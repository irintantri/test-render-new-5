/**
 * Service to calculate real-time task counts for the user dashboard.
 */
FUNCTION GET_USER_TASK_COUNTS(user_id):
    // Logic to aggregate counts from various content modules
    RETURN {
        "draftsInProgress": CONTENT_DB.COUNT(status="DRAFT", owner=user_id),
        "itemsAwaitingReview": CONTENT_DB.COUNT(status="PENDING", reviewer=user_id),
        "rejectedItems": CONTENT_DB.COUNT(status="REJECTED", owner=user_id),
        "approvedToPublish": CONTENT_DB.COUNT(status="APPROVED", owner=user_id)
    }