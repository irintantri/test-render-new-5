/** Setup wizard API calls (authoritative payloads). */
import { apiClient } from "@shared/http";
import type { CatalogProtocol, ReferenceDocumentEntity, TemplateDTO } from "@shared/types";

export const fetchProtocols = () => apiClient.get<CatalogProtocol[]>("/api/catalog/protocols").then((r) => r.data);
export const fetchTemplates = () => apiClient.get<TemplateDTO[]>("/api/catalog/templates").then((r) => r.data);

export const uploadReferenceDocument = (protocolId: string, file: File, doc_kind: string) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("doc_kind", doc_kind);
  return apiClient.post<ReferenceDocumentEntity>(`/api/reference/${encodeURIComponent(protocolId)}/upload`, formData).then((r) => r.data);
};

/** Existing reference documents in the DMS for the selected protocol. */
export const fetchDMSDocuments = (protocolId: string) => {
  if (!protocolId) throw new Error("Protocol must be selected before fetching DMS documents.");
  return apiClient.get<ReferenceDocumentEntity[]>(`/api/reference?protocolId=${encodeURIComponent(protocolId)}`).then((r) => r.data);
};
