/** Section lifecycle API calls: PATCH / DELETE /api/sections/{id}. */
import { useState } from "react";
import { apiClient } from "@shared/http";
import { useToast } from "@shared/ui";

export function useSectionActions(opts: { onRefresh?: () => void | Promise<void>; onClearSelection?: () => void } = {}) {
  const notify = useToast();
  const [busy, setBusy] = useState(false);

  async function updateSection(sectionId: string, content: string) {
    setBusy(true);
    try {
      await apiClient.patch(`/api/sections/${sectionId}`, { content });
      notify("Section updated successfully", "success");
      await opts.onRefresh?.();
      return true;
    } catch {
      notify("Failed to update section", "error");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function deleteSection(sectionId: string) {
    setBusy(true);
    try {
      await apiClient.delete(`/api/sections/${sectionId}`);
      opts.onClearSelection?.();
      await opts.onRefresh?.();
      notify("Section deleted", "success");
      return true;
    } catch {
      notify("Failed to delete section", "error");
      return false;
    } finally {
      setBusy(false);
    }
  }

  return { updateSection, deleteSection, busy };
}
