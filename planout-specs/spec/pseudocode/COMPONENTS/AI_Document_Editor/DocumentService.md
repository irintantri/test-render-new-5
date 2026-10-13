// Logic layer for persistence
Service DocumentService {

    /**
     * API Signature: PATCH /api/v1/document/section/{id}
     */
    Function saveSection(sectionId, content) {
        return HTTP.patch(`/api/v1/document/section/${sectionId}`, {
            content: content
        })
    }
}