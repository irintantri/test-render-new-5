/**
 * Updates the reviewer status to 'acted' upon approval action.
 */
function markReviewerAsActed(reviewerId: UUID) {
    // Dispatches request with reviewer ID as path parameter
    const response = API.post(`/api/reviewers/${reviewerId}/act`);
    
    if (response.status === 200) {
        // Update local REVIEWER.acted status to true
        return { success: true };
    } else {
        throw new Error("Failed to update reviewer status");
    }
}