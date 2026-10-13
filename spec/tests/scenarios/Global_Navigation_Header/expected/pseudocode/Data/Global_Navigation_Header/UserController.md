/**
 * API Controller for /api/user/context
 */

ENDPOINT GET /api/user/context:
    TRY:
        context = UserContextService.getUserContext()
        RETURN 200 OK WITH context
    CATCH error:
        RETURN 500 INTERNAL_SERVER_ERROR WITH { message: "Failed to load user context" }