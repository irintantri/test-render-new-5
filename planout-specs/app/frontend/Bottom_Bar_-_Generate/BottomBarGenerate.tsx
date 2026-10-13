/** Generate page bottom bar: Back to Setup · Skip. Asset: d4357674 */
import { ChevronLeft } from "lucide-react";
import { Button } from "@shared/ui";
import { useNavigationLogic } from "./useNavigationLogic";

export function BottomBarGenerate({ jobId, protocolId }: { jobId: string; protocolId?: string }) {
  const { handleBackToSetup, handleSkip } = useNavigationLogic(jobId, protocolId);
  return (
    <div className="bottom-bar">
      <Button variant="ghost" icon={<ChevronLeft />} onClick={handleBackToSetup}>
        Back to Setup
      </Button>
      <Button variant="link" onClick={handleSkip}>
        Skip
      </Button>
    </div>
  );
}
