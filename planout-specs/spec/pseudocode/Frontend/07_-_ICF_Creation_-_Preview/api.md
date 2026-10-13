/**
 * API Layer mapping to authoritative endpoints
 */
export const fetchDocument = async (documentId: string) => {
  const response = await fetch(`/api/documents/${documentId}`);
  return response.json();
};

export const fetchDocumentSections = async (documentId: string) => {
  const response = await fetch(`/api/documents/${documentId}/sections`);
  return response.json();
};

export const publishDocument = async (payload: { documentId: string }) => {
  const response = await fetch('/api/publish', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return response.json();
};