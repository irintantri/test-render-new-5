/** Review page: composes ReviewPage with TOC, Review Actions, comments/approval, AI panel, and bottom bar. */
import { useState } from "react";
import { useParams } from "react-router-dom";
import type { DocumentView } from "@shared/types";
import { ReviewPage } from "@app/frontend/06_-_ICF_Creation_-_Review/ReviewPage";
import { TableOfContents } from "@app/frontend/Table_of_Contents/TableOfContents";
import { ReviewActionBar } from "@app/frontend/Review_Actions/ReviewActionBar";
import { CommentPanel } from "@app/frontend/Comment_Actions/CommentPanel";
import { ApprovalGate } from "@app/frontend/Comment_Actions/ApprovalGate";
import { AIDocumentEditor } from "@app/frontend/AI_Document_Editor/AIDocumentEditor";
import { ReviewBottomBar } from "@app/frontend/Bottom_Bar_-_Review/ReviewBottomBar";
import { CreationLayout } from "./CreationLayout";

export function ReviewRoute() {
  const { documentId = "" } = useParams();
  const [doc, setDoc] = useState<DocumentView | null>(null);
  const [gateKey, setGateKey] = useState(0);

  return (
    <CreationLayout currentStep={3} tone="white" documentId={doc?.id ?? documentId} protocolId={doc?.protocol_id} icfName={doc?.icf_name} icfVersion={doc?.icf_version}>
      <ReviewPage
        id={documentId}
        onDocument={setDoc}
        renderToc={({ document, sections, activeSectionId, onSectionClick }) => (
          <TableOfContents sections={sections} activeSectionId={activeSectionId} onSectionClick={onSectionClick} protocolId={document.protocol_id} versionLabel={document.icf_version} />
        )}
        renderActionBar={({ document }) => <ReviewActionBar documentId={document.id} docMetadata={document} />}
        renderAiPanel={({ section }) => <AIDocumentEditor sectionData={section} readOnly />}
        renderComments={({ document, sections, onOpenCountChange, onActivity }) => (
          <CommentPanel documentId={document.id} sections={sections} onOpenCountChange={onOpenCountChange} onActivity={onActivity} />
        )}
        renderBottomBar={({ document, openCommentsCount, refreshKey }) => (
          <ReviewBottomBar
            documentId={document.id}
            openCommentsCount={openCommentsCount}
            status={document.status}
            extra={document.status === "In Review" ? <ApprovalGate documentId={document.id} refreshKey={refreshKey + gateKey} onChange={() => setGateKey((k) => k + 1)} /> : null}
          />
        )}
      />
    </CreationLayout>
  );
}
