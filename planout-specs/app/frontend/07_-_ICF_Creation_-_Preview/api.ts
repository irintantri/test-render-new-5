/** Preview API layer (authoritative endpoints). */
import { apiClient } from "@shared/http";
import type { DocumentView, SectionView } from "@shared/types";

export const fetchDocument = async (documentId: string) => (await apiClient.get<DocumentView>(`/api/documents/${documentId}`)).data;

/** GET /api/documents/:id/sections — accepts a bare array or { sections }. */
export const fetchDocumentSections = async (documentId: string): Promise<{ sections: SectionView[] }> => {
  const data = (await apiClient.get<SectionView[] | { sections: SectionView[] }>(`/api/documents/${documentId}/sections`)).data;
  return Array.isArray(data) ? { sections: data } : data;
};

export const publishDocument = async (payload: { documentId: string }) =>
  (await apiClient.post<{ status: string; document: DocumentView }>("/api/publish", payload)).data;
