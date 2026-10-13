/**
 * Service to handle retrieval of authenticated user identity.
 * Maps database User entity to the UserContext DTO required by the Global Navigation Header.
 */

FUNCTION getUserContext():
    // Fetch current session user from database
    user = DB.User.find(current_session.user_id)
    
    IF user IS NULL:
        RETURN {
            id: NULL,
            firstName: "User",
            lastName: "Name",
            role: "ICF Author",
            secondaryRole: NULL,
            taskCounts: 0
        }
    
    // Map entity to DTO
    RETURN {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        secondaryRole: user.secondaryRole,
        taskCounts: user.taskCounts
    }