/** Service for the Edit bottom bar workflow transition (Draft → In Review). */
import { recordAudit, repos, withTransaction } from "@shared/db";
import { nowIso, uuid } from "@shared/lib";
import { submitDocumentForApproval } from "@app/data/Bottom_Bar_-_Edit/DocumentService";
import { sectionsOf } from "@shared/db";

export const DocumentService = {
  /** Transition to "In Review", snapshot a version, and audit — atomically. */
  async submitForApproval(id: string, actor: { id: string; name: string }) {
    return withTransaction(() => {
      const updated = submitDocumentForApproval(id);
      repos.documentVersions.findMany({ document_id: id, is_current: true }).forEach((v) => repos.documentVersions.update(v.id, { is_current: false }));
      repos.documentVersions.insert({
        id: uuid(),
        document_id: id,
        version_number: updated.icf_version.replace(/^v/, ""),
        status: "In Review",
        is_current: true,
        created_at: nowIso(),
        snapshot: sectionsOf(id).map((s) => ({ title: s.title, content: s.content })),
      });
      recordAudit(id, "Submitted for Review", actor.id, actor.name);
      return updated;
    });
  },
};
