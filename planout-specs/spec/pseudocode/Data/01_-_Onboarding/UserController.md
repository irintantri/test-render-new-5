/**
 * Controller handling the authenticated user session context.
 */
FUNCTION GET_USER_ME(request):
    // Extract user identity from session/token
    user_id = AUTH_SERVICE.GET_CURRENT_USER_ID(request)
    
    IF user_id IS NULL:
        RETURN HTTP_401_UNAUTHORIZED
    
    // Fetch core profile data
    user_profile = DB.QUERY("SELECT * FROM USER WHERE id = ?", user_id)
    
    // Fetch aggregated task counts for dashboard badges
    task_counts = DB.QUERY("SELECT * FROM TASK_SUMMARY WHERE userId = ?", user_id)
    
    // Construct response payload
    response = {
        "id": user_profile.id,
        "firstName": user_profile.firstName,
        "lastName": user_profile.lastName,
        "email": user_profile.email,
        "avatarUrl": user_profile.avatarUrl,
        "role": user_profile.role,
        "secondaryRole": user_profile.secondaryRole,
        "locale": user_profile.locale,
        "timezone": user_profile.timezone,
        "lastLoginAt": user_profile.lastLoginAt,
        "taskCounts": {
            "draftsInProgress": task_counts.draftsInProgress,
            "itemsAwaitingReview": task_counts.itemsAwaitingReview,
            "rejectedItems": task_counts.rejectedItems,
            "approvedToPublish": task_counts.approvedToPublish
        }
    }
    
    RETURN HTTP_200_OK(response)