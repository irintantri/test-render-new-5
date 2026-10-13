/**
 * Main container for the ICF Generation process.
 * Orchestrates polling and state management for the generation pipeline.
 */
component GenerationView(jobId: string, protocolId: string) {
  state progress = 0;
  state status = "pending"; // "pending" | "processing" | "completed" | "failed"
  state step_label = "";
  state document_id = null;
  
  // Derived state for the stepper
  // Maps step_label to index 0-5 based on the sequence defined in requirements
  const steps = [
    "Parsing protocol data",
    "Loading reference documents",
    "Applying regulatory templates",
    "Generating consent sections",
    "Running compliance checks",
    "Finalizing document"
  ];
  
  const currentStepIndex = steps.indexOf(step_label);

  // Polling effect
  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch("/api/icf/generation/{jobId}", { 
        pathParams: { jobId } 
      });
      
      if (response.status === 200) {
        const data = await response.json();
        progress = data.progress;
        status = data.status;
        step_label = data.step_label;
        document_id = data.document_id;

        if (progress === 100 || status === "completed") {
          clearInterval(interval);
          // Auto-navigate to editor
          router.push(`/icf/editor/${document_id}`);
        }
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [jobId]);

  return (
    <WrapperShell>
      <GlobalNavigationHeader />
      
      <GenerationVisualization 
        protocolId={protocolId} 
        progress={progress} 
      />
      
      <ProgressStepper 
        currentStepIndex={currentStepIndex} 
        progress={progress} 
        steps={steps} 
      />
      
      <BottomBarGenerate />
    </WrapperShell>
  );
}