COMPONENT CommentComposer:
    STATE text = ""
    STATE selectedSection = defaultSection
    
    RENDER:
        INPUT(text, onChange: setText)
        
        // Section dropdown appears on focus
        IF isFocused:
            DROPDOWN(sections, onSelect: setSelectedSection)
            
        BUTTON "Submit" ON CLICK:
            CommentService.addComment({ text, sectionId: selectedSection.id })
            RESET text
    Asset: assets/a5ff0cd2-c9d0-4705-8f79-eeac4d8d7b9a.svg