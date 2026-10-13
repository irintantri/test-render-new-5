/**
 * Validates if the "Submit for Approval" button should be enabled.
 */
function canSubmitForApproval(comments: COMMENT[], reviewers: REVIEWER[]) {
    const openComments = comments.filter(c => c.status !== "Resolved" && c.status !== "Closed");
    const allReviewersActed = reviewers.every(r => r.acted === true);
    
    return openComments.length === 0 && allReviewersActed;
}