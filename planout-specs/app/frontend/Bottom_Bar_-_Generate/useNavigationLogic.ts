import { useNavigate } from "react-router-dom";
import { ROUTES } from "@shared/lib";

/**
 * handleBackToSetup → setup (protocol pre-selected when known)
 * handleSkip        → /edit/{jobId} (server resolves the job to its document)
 */
export function useNavigationLogic(jobId: string, protocolId?: string) {
  const navigate = useNavigate();

  function handleBackToSetup() {
    navigate(ROUTES.setup(protocolId));
  }

  function handleSkip() {
    if (jobId) navigate(ROUTES.edit(jobId));
    else console.error("Cannot skip: Missing jobId");
  }

  return { handleBackToSetup, handleSkip };
}
