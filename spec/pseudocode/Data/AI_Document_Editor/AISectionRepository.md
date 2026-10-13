// This service handles the persistence and versioning logic for AI-edited sections.

FUNCTION updateSectionWithAI(documentId, sectionId, aiPrompt, currentContent):
    // 1. Call the AI Service (external provider) to generate the refined content
    refinedContent = AI_PROVIDER.generate(prompt: aiPrompt, context: currentContent)

    // 2. Fetch existing section to determine current version
    existingSection = DATABASE.find(AIEditedSection, { id: sectionId, document_id: documentId })

    // 3. Prepare updated record
    newVersion = existingSection.version + 1
    updatedSection = {
        id: sectionId,
        document_id: documentId,
        title: existingSection.title,
        ai_label: "AI Edited",
        status: "AI Generated",
        content: refinedContent,
        position: existingSection.position,
        version: newVersion
    }

    // 4. Persist to database
    DATABASE.update(AIEditedSection, updatedSection)

    RETURN updatedSection