/**
 * Handles persistence logic for Reviewer status updates.
 */
FUNCTION updateReviewerStatus(reviewerId):
    // Update the 'acted' boolean field for the specific REVIEWER record
    // This reflects the user's action on the document review
    UPDATE REVIEWER 
    SET acted = TRUE 
    WHERE id = reviewerId
    RETURN updated_record