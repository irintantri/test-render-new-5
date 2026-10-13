/** Edit & Refine page: composes DocumentEditor with TOC, Edit Actions, AI editor, and bottom bar. */
import { useState } from "react";
import { useParams } from "react-router-dom";
import type { DocumentView } from "@shared/types";
import { DocumentEditor } from "@app/frontend/05_-_ICF_Creation_-_Edit_and_Refine/DocumentEditor";
import { EditableTableOfContents } from "@app/frontend/Table_of_Contents/TableOfContents";
import { EditActionBar } from "@app/frontend/Edit_Actions/EditActionBar";
import { AIDocumentEditor } from "@app/frontend/AI_Document_Editor/AIDocumentEditor";
import { BottomActionBar } from "@app/frontend/Bottom_Bar_-_Edit/BottomActionBar";
import { CreationLayout } from "./CreationLayout";

export function EditRoute() {
  const { documentId = "" } = useParams();
  const [doc, setDoc] = useState<DocumentView | null>(null);

  return (
    <CreationLayout currentStep={2} tone="white" documentId={doc?.id ?? documentId} protocolId={doc?.protocol_id} icfName={doc?.icf_name} icfVersion={doc?.icf_version}>
      <DocumentEditor
        documentId={documentId}
        onDocument={setDoc}
        renderToc={({ document, sections, activeSectionId, onSectionClick, onSectionsChanged }) => (
          <EditableTableOfContents
            documentId={document.id}
            sections={sections}
            activeSectionId={activeSectionId}
            onSectionClick={onSectionClick}
            onSectionsChanged={onSectionsChanged}
            protocolId={document.protocol_id}
            versionLabel={document.icf_version}
          />
        )}
        renderActionBar={({ document, selectedSection, onEditSection, onChanged }) => (
          <EditActionBar documentData={document} selectedSection={selectedSection} onEditSection={onEditSection} onChanged={onChanged} />
        )}
        renderSidePanel={({ section, focusKey, onProcessingChange, onSectionUpdated }) => (
          <AIDocumentEditor sectionData={section} focusKey={focusKey} onProcessingChange={onProcessingChange} onSectionUpdated={() => onSectionUpdated()} />
        )}
        renderBottomBar={({ document }) => <BottomActionBar documentId={document.id} protocolId={document.protocol_id} status={document.status} />}
      />
    </CreationLayout>
  );
}
