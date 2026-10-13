/**
 * Displays the high-level progress metrics and ETA.
 */
component GenerationVisualization(protocolId: string, progress: number) {
  // ETA calculation: max(0, round((100 - progress) * 3)) seconds
  const remainingSeconds = Math.max(0, Math.round((100 - progress) * 3));
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedETA = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <section>
      <h1>Generating Consent Form</h1>
      <p>Creating ICF for <strong>{protocolId}</strong></p>
      
      <div class="eta-display">
        <Icon name="clock" />
        <span>{formattedETA}</span>
      </div>

      <div class="progress-track">
        <div class="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <footer>
        {progress}% complete — please do not close this window
      </footer>
    </section>
  );
}