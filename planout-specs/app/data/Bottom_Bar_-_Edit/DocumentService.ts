/** Enforces status constraints before submission from the Edit bottom bar. */
import { z } from "zod";
import { makeValidator } from "@shared/schema";
import { NotFoundError, ValidationError } from "@shared/errors";
import { getDocumentById, transitionToInReview, updateDocumentContent, type Document } from "./DocumentRepository";

export const saveDraftSchema = z.object({
  content: z.string(),
  metadata: z.record(z.unknown()).default({}),
});
export type SaveDraftInput = z.infer<typeof saveDraftSchema>;
export const validate = makeValidator(saveDraftSchema, "SaveDraftInput");

export function submitDocumentForApproval(id: string): Document {
  const document = getDocumentById(id);
  if (!document) throw new NotFoundError("Document not found");
  if (document.status !== "Draft") {
    throw new ValidationError("Only documents in Draft status can be submitted for approval.");
  }
  return transitionToInReview(id);
}

export function saveDraft(id: string, content: string, metadata: Record<string, unknown>): Document {
  const input = validate({ content, metadata });
  return updateDocumentContent(id, input.content, input.metadata);
}
