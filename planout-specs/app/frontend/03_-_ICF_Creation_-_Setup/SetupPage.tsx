/** Three-column ICF setup wizard: protocol · reference documents · template. Asset: dd46e12b */
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BookOpen, CheckCircle2, FileText, FlaskConical, Search, Upload, X } from "lucide-react";
import type { CatalogProtocol, ReferenceDocumentEntity, TemplateDTO } from "@shared/types";
import { Button, ErrorBanner, InfoNote, PanelSpinner, EmptyState } from "@shared/ui";
import { fetchDMSDocuments, fetchProtocols, fetchTemplates, uploadReferenceDocument } from "./api";
import "./setup.css";

export const REFERENCE_KINDS = ["Investigation Brochure", "Lab Manual"] as const;
export type ReferenceKind = (typeof REFERENCE_KINDS)[number];

export interface SetupState {
  protocol: CatalogProtocol | null;
  references: ReferenceDocumentEntity[];
  template: string | null;
}

const PHASE_TONE: Record<string, string> = { "Phase I": "phase--amber", "Phase II": "phase--blue", "Phase III": "phase--indigo" };

function Column({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <section className="setup-col">
      <header className="setup-col__head">
        {icon}
        <h2>{title}</h2>
      </header>
      <div className="setup-col__body">{children}</div>
    </section>
  );
}

export const SetupPage = ({ initialProtocolId, renderBottomBar }: { initialProtocolId?: string; renderBottomBar?: (state: SetupState) => ReactNode }) => {
  const [protocols, setProtocols] = useState<CatalogProtocol[]>([]);
  const [query, setQuery] = useState("");
  const [templates, setTemplates] = useState<TemplateDTO[]>([]);
  const [selectedProtocol, setSelectedProtocol] = useState<CatalogProtocol | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("standard");
  const [referenceDocs, setReferenceDocs] = useState<Record<ReferenceKind, ReferenceDocumentEntity | null>>({ "Investigation Brochure": null, "Lab Manual": null });
  const [busyKind, setBusyKind] = useState<ReferenceKind | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([fetchProtocols(), fetchTemplates()])
      .then(([p, t]) => {
        setProtocols(p);
        setTemplates(t);
        const initial = initialProtocolId && p.find((x) => x.protocol_id === initialProtocolId);
        if (initial) setSelectedProtocol(initial);
        if (!t.some((x) => x.id === "standard")) setSelectedTemplate(t.find((x) => x.recommended)?.id ?? t[0]?.id ?? "");
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load setup data.");
        setLoading(false);
      });
  }, [initialProtocolId]);

  useEffect(() => {
    if (selectedProtocol) listRef.current?.querySelector(".proto-card.selected")?.scrollIntoView({ block: "nearest" });
  }, [selectedProtocol, loading]);

  const filteredProtocols = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return protocols;
    return protocols.filter((p) => p.protocol_name.toLowerCase().includes(q) || p.protocol_id.toLowerCase().includes(q) || p.protocolName.toLowerCase().includes(q));
  }, [protocols, query]);

  const selectProtocol = (p: CatalogProtocol) => {
    if (selectedProtocol?.id !== p.id) setReferenceDocs({ "Investigation Brochure": null, "Lab Manual": null });
    setSelectedProtocol(p);
    setError(null);
  };

  const handleUpload = async (docKind: ReferenceKind, file: File | undefined) => {
    if (!file) return;
    if (!selectedProtocol) {
      setError("Select a protocol first");
      return;
    }
    setBusyKind(docKind);
    try {
      const result = await uploadReferenceDocument(selectedProtocol.protocol_id, file, docKind);
      setReferenceDocs((prev) => ({ ...prev, [docKind]: result }));
      setError(null);
    } catch (e) {
      setError(`Upload failed: ${(e as Error).message}`);
    } finally {
      setBusyKind(null);
    }
  };

  const handleFetchDMS = async (docKind: ReferenceKind) => {
    if (!selectedProtocol) {
      setError("Select a protocol first");
      return;
    }
    setBusyKind(docKind);
    try {
      const docs = await fetchDMSDocuments(selectedProtocol.protocol_id);
      const match = docs.find((d) => d.doc_kind === docKind);
      if (!match) setError(`No ${docKind} found in the DMS for ${selectedProtocol.protocol_id}.`);
      else {
        setReferenceDocs((prev) => ({ ...prev, [docKind]: match }));
        setError(null);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusyKind(null);
    }
  };

  const state: SetupState = {
    protocol: selectedProtocol,
    references: REFERENCE_KINDS.map((k) => referenceDocs[k]).filter((d): d is ReferenceDocumentEntity => !!d),
    template: selectedTemplate || null,
  };

  return (
    <div className="setup-page">
      <div className="setup-container">
        <div className="setup-intro">
          <h1>New Consent Form</h1>
          <p>Configure your consent form by selecting a protocol, uploading references, and choosing a template.</p>
        </div>
        <ErrorBanner message={error} onDismiss={() => setError(null)} />

        <div className="setup-grid">
          {/* Column 1: Protocol Selection */}
          <Column icon={<BookOpen size={16} />} title="Select Protocol">
            <div className="setup-search">
              <Search size={15} />
              <input placeholder="Search protocols…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search protocols" />
            </div>
            <div className="proto-list" ref={listRef}>
              {loading ? (
                <PanelSpinner label="Loading protocols…" />
              ) : filteredProtocols.length === 0 ? (
                <EmptyState title="No protocols match" description="Try a protocol name or ID." />
              ) : (
                filteredProtocols.map((p) => (
                  <button key={p.id} className={`proto-card ${selectedProtocol?.id === p.id ? "selected" : ""}`} onClick={() => selectProtocol(p)} aria-pressed={selectedProtocol?.id === p.id}>
                    <div className="proto-card__top">
                      <span className="proto-card__id">{p.protocol_id}</span>
                      <span className={`phase ${PHASE_TONE[p.phase] ?? "phase--indigo"}`}>{p.phase}</span>
                    </div>
                    <h3>{p.protocol_name}</h3>
                    <p className="proto-card__meta">
                      <span>
                        <BookOpen size={12} /> {p.category}
                      </span>
                      <span>
                        <FlaskConical size={12} /> {p.drug_code}
                      </span>
                    </p>
                  </button>
                ))
              )}
            </div>
          </Column>

          {/* Column 2: Reference Documents */}
          <Column icon={<Upload size={16} />} title="Reference Documents">
            <div className="ref-list">
              {REFERENCE_KINDS.map((kind) => {
                const doc = referenceDocs[kind];
                return (
                  <div key={kind} className={`ref-box ${doc ? "ref-box--attached" : ""}`}>
                    <h4>{kind}</h4>
                    {doc ? (
                      <div className="ref-file">
                        <FileText size={16} />
                        <div className="ref-file__info">
                          <span className="ref-file__name" title={doc.file_name}>
                            {doc.file_name}
                          </span>
                          <span className="ref-file__src">{doc.source === "dms" ? "From DMS" : `Uploaded · ${Math.max(1, Math.round(doc.size / 1024))} KB`}</span>
                        </div>
                        <CheckCircle2 size={16} className="ref-file__ok" />
                        <button className="icon-btn" aria-label={`Remove ${kind}`} onClick={() => setReferenceDocs((prev) => ({ ...prev, [kind]: null }))}>
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div className="ref-actions">
                        <Button variant="outline" size="sm" icon={<BookOpen />} loading={busyKind === kind} onClick={() => handleFetchDMS(kind)}>
                          Fetch DMS
                        </Button>
                        <Button size="sm" icon={<Upload />} disabled={busyKind === kind} onClick={() => (selectedProtocol ? fileInputs.current[kind]?.click() : setError("Select a protocol first"))}>
                          Upload
                        </Button>
                        <input
                          ref={(el) => {
                            fileInputs.current[kind] = el;
                          }}
                          type="file"
                          accept=".pdf,.doc,.docx,.txt"
                          hidden
                          onChange={(e) => {
                            handleUpload(kind, e.target.files?.[0]);
                            e.target.value = "";
                          }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
              <InfoNote>Documents provide reference context for AI generation.</InfoNote>
            </div>
          </Column>

          {/* Column 3: Template Selection */}
          <Column icon={<FileText size={16} />} title="Select Template">
            <div className="tpl-list">
              {templates.map((t) => (
                <button key={t.id} onClick={() => setSelectedTemplate(t.id)} className={`tpl-card ${selectedTemplate === t.id ? "selected" : ""}`} aria-pressed={selectedTemplate === t.id}>
                  <div className="tpl-card__top">
                    <h3>{t.name}</h3>
                    {t.recommended && <span className="tpl-card__rec">Recommended</span>}
                    {selectedTemplate === t.id && <CheckCircle2 size={16} className="tpl-card__check" fill="var(--primary)" color="#fff" />}
                  </div>
                  <p>{t.description}</p>
                </button>
              ))}
            </div>
          </Column>
        </div>
      </div>
      {renderBottomBar?.(state)}
    </div>
  );
};
