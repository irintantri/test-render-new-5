/**
 * API layer for Edit & Refine:
 *   GET   /api/documents/:id          → EditorDocument
 *   PATCH /api/documents/:id          { content } → EditorDocument
 *   POST  /api/documents/:id/rewrite  { sectionId, prompt } → { refinedText }
 */
import { Router } from "express";
import { z } from "zod";
import { makeValidator } from "@shared/schema";
import { asyncHandler, param, validateBody } from "@shared/middleware";
import { documentContentUpdateSchema, getDocumentById } from "./DocumentRepository";
import { aiRewriteRequestSchema, handleAIRewrite, handleManualEdit } from "./DocumentService";

export const rewriteResponseSchema = z.object({ refinedText: z.string() });
export type RewriteResponse = z.infer<typeof rewriteResponseSchema>;
export const patchDocumentSchema = documentContentUpdateSchema;
export type PatchDocumentBody = z.infer<typeof patchDocumentSchema>;
export const validate = makeValidator(patchDocumentSchema, "PatchDocumentBody");

export const router = Router();

router.get("/documents/:id", (req, res) => {
  res.json(getDocumentById(req.params.id));
});

router.patch("/documents/:id", validateBody(patchDocumentSchema, true), (req, res) => {
  res.json(handleManualEdit(param(req, "id"), (req.body as PatchDocumentBody).content));
});

router.post(
  "/documents/:id/rewrite",
  validateBody(aiRewriteRequestSchema),
  asyncHandler(async (req, res) => {
    const refinedText = await handleAIRewrite(param(req, "id"), req.body.sectionId, req.body.prompt);
    res.json({ refinedText } satisfies RewriteResponse);
  }),
);
