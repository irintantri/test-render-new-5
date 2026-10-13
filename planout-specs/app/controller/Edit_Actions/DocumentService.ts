/**
 * Section-level modifications for Edit & Refine.
 *   PATCH  /api/documents/:id/sections/:sectionId  { content }   (also /api/sections/:sectionId)
 *   DELETE /api/documents/:id/sections/:sectionId               (also /api/sections/:sectionId)
 */
import { Router, type Request } from "express";
import { z } from "zod";
import { actorOf, param, validateBody } from "@shared/middleware";
import { recordAudit, repos, resequence, resolveDocumentId, syncDocumentContent, toDocumentView, withTransaction } from "@shared/db";
import { NotFoundError } from "@shared/errors";

export function getDocumentDetails(documentId: string) {
  return toDocumentView(resolveDocumentId(documentId));
}

/** Removes the section (and its subsections), then re-sequences order. */
export async function deleteSection(documentId: string, sectionId: string, actor: { id: string; name: string }) {
  return withTransaction(() => {
    const section = repos.sections.findOne({ id: sectionId, document_id: documentId });
    if (!section) throw new NotFoundError("Section not found");
    repos.sections.deleteWhere((s) => s.id === sectionId || s.parent_id === sectionId);
    resequence(documentId);
    syncDocumentContent(documentId);
    recordAudit(documentId, "Section Deleted", actor.id, actor.name, sectionId);
    return { success: true };
  });
}

/** Persists manual text and records a MANUAL_EDIT activity entry. */
export function updateSectionContent(documentId: string, sectionId: string, newContent: string, actor: { id: string; name: string }) {
  const section = repos.sections.findOne({ id: sectionId, document_id: documentId });
  if (!section) throw new NotFoundError("Section not found");
  const updated = repos.sections.update(sectionId, { content: newContent, version: section.version + 1 });
  syncDocumentContent(documentId);
  recordAudit(documentId, "Manual Edit", actor.id, actor.name, sectionId);
  return updated;
}

/** Format: PROTO-<year>-<3-digit random>-ICF, unique among documents. */
export function generateICFIdentifier(): string {
  for (;;) {
    const icfId = `PROTO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}-ICF`;
    if (!repos.documents.findOne({ icf_name: icfId })) return icfId;
  }
}

const contentSchema = z.object({ content: z.string().trim().min(1, "Section content cannot be empty.") });

function locate(req: Request) {
  const sectionId = param(req, "sectionId");
  if (req.params.id) return { documentId: resolveDocumentId(param(req, "id")), sectionId };
  const section = repos.sections.getById(sectionId, "Section");
  return { documentId: section.document_id, sectionId };
}

export const router = Router();

for (const path of ["/documents/:id/sections/:sectionId", "/sections/:sectionId"]) {
  router.patch(path, validateBody(contentSchema, true), (req, res) => {
    const { documentId, sectionId } = locate(req);
    res.json(updateSectionContent(documentId, sectionId, req.body.content, actorOf(req)));
  });
  router.delete(path, async (req, res, next) => {
    try {
      const { documentId, sectionId } = locate(req);
      res.json(await deleteSection(documentId, sectionId, actorOf(req)));
    } catch (e) {
      next(e);
    }
  });
}
