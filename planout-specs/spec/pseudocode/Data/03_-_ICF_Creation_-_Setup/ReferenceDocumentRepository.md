// Handles persistence and retrieval of reference documents attached to a protocol
interface ReferenceDocumentRepository {
  // Retrieves documents associated with a specific protocol
  getDocumentsByProtocol(protocolId: string): Promise<ReferenceDocument[]>;
  
  // Persists metadata after file upload
  saveDocumentMetadata(doc: ReferenceDocument): Promise<ReferenceDocument>;
}