/**
 * Client service for the Edit Action Bar — maps UI intent to API endpoints.
 */
import { z } from "zod";
import { apiClient } from "@shared/http";
import { makeValidator, type DocumentView } from "@shared/schema";

export const sectionUpdateSchema = z.object({
  content: z.string().trim().min(1, "Section content cannot be empty."),
});
export type SectionUpdate = z.infer<typeof sectionUpdateSchema>;
export const validate = makeValidator(sectionUpdateSchema, "SectionUpdate");

export const DocumentActionsService = {
  async getDocument(documentId: string): Promise<DocumentView> {
    return (await apiClient.get<DocumentView>(`/api/documents/${documentId}`)).data;
  },
  /** Persists manual text modifications (server logs MANUAL_EDIT). */
  async updateSection(documentId: string, sectionId: string, content: string): Promise<void> {
    await apiClient.patch(`/api/documents/${documentId}/sections/${sectionId}`, validate({ content }));
  },
  /** Permanently removes a section — UI must confirm first. */
  async deleteSection(documentId: string, sectionId: string): Promise<void> {
    await apiClient.delete(`/api/documents/${documentId}/sections/${sectionId}`);
  },
};
