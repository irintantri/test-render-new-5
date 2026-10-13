/** Simulated-PDF preview with zoom and publish. Asset: 296abc29 */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, CircleCheck, FileText, ZoomIn, ZoomOut, BadgeCheck } from "lucide-react";
import { ROUTES } from "@shared/lib";
import { Button, ErrorBanner, IcfPdfDocument, PanelSpinner, useToast } from "@shared/ui";
import type { DocumentView, SectionView } from "@shared/types";
import { fetchDocument, fetchDocumentSections, publishDocument } from "./api";
import "./preview.css";

const ZOOM_MIN = 50;
const ZOOM_MAX = 200;
const CHARS_PER_PAGE = 1500;

export const ICFPreviewPage = ({ documentId, onDocument }: { documentId: string; onDocument?: (doc: DocumentView) => void }) => {
  const [documentData, setDocumentData] = useState<DocumentView | null>(null);
  const [sections, setSections] = useState<SectionView[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [page, setPage] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const notify = useToast();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const doc = await fetchDocument(documentId);
        const sec = await fetchDocumentSections(doc.id);
        setDocumentData(doc);
        onDocument?.(doc);
        setSections(sec.sections);
        if (doc.id !== documentId) navigate(ROUTES.preview(doc.id), { replace: true });
      } catch (e) {
        setLoadError((e as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [documentId, navigate, onDocument]);

  const pageCount = Math.max(1, Math.ceil(sections.reduce((n, s) => n + s.content.length + s.title.length, 0) / CHARS_PER_PAGE));

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setPage(max <= 0 ? 1 : Math.min(pageCount, Math.floor((el.scrollTop / max) * (pageCount - 1) + 1)));
  };

  const handlePublish = async () => {
    if (!documentData) return;
    setIsPublishing(true);
    try {
      const response = await publishDocument({ documentId: documentData.id });
      if (response.status === "success") {
        setIsPublished(true);
        notify("ICF Published Successfully", "success");
      }
    } catch (error) {
      console.error("Publishing failed", error);
      notify((error as Error).message || "Publishing failed", "error");
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) return <PanelSpinner label="Loading Preview..." />;
  if (loadError || !documentData) return <div style={{ padding: 24 }}><ErrorBanner message={loadError ?? "Failed to load ICF preview data"} /></div>;

  const title = `${documentData.protocol_id} ICF — ${documentData.icf_version}.pdf`;

  return (
    <div className="preview-page">
      <div className="document-toolbar">
        <FileText size={16} />
        <span className="document-toolbar__title">{title}</span>
        <div className="document-toolbar__controls">
          <button onClick={() => setZoomLevel((z) => Math.max(ZOOM_MIN, z - 10))} aria-label="Zoom out" disabled={zoomLevel <= ZOOM_MIN}>
            <ZoomOut size={16} />
          </button>
          <span className="document-toolbar__zoom">{zoomLevel}%</span>
          <button onClick={() => setZoomLevel((z) => Math.min(ZOOM_MAX, z + 10))} aria-label="Zoom in" disabled={zoomLevel >= ZOOM_MAX}>
            <ZoomIn size={16} />
          </button>
          <span className="document-toolbar__page">
            Page {page} of {pageCount}
          </span>
        </div>
      </div>

      <div className="icf-pdf-container" ref={scrollRef} onScroll={onScroll}>
        <div className="icf-pdf-zoom" style={{ zoom: zoomLevel / 100 } as React.CSSProperties}>
          <IcfPdfDocument document={documentData} sections={sections} />
        </div>
      </div>

      <div className="bottom-bar action-footer">
        <Button variant="ghost" icon={<ChevronLeft />} onClick={() => navigate(ROUTES.review(documentData.id))}>
          Back to Review
        </Button>
        {isPublished ? (
          <div className="success-badge" role="status">
            <BadgeCheck size={16} /> ICF Published Successfully
          </div>
        ) : (
          <Button variant="success" icon={<CircleCheck />} loading={isPublishing} onClick={handlePublish}>
            Publish ICF
          </Button>
        )}
      </div>
    </div>
  );
};
