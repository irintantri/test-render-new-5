/**
 * Hook: useNavigationLogic
 * Description: Encapsulates navigation routing logic for the Generate page.
 * API Signature:
 *   - handleBackToSetup(): void -> Navigates to '/create'
 *   - handleSkip(): void -> Navigates to '/edit/{jobId}'
 */

HOOK useNavigationLogic(jobId: string) {
    IMPORT { navigate } FROM "app-router"

    FUNCTION handleBackToSetup() {
        // Business Goal: Return user to the initial configuration step
        navigate("/create")
    }

    FUNCTION handleSkip() {
        // Business Goal: Allow user to bypass generation and proceed to manual edit
        // Requires jobId to maintain state context
        IF (jobId IS NOT EMPTY) {
            navigate(`/edit/${jobId}`)
        } ELSE {
            LOG_ERROR("Cannot skip: Missing jobId")
        }
    }

    RETURN { handleBackToSetup, handleSkip }
}