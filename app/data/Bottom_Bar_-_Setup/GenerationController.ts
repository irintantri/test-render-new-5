/**
 * Contracts for POST /api/generate (→ 202 GenerateJobAccepted) and the
 * component-level POST /api/v1/icf/generate.
 */
import { z } from "zod";
import { makeValidator } from "@shared/schema";

const missing = "Missing required protocol or template identifiers.";

export const generateRequestSchema = z
  .object({
    protocol_id: z.string().optional(),
    template_id: z.string().optional(),
    template_value: z.string().optional(),
    reference_ids: z.array(z.string()).optional(),
    // component-level camelCase payload
    protocolId: z.string().optional(),
    templateId: z.string().optional(),
    referenceIds: z.array(z.string()).optional(),
  })
  .transform((b) => ({
    protocol_id: b.protocol_id ?? b.protocolId ?? "",
    template_id: b.template_id ?? b.template_value ?? b.templateId ?? "",
    reference_ids: b.reference_ids ?? b.referenceIds ?? [],
  }))
  .refine((b) => b.protocol_id && b.template_id, { message: missing });
export type GenerateRequest = z.output<typeof generateRequestSchema>;
export const validate = makeValidator(generateRequestSchema, "GenerateRequest");

export const generateJobAcceptedSchema = z.object({
  job_id: z.string().uuid(),
  protocol_id: z.string(),
  id: z.string().uuid(),
  status: z.string(),
  created_at: z.string(),
});
export type GenerateJobAccepted = z.infer<typeof generateJobAcceptedSchema>;

export const generationEventSchema = z.object({
  status: z.enum(["pending", "processing", "complete", "failed"]),
  progress: z.number().min(0).max(100),
  step_label: z.string(),
  document_id: z.string().nullable(),
  error: z.string().nullable().optional(),
});
export type GenerationEvent = z.infer<typeof generationEventSchema>;
