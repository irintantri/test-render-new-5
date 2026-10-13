/**
 * Renders the six sequential checkpoints.
 * Asset: assets/0f440293-ce09-4cbb-8748-0f9854854032.svg
 */
component ProgressStepper(currentStepIndex: number, progress: number, steps: string[]) {
  return (
    <ol class="stepper">
      {steps.map((label, index) => {
        const isDone = index < currentStepIndex || progress === 100;
        const isActive = index === currentStepIndex && progress < 100;
        
        return (
          <li class={isDone ? "done" : isActive ? "active" : "pending"}>
            {isDone && <Icon name="check-green" />}
            {isActive && <Spinner />}
            <span>{label}</span>
            {isDone && <label>Done</label>}
            {isActive && <label>In progress…</label>}
          </li>
        );
      })}
    </ol>
  );
}