/** Persistence and versioning for AI-edited sections. */
import { z } from "zod";
import { makeValidator, zSectionEntity } from "@shared/schema";
import { repos, syncDocumentContent } from "@shared/db";
import { NotFoundError } from "@shared/errors";
import { rewriteSection } from "@shared/ai";

export const aiEditedSectionSchema = z.object({
  id: z.string(),
  document_id: z.string(),
  title: z.string(),
  ai_label: z.string(),
  status: z.string(),
  content: z.string().min(1),
  position: z.number().int(),
  version: z.number().int().min(1),
});
export type AIEditedSection = z.infer<typeof aiEditedSectionSchema>;
export const validate = makeValidator(aiEditedSectionSchema, "AIEditedSection");

export const AISectionRepository = {
  async updateSectionWithAI(args: { documentId: string; sectionId: string; aiPrompt: string; currentContent?: string }): Promise<AIEditedSection> {
    const existing = repos.sections.findOne({ id: args.sectionId, document_id: args.documentId });
    if (!existing) throw new NotFoundError("Section not found");
    const refinedContent = await rewriteSection({
      title: existing.title,
      content: args.currentContent ?? existing.content,
      instruction: args.aiPrompt,
    });
    const updated = validate({
      id: existing.id,
      document_id: existing.document_id,
      title: existing.title,
      ai_label: "AI Edited",
      status: "AI Generated",
      content: refinedContent,
      position: existing.position,
      version: existing.version + 1,
    });
    repos.sections.update(existing.id, zSectionEntity.partial().parse({ ...updated, is_ai_generated: true }));
    syncDocumentContent(args.documentId);
    return updated;
  },
};
