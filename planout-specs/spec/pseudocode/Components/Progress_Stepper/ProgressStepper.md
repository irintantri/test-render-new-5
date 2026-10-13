// UI Component for the Progress Stepper
// Asset: assets/61238dad-594f-4495-b090-7062b594f51f.svg

COMPONENT ProgressStepper(currentStep, documentId, completedSteps):
    IMPORT { steps, getStepStatus, handleStepClick } FROM useStepperNavigation(currentStep, documentId, completedSteps)

    RENDER Container:
        FOR EACH step, index IN steps:
            status = getStepStatus(step, index)
            
            RENDER StepItem:
                PROPS:
                    label = step
                    state = status // "done", "active", "future"
                    isClickable = (status == "done" OR status == "active") AND step != "Generate"
                    onClick = () => handleStepClick(step, index)
                
                IF status == "done":
                    SHOW CheckIcon
                ELSE:
                    SHOW StepNumber(index + 1)