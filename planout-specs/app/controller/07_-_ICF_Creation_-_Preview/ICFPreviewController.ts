/** ICF Preview data loading + publication (client logic). */
import { apiClient } from "@shared/http";
import type { DocumentView, SectionView } from "@shared/types";

function handleError(message: string, error: unknown) {
  console.error(message, error);
}

export async function loadICFPreview(documentId: string): Promise<{ metadata: DocumentView; sections: SectionView[] } | null> {
  try {
    const [metadata, sections] = await Promise.all([
      apiClient.get<DocumentView>(`/api/documents/${documentId}`),
      apiClient.get<SectionView[]>(`/api/documents/${documentId}/sections`),
    ]);
    return { metadata: metadata.data, sections: sections.data };
  } catch (error) {
    handleError("Failed to load ICF preview data", error);
    return null;
  }
}

export async function publishICF(documentId: string): Promise<{ success: boolean; data?: unknown; error?: string }> {
  try {
    const response = await apiClient.post<{ status: string }>("/api/publish", { documentId });
    return { success: true, data: response.data };
  } catch (error) {
    handleError("Error during publication", error);
    return { success: false, error: (error as Error).message };
  }
}
