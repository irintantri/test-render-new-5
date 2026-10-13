/** Business logic for manual edits and AI-assisted refinements. */
import { z } from "zod";
import { makeValidator } from "@shared/schema";
import { repos, resolveDocumentId } from "@shared/db";
import { NotFoundError, ValidationError } from "@shared/errors";
import { rewriteSection } from "@shared/ai";
import { getDocumentById, updateDocumentContent } from "./DocumentRepository";

export const aiRewriteRequestSchema = z.object({
  sectionId: z.string().min(1, "sectionId is required"),
  prompt: z.string().trim().min(1, "prompt is required"),
});
export type AIRewriteRequest = z.infer<typeof aiRewriteRequestSchema>;
export const validate = makeValidator(aiRewriteRequestSchema, "AIRewriteRequest");

export function handleManualEdit(id: string, newContent: string) {
  if (!newContent || !newContent.trim()) throw new ValidationError("Content cannot be empty");
  const current = repos.documents.findById(resolveDocumentId(id));
  return updateDocumentContent(id, newContent, (current?.metadata ?? {}) as Record<string, unknown>);
}

/** Returns the refined text for a single section (not persisted). */
export async function handleAIRewrite(id: string, sectionId: string, prompt: string): Promise<string> {
  const doc = getDocumentById(id);
  const section = doc.metadata.sections.find((s) => s.id === sectionId);
  if (!section) throw new NotFoundError("Section not found");
  return rewriteSection({ title: section.title, content: section.content, instruction: prompt });
}
