/**
 *   GET  /api/documents/:id/sections → Section[]
 *   POST /api/documents/:id/sections { title, parentId? } → 201 Section
 */
import { Router } from "express";
import { z } from "zod";
import { makeValidator } from "@shared/schema";
import { actorOf, param, validateBody } from "@shared/middleware";
import { recordAudit, repos, resequence, resolveDocumentId, sectionsOf, syncDocumentContent, toSectionViews } from "@shared/db";
import { uuid } from "@shared/lib";
import { NotFoundError } from "@shared/errors";
import { getDocumentSections } from "./DocumentRepository";

export const createSectionSchema = z.object({
  title: z.string().trim().min(1, "Section title is required"),
  documentId: z.string().optional(),
  document_id: z.string().optional(),
  parentId: z.string().nullable().optional(),
});
export type CreateSectionInput = z.infer<typeof createSectionSchema>;
export const validate = makeValidator(createSectionSchema, "CreateSectionInput");

/** Next position: end of document, or right after the parent's last child. */
export function calculateNextPosition(documentId: string, parentId: string | null): number {
  const all = sectionsOf(documentId);
  if (!parentId) return all.length;
  const parentIdx = all.findIndex((s) => s.id === parentId);
  if (parentIdx < 0) throw new NotFoundError("Parent section not found");
  let pos = parentIdx + 1;
  while (pos < all.length && all[pos].parent_id === parentId) pos++;
  return pos;
}

export const router = Router();

router.get("/documents/:id/sections", (req, res) => {
  res.json(getDocumentSections(req.params.id));
});

router.post("/documents/:id/sections", validateBody(createSectionSchema), (req, res) => {
  const documentId = resolveDocumentId(param(req, "id"));
  const { title, parentId } = req.body as CreateSectionInput;
  // a subsection's parent must be top-level
  const parent = parentId ? repos.sections.findById(parentId) : null;
  const effectiveParent = parent ? (parent.parent_id ?? parent.id) : null;
  const newPosition = calculateNextPosition(documentId, effectiveParent);
  sectionsOf(documentId).forEach((s) => s.position >= newPosition && repos.sections.update(s.id, { position: s.position + 1 }));
  const id = uuid();
  repos.sections.insert({
    id,
    document_id: documentId,
    title,
    content: effectiveParent ? "Enter subsection content…" : "Enter section content…",
    position: newPosition,
    status: "draft",
    version: 1,
    ai_label: null,
    parent_id: effectiveParent,
    is_ai_generated: false,
  });
  resequence(documentId);
  syncDocumentContent(documentId);
  const actor = actorOf(req);
  recordAudit(documentId, effectiveParent ? "Subsection Added" : "Section Added", actor.id, actor.name, id);
  res.status(201).json(toSectionViews(documentId).find((s) => s.id === id));
});
