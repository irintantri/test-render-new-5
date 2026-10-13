/** Review screen reads: document and its chronological audit trail. */
import { repos, resolveDocumentId } from "@shared/db";
import { NotFoundError } from "@shared/errors";
import { documentDTOSchema, validateAuditEntry, type AuditEntryDTO, type DocumentDTO } from "./DocumentDTO";
import { makeValidator } from "@shared/schema";

export type { DocumentDTO, AuditEntryDTO };
export const schema = documentDTOSchema;
export const validate = makeValidator(documentDTOSchema, "DocumentDTO");

export function getDocumentById(id: string): DocumentDTO {
  const doc = repos.documents.findById(resolveDocumentId(id));
  if (!doc) throw new NotFoundError("Document not found");
  return validate(doc);
}

/** ORDER BY timestamp DESC */
export function getAuditTrailByDocumentId(documentId: string): AuditEntryDTO[] {
  return repos.auditLogs
    .findMany({ document_id: resolveDocumentId(documentId) }, { orderBy: "timestamp", order: "desc" })
    .map((log) =>
      validateAuditEntry({
        id: log.id,
        userId: log.user_id,
        user_id: log.user_id,
        user_name: log.user_name,
        action: log.action,
        timestamp: log.timestamp,
        resourceId: log.resource_id,
        resource_id: log.resource_id,
      }),
    );
}
