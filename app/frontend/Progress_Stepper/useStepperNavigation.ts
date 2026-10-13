import { useNavigate } from "react-router-dom";
import { ROUTES } from "@shared/lib";

export const STEPS = ["Setup", "Generate", "Edit & Refine", "Review", "Preview"] as const;
export type StepName = (typeof STEPS)[number];
export type StepStatus = "done" | "active" | "future";

export function useStepperNavigation(currentStep: StepName | number, documentId?: string | null, protocolId?: string | null, completedSteps: StepName[] = []) {
  const navigate = useNavigate();
  const currentStepIndex = typeof currentStep === "number" ? currentStep : STEPS.indexOf(currentStep);

  const getStepStatus = (stepName: StepName, index: number): StepStatus => {
    if (index < currentStepIndex || completedSteps.includes(stepName)) return index === currentStepIndex ? "active" : "done";
    if (index === currentStepIndex) return "active";
    return "future";
  };

  const routeFor = (stepName: StepName): string | null => {
    switch (stepName) {
      case "Setup":
        return ROUTES.setup(protocolId ?? undefined);
      case "Edit & Refine":
        return documentId ? ROUTES.edit(documentId) : null;
      case "Review":
        return documentId ? ROUTES.review(documentId) : null;
      case "Preview":
        return documentId ? ROUTES.preview(documentId) : null;
      default:
        return null;
    }
  };

  const isClickable = (stepName: StepName, index: number) => {
    if (stepName === "Generate") return false; // transient step
    if (["Edit & Refine", "Review", "Preview"].includes(stepName) && !documentId) return false;
    return index <= currentStepIndex && index !== currentStepIndex;
  };

  const handleStepClick = (stepName: StepName, index: number) => {
    if (!isClickable(stepName, index)) return null;
    const route = routeFor(stepName);
    if (route) navigate(route);
    return route;
  };

  return { steps: STEPS, currentStepIndex, getStepStatus, handleStepClick, isClickable };
}
