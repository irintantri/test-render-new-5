// API layer exposing endpoints for the Edit and Refine feature.

ENDPOINT GET /api/documents/:id {
    // Returns the full DocumentDTO for the editor interface
    RETURN DocumentRepository.getDocumentById(request.params.id);
}

ENDPOINT PATCH /api/documents/:id {
    // Updates document content via manual edit
    RETURN DocumentService.handleManualEdit(request.params.id, request.body.content);
}

ENDPOINT POST /api/documents/:id/rewrite {
    // Triggers AI-assisted rewrite for a specific section
    // Expects: { sectionId: string, prompt: string }
    RETURN DocumentService.handleAIRewrite(request.params.id, request.body.sectionId, request.body.prompt);
}