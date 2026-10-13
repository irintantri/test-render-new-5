/** Persistence and retrieval of reference documents attached to a protocol. */
import { z } from "zod";
import { makeValidator, zReferenceDocumentEntity, type ReferenceDocumentEntity } from "@shared/schema";
import { repos } from "@shared/db";

export const REFERENCE_DOC_KINDS = ["Investigation Brochure", "Lab Manual"] as const;

export const referenceDocumentSchema = zReferenceDocumentEntity.extend({
  doc_kind: z.enum(REFERENCE_DOC_KINDS),
});
export type ReferenceDocument = z.infer<typeof referenceDocumentSchema>;
export const validate = makeValidator(referenceDocumentSchema, "ReferenceDocument");

export const ReferenceDocumentRepository = {
  async getDocumentsByProtocol(protocolId: string): Promise<ReferenceDocumentEntity[]> {
    return repos.referenceDocuments.findMany({ protocol_id: protocolId }, { orderBy: "uploaded_at", order: "desc" });
  },
  async saveDocumentMetadata(doc: ReferenceDocument): Promise<ReferenceDocumentEntity> {
    return repos.referenceDocuments.insert(validate(doc));
  },
};
