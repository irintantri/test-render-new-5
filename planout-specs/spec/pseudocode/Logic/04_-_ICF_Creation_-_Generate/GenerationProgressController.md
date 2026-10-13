/**
 * Logic layer for the generation progress view.
 * Orchestrates the UI state based on the SSE stream.
 */
COMPONENT GenerationProgressController(jobId):
  - IMPORT useICFGeneration hook
  
  - RENDER:
      - Display progress bar mapped to `progress`
      - Display list of 6 sequential checkpoints
      - Highlight checkpoint matching `currentStep`
      - IF `error` exists, display retry/error UI
      - IF `isComplete` is true, show "Redirecting to editor..." message