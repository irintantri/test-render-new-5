/** Headline progress metrics + ETA. */
import { Clock3, Sparkles } from "lucide-react";
import { formatEta } from "@shared/lib";

export function GenerationVisualization({ protocolId, progress }: { protocolId: string; progress: number }) {
  // ETA: max(0, round((100 - progress) * 3)) seconds
  const remainingSeconds = Math.max(0, Math.round((100 - progress) * 3));
  return (
    <section className="gen-viz">
      <div className="gen-viz__icon">
        <Sparkles size={24} />
      </div>
      <h1>Generating Consent Form</h1>
      <p className="gen-viz__sub">
        Creating ICF for <strong>{protocolId}</strong>
      </p>
      <div className="gen-viz__eta" aria-live="polite">
        <Clock3 size={14} />
        <span className="gen-viz__time">{formatEta(remainingSeconds)}</span>
        <span className="gen-viz__est">estimated</span>
      </div>
      <div className="gen-viz__track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
        <div className="gen-viz__fill" style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}
