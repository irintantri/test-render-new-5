/** Bridge between Edit & Refine UI and the Document entity (GET /api/documents/:id). */
import { apiClient } from "@shared/http";
import type { DocumentView } from "@shared/types";

export const fetchDocumentById = async (id: string): Promise<DocumentView> => {
  const response = await apiClient.get<DocumentView>(`/api/documents/${id}`);
  if (response.status !== 200) throw new Error("Failed to retrieve document metadata and content.");
  return response.data;
};
