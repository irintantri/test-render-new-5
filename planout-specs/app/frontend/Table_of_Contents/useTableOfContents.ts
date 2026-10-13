/** Turns ordered sections into TOC items (sub-items match /\d+\.\d+/). */
import { useMemo } from "react";

export interface TocSectionInput {
  id: string;
  title: string;
  parent_id?: string | null;
}

export interface TocItem {
  id: string;
  label: string;
  displayNumber: string;
  isSubItem: boolean;
  isActive: boolean;
}

export const SUB_ITEM_PATTERN = /\d+\.\d+/;

export function useTableOfContents(sections: TocSectionInput[], activeSectionId: string | null) {
  const tocItems = useMemo<TocItem[]>(() => {
    let top = 0;
    return sections.map((section) => {
      const isSubItem = SUB_ITEM_PATTERN.test(section.title) || Boolean(section.parent_id);
      const displayNumber = isSubItem ? (section.title.match(/^\d+(\.\d+)+/)?.[0] ?? "") : String(++top);
      return {
        id: section.id,
        label: isSubItem ? section.title.replace(/^\d+(\.\d+)+\s*/, "") : section.title,
        displayNumber,
        isSubItem,
        isActive: section.id === activeSectionId,
      };
    });
  }, [sections, activeSectionId]);

  function scrollToSection(sectionId: string) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return { tocItems, scrollToSection };
}
