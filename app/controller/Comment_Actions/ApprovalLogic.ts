/** Whether "Submit for Approval" should be enabled (pure — client + server). */
export interface ApprovalComment {
  status: string;
  parent_id?: string | null;
}
export interface ApprovalReviewer {
  acted: boolean;
}

export function countOpenComments(comments: ApprovalComment[]): number {
  return comments.filter((c) => !c.parent_id && c.status !== "Resolved" && c.status !== "Closed").length;
}

export function canSubmitForApproval(comments: ApprovalComment[], reviewers: ApprovalReviewer[]): boolean {
  const allReviewersActed = reviewers.every((r) => r.acted === true);
  return countOpenComments(comments) === 0 && allReviewersActed;
}
