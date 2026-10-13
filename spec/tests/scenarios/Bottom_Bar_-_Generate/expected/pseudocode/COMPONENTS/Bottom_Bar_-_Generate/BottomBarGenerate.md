/**
 * Component: BottomBarGenerate
 * Description: A fixed bottom navigation bar for the Generate page.
 * Contains a "Back to Setup" button and a "Skip" button.
 * Asset: assets/d4357674-d49a-4826-8fbb-8813a446b9c2.svg
 */

COMPONENT BottomBarGenerate(jobId: string) {
    IMPORT useNavigationLogic FROM "./useNavigationLogic"
    
    CONST { handleBackToSetup, handleSkip } = useNavigationLogic(jobId)

    RETURN (
        <Container style="fixed-bottom-bar">
            <GhostButton 
                label="Back to Setup" 
                onClick={handleBackToSetup} 
            />
            <GhostButton 
                label="Skip" 
                onClick={handleSkip} 
            />
        </Container>
    )
}