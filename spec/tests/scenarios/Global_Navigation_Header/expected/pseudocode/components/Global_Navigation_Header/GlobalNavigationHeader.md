// Main UI Component
COMPONENT GlobalNavigationHeader:
    IMPORT useUserContext
    
    // Asset: assets/77a95ca6-b9a9-49c8-8e20-8869ff95586e.svg
    
    RENDER:
        CONTAINER (Fixed Position, Full Width):
            // Left Section
            SECTION (Brand):
                TEXT "Powered by Agilisium"
                HEADING "Consent IQ"
                SUBTITLE "Informed Consent Form Generation Platform"

            // Right Section
            SECTION (User Actions):
                // Notification Icon
                ICON (Bell)
                IF userProfile.unreadNotifications > 0:
                    BADGE (userProfile.unreadNotifications)

                // User Profile
                DIV (Profile Container):
                    AVATAR (userProfile.avatarInitials)
                    TEXT userProfile.name
                    TEXT userProfile.role
                    ICON (Chevron Down)