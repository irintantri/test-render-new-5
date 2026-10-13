import { apiClient } from "@shared/http";
import type { GenerateJobAccepted } from "@shared/types";

export interface GenerateICFState {
  selectedProtocol: string;
  attachedReferences: string[];
  selectedTemplate: string;
}

/** POST /api/v1/icf/generate { protocolId, referenceIds, templateId } */
export async function generateICF(state: GenerateICFState) {
  const res = await apiClient.post<GenerateJobAccepted & { status: string }>("/api/v1/icf/generate", {
    protocolId: state.selectedProtocol,
    referenceIds: state.attachedReferences,
    templateId: state.selectedTemplate,
  });
  return res.data;
}
