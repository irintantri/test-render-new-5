import { apiClient } from "@shared/http";

export const AIService = {
  /** POST /api/v1/document/rewrite { sectionId, content, instruction } → { updatedContent } */
  async rewriteSection(sectionId: string, currentText: string, instruction: string): Promise<string> {
    const response = await apiClient.post<{ updatedContent: string }>("/api/v1/document/rewrite", {
      sectionId,
      content: currentText,
      instruction,
    });
    return response.data.updatedContent;
  },

  /** Non-persisting suggestion (Review mode): POST /api/documents/:id/rewrite → { refinedText } */
  async suggest(documentId: string, sectionId: string, prompt: string): Promise<string> {
    const res = await apiClient.post<{ refinedText: string }>(`/api/documents/${documentId}/rewrite`, { sectionId, prompt });
    return res.data.refinedText;
  },
};
