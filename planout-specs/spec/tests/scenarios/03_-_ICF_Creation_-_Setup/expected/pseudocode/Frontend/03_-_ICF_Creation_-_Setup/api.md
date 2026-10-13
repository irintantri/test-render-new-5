// Logic layer mapping to authoritative API PAYLOADS
export const fetchProtocols = () => fetch('/api/catalog/protocols').then(r => r.json());
export const fetchTemplates = () => fetch('/api/catalog/templates').then(r => r.json());
export const uploadReferenceDocument = (protocolId, file, doc_kind) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('doc_kind', doc_kind);
  return fetch(`/api/reference/${protocolId}/upload`, {
    method: 'POST',
    body: formData
  }).then(r => r.json());
};