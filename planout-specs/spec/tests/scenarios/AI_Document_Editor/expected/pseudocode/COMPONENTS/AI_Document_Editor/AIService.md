// Logic layer for handling AI communication
Service AIService {

    /**
     * API Signature: POST /api/v1/document/rewrite
     * Payload: { sectionId: string, content: string, instruction: string }
     * Response: { updatedContent: string }
     */
    Function rewriteSection(sectionId, currentText, instruction) {
        response = HTTP.post("/api/v1/document/rewrite", {
            sectionId: sectionId,
            content: currentText,
            instruction: instruction
        })
        
        return response.data.updatedContent
    }
}