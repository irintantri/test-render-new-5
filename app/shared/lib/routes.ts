/** Single source of truth for client-side routes. */
export const ROUTES = {
  signIn: "/",
  login: "/login",
  welcome: "/dashboard",
  icfDashboard: "/icf-management",
  setup: (protocolId?: string) => (protocolId ? `/setup/${encodeURIComponent(protocolId)}` : "/setup"),
  generate: (jobId: string, protocolId?: string) =>
    `/icf-creation-generate/${jobId}${protocolId ? `?protocolId=${encodeURIComponent(protocolId)}` : ""}`,
  edit: (documentId: string) => `/edit/${documentId}`,
  review: (documentId: string) => `/review/${documentId}`,
  preview: (documentId: string) => `/preview/${documentId}`,
  aiGenerate: "/ai/generate",
} as const;
