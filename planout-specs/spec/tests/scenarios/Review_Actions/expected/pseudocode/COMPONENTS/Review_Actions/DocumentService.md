// Logic: Backend-facing service logic for handling comparison requests.

Service DocumentService {
    
    // API Signature: GET /api/documents/{docId}/compare?v1={id}&v2={id}
    // This logic triggers the side-by-side view state in the UI
    Function compareVersions(documentId, versionA, versionB) {
        Validate(versionA != versionB, "Cannot compare a version to itself");
        
        Return API.get(`/documents/${documentId}/compare`, {
            params: { v1: versionA, v2: versionB }
        });
    }
}