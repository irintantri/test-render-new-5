// Main container component for the AI editing panel
Component AIDocumentEditor(sectionData) {
    State currentContent = sectionData.content
    State userPrompt = ""
    State isProcessing = false

    // Asset: assets/7c11f251-c8d8-47c5-8ea4-53cf3845db53.svg
    
    Render {
        Display SectionHeader(sectionData.title)
        
        // Editable textarea for manual refinement
        TextArea(
            value: currentContent,
            onChange: (val) => currentContent = val
        )

        // Quick Prompts
        QuickPromptBar(onSelect: (prompt) => userPrompt = prompt)

        // Instruction Input
        TextArea(
            placeholder: "Ask AI to refine content...",
            value: userPrompt,
            onChange: (val) => userPrompt = val
        )

        // Action Button
        Button(
            label: isProcessing ? "Asking…" : "Ask AI",
            disabled: userPrompt.isEmpty || isProcessing,
            onClick: handleAskAI
        )
    }

    Function handleAskAI() {
        isProcessing = true
        
        // 1. Save manual changes first
        await DocumentService.saveSection(sectionData.id, currentContent)
        
        // 2. Call AI Service
        try {
            updatedContent = await AIService.rewriteSection(
                sectionId: sectionData.id,
                currentText: currentContent,
                instruction: userPrompt
            )
            
            // 3. Update UI instantly
            currentContent = updatedContent
            EventBus.emit("section-updated", { id: sectionData.id, content: updatedContent })
        } finally {
            isProcessing = false
        }
    }
}