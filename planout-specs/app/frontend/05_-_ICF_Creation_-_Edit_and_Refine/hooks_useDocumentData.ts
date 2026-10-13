/** Document data for the editor — GET /api/documents/:id (via the Logic-lane useDocument hook). */
import { useDocument } from "@app/controller/05_-_ICF_Creation_-_Edit_and_Refine/DocumentStateHook";
import type { SectionView } from "@shared/types";

export const useDocumentData = (id: string) => {
  const { document, isLoading, error, reload, setDocument } = useDocument(id);
  return { document, loading: isLoading, error, reload, setDocument };
};

/** Group flat ordered sections into top-level cards with their subsections. */
export function groupSections(sections: SectionView[]) {
  const tops = sections.filter((s) => !s.parent_id);
  return tops.map((top) => ({ section: top, children: sections.filter((s) => s.parent_id === top.id) }));
}
