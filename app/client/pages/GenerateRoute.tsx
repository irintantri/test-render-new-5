import { useParams, useSearchParams } from "react-router-dom";
import { GenerationView } from "@app/frontend/04_-_ICF_Creation_-_Generate/GenerationView";
import { BottomBarGenerate } from "@app/frontend/Bottom_Bar_-_Generate/BottomBarGenerate";
import { CreationLayout } from "./CreationLayout";

export function GenerateRoute() {
  const { jobId = "" } = useParams();
  const [params] = useSearchParams();
  const protocolId = params.get("protocolId") ?? "";
  return (
    <CreationLayout currentStep={1} protocolId={protocolId || null} bottomBar={<BottomBarGenerate jobId={jobId} protocolId={protocolId || undefined} />}>
      <GenerationView jobId={jobId} protocolId={protocolId || "your protocol"} />
    </CreationLayout>
  );
}
