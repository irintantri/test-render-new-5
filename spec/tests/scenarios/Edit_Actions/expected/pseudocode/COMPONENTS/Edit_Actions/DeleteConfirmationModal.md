// Component: DeleteConfirmationModal
// Description: Overlay to prevent accidental deletion.

Component DeleteConfirmationModal(sectionId, onConfirm, onCancel):
    Render:
        Overlay:
            Title: "Delete this section?"
            Body: "Warning: This action cannot be undone."
            Button "Cancel" -> onClick: onCancel()
            Button "Delete" -> onClick: 
                call useSectionActions.deleteSection(sectionId)
                onConfirm()