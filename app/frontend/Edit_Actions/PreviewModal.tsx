/** Full-screen PDF-style preview of the draft ICF. */
import { FileText } from "lucide-react";
import { IcfPdfDocument, Modal } from "@shared/ui";
import type { DocumentView } from "@shared/types";

export function PreviewModal({ documentData, onClose }: { documentData: DocumentView; onClose: () => void }) {
  return (
    <Modal
      open
      wide
      onClose={onClose}
      icon={<FileText size={16} />}
      title={`${documentData.protocol_id} ICF — ${documentData.icf_version}.pdf · Draft`}
      bodyStyle={{ background: "#e5e7eb", padding: "28px 16px" }}
    >
      <IcfPdfDocument document={documentData} draft />
    </Modal>
  );
}
