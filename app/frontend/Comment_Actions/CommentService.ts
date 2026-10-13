/** Comment + reviewer API calls. */
import { apiClient } from "@shared/http";
import type { Comment, CommentStatus, Reviewer } from "@shared/types";

export const CommentService = {
  async list(documentId: string): Promise<Comment[]> {
    return (await apiClient.get<Comment[]>(`/api/comments?documentId=${encodeURIComponent(documentId)}`)).data;
  },
  /** payload: { documentId, sectionId, text, parentId? } */
  async addComment(payload: { documentId: string; sectionId: string; text: string; parentId?: string | null }): Promise<Comment> {
    if (!payload.text.trim()) throw new Error("Comment text is required");
    return (await apiClient.post<Comment>("/api/comments", payload)).data;
  },
  async updateStatus(commentId: string, newStatus: CommentStatus): Promise<Comment> {
    return (await apiClient.patch<Comment>(`/api/comments/${commentId}/status`, { status: newStatus })).data;
  },
  async submitApproval(documentId: string) {
    return (await apiClient.post<{ success: boolean }>(`/api/documents/${documentId}/submit-approval`)).data;
  },
  async listReviewers(documentId: string): Promise<Reviewer[]> {
    return (await apiClient.get<Reviewer[]>(`/api/reviewers?documentId=${encodeURIComponent(documentId)}`)).data;
  },
  async markReviewerActed(reviewerId: string) {
    return (await apiClient.post<{ success: boolean; reviewer: Reviewer }>(`/api/reviewers/${reviewerId}/act`)).data;
  },
};
