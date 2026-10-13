/**
 * Cross-feature document helpers: repositories for the shared entities plus
 * the invariants every feature relies on (section ordering, content sync,
 * audit logging, job → document resolution).
 */
import { Repository } from "./Repository";
import type { SectionEntity } from "../schema/entities";
import type { DocumentView, SectionView } from "../schema/views";
import { sectionsToMarkdown } from "../lib/icfContent";
import { nowIso, uuid } from "../lib/format";
import { NotFoundError } from "../errors";

export const repos = {
  users: new Repository("users"),
  sessions: new Repository("sessions"),
  protocols: new Repository("protocols"),
  documents: new Repository("documents"),
  sections: new Repository("sections"),
  referenceDocuments: new Repository("referenceDocuments"),
  templates: new Repository("templates"),
  generationJobs: new Repository("generationJobs"),
  comments: new Repository("comments"),
  reviewers: new Repository("reviewers"),
  auditLogs: new Repository("auditLogs"),
  documentVersions: new Repository("documentVersions"),
  documentGenerations: new Repository("documentGenerations"),
  documentSections: new Repository("documentSections"),
};

export function sectionsOf(documentId: string): SectionEntity[] {
  return repos.sections.findMany({ document_id: documentId }, { orderBy: "position", order: "asc" });
}

/** Top-level number ("3") or subsection number ("3.1") for each section id. */
export function numberSections(sections: SectionEntity[]): Map<string, string> {
  const map = new Map<string, string>();
  let top = 0;
  const childCount = new Map<string, number>();
  for (const s of sections) {
    if (!s.parent_id) map.set(s.id, String(++top));
    else {
      const n = (childCount.get(s.parent_id) ?? 0) + 1;
      childCount.set(s.parent_id, n);
      map.set(s.id, `${map.get(s.parent_id) ?? "?"}.${n}`);
    }
  }
  return map;
}

/** Re-sequence positions 0..n-1 and renumber subsection title prefixes. */
export function resequence(documentId: string): SectionEntity[] {
  const ordered = sectionsOf(documentId);
  const numbers = numberSections(ordered);
  ordered.forEach((s, i) => {
    const patch: Partial<SectionEntity> = { position: i };
    if (s.parent_id) patch.title = `${numbers.get(s.id)} ${s.title.replace(/^\d+(\.\d+)+\s*/, "")}`;
    repos.sections.update(s.id, patch);
  });
  return sectionsOf(documentId);
}

/** Rebuild Document.content from its sections and bump last_modified. */
export function syncDocumentContent(documentId: string) {
  const doc = repos.documents.findById(documentId);
  if (!doc) return null;
  return repos.documents.update(documentId, { content: sectionsToMarkdown(sectionsOf(documentId)), last_modified: nowIso() });
}

export function toSectionViews(documentId: string): SectionView[] {
  const sections = sectionsOf(documentId);
  const numbers = numberSections(sections);
  return sections.map((s) => ({ ...s, number: numbers.get(s.id) ?? "", isAiGenerated: s.is_ai_generated }));
}

/** Full document read-model: entity + ordered sections + protocol context. */
export function toDocumentView(documentId: string): DocumentView {
  const doc = repos.documents.findById(documentId);
  if (!doc) throw new NotFoundError("Document not found");
  const protocol = repos.protocols.findOne({ protocol_id: doc.protocol_id });
  return {
    ...doc,
    metadata: { ...doc.metadata, sections: toSectionViews(documentId) },
    protocol_name: protocol?.protocol_name,
    study_title: protocol?.title,
    sponsor: protocol?.sponsor,
  };
}

export function recordAudit(documentId: string, action: string, userId: string, userName: string, resourceId = documentId) {
  return repos.auditLogs.insert({
    id: uuid(),
    document_id: documentId,
    user_id: userId,
    user_name: userName,
    action,
    timestamp: nowIso(),
    resource_id: resourceId,
  });
}

type JobFinalizer = (jobId: string) => string | null;
let finalizeJob: JobFinalizer | null = null;

/** The generation pipeline registers how to force-complete a job (used by "Skip"). */
export function registerJobFinalizer(fn: JobFinalizer) {
  finalizeJob = fn;
}

/** Accepts a document id or a generation job id and returns a document id. */
export function resolveDocumentId(id: string): string {
  if (repos.documents.findById(id)) return id;
  const job = repos.generationJobs.findById(id);
  if (job) {
    const docId = job.document_id ?? finalizeJob?.(id) ?? null;
    if (docId) return docId;
  }
  throw new NotFoundError("Document not found");
}
