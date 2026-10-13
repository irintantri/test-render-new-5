/**
 * Contract for POST /api/documents/:documentId/sections/:sectionId/ai
 *   400 "Prompt is required" | 200 AIEditedSection | 500 "Failed to refine section: …"
 */
import { z } from "zod";
import { makeValidator } from "@shared/schema";

export const aiSectionRequestSchema = z.object({
  prompt: z.string({ required_error: "Prompt is required" }).trim().min(1, "Prompt is required"),
  currentContent: z.string().optional(),
});
export type AISectionRequest = z.infer<typeof aiSectionRequestSchema>;
export const validate = makeValidator(aiSectionRequestSchema, "AISectionRequest");
