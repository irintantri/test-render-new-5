/** Shared DTOs for the ICF Setup Wizard. */
import { z } from "zod";
import { makeValidator } from "@shared/schema";

export const referenceDocumentDTOSchema = z.object({
  id: z.string(),
  protocol_id: z.string(),
  doc_kind: z.string(),
  file_name: z.string(),
  bucket_name: z.string(),
  uploaded_at: z.string(),
});
export type ReferenceDocumentDTO = z.infer<typeof referenceDocumentDTOSchema>;

export const protocolOptionDTOSchema = z.object({
  protocolId: z.string(),
  protocolName: z.string(),
  phase: z.string(),
  category: z.string(),
  description: z.string(),
  status: z.string(),
  lastModified: z.string(),
});
export type ProtocolOptionDTO = z.infer<typeof protocolOptionDTOSchema>;

export const templateDTOSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  recommended: z.boolean(),
});
export type TemplateDTO = z.infer<typeof templateDTOSchema>;

export const validateReferenceDocument = makeValidator(referenceDocumentDTOSchema, "ReferenceDocumentDTO");
export const validateProtocolOption = makeValidator(protocolOptionDTOSchema, "ProtocolOptionDTO");
export const validateTemplate = makeValidator(templateDTOSchema, "TemplateDTO");

/** Validate any Setup DTO by kind. */
export function validate(kind: "reference" | "protocol" | "template", entity: unknown) {
  return kind === "reference"
    ? validateReferenceDocument(entity)
    : kind === "protocol"
      ? validateProtocolOption(entity)
      : validateTemplate(entity);
}
