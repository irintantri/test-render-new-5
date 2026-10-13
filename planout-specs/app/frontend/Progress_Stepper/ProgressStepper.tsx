/** Five-stage creation stepper. Asset: 61238dad */
import { Fragment } from "react";
import { BookOpen, Check, Eye, FileText, MessageSquare, Sparkles } from "lucide-react";
import { STEPS, useStepperNavigation, type StepName } from "./useStepperNavigation";
import "./StepperStyles.css";

const ICONS: Record<StepName, typeof BookOpen> = {
  Setup: BookOpen,
  Generate: Sparkles,
  "Edit & Refine": FileText,
  Review: MessageSquare,
  Preview: Eye,
};

export interface ProgressStepperProps {
  currentStep: StepName | number;
  documentId?: string | null;
  protocolId?: string | null;
  completedSteps?: StepName[];
}

export function ProgressStepper({ currentStep, documentId, protocolId, completedSteps }: ProgressStepperProps) {
  const { steps, getStepStatus, handleStepClick, isClickable } = useStepperNavigation(currentStep, documentId, protocolId, completedSteps);
  return (
    <nav className="stepper-container" aria-label="Consent creation progress">
      {steps.map((step, index) => {
        const status = getStepStatus(step, index);
        const clickable = isClickable(step, index);
        const Icon = ICONS[step];
        return (
          <Fragment key={step}>
            {index > 0 && <span className={`step-connector ${getStepStatus(STEPS[index - 1], index - 1) === "done" ? "done" : ""}`} />}
            <button
              className={`step-item ${status} ${clickable ? "clickable" : ""}`}
              aria-current={status === "active" ? "step" : undefined}
              aria-disabled={!clickable}
              onClick={() => handleStepClick(step, index)}
              title={status === "future" ? `Step ${index + 1}` : step}
            >
              <span className="step-item__icon">{status === "done" ? <Check strokeWidth={3} /> : <Icon />}</span>
              {step}
            </button>
          </Fragment>
        );
      })}
    </nav>
  );
}
