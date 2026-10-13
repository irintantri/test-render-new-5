/** Document structure retrieval for the Table of Contents. */
import { makeValidator, zSectionView, type SectionView } from "@shared/schema";
import { resolveDocumentId, toSectionViews } from "@shared/db";

export const sectionSchema = zSectionView;
export type Section = SectionView;
export const validate = makeValidator(sectionSchema, "Section");

/** Sections (with subsections) ordered by position ASC. */
export function getDocumentSections(documentId: string): Section[] {
  return toSectionViews(resolveDocumentId(documentId));
}
