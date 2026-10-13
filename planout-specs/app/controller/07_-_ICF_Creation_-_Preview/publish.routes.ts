/**
 * POST /api/publish { documentId } → { status: "success", document }
 * Approval gate: the document must be Approved (submitted for approval with
 * all comments resolved and all reviewers acted) before it can be published.
 */
import { Router } from "express";
import { z } from "zod";
import { actorOf, validateBody } from "@shared/middleware";
import { recordAudit, repos, resolveDocumentId, withTransaction } from "@shared/db";
import { ValidationError } from "@shared/errors";
import { nowIso } from "@shared/lib";

export const publishRequestSchema = z.object({ documentId: z.string().min(1, "documentId is required") });

export const router = Router();

router.post("/publish", validateBody(publishRequestSchema), async (req, res, next) => {
  try {
    const id = resolveDocumentId(req.body.documentId);
    const doc = repos.documents.getById(id, "Document");
    if (doc.status !== "Approved") {
      throw new ValidationError("Only approved documents can be published. Submit the ICF for approval first.");
    }
    const actor = actorOf(req);
    const updated = await withTransaction(() => {
      const d = repos.documents.update(id, { published_at: nowIso(), last_modified: nowIso() });
      recordAudit(id, "Published", actor.id, actor.name);
      return d;
    });
    res.json({ status: "success", document: updated });
  } catch (e) {
    next(e);
  }
});
