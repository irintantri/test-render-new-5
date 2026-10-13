/**
 * Controller handling the authenticated user profile initialization.
 * Orchestrates data retrieval from the User and TaskSummary services.
 */
function handleGetUsersMe(request) {
    // 1. Extract session identity from the Authentication Session Service
    const userId = AuthenticationSessionService.getAuthenticatedUserId(request);
    
    if (!userId) {
        return { status: 401, body: { error: "Unauthorized" } };
    }

    // 2. Fetch core profile data
    const userProfile = Database.find("USER", { id: userId });
    
    // 3. Fetch associated task metrics
    const taskSummary = Database.find("TASK_SUMMARY", { userId: userId });

    // 4. Construct and return the unified response
    return {
        status: 200,
        body: {
            firstName: userProfile.firstName,
            lastName: userProfile.lastName,
            avatarUrl: userProfile.avatarUrl,
            role: userProfile.role,
            locale: userProfile.locale,
            timezone: userProfile.timezone,
            taskSummary: {
                draftsInProgress: taskSummary.draftsInProgress,
                itemsAwaitingReview: taskSummary.itemsAwaitingReview,
                rejectedItems: taskSummary.rejectedItems,
                approvedToPublish: taskSummary.approvedToPublish
            }
        }
    };
}