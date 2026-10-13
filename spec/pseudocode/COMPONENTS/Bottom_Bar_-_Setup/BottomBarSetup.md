COMPONENT BottomBarSetup:
    // Props: 
    // - isGenerateEnabled: boolean (derived from form validation)
    // - onGenerate: function (triggers API call)

    RENDER:
        CONTAINER (Bottom-Bar-Setup)
            Asset: assets/4d72f464-245d-49a0-b712-dffa9b8c36bb.svg
            
            // Left side: Navigation
            BUTTON (Ghost, Left Chevron) "Back to Dashboard"
                ON_CLICK: NavigateTo("/dashboard")
            
            // Right side: Action
            BUTTON (Primary) "Generate ICF"
                DISABLED: !isGenerateEnabled
                ON_CLICK: 
                    CALL useGenerateICF.handleGenerate()