import { apiClient } from "@shared/http";

export const DocumentService = {
  /** PATCH /api/v1/document/section/{id} { content } */
  saveSection(sectionId: string, content: string) {
    return apiClient.patch(`/api/v1/document/section/${sectionId}`, { content });
  },
};
