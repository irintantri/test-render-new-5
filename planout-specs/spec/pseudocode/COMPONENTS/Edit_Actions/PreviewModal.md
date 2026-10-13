// Component: PreviewModal
// Description: Full-screen PDF preview of the ICF document.

Component PreviewModal(documentData, onClose):
    Render:
        ModalOverlay:
            Header:
                Display Icon "Document"
                Display Label: "{documentData.protocol_id} ICF — {documentData.version}.pdf · Draft"
                Button "Close" -> onClick: onClose()
            Body:
                ScrollableContainer:
                    Render IcfPdfDocument(documentData)
            Backdrop -> onClick: onClose()