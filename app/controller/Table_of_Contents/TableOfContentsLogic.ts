/** TOC data operations — the TOC is derived from the ordered Section list. */
import { apiClient } from "@shared/http";
import type { SectionView } from "@shared/types";

export async function fetchDocumentSections(documentId: string): Promise<SectionView[]> {
  const { data } = await apiClient.get<SectionView[]>(`/api/documents/${documentId}/sections`);
  return [...data].sort((a, b) => a.position - b.position);
}

/** New top-level section, appended at the end. */
export async function addSection(documentId: string): Promise<SectionView> {
  const payload = { title: "New Section", document_id: documentId };
  return (await apiClient.post<SectionView>(`/api/documents/${documentId}/sections`, payload)).data;
}

/** New subsection under the given (or active) top-level section. */
export async function addSubsection(documentId: string, parentId: string): Promise<SectionView> {
  const payload = { title: "New Subsection", document_id: documentId, parentId };
  return (await apiClient.post<SectionView>(`/api/documents/${documentId}/sections`, payload)).data;
}

export function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
}
