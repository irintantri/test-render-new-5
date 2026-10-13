/**
 * POST /api/documents/{documentId}/submit-approval
 *   200 submission successful · 400 validation failed (open comments, reviewers pending) · 500 server error
 */
import { apiClient } from "@shared/http";

export interface SubmitApprovalResponse {
  success: boolean;
  id: string;
  status: string;
}

export function postSubmitApproval(documentId: string) {
  return apiClient.post<SubmitApprovalResponse>(`/api/documents/${documentId}/submit-approval`);
}
