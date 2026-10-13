/** DTOs for the Review screen: document state and audit entries. */
import { z } from "zod";
import { makeValidator, zDocumentStatus, zNullableTimestamp, zTimestamp } from "@shared/schema";

export const documentDTOSchema = z.object({
  id: z.string(),
  protocol_id: z.string(),
  icf_name: z.string(),
  icf_version: z.string(),
  template: z.string().nullable(),
  status: zDocumentStatus,
  content: z.string().nullable(),
  metadata: z.record(z.unknown()),
  published_at: zNullableTimestamp,
  created_at: zTimestamp,
  last_modified: zTimestamp,
});
export type DocumentDTO = z.infer<typeof documentDTOSchema>;

export const auditEntryDTOSchema = z.object({
  id: z.string(),
  userId: z.string(),
  user_id: z.string(),
  user_name: z.string(),
  action: z.string(),
  timestamp: zTimestamp,
  resourceId: z.string(),
  resource_id: z.string(),
});
export type AuditEntryDTO = z.infer<typeof auditEntryDTOSchema>;

export const validate = makeValidator(documentDTOSchema, "DocumentDTO");
export const validateAuditEntry = makeValidator(auditEntryDTOSchema, "AuditEntryDTO");
