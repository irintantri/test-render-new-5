/** Persistence for Document state transitions driven by the Edit bottom bar. */
import { makeValidator, zDocumentEntity, type DocumentEntity } from "@shared/schema";
import { repos } from "@shared/db";
import { nowIso } from "@shared/lib";

export const documentSchema = zDocumentEntity;
export type Document = DocumentEntity;
export const validate = makeValidator(documentSchema, "Document");

export function updateDocumentContent(id: string, content: string, metadata: Record<string, unknown>): Document {
  return repos.documents.update(id, { content, metadata, last_modified: nowIso() });
}

export function transitionToInReview(id: string): Document {
  return repos.documents.update(id, { status: "In Review", last_modified: nowIso() });
}

export function getDocumentById(id: string): Document | null {
  return repos.documents.findById(id);
}
