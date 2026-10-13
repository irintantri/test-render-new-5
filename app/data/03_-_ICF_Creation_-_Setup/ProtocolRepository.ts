/** Data access for protocol selection and search in the Setup wizard. */
import { z } from "zod";
import { makeValidator, type ProtocolEntity } from "@shared/schema";
import { likeAny, repos } from "@shared/db";
import { ValidationError } from "@shared/errors";
import { protocolOptionDTOSchema } from "./DataModels";

/** Catalog card = ProtocolOptionDTO + identifiers the Setup UI keys on. */
export const catalogProtocolSchema = protocolOptionDTOSchema.extend({
  id: z.string(),
  protocol_id: z.string(),
  protocol_name: z.string(),
  title: z.string(),
  drug_code: z.string(),
});
export type CatalogProtocol = z.infer<typeof catalogProtocolSchema>;
export const validate = makeValidator(catalogProtocolSchema, "CatalogProtocol");

export const SEARCH_MIN_CHARS = 3;

function toCatalog(p: ProtocolEntity): CatalogProtocol {
  return validate({
    id: p.id,
    protocolId: p.protocol_id,
    protocolName: p.protocol_name,
    phase: p.phase,
    category: p.category,
    description: p.description,
    status: p.status,
    lastModified: p.last_modified,
    protocol_id: p.protocol_id,
    protocol_name: p.title,
    title: p.title,
    drug_code: p.drug_code,
  });
}

export const ProtocolRepository = {
  /** Full list for initial catalog load (most recent first). */
  async getAllProtocols(): Promise<CatalogProtocol[]> {
    return repos.protocols.findMany(undefined, { orderBy: "last_modified", order: "desc" }).map(toCatalog);
  },
  /** Search by name or ID — minimum 3 characters. */
  async searchProtocols(query: string): Promise<CatalogProtocol[]> {
    if (query.trim().length < SEARCH_MIN_CHARS) throw new ValidationError(`Search query must be at least ${SEARCH_MIN_CHARS} characters`);
    return repos.protocols
      .findMany(likeAny<ProtocolEntity>(["protocol_id", "protocol_name", "title"], query), { orderBy: "protocol_id", order: "asc" })
      .map(toCatalog);
  },
};
