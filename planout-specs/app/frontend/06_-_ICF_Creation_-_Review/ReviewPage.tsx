/**
 * Review workspace: TOC · read-only section cards · AI / Comments / Audit tabs. Asset: a1745dc6
 * Cross-feature pieces are injected by the page via render props.
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@shared/http";
import { useActiveSection, useApi } from "@shared/hooks";
import { ROUTES } from "@shared/lib";
import { ErrorBanner, PanelSpinner, Tabs } from "@shared/ui";
import type { AuditEntryDTO, DocumentView, SectionView } from "@shared/types";
import { AuditTrail } from "./AuditTrail";
import { CommentActions } from "./CommentActions";
import { DocumentSectionCard } from "./DocumentSectionCard";
import "./review.css";

type PanelTab = "ai" | "comments" | "audit";

export interface ReviewSlots {
  renderToc: (p: { document: DocumentView; sections: SectionView[]; activeSectionId: string | null; onSectionClick: (id: string) => void }) => ReactNode;
  renderActionBar: (p: { document: DocumentView }) => ReactNode;
  renderAiPanel: (p: { section: SectionView | null }) => ReactNode;
  renderComments: (p: { document: DocumentView; sections: SectionView[]; onOpenCountChange: (n: number) => void; onActivity: () => void }) => ReactNode;
  renderBottomBar: (p: { document: DocumentView; openCommentsCount: number; refreshKey: number }) => ReactNode;
}

/** Split sections into top-level cards with their nested subsections. */
export function parseContentToSections(sections: SectionView[]) {
  return sections
    .filter((s) => !s.parent_id)
    .map((s) => ({
      id: s.id,
      title: `${s.number}. ${s.title}`,
      content: s.content,
      metadata: { is_ai_generated: s.isAiGenerated },
      subsections: sections.filter((c) => c.parent_id === s.id),
    }));
}

export const ReviewPage = ({ id, onDocument, ...slots }: { id: string; onDocument?: (doc: DocumentView) => void } & ReviewSlots) => {
  const navigate = useNavigate();
  const { data: document, loading: isDocLoading, error } = useApi(() => apiClient.get<DocumentView>(`/api/documents/${id}`).then((r) => r.data), [id]);
  const { data: auditLogs, loading: isAuditLoading, reload: reloadAudit } = useApi(
    () => apiClient.get<AuditEntryDTO[]>(`/api/documents/${id}/audit`).then((r) => r.data),
    [id],
  );
  const [tab, setTab] = useState<PanelTab>("comments");
  const [openCount, setOpenCount] = useState(0);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document) onDocument?.(document);
  }, [document, onDocument]);

  useEffect(() => {
    if (document && document.id !== id) navigate(ROUTES.review(document.id), { replace: true });
  }, [document, id, navigate]);

  const sections = useMemo(() => document?.metadata.sections ?? [], [document]);
  const cards = useMemo(() => parseContentToSections(sections), [sections]);
  useActiveSection(sections.map((s) => s.id), setActiveSectionId, scrollRef);

  if (isDocLoading || (isAuditLoading && !auditLogs)) return <PanelSpinner label="Loading review…" />;
  if (error || !document) return <div style={{ padding: 24 }}><ErrorBanner message={error ?? "Document not found"} /></div>;

  const activeSection = sections.find((s) => s.id === activeSectionId) ?? sections[0] ?? null;
  const onActivity = () => {
    reloadAudit();
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="workspace review-page-layout">
      <aside className="workspace__toc">{slots.renderToc({ document, sections, activeSectionId: activeSection?.id ?? null, onSectionClick: setActiveSectionId })}</aside>

      <section className="workspace__center">
        {slots.renderActionBar({ document })}
        <div className="document-canvas document-canvas--narrow document-viewer" ref={scrollRef}>
          {cards.map((section) => (
            <DocumentSectionCard key={section.id} id={section.id} title={section.title} content={section.content} isAiGenerated={section.metadata.is_ai_generated} subsections={section.subsections} />
          ))}
        </div>
        {slots.renderBottomBar({ document, openCommentsCount: openCount, refreshKey })}
      </section>

      <aside className="workspace__panel right-panel">
        <Tabs<PanelTab>
          tabs={[
            { id: "ai", label: "AI Assistant" },
            { id: "comments", label: `Comments (${openCount})` },
            { id: "audit", label: "Audit Trail" },
          ]}
          value={tab}
          onChange={(t) => {
            setTab(t);
            if (t === "audit") reloadAudit();
          }}
        />
        <div className="workspace__panel-body">
          {/* Comments stay mounted so the open-count badge is always live */}
          <div style={{ display: tab === "comments" ? "contents" : "none" }}>
            <CommentActions document_id={document.id}>{slots.renderComments({ document, sections, onOpenCountChange: setOpenCount, onActivity })}</CommentActions>
          </div>
          {tab === "ai" && slots.renderAiPanel({ section: activeSection })}
          {tab === "audit" && <AuditTrail logs={auditLogs ?? []} />}
        </div>
      </aside>
    </div>
  );
};
