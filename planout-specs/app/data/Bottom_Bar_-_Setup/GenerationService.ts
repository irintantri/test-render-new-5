/**
 * ICF generation: creates a GenerationJob (PENDING) and drives a background
 * worker through six checkpoints, finally materialising a Draft document.
 */
import { makeValidator, zGenerationJobEntity, type GenerationJobEntity } from "@shared/schema";
import {
  buildSectionRows,
  contextFor,
  recordAudit,
  registerJobFinalizer,
  repos,
  syncDocumentContent,
  withTransaction,
  DEMO_USER_ID,
} from "@shared/db";
import { NotFoundError } from "@shared/errors";
import { createLogger, nowIso, uuid } from "@shared/lib";
import type { GenerateJobAccepted, GenerationEvent } from "./GenerationController";

const log = createLogger("generation");

export const generationJobSchema = zGenerationJobEntity;
export type GenerationJob = GenerationJobEntity;
export const validate = makeValidator(generationJobSchema, "GenerationJob");

export const GENERATION_STEPS = [
  "Parsing protocol data",
  "Loading reference documents",
  "Applying regulatory templates",
  "Generating consent sections",
  "Running compliance checks",
  "Finalizing document",
] as const;

const durationMs = () => Number(process.env.GENERATION_DURATION_MS) || 15000;
const workers = new Map<string, ReturnType<typeof setInterval>>();

export function stepLabelFor(progress: number): string {
  const idx = Math.min(GENERATION_STEPS.length - 1, Math.floor((progress / 100) * GENERATION_STEPS.length));
  return GENERATION_STEPS[idx];
}

export function initiateICFGeneration(protocol_id: string, template_value: string, reference_ids: string[] = []): GenerateJobAccepted {
  if (!repos.protocols.findOne({ protocol_id })) throw new NotFoundError(`Protocol ${protocol_id} not found`);
  const job = repos.generationJobs.insert(
    validate({
      id: uuid(),
      protocol_id,
      template_id: template_value,
      reference_ids,
      status: "PENDING",
      progress: 0,
      step_label: GENERATION_STEPS[0],
      document_id: null,
      created_at: nowIso(),
      error: null,
    }),
  );
  startWorker(job.id);
  return { job_id: job.id, protocol_id, id: job.id, status: job.status, created_at: job.created_at };
}

function startWorker(jobId: string) {
  const started = Date.now();
  const timer = setInterval(() => {
    const job = repos.generationJobs.findById(jobId);
    if (!job || job.status === "COMPLETE" || job.status === "FAILED") return stopWorker(jobId);
    const progress = Math.min(99, Math.round(((Date.now() - started) / durationMs()) * 100));
    repos.generationJobs.update(jobId, {
      progress,
      status: progress >= 17 ? "PROCESSING" : job.status,
      step_label: stepLabelFor(progress),
    });
    if (Date.now() - started >= durationMs()) finalizeJob(jobId);
  }, 400);
  workers.set(jobId, timer);
}

function stopWorker(jobId: string) {
  const t = workers.get(jobId);
  if (t) clearInterval(t);
  workers.delete(jobId);
}

/** Materialise the generated Draft document. Idempotent. */
export function finalizeJob(jobId: string): string | null {
  const job = repos.generationJobs.findById(jobId);
  if (!job) return null;
  if (job.document_id) return job.document_id;
  stopWorker(jobId);
  try {
    const protocol = repos.protocols.findOne({ protocol_id: job.protocol_id });
    if (!protocol) throw new NotFoundError("Protocol not found");
    const template = repos.templates.findById(job.template_id);
    const docId = uuid();
    const now = nowIso();
    repos.documents.insert({
      id: docId,
      protocol_id: protocol.protocol_id,
      icf_name: `${protocol.protocol_id} ICF`,
      icf_version: "v1.0",
      template: job.template_id,
      status: "Draft",
      content: null,
      metadata: { template_name: template?.name ?? job.template_id, generation_job_id: jobId, reference_ids: job.reference_ids },
      published_at: null,
      created_at: now,
      last_modified: now,
      owner_id: DEMO_USER_ID,
      reviewer_id: null,
    });
    const rows = buildSectionRows(docId, contextFor(protocol, job.template_id));
    rows.forEach((r) => repos.sections.insert(r));
    syncDocumentContent(docId);
    ["Sarah Chen|Medical Reviewer", "James Liu|Legal / Regulatory", "Priya Nair|Privacy Officer"].forEach((s, i) => {
      const [name, role] = s.split("|");
      repos.reviewers.insert({ id: `${docId}-r${i + 1}`, document_id: docId, name, role, acted: false });
    });
    repos.documentVersions.insert({
      id: uuid(),
      document_id: docId,
      version_number: "1.0",
      status: "Draft",
      is_current: true,
      created_at: now,
      snapshot: rows.map((r) => ({ title: r.title, content: r.content })),
    });
    recordAudit(docId, "Document Created", DEMO_USER_ID, "Mike Evans");
    recordAudit(docId, "AI Generation Completed", "ai", "Consent IQ AI");
    repos.generationJobs.update(jobId, { status: "COMPLETE", progress: 100, step_label: GENERATION_STEPS[5], document_id: docId });
    log.info(`Job ${jobId} complete → document ${docId}`);
    return docId;
  } catch (e) {
    repos.generationJobs.update(jobId, { status: "FAILED", error: (e as Error).message });
    log.error(`Job ${jobId} failed`, e);
    return null;
  }
}

registerJobFinalizer(finalizeJob);

export function toGenerationEvent(job: GenerationJob): GenerationEvent {
  return {
    status: job.status === "COMPLETE" ? "complete" : job.status === "FAILED" ? "failed" : job.status === "PENDING" ? "pending" : "processing",
    progress: job.progress,
    step_label: job.step_label,
    document_id: job.document_id,
    error: job.error,
  };
}

export { withTransaction };
