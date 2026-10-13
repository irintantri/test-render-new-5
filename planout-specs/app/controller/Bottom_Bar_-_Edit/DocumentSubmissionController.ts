/**
 * POST /api/documents/:id/submit-review — Draft → In Review.
 *   404 Document not found | 400 not in Draft | 200 { id, status }
 */
import { Router } from "express";
import { actorOf, asyncHandler, param } from "@shared/middleware";
import { repos, resolveDocumentId } from "@shared/db";
import { NotFoundError } from "@shared/errors";
import { DocumentService } from "./DocumentService";

export async function handleSubmitForReview(documentId: string, actor: { id: string; name: string }) {
  if (!repos.documents.findById(documentId)) throw new NotFoundError("Document not found");
  const updated = await DocumentService.submitForApproval(documentId, actor);
  return { id: updated.id, status: updated.status };
}

export const router = Router();

router.post(
  "/documents/:id/submit-review",
  asyncHandler(async (req, res) => {
    res.json(await handleSubmitForReview(resolveDocumentId(param(req, "id")), actorOf(req)));
  }),
);
