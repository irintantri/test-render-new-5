import { useState } from "react";
import { useParams } from "react-router-dom";
import type { DocumentView } from "@shared/types";
import { ICFPreviewPage } from "@app/frontend/07_-_ICF_Creation_-_Preview/ICFPreviewPage";
import { CreationLayout } from "./CreationLayout";

export function PreviewRoute() {
  const { documentId = "" } = useParams();
  const [doc, setDoc] = useState<DocumentView | null>(null);
  return (
    <CreationLayout currentStep={4} documentId={doc?.id ?? documentId} protocolId={doc?.protocol_id} icfName={doc?.icf_name} icfVersion={doc?.icf_version}>
      <ICFPreviewPage documentId={documentId} onDocument={setDoc} />
    </CreationLayout>
  );
}
