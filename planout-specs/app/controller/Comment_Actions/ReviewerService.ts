/**
 *   GET  /api/reviewers?documentId=
 *   POST /api/reviewers/:reviewerId/act → 200 { success: true, reviewer }
 */
import { Router } from "express";
import { actorOf, param } from "@shared/middleware";
import { recordAudit, repos, resolveDocumentId } from "@shared/db";
import { ValidationError } from "@shared/errors";
import { fetchReviewersByDocument, updateReviewerStatus } from "@app/data/Comment_Actions/ReviewerRepository";

export function markReviewerAsActed(reviewerId: string, actor: { id: string; name: string }) {
  repos.reviewers.getById(reviewerId, "Reviewer");
  const reviewer = updateReviewerStatus(reviewerId);
  recordAudit(reviewer.document_id, `Reviewer Approved (${reviewer.name})`, actor.id, actor.name, reviewer.id);
  return { success: true, reviewer };
}

export const router = Router();

router.get("/reviewers", (req, res) => {
  const documentId = String(req.query.documentId ?? "");
  if (!documentId) throw new ValidationError("documentId is required");
  res.json(fetchReviewersByDocument(resolveDocumentId(documentId)));
});

router.post("/reviewers/:reviewerId/act", (req, res) => {
  res.status(200).json(markReviewerAsActed(param(req, "reviewerId"), actorOf(req)));
});
