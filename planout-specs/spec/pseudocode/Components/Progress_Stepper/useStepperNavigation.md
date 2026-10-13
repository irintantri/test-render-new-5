// Logic to handle step state and navigation rules
FUNCTION useStepperNavigation(currentStepId, documentId, completedStepsList):
    DEFINE steps = ["Setup", "Generate", "Edit & Refine", "Review", "Preview"]
    
    FUNCTION getStepStatus(stepName, index):
        IF index < currentStepIndex: RETURN "done"
        IF index == currentStepIndex: RETURN "active"
        RETURN "future"

    FUNCTION handleStepClick(stepName, index):
        // Rule: Generate step is transient, cannot be navigated to
        IF stepName == "Generate": RETURN null
        
        // Rule: Edit, Review, Preview require documentId
        IF ["Edit & Refine", "Review", "Preview"].includes(stepName) AND !documentId:
            RETURN null
            
        // Rule: Only completed or current steps are clickable
        IF index <= currentStepIndex:
            NAVIGATE_TO(routeFor(stepName), { documentId })

    RETURN { steps, getStepStatus, handleStepClick }