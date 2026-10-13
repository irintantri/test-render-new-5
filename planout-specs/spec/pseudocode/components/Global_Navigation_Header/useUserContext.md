// Custom hook to manage user identity state
FUNCTION useUserContext():
    INITIALIZE state: userProfile = { name: null, role: null, avatarInitials: null, unreadNotifications: 0 }
    INITIALIZE state: isLoading = true
    INITIALIZE state: error = null

    ON MOUNT:
        TRY:
            data = CALL API.fetchUserContext()
            SET userProfile = {
                name: data.fullName OR "User Name",
                role: data.role OR "ICF Author",
                avatarInitials: data.initials,
                unreadNotifications: data.taskCounts
            }
        CATCH:
            SET error = "Failed to load user context"
        FINALLY:
            SET isLoading = false

    RETURN { userProfile, isLoading, error }