import { apiClient, qs } from "@shared/http";
import type { CompareResult } from "@shared/types";

export const DocumentService = {
  /** GET /api/documents/{docId}/compare?v1=&v2= */
  async compareVersions(documentId: string, versionA: string, versionB: string): Promise<CompareResult> {
    if (versionA === versionB) throw new Error("Cannot compare a version to itself");
    return (await apiClient.get<CompareResult>(`/api/documents/${documentId}/compare${qs({ v1: versionA, v2: versionB })}`)).data;
  },
};
