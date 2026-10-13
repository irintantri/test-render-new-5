/** Persistence for the ICF document lifecycle (Edit & Refine). */
import { z } from "zod";
import { makeValidator, zDocumentView, type DocumentView } from "@shared/schema";
import { repos, resolveDocumentId, toDocumentView } from "@shared/db";
import { nowIso } from "@shared/lib";

export const editorDocumentSchema = zDocumentView;
export type EditorDocument = DocumentView;
export const validate = makeValidator(editorDocumentSchema, "EditorDocument");

export const documentContentUpdateSchema = z.object({
  content: z.string().trim().min(1, "Content cannot be empty"),
  metadata: z.record(z.unknown()).optional(),
});

/** Full document state for the editor (accepts a generation job id too). */
export function getDocumentById(id: string): EditorDocument {
  return toDocumentView(resolveDocumentId(id));
}

/** Update content + metadata and refresh last_modified. */
export function updateDocumentContent(id: string, content: string, metadata: Record<string, unknown>) {
  const docId = resolveDocumentId(id);
  repos.documents.update(docId, { content, metadata, last_modified: nowIso() });
  return getDocumentById(docId);
}
