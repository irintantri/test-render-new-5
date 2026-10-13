/**
 * Comment thread endpoints.
 *   GET   /api/comments?documentId=
 *   POST  /api/comments                 { document_id|documentId, section|sectionId, owner?, comment_text|text, parent_id|parentId? }
 *   POST  /api/documents/:id/comments   (same body, document from path)
 *   PATCH /api/comments/:id/status      { status: Open|Resolved|Closed }
 */
import { Router, type Request } from "express";
import { z } from "zod";
import { actorOf, param, validateBody } from "@shared/middleware";
import { recordAudit, repos, resolveDocumentId } from "@shared/db";
import { ValidationError } from "@shared/errors";
import { zCommentStatus } from "@shared/schema";
import { createComment, fetchCommentsByDocument, updateCommentStatus } from "@app/data/Comment_Actions/CommentRepository";

const commentBodySchema = z
  .object({
    document_id: z.string().optional(),
    documentId: z.string().optional(),
    section: z.string().optional(),
    sectionId: z.string().optional(),
    owner: z.string().optional(),
    comment_text: z.string().optional(),
    text: z.string().optional(),
    parent_id: z.string().nullable().optional(),
    parentId: z.string().nullable().optional(),
  })
  .transform((b) => ({
    document_id: b.document_id ?? b.documentId ?? "",
    section: b.section ?? b.sectionId ?? "",
    owner: b.owner,
    comment_text: (b.comment_text ?? b.text ?? "").trim(),
    parent_id: b.parent_id ?? b.parentId ?? null,
  }));

export function fetchComments(documentId: string) {
  return fetchCommentsByDocument(resolveDocumentId(documentId));
}

export function addComment(req: Request, documentIdOverride?: string) {
  const data = req.body as z.output<typeof commentBodySchema>;
  if (!data.comment_text) throw new ValidationError("Comment text is required");
  const documentId = resolveDocumentId(documentIdOverride ?? data.document_id);
  const actor = actorOf(req);
  let section = data.section;
  if (data.parent_id) section = repos.comments.getById(data.parent_id, "Comment").section;
  const comment = createComment({ ...data, section, document_id: documentId, owner: data.owner || actor.name });
  recordAudit(documentId, data.parent_id ? "Comment Reply" : "Comment Added", actor.id, actor.name, comment.id);
  return comment;
}

export const router = Router();

router.get("/comments", (req, res) => {
  const documentId = String(req.query.documentId ?? "");
  if (!documentId) throw new ValidationError("documentId is required");
  res.json(fetchComments(documentId));
});

router.post("/comments", validateBody(commentBodySchema), (req, res) => {
  res.status(201).json(addComment(req));
});

router.post("/documents/:id/comments", validateBody(commentBodySchema), (req, res) => {
  res.status(201).json(addComment(req, param(req, "id")));
});

router.patch("/comments/:id/status", validateBody(z.object({ status: zCommentStatus })), (req, res) => {
  const updated = updateCommentStatus(param(req, "id"), req.body.status);
  const actor = actorOf(req);
  recordAudit(updated.document_id, `Comment ${updated.status}`, actor.id, actor.name, updated.id);
  res.json(updated);
});
