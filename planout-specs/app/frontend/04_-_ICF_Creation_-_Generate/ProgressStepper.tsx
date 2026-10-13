/** Six sequential generation checkpoints. Asset: 0f440293 */
import { Check, LoaderCircle } from "lucide-react";

export function ProgressStepper({ currentStepIndex, progress, steps }: { currentStepIndex: number; progress: number; steps: string[] }) {
  return (
    <ol className="gen-steps">
      {steps.map((label, index) => {
        const isDone = index < currentStepIndex || progress === 100;
        const isActive = index === currentStepIndex && progress < 100;
        const cls = isDone ? "done" : isActive ? "active" : "pending";
        return (
          <li key={label} className={`gen-step gen-step--${cls}`}>
            <span className="gen-step__dot">
              {isDone && <Check size={13} strokeWidth={3} />}
              {isActive && <LoaderCircle size={13} className="gen-step__spin" />}
            </span>
            <span className="gen-step__label">{label}</span>
            {isDone && <span className="gen-step__state">Done</span>}
            {isActive && <span className="gen-step__state">In progress…</span>}
          </li>
        );
      })}
    </ol>
  );
}
