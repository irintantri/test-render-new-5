/**
 * Version retrieval + comparison for the Review Action Bar.
 *   GET /api/documents/:id/versions
 *   GET /api/documents/:id/compare?v1=<versionId>&v2=<versionId>
 */
import { Router } from "express";
import { param } from "@shared/middleware";
import { repos, resolveDocumentId } from "@shared/db";
import { NotFoundError, ValidationError } from "@shared/errors";

export interface DocumentVersionView {
  id: string;
  versionLabel: string;
  versionString: string;
  status: string;
  isCurrent: boolean;
  createdAt: string;
}

export interface CompareRow {
  title: string;
  left: string | null;
  right: string | null;
  changed: boolean;
}
export interface CompareResult {
  v1: DocumentVersionView;
  v2: DocumentVersionView;
  rows: CompareRow[];
  changedCount: number;
}

export function getDocumentVersions(documentId: string): DocumentVersionView[] {
  if (!documentId) throw new ValidationError("Document ID is required to fetch versions.");
  return repos.documentVersions
    .findMany({ document_id: resolveDocumentId(documentId) }, { orderBy: "created_at", order: "desc" })
    .map((v) => ({
      id: v.id,
      versionLabel: `Version ${v.version_number}`,
      versionString: `v${v.version_number}`,
      status: v.status,
      isCurrent: v.is_current,
      createdAt: v.created_at,
    }));
}

export function compareVersions(documentId: string, versionA: string, versionB: string): CompareResult {
  if (versionA === versionB) throw new ValidationError("Cannot compare a version to itself");
  const docId = resolveDocumentId(documentId);
  const a = repos.documentVersions.findOne({ id: versionA, document_id: docId });
  const b = repos.documentVersions.findOne({ id: versionB, document_id: docId });
  if (!a || !b) throw new NotFoundError("Version not found");
  const views = getDocumentVersions(docId);
  const titles = [...new Set([...a.snapshot.map((s) => s.title), ...b.snapshot.map((s) => s.title)])];
  const rows = titles.map((title) => {
    const left = a.snapshot.find((s) => s.title === title)?.content ?? null;
    const right = b.snapshot.find((s) => s.title === title)?.content ?? null;
    return { title, left, right, changed: left !== right };
  });
  return {
    v1: views.find((v) => v.id === a.id)!,
    v2: views.find((v) => v.id === b.id)!,
    rows,
    changedCount: rows.filter((r) => r.changed).length,
  };
}

export const router = Router();

router.get("/documents/:id/versions", (req, res) => {
  res.json(getDocumentVersions(param(req, "id")));
});

router.get("/documents/:id/compare", (req, res) => {
  res.json(compareVersions(param(req, "id"), String(req.query.v1 ?? ""), String(req.query.v2 ?? "")));
});
