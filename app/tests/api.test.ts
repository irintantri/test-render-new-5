/** API behaviour tests against the in-memory mock database. */
import type { AddressInfo } from "node:net";
import type { Server } from "node:http";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createApp } from "../server/app";

let server: Server;
let base = "";
const auth = { Authorization: "Bearer demo-token" };

async function call<T = any>(method: string, path: string, body?: unknown, headers: Record<string, string> = {}) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: { ...(body ? { "Content-Type": "application/json" } : {}), ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { status: res.status, body: (text ? JSON.parse(text) : null) as T };
}

beforeAll(async () => {
  process.env.GENERATION_DURATION_MS = "300";
  server = createApp({ useMockDb: true, quiet: true }).listen(0);
  await new Promise((r) => server.once("listening", r));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}/api`;
});
afterAll(() => server.close());

describe("verification gate", () => {
  it("GET /api/health → { status: ok }", async () => {
    expect(await call("GET", "/health")).toEqual({ status: 200, body: { status: "ok" } });
  });
});

describe("onboarding", () => {
  it("GET /api/users/me requires a session", async () => {
    expect((await call("GET", "/users/me")).status).toBe(401);
  });
  it("returns profile + task summary", async () => {
    const { status, body } = await call("GET", "/users/me", undefined, auth);
    expect(status).toBe(200);
    expect(body.firstName).toBe("Mike");
    expect(body.taskSummary).toMatchObject({ draftsInProgress: 3, itemsAwaitingReview: 2 });
  });
});

describe("dashboard", () => {
  it("stats aggregate document statuses", async () => {
    expect((await call("GET", "/stats")).body).toEqual({ total: 25, inReview: 7, approved: 15 });
  });
  it("sorts and searches", async () => {
    const sorted = await call("GET", "/protocol?sort_by=protocol_id&sort_order=asc");
    const ids = sorted.body.data.map((r: any) => r.protocol_id);
    expect(ids).toEqual([...ids].sort());
    const found = await call("GET", "/search?protocolName=neuro");
    expect(found.body.data.every((r: any) => /neuro/i.test(r.protocol_name + r.icf_name))).toBe(true);
  });
});

describe("generation → edit → review → approve → publish", () => {
  let docId = "";

  it("rejects generation without identifiers", async () => {
    const res = await call("POST", "/generate", {});
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing required protocol or template identifiers.");
  });

  it("creates a job and completes to a Draft document", async () => {
    const res = await call("POST", "/generate", { protocol_id: "PROTO-2024-001", template_id: "standard" });
    expect(res.status).toBe(202);
    await new Promise((r) => setTimeout(r, 900));
    const job = await call("GET", `/icf/generation/${res.body.job_id}`);
    expect(job.body.status).toBe("complete");
    docId = job.body.document_id;
    const doc = await call("GET", `/documents/${docId}`);
    expect(doc.body.status).toBe("Draft");
    expect(doc.body.metadata.sections.filter((s: any) => !s.parent_id)).toHaveLength(12);
  });

  it("validates AI prompt and refines a section", async () => {
    const sectionId = `${docId}-s1`;
    expect((await call("POST", `/documents/${docId}/sections/${sectionId}/ai`, {})).body.error).toBe("Prompt is required");
    const ok = await call("POST", `/documents/${docId}/sections/${sectionId}/ai`, { prompt: "Simplify language" });
    expect(ok.status).toBe(200);
    expect(ok.body.ai_label).toBe("AI Refined");
    expect(ok.body.version).toBe(2);
  });

  it("adds a subsection with hierarchical numbering, then deletes it", async () => {
    const created = await call("POST", `/documents/${docId}/sections`, { title: "New Subsection", parentId: `${docId}-s3` });
    expect(created.status).toBe(201);
    expect(created.body.title).toBe("3.4 New Subsection");
    expect((await call("DELETE", `/sections/${created.body.id}`)).status).toBe(200);
  });

  it("only Draft documents can be submitted for review", async () => {
    expect((await call("POST", `/documents/${docId}/submit-review`)).body.status).toBe("In Review");
    expect((await call("POST", `/documents/${docId}/submit-review`)).status).toBe(400);
  });

  it("blocks approval while comments are open or reviewers pending", async () => {
    const c = await call("POST", "/comments", { documentId: docId, sectionId: "5. Benefits", text: "Clarify outcomes" });
    expect(c.status).toBe(201);
    const blocked = await call("POST", `/documents/${docId}/submit-approval`);
    expect(blocked.status).toBe(400);
    expect(blocked.body.error).toBe("Cannot submit with open comments.");

    await call("PATCH", `/comments/${c.body.id}/status`, { status: "Resolved" });
    expect((await call("POST", `/documents/${docId}/submit-approval`)).body.error).toMatch(/reviewers must act/);

    const reviewers = await call("GET", `/reviewers?documentId=${docId}`);
    for (const r of reviewers.body) await call("POST", `/reviewers/${r.id}/act`);
    const ok = await call("POST", `/documents/${docId}/submit-approval`);
    expect(ok.body).toMatchObject({ success: true, status: "Approved" });
  });

  it("publishes the approved ICF and records the audit trail", async () => {
    expect((await call("POST", "/publish", { documentId: docId })).body.status).toBe("success");
    const audit = await call("GET", `/documents/${docId}/audit`);
    const actions = audit.body.map((a: any) => a.action);
    expect(actions[0]).toBe("Published");
    expect(actions).toContain("Submitted for Review");
  });
});

describe("versions", () => {
  it("rejects comparing a version to itself and reports changes", async () => {
    const same = await call("GET", "/documents/doc-proto-2024-001/compare?v1=doc-proto-2024-001-v-cur&v2=doc-proto-2024-001-v-cur");
    expect(same.status).toBe(400);
    const diff = await call("GET", "/documents/doc-proto-2024-001/compare?v1=doc-proto-2024-001-v-prev&v2=doc-proto-2024-001-v-cur");
    expect(diff.body.changedCount).toBe(2);
  });
});
