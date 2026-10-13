/**
 * Orchestrates generation UI state from the SSE stream and hands it to a view.
 */
import type { ReactNode } from "react";
import { useICFGeneration } from "./useICFGeneration";

export const GENERATION_CHECKPOINTS = [
  "Parsing protocol data",
  "Loading reference documents",
  "Applying regulatory templates",
  "Generating consent sections",
  "Running compliance checks",
  "Finalizing document",
];

export interface GenerationProgressState {
  progress: number;
  currentStep: string;
  currentStepIndex: number;
  isComplete: boolean;
  error: string | null;
  retry: () => void;
  checkpoints: string[];
}

export function GenerationProgressController({
  jobId,
  children,
}: {
  jobId: string;
  children: (state: GenerationProgressState) => ReactNode;
}) {
  const { currentStep, progress, isComplete, error, retry } = useICFGeneration(jobId);
  const currentStepIndex = Math.max(0, GENERATION_CHECKPOINTS.indexOf(currentStep));
  return <>{children({ progress, currentStep, currentStepIndex, isComplete, error, retry, checkpoints: GENERATION_CHECKPOINTS })}</>;
}
