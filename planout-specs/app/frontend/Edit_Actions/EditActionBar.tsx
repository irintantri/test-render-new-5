/** Document context + section actions (Edit · Delete · Preview Draft). Asset: 116d52e2 */
import { useState } from "react";
import { Eye, PenLine, Trash2 } from "lucide-react";
import { Button, Modal, Pill, TextArea } from "@shared/ui";
import type { DocumentView, SectionView } from "@shared/types";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { PreviewModal } from "./PreviewModal";
import { useSectionActions } from "./useSectionActions";

export function EditActionBar({
  documentData,
  selectedSection,
  onEditSection,
  onChanged,
}: {
  documentData: DocumentView;
  selectedSection: SectionView | null;
  /** When provided, the page edits inline; otherwise a modal editor is used. */
  onEditSection?: () => void;
  onChanged: () => void | Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { updateSection, deleteSection, busy } = useSectionActions({ onRefresh: onChanged });

  const title = selectedSection ? (selectedSection.parent_id ? selectedSection.title : `${selectedSection.number}. ${selectedSection.title}`) : "No section selected";
  const hasSubsections = !!selectedSection && documentData.metadata.sections.some((s) => s.parent_id === selectedSection.id);

  const startEdit = () => {
    if (!selectedSection) return;
    if (onEditSection) return onEditSection();
    setDraft(selectedSection.content);
    setIsEditing(true);
  };

  return (
    <div className="doc-actionbar">
      <span className="doc-actionbar__name">{documentData.icf_name}</span>
      <span className="doc-actionbar__section" title={title}>
        {title}
      </span>
      <Button variant="primary-ghost" size="sm" icon={<PenLine />} disabled={!selectedSection} onClick={startEdit}>
        Edit
      </Button>
      <Button variant="danger-ghost" size="sm" icon={<Trash2 />} disabled={!selectedSection} onClick={() => setConfirmDelete(true)}>
        Delete
      </Button>
      <span className="doc-actionbar__sep" />
      <Button variant="outline" size="sm" icon={<Eye />} onClick={() => setShowPreviewModal(true)}>
        Preview Draft
      </Button>
      <Pill strong>
        {documentData.icf_version} {documentData.status === "Draft" ? "Draft" : documentData.status}
      </Pill>

      {isEditing && selectedSection && (
        <Modal
          open
          onClose={() => setIsEditing(false)}
          title={`Edit — ${title}`}
          footer={
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button loading={busy} disabled={!draft.trim()} onClick={async () => (await updateSection(selectedSection.id, draft)) && setIsEditing(false)}>
                Save
              </Button>
            </>
          }
        >
          <TextArea value={draft} onChange={(e) => setDraft(e.target.value)} rows={12} invalid={!draft.trim()} />
          {!draft.trim() && <div className="field__error">Section content cannot be empty.</div>}
        </Modal>
      )}

      <DeleteConfirmationModal
        open={confirmDelete}
        sectionTitle={title}
        hasSubsections={hasSubsections}
        busy={busy}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={async () => {
          if (selectedSection && (await deleteSection(selectedSection.id))) setConfirmDelete(false);
        }}
      />

      {showPreviewModal && <PreviewModal documentData={documentData} onClose={() => setShowPreviewModal(false)} />}
    </div>
  );
}
