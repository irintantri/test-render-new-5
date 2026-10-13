/** Setup page bottom bar. Asset: 4d72f464 */
import { useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { ROUTES } from "@shared/lib";
import { Button } from "@shared/ui";

export function BottomBarSetup({ isGenerateEnabled, onGenerate, isGenerating }: { isGenerateEnabled: boolean; onGenerate: () => void; isGenerating?: boolean }) {
  const navigate = useNavigate();
  return (
    <div className="bottom-bar">
      <button className="btn btn--primary-ghost" style={{ paddingLeft: 0 }} onClick={() => navigate(ROUTES.icfDashboard)}>
        ← Back to Dashboard
      </button>
      <Button size="lg" icon={<Sparkles />} disabled={!isGenerateEnabled} loading={isGenerating} onClick={onGenerate} title={isGenerateEnabled ? undefined : "Select a protocol, attach at least one reference, and choose a template"}>
        Generate ICF
      </Button>
    </div>
  );
}
