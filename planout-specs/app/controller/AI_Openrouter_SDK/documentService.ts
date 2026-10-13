/**
 * POST /api/document/generate { template_id, source_filename, values, model }
 *   → { id, filled_markdown, pages, sections }
 * Loads the source file (from uploaded reference docs or disk), calls OpenRouter
 * (or the local mock), persists DocumentGeneration + DocumentSection rows.
 */
import fs from "node:fs";
import { Router } from "express";
import { z } from "zod";
import { asyncHandler, validateBody } from "@shared/middleware";
import { repos } from "@shared/db";
import { isAiConfigured } from "@shared/ai";
import { saveGeneratedDocument } from "@app/data/AI_Openrouter_SDK/DocumentRepository";
import { processDocument } from "@app/data/AI_Openrouter_SDK/OpenRouterService";

export const generateDocumentSchema = z.object({
  template_id: z.string().trim().min(1, "Template ID is required"),
  source_filename: z.string().trim().min(1, "Source filename is required"),
  model: z.string().trim().regex(/^[\w.-]+\/[\w.:-]+$/, "Model must be a valid OpenRouter model identifier (provider/model)"),
  values: z.record(z.unknown()).default({}),
});
export type GenerateDocumentInput = z.infer<typeof generateDocumentSchema>;

export interface GeneratedDocumentResponse {
  id: string;
  filled_markdown: string;
  pages: number;
  sections: { title: string; content: string }[];
  model: string;
  mocked: boolean;
}

/** Split "## Heading" markdown into sections; falls back to one Summary section. */
export function parseSectionsFromMarkdown(markdown: string) {
  const parts = markdown.split(/^#{1,3}\s+/m).filter((p) => p.trim());
  if (parts.length <= 1) return [{ title: "Summary", content: markdown.trim() }];
  return parts.map((p) => {
    const [title, ...rest] = p.split("\n");
    return { title: title.trim(), content: rest.join("\n").trim() };
  });
}

function loadSource(filename: string): { base64: string; text: string } {
  if (fs.existsSync(filename) && fs.statSync(filename).isFile()) {
    const buf = fs.readFileSync(filename);
    return { base64: buf.toString("base64"), text: "" };
  }
  // Fall back to a reference document registered for a protocol
  const ref = repos.referenceDocuments.findOne({ file_name: filename });
  return { base64: "", text: ref ? `${ref.doc_kind} for ${ref.protocol_id}` : filename };
}

export const processDocumentGeneration = async (input: GenerateDocumentInput): Promise<GeneratedDocumentResponse> => {
  const source = loadSource(input.source_filename);
  const valuesText = Object.entries(input.values)
    .map(([k, v]) => `- **${k}:** ${typeof v === "string" ? v : JSON.stringify(v)}`)
    .join("\n");
  const prompt = `Summarize this document and process sections based on provided values.\nTemplate: ${input.template_id}\nSource: ${source.text || input.source_filename}\n\n${valuesText}`;

  const summary = isAiConfigured()
    ? await processDocument(source.base64, prompt, input.model)
    : `## Overview\nGenerated from **${input.source_filename}** using template **${input.template_id}**.\n\n## Configuration Values\n${valuesText || "- (none provided)"}\n\n## Next Steps\nReview each section and refine with AI before publishing.`;

  const sections = parseSectionsFromMarkdown(summary);
  const pages = Math.max(1, Math.ceil(summary.length / 3000));
  const id = await saveGeneratedDocument({
    template_id: input.template_id,
    source_filename: input.source_filename,
    model: input.model,
    values: input.values,
    filled_markdown: summary,
    pages,
    sections,
  });
  return { id, filled_markdown: summary, pages, sections, model: input.model, mocked: !isAiConfigured() };
};

export const router = Router();

router.post(
  "/document/generate",
  validateBody(generateDocumentSchema),
  asyncHandler(async (req, res) => res.status(201).json(await processDocumentGeneration(req.body))),
);
