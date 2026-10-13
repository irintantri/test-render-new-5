import { AlertTriangle } from "lucide-react";
import { Button, Modal } from "@shared/ui";

export function DeleteConfirmationModal({
  open,
  sectionTitle,
  hasSubsections,
  busy,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  sectionTitle: string;
  hasSubsections?: boolean;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Delete this section?"
      icon={<AlertTriangle size={18} color="var(--red-600)" />}
      footer={
        <>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" loading={busy} onClick={onConfirm}>
            Delete
          </Button>
        </>
      }
    >
      <p style={{ margin: "0 0 8px" }}>
        <b>{sectionTitle}</b>
        {hasSubsections ? " and all of its subsections" : ""} will be removed from the document.
      </p>
      <p style={{ margin: 0, color: "var(--red-700)" }}>Warning: This action cannot be undone.</p>
    </Modal>
  );
}
