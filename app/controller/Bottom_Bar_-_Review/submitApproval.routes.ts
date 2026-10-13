/**
 * POST /api/documents/:documentId/submit-approval
 *   400 open comments / reviewers pending / wrong status | 200 { success, id, status }
 */
import { Router } from "express";
import { actorOf, asyncHandler, param } from "@shared/middleware";
import { recordAudit, repos, resolveDocumentId, withTransaction } from "@shared/db";
import { ValidationError } from "@shared/errors";
import { nowIso } from "@shared/lib";
import { evaluateSubmitGate } from "./ReviewBottomBarLogic";

export function getOpenCommentsCount(documentId: string): number {
  return repos.comments.count((c) => c.document_id === documentId && !c.parent_id && c.status === "Open");
}

export async function handleSubmitForApproval(documentId: string, actor: { id: string; name: string }) {
  const doc = repos.documents.getById(documentId, "Document");
  const gate = evaluateSubmitGate(getOpenCommentsCount(documentId));
  if (!gate.success) throw new ValidationError(gate.message!);
  const pending = repos.reviewers.findMany({ document_id: documentId }).filter((r) => !r.acted);
  if (pending.length) throw new ValidationError(`All reviewers must act before approval (${pending.map((r) => r.name).join(", ")} pending).`);
  if (doc.status !== "In Review") throw new ValidationError("Only documents In Review can be submitted for approval.");
  return withTransaction(() => {
    const updated = repos.documents.update(documentId, { status: "Approved", last_modified: nowIso() });
    repos.documentVersions
      .findMany({ document_id: documentId, is_current: true })
      .forEach((v) => repos.documentVersions.update(v.id, { status: "Approved" }));
    recordAudit(documentId, "Submitted for Approval", actor.id, actor.name);
    recordAudit(documentId, "Approved", actor.id, actor.name);
    return { success: true, id: updated.id, status: updated.status };
  });
}

export const router = Router();

router.post(
  "/documents/:documentId/submit-approval",
  asyncHandler(async (req, res) => {
    res.json(await handleSubmitForApproval(resolveDocumentId(param(req, "documentId")), actorOf(req)));
  }),
);
