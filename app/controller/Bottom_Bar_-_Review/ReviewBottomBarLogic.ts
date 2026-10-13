/**
 * Review bottom bar rules (pure — safe to import from client and server).
 */
export interface SubmitApprovalResult {
  success: boolean;
  message?: string;
  error?: string;
}

/** Gate: submission is blocked while comments remain open. */
export function evaluateSubmitGate(openCommentsCount: number): SubmitApprovalResult {
  if (openCommentsCount > 0) return { success: false, message: "Cannot submit with open comments." };
  return { success: true };
}

export function getSubmitButtonLabel(openCommentsCount: number): string {
  if (openCommentsCount > 0) return `Submit for Approval (${openCommentsCount} open)`;
  return "Submit for Approval";
}
