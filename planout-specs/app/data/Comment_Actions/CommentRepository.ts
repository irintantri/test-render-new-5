/** Data retrieval and persistence for the Comments tab. */
import { z } from "zod";
import { makeValidator, zCommentEntity, zCommentStatus, type CommentEntity, type CommentStatus } from "@shared/schema";
import { repos } from "@shared/db";
import { nowIso, uuid } from "@shared/lib";

export const commentSchema = zCommentEntity;
export type Comment = CommentEntity;
export const validate = makeValidator(commentSchema, "Comment");

export const createCommentSchema = z.object({
  document_id: z.string().min(1),
  section: z.string().default(""),
  owner: z.string().min(1),
  comment_text: z.string().trim().min(1, "Comment text is required"),
  parent_id: z.string().nullable().optional(),
});
export type CreateCommentInput = z.input<typeof createCommentSchema>;

export function fetchCommentsByDocument(documentId: string): Comment[] {
  return repos.comments.findMany({ document_id: documentId }, { orderBy: "timestamp", order: "asc" });
}

export function createComment(commentData: CreateCommentInput): Comment {
  const input = createCommentSchema.parse(commentData);
  return repos.comments.insert(
    validate({
      id: uuid(),
      document_id: input.document_id,
      section: input.section,
      owner: input.owner,
      comment_text: input.comment_text,
      status: "Open",
      parent_id: input.parent_id ?? null,
      timestamp: nowIso(),
    }),
  );
}

export function updateCommentStatus(commentId: string, newStatus: CommentStatus | string): Comment {
  return repos.comments.update(commentId, { status: zCommentStatus.parse(newStatus) });
}
