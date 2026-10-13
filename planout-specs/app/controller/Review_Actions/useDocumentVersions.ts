/** Version-dropdown state for the Review Action Bar. */
import { useEffect, useState } from "react";
import { apiClient } from "@shared/http";
import type { DocumentVersionView } from "@shared/types";

export async function getDocumentVersions(documentId: string): Promise<DocumentVersionView[]> {
  if (!documentId) throw new Error("Document ID is required to fetch versions.");
  return (await apiClient.get<DocumentVersionView[]>(`/api/documents/${documentId}/versions`)).data;
}

export function useDocumentVersions(documentId: string) {
  const [versions, setVersions] = useState<DocumentVersionView[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchVersions() {
      setLoading(true);
      try {
        setVersions(await getDocumentVersions(documentId));
      } catch (error) {
        console.error("Failed to fetch document versions", error);
      } finally {
        setLoading(false);
      }
    }
    if (documentId) fetchVersions();
  }, [documentId]);

  return { versions, loading };
}
