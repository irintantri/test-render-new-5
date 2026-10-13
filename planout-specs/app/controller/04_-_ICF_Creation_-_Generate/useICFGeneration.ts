/**
 * Real-time SSE connection for ICF generation; auto-navigates to the editor on completion.
 */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "@shared/http";
import { ROUTES } from "@shared/lib";
import type { GenerationEvent } from "@shared/types";

export const REDIRECT_DELAY_MS = 700;

export function useICFGeneration(jobId: string) {
  const [currentStep, setCurrentStep] = useState("");
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const navigate = useNavigate();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!jobId) return;
    setError(null);
    const source = new EventSource(apiUrl(`/api/icf/generation/${jobId}`));

    source.onmessage = (msg) => {
      const data = JSON.parse(msg.data) as GenerationEvent;
      setCurrentStep(data.step_label);
      setProgress(data.progress);
      if (data.status === "failed") {
        setError(data.error || "Connection lost or generation failed");
        source.close();
      }
      if (data.status === "complete") {
        setIsComplete(true);
        source.close();
        timer.current = setTimeout(() => navigate(ROUTES.edit(data.document_id!)), REDIRECT_DELAY_MS);
      }
    };
    source.onerror = () => {
      setError((prev) => prev ?? "Connection lost or generation failed");
      source.close();
    };
    return () => {
      source.close();
      clearTimeout(timer.current);
    };
  }, [jobId, attempt, navigate]);

  /** Reconnect after an error (the job keeps running server-side). */
  const retry = () => setAttempt((n) => n + 1);

  return { currentStep, progress, isComplete, error, retry };
}
