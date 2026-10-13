COMPONENT SetupPage:
    // Logic to determine if the Generate button should be active
    STATE isFormValid = (protocol && references.length > 0 && template)

    RENDER:
        // ... other page content ...
        
        BottomBarSetup(
            isGenerateEnabled: isFormValid,
            onGenerate: handleGenerate
        )