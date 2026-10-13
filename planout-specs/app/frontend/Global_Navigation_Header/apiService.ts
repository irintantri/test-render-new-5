import { apiClient } from "@shared/http";
import type { UserContext } from "@shared/types";

export const API = {
  /** GET /api/user/context → { fullName, role, initials, taskCounts, … } */
  async fetchUserContext(): Promise<UserContext> {
    return (await apiClient.get<UserContext>("/api/user/context")).data;
  },
};
