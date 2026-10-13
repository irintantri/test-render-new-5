// Handles data access for protocol selection and search
interface ProtocolRepository {
  // Fetches full list for initial catalog load
  getAllProtocols(): Promise<Protocol[]>;
  
  // Searches protocols by name or ID (min 3 chars)
  searchProtocols(query: string): Promise<Protocol[]>;
}