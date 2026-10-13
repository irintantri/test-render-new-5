/** Review page reads: full document details and audit trail (most recent first). */
import { getAuditTrailByDocumentId, getDocumentById as getDocument } from "@app/data/06_-_ICF_Creation_-_Review/DocumentRepository";

export async function getDocumentById(documentId: string) {
  return getDocument(documentId); // throws NotFoundError("Document not found")
}

export async function getDocumentAuditTrail(documentId: string) {
  return getAuditTrailByDocumentId(documentId);
}
