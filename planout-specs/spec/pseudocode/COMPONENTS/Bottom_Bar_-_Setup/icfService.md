SERVICE icfService:
    // API Signature for the generation endpoint
    // POST /api/v1/icf/generate
    // Request Body: { protocolId, referenceIds, templateId }
    
    FUNCTION generateICF():
        RETURN HTTP_POST("/api/v1/icf/generate", {
            protocolId: state.selectedProtocol,
            referenceIds: state.attachedReferences,
            templateId: state.selectedTemplate
        })