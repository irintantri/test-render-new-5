/**
 * Edit & Refine workspace: TOC · section cards · AI assistant panel. Asset: ecabe235
 * Cross-feature pieces (TOC, action bar, AI panel, bottom bar) are injected by the page via render props.
 */
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Library } from "lucide-react";
import { apiClient } from "@shared/http";
import { useActiveSection, useApi } from "@shared/hooks";
import { ROUTES } from "@shared/lib";
import { EmptyState, ErrorBanner, PanelSpinner, Tabs, useToast } from "@shared/ui";
import type { DocumentView, ReferenceDocumentEntity, SectionView } from "@shared/types";
import { groupSections, useDocumentData } from "./hooks_useDocumentData";
import { DocumentSectionCard } from "./DocumentSectionCard";
import { SectionEditor } from "./SectionEditor";

export interface EditorSlots {
  renderToc: (p: { document: DocumentView; sections: SectionView[]; activeSectionId: string | null; onSectionClick: (id: string) => void; onSectionsChanged: () => Promise<void> }) => ReactNode;
  renderActionBar: (p: { document: DocumentView; selectedSection: SectionView | null; onEditSection: () => void; onChanged: () => Promise<void> }) => ReactNode;
  renderSidePanel: (p: {
    document: DocumentView;
    section: SectionView | null;
    focusKey: number;
    onProcessingChange: (sectionId: string | null) => void;
    onSectionUpdated: () => Promise<void>;
  }) => ReactNode;
  renderBottomBar: (p: { document: DocumentView }) => ReactNode;
}

function SourceDocs({ protocolId }: { protocolId: string }) {
  const { data, loading } = useApi(() => apiClient.get<ReferenceDocumentEntity[]>(`/api/reference?protocolId=${encodeURIComponent(protocolId)}`).then((r) => r.data), [protocolId]);
  if (loading) return <PanelSpinner label="Loading sources…" />;
  if (!data?.length) return <EmptyState title="No source documents" icon={<Library size={18} />} />;
  return (
    <ul className="source-docs">
      {data.map((d) => (
        <li key={d.id}>
          <FileText size={16} />
          <div>
            <div className="source-docs__name">{d.file_name}</div>
            <div className="source-docs__meta">
              {d.doc_kind} · {d.source === "dms" ? "DMS" : "Upload"}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export const DocumentEditor = ({ documentId, onDocument, ...slots }: { documentId: string; onDocument?: (doc: DocumentView) => void } & EditorSlots) => {
  const { document, loading, error, reload } = useDocumentData(documentId);
  const navigate = useNavigate();
  const notify = useToast();
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [aiSection, setAiSection] = useState<SectionView | null>(null);
  const [focusKey, setFocusKey] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [panelTab, setPanelTab] = useState<"ai" | "sources">("ai");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document) onDocument?.(document);
  }, [document, onDocument]);

  // A generation job id resolves to its document — normalise the URL.
  useEffect(() => {
    if (document && document.id !== documentId) navigate(ROUTES.edit(document.id), { replace: true });
  }, [document, documentId, navigate]);

  const sections = useMemo(() => document?.metadata.sections ?? [], [document]);
  const groups = useMemo(() => groupSections(sections), [sections]);
  const activeSection = sections.find((s) => s.id === activeSectionId) ?? sections[0] ?? null;
  const panelSection = aiSection ? (sections.find((s) => s.id === aiSection.id) ?? null) : activeSection;

  useActiveSection(
    sections.map((s) => s.id),
    (id) => setActiveSectionId(id),
    scrollRef,
  );

  if (loading) return <PanelSpinner label="Loading document…" />;
  if (error || !document) return <div style={{ padding: 24 }}><ErrorBanner message="Failed to load document" /></div>;

  const handleUpdate = async (sectionId: string, newContent: string) => {
    setSavingId(sectionId);
    try {
      await apiClient.patch(`/api/documents/${document.id}/sections/${sectionId}`, { content: newContent });
      await reload();
      setEditingId(null);
      notify("Section updated successfully", "success");
    } catch (e) {
      notify(`Failed to update section: ${(e as Error).message}`, "error");
    } finally {
      setSavingId(null);
    }
  };

  const onEditWithAI = (section: SectionView) => {
    setAiSection(section);
    setActiveSectionId(section.id);
    setPanelTab("ai");
    setFocusKey((k) => k + 1);
  };

  return (
    <div className="workspace">
      <aside className="workspace__toc">
        {slots.renderToc({ document, sections, activeSectionId: activeSection?.id ?? null, onSectionClick: setActiveSectionId, onSectionsChanged: reload })}
      </aside>

      <section className="workspace__center">
        {slots.renderActionBar({ document, selectedSection: activeSection, onEditSection: () => activeSection && setEditingId(activeSection.id), onChanged: reload })}
        <div className="document-canvas" ref={scrollRef}>
          {groups.map(({ section, children }) => (
            <DocumentSectionCard
              key={section.id}
              data={section}
              subsections={children}
              onEditWithAI={onEditWithAI}
              generatingId={generatingId}
              isSelected={aiSection?.id === section.id}
              renderEditor={(s) =>
                editingId === s.id ? <SectionEditor section={s} saving={savingId === s.id} onUpdate={(c) => handleUpdate(s.id, c)} onCancel={() => setEditingId(null)} /> : null
              }
            />
          ))}
          {groups.length === 0 && <EmptyState title="This document has no sections" description="Use “Add Section” in the table of contents to start." />}
        </div>
        {slots.renderBottomBar({ document })}
      </section>

      <aside className="workspace__panel ai-assistant-panel">
        <Tabs
          tabs={[
            { id: "ai", label: "AI Assistant" },
            { id: "sources", label: "Source Docs" },
          ]}
          value={panelTab}
          onChange={setPanelTab}
        />
        <div className="workspace__panel-body">
          {panelTab === "ai" ? (
            slots.renderSidePanel({ document, section: panelSection, focusKey, onProcessingChange: setGeneratingId, onSectionUpdated: reload })
          ) : (
            <SourceDocs protocolId={document.protocol_id} />
          )}
        </div>
      </aside>
    </div>
  );
};
