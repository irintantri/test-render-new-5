// Business logic layer for processing edits and AI-assisted refinements.

FUNCTION handleManualEdit(id: UUID, newContent: Text): Document {
    // Validates content and persists manual changes
    VALIDATE(newContent, "Content cannot be empty");
    RETURN DocumentRepository.updateDocumentContent(id, newContent, currentMetadata);
}

FUNCTION handleAIRewrite(id: UUID, sectionId: String, prompt: String): Text {
    // Orchestrates call to AI service to rewrite a specific section
    // Returns the refined text block to be injected into the document
    LET currentContent = DocumentRepository.getDocumentById(id).content;
    LET refinedText = AI_SERVICE.generateRewrite(currentContent, sectionId, prompt);
    RETURN refinedText;
}