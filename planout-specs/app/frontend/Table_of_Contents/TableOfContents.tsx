/** Left-panel Table of Contents. Asset: cda38507 */
import { Plus } from "lucide-react";
import { Button, Pill } from "@shared/ui";
import { useTableOfContentsActions } from "@app/controller/Table_of_Contents/TableOfContentsComponent";
import { useTableOfContents, type TocSectionInput } from "./useTableOfContents";
import "./TableOfContents.css";

export interface TableOfContentsProps {
  sections: TocSectionInput[];
  activeSectionId: string | null;
  onSectionClick: (id: string) => void;
  protocolId?: string;
  versionLabel?: string;
}

function TocList({ sections, activeSectionId, onSectionClick }: TableOfContentsProps) {
  const { tocItems, scrollToSection } = useTableOfContents(sections, activeSectionId);
  return (
    <ul className="toc-list">
      {tocItems.map((item) => (
        <li key={item.id}>
          <button
            className={`toc-item ${item.isActive ? "active" : ""} ${item.isSubItem ? "toc-item--sub" : ""}`}
            aria-current={item.isActive ? "location" : undefined}
            onClick={() => {
              scrollToSection(item.id);
              onSectionClick(item.id);
            }}
          >
            <span className="number">{item.displayNumber}
              {!item.isSubItem && "."}</span>
            <span className="title">{item.label}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}

function TocShell({ protocolId, versionLabel, count, children, footer }: { protocolId?: string; versionLabel?: string; count: number; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <nav className="toc-container" aria-label="Table of Contents">
      <div className="toc-head">
        <h3>Table of Contents</h3>
        {protocolId && <Pill mono>{protocolId}</Pill>}
      </div>
      <div className="toc-scroll">{children}</div>
      {footer}
      <div className="toc-foot">
        <span>v{(versionLabel ?? "1.0").replace(/^v/, "")}</span>
        <span>{count} sections</span>
      </div>
    </nav>
  );
}

/** Read-only TOC (Review page). */
export function TableOfContents(props: TableOfContentsProps) {
  return (
    <TocShell protocolId={props.protocolId} versionLabel={props.versionLabel} count={props.sections.filter((s) => !s.parent_id).length}>
      <TocList {...props} />
    </TocShell>
  );
}

/** Editable TOC with Add Section / Add Subsection (Edit & Refine page). */
export function EditableTableOfContents(props: TableOfContentsProps & { documentId: string; onSectionsChanged: () => Promise<void> | void }) {
  const actions = useTableOfContentsActions({
    documentId: props.documentId,
    sections: props.sections as never,
    activeSectionId: props.activeSectionId,
    onActiveChange: props.onSectionClick,
    onSectionsChanged: props.onSectionsChanged,
  });
  return (
    <TocShell
      protocolId={props.protocolId}
      versionLabel={props.versionLabel}
      count={props.sections.filter((s) => !s.parent_id).length}
      footer={
        <div className="toc-actions">
          {actions.error && <div className="toc-error">{actions.error}</div>}
          <Button variant="outline" size="sm" block icon={<Plus />} disabled={actions.isAdding} onClick={actions.addSection}>
            Add Section
          </Button>
          <Button variant="ghost" size="sm" block icon={<Plus />} disabled={actions.isAdding} onClick={actions.addSubsection}>
            Add Subsection
          </Button>
        </div>
      }
    >
      <TocList {...props} />
    </TocShell>
  );
}
