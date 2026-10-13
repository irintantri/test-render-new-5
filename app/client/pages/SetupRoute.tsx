import { useParams } from "react-router-dom";
import { SetupPage } from "@app/frontend/03_-_ICF_Creation_-_Setup/SetupPage";
import { SetupBottomBar } from "@app/frontend/Bottom_Bar_-_Setup/SetupPage";
import { CreationLayout } from "./CreationLayout";

export function SetupRoute() {
  const { protocolId } = useParams();
  return (
    <CreationLayout currentStep={0}>
      <SetupPage initialProtocolId={protocolId} renderBottomBar={(state) => <SetupBottomBar state={state} />} />
    </CreationLayout>
  );
}
