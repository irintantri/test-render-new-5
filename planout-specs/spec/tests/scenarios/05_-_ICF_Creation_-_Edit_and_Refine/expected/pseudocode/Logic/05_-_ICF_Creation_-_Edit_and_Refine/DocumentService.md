/**
 * Logic layer for handling the retrieval and state management of the ICF document.
 * This service acts as the bridge between the UI components and the Document entity.
 */

export const fetchDocumentById = async (id: string) => {
  // Perform GET request to retrieve the full Document object
  // Maps to: GET /api/documents/:id
  const response = await apiClient.get(`/api/documents/${id}`);
  
  if (response.status !== 200) {
    throw new Error("Failed to retrieve document metadata and content.");
  }

  const document: Document = response.data;

  // Return the document object to be consumed by the UI components
  // The UI will use 'content' to populate the IcfMarkdown components
  // and 'metadata' for section-specific attributes (e.g., AI generation status).
  return {
    id: document.id,
    protocol_id: document.protocol_id,
    icf_name: document.icf_name,
    icf_version: document.icf_version,
    status: document.status,
    content: document.content,
    metadata: document.metadata,
    last_modified: document.last_modified
  };
};