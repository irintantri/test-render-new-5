/**
 * Hook to manage the real-time SSE connection for ICF generation.
 * Monitors the generation pipeline and handles auto-navigation upon completion.
 */
FUNCTION useICFGeneration(jobId: string):
  - currentStep: string (The active checkpoint label)
  - progress: number (0-100)
  - isComplete: boolean
  - error: string | null

  INITIALIZE state:
    - currentStep = ""
    - progress = 0
    - isComplete = false

  ON MOUNT:
    - CREATE EventSource connection to "GET /api/icf/generation/{jobId}"
    
    - ON message received:
        - PARSE event data into { status, progress, step_label, document_id }
        - UPDATE currentStep = step_label
        - UPDATE progress = progress
        
        - IF status == "complete":
            - SET isComplete = true
            - CLOSE EventSource connection
            - TRIGGER delay(700ms)
            - NAVIGATE to "/edit/{document_id}"

    - ON error:
        - SET error = "Connection lost or generation failed"
        - CLOSE EventSource connection

  RETURN { currentStep, progress, isComplete, error }