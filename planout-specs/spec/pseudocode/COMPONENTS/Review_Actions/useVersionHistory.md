// Logic: Custom hook to handle API interaction for version retrieval.

Hook useVersionHistory(documentId) {
    // API Signature: GET /api/documents/{documentId}/versions
    // Returns: Array<{ id, versionString, status, isCurrent }>
    
    Function fetchVersions() {
        return API.get(`/documents/${documentId}/versions`);
    }

    Return useQuery(["versions", documentId], fetchVersions);
}