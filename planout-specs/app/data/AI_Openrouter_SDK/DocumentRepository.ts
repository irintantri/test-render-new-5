/** Persists OpenRouter generation output: one DocumentGeneration + N DocumentSection rows. */
import { z } from "zod";
import { makeValidator } from "@shared/schema";
import { repos, withTransaction } from "@shared/db";
import { nowIso, uuid } from "@shared/lib";

export const generatedDocumentSchema = z.object({
  template_id: z.string().min(1),
  source_filename: z.string().min(1),
  model: z.string().min(1),
  values: z.record(z.unknown()),
  filled_markdown: z.string(),
  pages: z.number().int().min(0),
  sections: z.array(z.object({ title: z.string(), content: z.string() })),
});
export type GeneratedDocumentInput = z.infer<typeof generatedDocumentSchema>;
export const validate = makeValidator(generatedDocumentSchema, "GeneratedDocument");

export async function saveGeneratedDocument(data: GeneratedDocumentInput): Promise<string> {
  const input = validate(data);
  return withTransaction(() => {
    const doc = repos.documentGenerations.insert({
      id: uuid(),
      template_id: input.template_id,
      source_filename: input.source_filename,
      model: input.model,
      values: input.values,
      filled_markdown: input.filled_markdown,
      pages: input.pages,
      created_at: nowIso(),
    });
    input.sections.forEach((s) =>
      repos.documentSections.insert({ id: uuid(), document_id: doc.id, title: s.title, content: s.content }),
    );
    return doc.id;
  });
}
