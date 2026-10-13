/**
 * Core persisted entities. Every feature-level schema in /app/data/<feature>
 * composes these; nothing redefines them.
 */
import { z } from "zod";
import { zId, zTimestamp, zNullableTimestamp } from "./primitives";

export const DOCUMENT_STATUSES = ["Draft", "In Review", "Approved", "Rejected"] as const;
export const zDocumentStatus = z.enum(DOCUMENT_STATUSES);

export const COMMENT_STATUSES = ["Open", "Resolved", "Closed"] as const;
export const zCommentStatus = z.preprocess(
  (v) => (typeof v === "string" ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase() : v),
  z.enum(COMMENT_STATUSES),
);

export const zUserEntity = z.object({
  id: zId,
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  avatarUrl: z.string().nullable(),
  role: z.string().min(1),
  secondaryRole: z.string().nullable(),
  locale: z.string(),
  timezone: z.string(),
  lastLoginAt: zNullableTimestamp,
  pendingNotifications: z.number().int().min(0),
});

export const zSessionEntity = z.object({ token: z.string().min(1), userId: zId });

export const zProtocolEntity = z.object({
  id: zId,
  protocol_id: z.string().min(1),
  protocol_version: z.string(),
  protocol_name: z.string().min(1),
  title: z.string(),
  phase: z.string(),
  category: z.string(),
  drug_code: z.string(),
  description: z.string(),
  sponsor: z.string(),
  principal_investigator: z.string(),
  condition: z.string(),
  status: z.string(),
  last_modified: zTimestamp,
});

export const zDocumentEntity = z.object({
  id: zId,
  protocol_id: z.string().min(1),
  icf_name: z.string().min(1),
  icf_version: z.string().min(1),
  template: z.string().nullable(),
  status: zDocumentStatus,
  content: z.string().nullable(),
  metadata: z.record(z.unknown()),
  published_at: zNullableTimestamp,
  created_at: zTimestamp,
  last_modified: zTimestamp,
  owner_id: zId,
  reviewer_id: zId.nullable(),
});

export const zSectionEntity = z.object({
  id: zId,
  document_id: zId,
  title: z.string().min(1, "Section title is required"),
  content: z.string(),
  position: z.number().int().min(0),
  status: z.string(),
  version: z.number().int().min(1),
  ai_label: z.string().nullable(),
  parent_id: zId.nullable(),
  is_ai_generated: z.boolean(),
});

export const zReferenceDocumentEntity = z.object({
  id: zId,
  protocol_id: z.string().min(1),
  doc_kind: z.string().min(1),
  file_name: z.string().min(1),
  bucket_name: z.string().min(1),
  uploaded_at: zTimestamp,
  source: z.enum(["upload", "dms"]),
  size: z.number().int().min(0),
});

export const zTemplateEntity = z.object({
  id: zId,
  name: z.string().min(1),
  description: z.string(),
  recommended: z.boolean(),
});

export const GENERATION_STATUSES = ["PENDING", "PARSED", "PROCESSING", "COMPLETE", "FAILED"] as const;
export const zGenerationJobEntity = z.object({
  id: zId,
  protocol_id: z.string().min(1),
  template_id: z.string().min(1),
  reference_ids: z.array(z.string()),
  status: z.enum(GENERATION_STATUSES),
  progress: z.number().min(0).max(100),
  step_label: z.string(),
  document_id: zId.nullable(),
  created_at: zTimestamp,
  error: z.string().nullable(),
});

export const zCommentEntity = z.object({
  id: zId,
  document_id: zId,
  section: z.string(),
  owner: z.string().min(1),
  comment_text: z.string().min(1, "Comment text is required"),
  status: zCommentStatus,
  parent_id: zId.nullable(),
  timestamp: zTimestamp,
});

export const zReviewerEntity = z.object({
  id: zId,
  document_id: zId,
  name: z.string().min(1),
  role: z.string(),
  acted: z.boolean(),
});

export const zAuditLogEntity = z.object({
  id: zId,
  document_id: zId,
  user_id: zId,
  user_name: z.string(),
  action: z.string().min(1),
  timestamp: zTimestamp,
  resource_id: z.string(),
});

export const zDocumentVersionEntity = z.object({
  id: zId,
  document_id: zId,
  version_number: z.string(),
  status: z.string(),
  is_current: z.boolean(),
  created_at: zTimestamp,
  snapshot: z.array(z.object({ title: z.string(), content: z.string() })),
});

export const zDocumentGenerationEntity = z.object({
  id: zId,
  template_id: z.string().min(1),
  source_filename: z.string().min(1),
  model: z.string().min(1),
  values: z.record(z.unknown()),
  filled_markdown: z.string(),
  pages: z.number().int().min(0),
  created_at: zTimestamp,
});

export const zDocumentSectionEntity = z.object({
  id: zId,
  document_id: zId,
  title: z.string(),
  content: z.string(),
});

export type UserEntity = z.infer<typeof zUserEntity>;
export type SessionEntity = z.infer<typeof zSessionEntity>;
export type ProtocolEntity = z.infer<typeof zProtocolEntity>;
export type DocumentEntity = z.infer<typeof zDocumentEntity>;
export type DocumentStatus = z.infer<typeof zDocumentStatus>;
export type SectionEntity = z.infer<typeof zSectionEntity>;
export type ReferenceDocumentEntity = z.infer<typeof zReferenceDocumentEntity>;
export type TemplateEntity = z.infer<typeof zTemplateEntity>;
export type GenerationJobEntity = z.infer<typeof zGenerationJobEntity>;
export type CommentEntity = z.infer<typeof zCommentEntity>;
export type CommentStatus = (typeof COMMENT_STATUSES)[number];
export type ReviewerEntity = z.infer<typeof zReviewerEntity>;
export type AuditLogEntity = z.infer<typeof zAuditLogEntity>;
export type DocumentVersionEntity = z.infer<typeof zDocumentVersionEntity>;
export type DocumentGenerationEntity = z.infer<typeof zDocumentGenerationEntity>;
export type DocumentSectionEntity = z.infer<typeof zDocumentSectionEntity>;

/** Collection name → entity type map used by the DB adapter. */
export interface Collections {
  users: UserEntity;
  sessions: SessionEntity & { id: string };
  protocols: ProtocolEntity;
  documents: DocumentEntity;
  sections: SectionEntity;
  referenceDocuments: ReferenceDocumentEntity;
  templates: TemplateEntity;
  generationJobs: GenerationJobEntity;
  comments: CommentEntity;
  reviewers: ReviewerEntity;
  auditLogs: AuditLogEntity;
  documentVersions: DocumentVersionEntity;
  documentGenerations: DocumentGenerationEntity;
  documentSections: DocumentSectionEntity;
}
export type CollectionName = keyof Collections;
