/** Generation progress page body — live via SSE (GenerationProgressController). */
import { AlertCircle, RotateCw } from "lucide-react";
import { Button } from "@shared/ui";
import { GenerationProgressController } from "@app/controller/04_-_ICF_Creation_-_Generate/GenerationProgressController";
import { GenerationVisualization } from "./GenerationVisualization";
import { ProgressStepper } from "./ProgressStepper";
import "./generate.css";

export function GenerationView({ jobId, protocolId }: { jobId: string; protocolId: string }) {
  return (
    <GenerationProgressController jobId={jobId}>
      {({ progress, currentStepIndex, isComplete, error, retry, checkpoints }) => (
        <div className="gen-view">
          <GenerationVisualization protocolId={protocolId} progress={progress} />
          <ProgressStepper currentStepIndex={currentStepIndex} progress={isComplete ? 100 : progress} steps={checkpoints} />
          {error ? (
            <div className="gen-view__error" role="alert">
              <AlertCircle size={16} />
              <span>{error}</span>
              <Button size="sm" variant="outline" icon={<RotateCw />} onClick={retry}>
                Retry
              </Button>
            </div>
          ) : isComplete ? (
            <footer className="gen-view__foot gen-view__foot--done">Redirecting to editor…</footer>
          ) : (
            <footer className="gen-view__foot">{progress}% complete — please do not close this window</footer>
          )}
        </div>
      )}
    </GenerationProgressController>
  );
}
