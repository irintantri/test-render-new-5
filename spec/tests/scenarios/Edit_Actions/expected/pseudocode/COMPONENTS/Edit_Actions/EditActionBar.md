// Component: EditActionBar
// Asset: assets/116d52e2-ece5-423b-9cc7-f887580bde74.svg
// Description: The main container for document context and section-level actions.

Component EditActionBar(documentData, selectedSection):
    State isEditing = false
    State showPreviewModal = false

    Render:
        Header:
            Display DocumentName(documentData.name)
            Display ICFVersion(documentData.version)
        
        SectionContext:
            Display SelectedSectionTitle(selectedSection.title)
            
            ActionGroup:
                Button "Preview Draft" -> onClick: showPreviewModal = true
                Button "Edit" -> onClick: isEditing = true
                Button "Delete" -> onClick: triggerDeleteConfirmation()

        If isEditing:
            Render SectionEditor(selectedSection)
                OnSave(content): 
                    call useSectionActions.updateSection(selectedSection.id, content)
                    isEditing = false
                OnCancel: 
                    isEditing = false

        If showPreviewModal:
            Render PreviewModal(documentData)
                OnClose: showPreviewModal = false