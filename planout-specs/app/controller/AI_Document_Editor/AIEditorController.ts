/**
 * AI Document Editor endpoints.
 *   POST  /api/documents/:id/sections/:sectionId/ai  { prompt, currentContent? } → AIEditedSection (ai_label "AI Refined")
 *   PATCH /api/v1/document/section/:id               { content }                  → Section
 *   POST  /api/v1/document/rewrite                   { sectionId, content, instruction } → { updatedContent }
 */
import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { actorOf, asyncHandler, param, validateBody } from "@shared/middleware";
import { recordAudit, repos, resolveDocumentId, syncDocumentContent } from "@shared/db";
import { NotFoundError } from "@shared/errors";
import { rewriteSection } from "@shared/ai";
import { aiSectionRequestSchema } from "@app/data/AI_Document_Editor/AISectionController";
import { handleAISectionRefinement } from "./AIEditorService";

export async function postAISectionRefinement(req: Request, res: Response) {
  const documentId = resolveDocumentId(param(req, "id"));
  const sectionId = param(req, "sectionId");
  try {
    const result = await handleAISectionRefinement(documentId, sectionId, req.body.prompt, req.body.currentContent, actorOf(req));
    res.status(200).json({
      id: result.id,
      document_id: result.document_id,
      title: result.title,
      ai_label: "AI Refined",
      status: result.status,
      content: result.content,
      position: result.position,
      version: result.version,
    });
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    res.status(500).json({ error: "Failed to refine section with AI", message: `Failed to refine section: ${(error as Error).message}` });
  }
}

export const saveSectionSchema = z.object({ content: z.string().trim().min(1, "Section content cannot be empty.") });
export const rewriteRequestSchema = z.object({
  sectionId: z.string().min(1),
  content: z.string(),
  instruction: z.string().trim().min(1, "Instruction is required"),
});

export const router = Router();

router.post("/documents/:id/sections/:sectionId/ai", validateBody(aiSectionRequestSchema, true), asyncHandler(postAISectionRefinement));

router.patch("/v1/document/section/:id", validateBody(saveSectionSchema, true), (req, res) => {
  const section = repos.sections.getById(param(req, "id"), "Section");
  const updated = repos.sections.update(section.id, { content: req.body.content });
  syncDocumentContent(section.document_id);
  const actor = actorOf(req);
  recordAudit(section.document_id, "Manual Edit", actor.id, actor.name, section.id);
  res.json(updated);
});

router.post(
  "/v1/document/rewrite",
  validateBody(rewriteRequestSchema),
  asyncHandler(async (req, res) => {
    const section = repos.sections.getById(req.body.sectionId, "Section");
    const updatedContent = await rewriteSection({ title: section.title, content: req.body.content, instruction: req.body.instruction });
    repos.sections.update(section.id, { content: updatedContent, version: section.version + 1, ai_label: "AI Refined", is_ai_generated: true });
    syncDocumentContent(section.document_id);
    const actor = actorOf(req);
    recordAudit(section.document_id, "AI Refinement", actor.id, actor.name, section.id);
    res.json({ updatedContent });
  }),
);
