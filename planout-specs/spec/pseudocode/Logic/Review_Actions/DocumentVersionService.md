/**
 * Logic to handle the retrieval of document versions for the Review Action Bar.
 * This service interacts with the document versioning system to support 
 * the "Compare Versions" feature.
 */

function getDocumentVersions(documentId: string) {
    // Validate that the documentId is provided
    if (!documentId) {
        throw new Error("Document ID is required to fetch versions.");
    }

    // Call the API to retrieve all versions associated with the document
    // Maps to GET /api/documents/{id}/versions
    const versions = api.get(`/api/documents/${documentId}/versions`);

    // Transform the response to ensure the UI receives the necessary metadata
    // for the dropdown (version string, status, and current indicator)
    return versions.map(version => ({
        id: version.id,
        versionLabel: `Version ${version.version_number}`, <!-- MISSING_FIELD: DOCUMENT_VERSION.version_number -->
        status: version.status, <!-- MISSING_FIELD: DOCUMENT_VERSION.status -->
        isCurrent: version.is_current, <!-- MISSING_FIELD: DOCUMENT_VERSION.is_current -->
        createdAt: version.created_at <!-- MISSING_FIELD: DOCUMENT_VERSION.created_at -->
    }));
}