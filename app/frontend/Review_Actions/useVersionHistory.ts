/** GET /api/documents/{id}/versions → [{ id, versionString, status, isCurrent }] */
import { useDocumentVersions } from "@app/controller/Review_Actions/useDocumentVersions";

export function useVersionHistory(documentId: string) {
  const { versions, loading } = useDocumentVersions(documentId);
  return { data: versions, isLoading: loading };
}
