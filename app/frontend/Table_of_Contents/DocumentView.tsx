/**
 * Orchestrates the TOC and a scrollable list of section cards: clicking the
 * TOC scrolls; scrolling a card into view updates the active TOC item.
 */
import { useRef, useState, type ReactNode } from "react";
import { useActiveSection } from "@shared/hooks";
import { TableOfContents } from "./TableOfContents";
import type { TocSectionInput } from "./useTableOfContents";

export function DocumentView<T extends TocSectionInput>({
  documentData,
  renderCard,
  protocolId,
}: {
  documentData: { sections: T[] };
  renderCard: (section: T) => ReactNode;
  protocolId?: string;
}) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(documentData.sections[0]?.id ?? null);
  const scrollRef = useRef<HTMLElement>(null);
  useActiveSection(documentData.sections.map((s) => s.id), setActiveSectionId, scrollRef);

  return (
    <div className="layout" style={{ display: "grid", gridTemplateColumns: "182px 1fr", height: "100%" }}>
      <aside>
        <TableOfContents sections={documentData.sections} activeSectionId={activeSectionId} onSectionClick={setActiveSectionId} protocolId={protocolId} />
      </aside>
      <main ref={scrollRef} style={{ overflow: "auto" }}>
        {documentData.sections.map((section) => (
          <div key={section.id} id={section.id}>
            {renderCard(section)}
          </div>
        ))}
      </main>
    </div>
  );
}
