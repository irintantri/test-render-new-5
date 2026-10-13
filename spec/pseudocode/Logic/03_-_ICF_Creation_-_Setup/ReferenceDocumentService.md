// Handles document management and DMS integration
function uploadReferenceDocument(protocolId, file, docKind) {
    // Uploads a local file to the server for a specific protocol
    const formData = new FormData();
    formData.append("file", file);
    formData.append("doc_kind", docKind);
    
    return fetch(`/api/reference/${protocolId}/upload`, {
        method: "POST",
        body: formData
    });
}

function fetchDMSDocuments(protocolId) {
    // Retrieves existing reference documents from the DMS for the selected protocol
    if (!protocolId) {
        throw new Error("Protocol must be selected before fetching DMS documents.");
    }
    return fetch(`/api/reference?protocolId=${encodeURIComponent(protocolId)}`);
}