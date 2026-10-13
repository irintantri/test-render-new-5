// Shared DTOs for the ICF Setup Wizard
interface ReferenceDocumentDTO {
  id: string;
  protocol_id: string;
  doc_kind: string;
  file_name: string;
  bucket_name: string;
  uploaded_at: string;
}

interface ProtocolOptionDTO {
  protocolId: string;
  protocolName: string;
  phase: string;
  category: string;
  description: string;
  status: string;
  lastModified: string;
}

interface TemplateDTO {
  id: string;
  name: string;
  description: string;
  recommended: boolean;
}