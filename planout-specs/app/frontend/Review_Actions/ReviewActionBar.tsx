/** Review context bar: document name, version/status, Compare Versions. Asset: f754b406 */
import { useEffect, useRef, useState } from "react";
import { GitCompareArrows } from "lucide-react";
import { Button, IcfMarkdown, Modal, Pill, useToast } from "@shared/ui";
import type { CompareResult, DocumentView } from "@shared/types";
import { DocumentService } from "./DocumentService";
import { useVersionHistory } from "./useVersionHistory";
import { VersionDropdown } from "./VersionDropdown";
import "./review-actions.css";

export function ReviewActionBar({ documentId, docMetadata }: { documentId: string; docMetadata: DocumentView }) {
  const { data: versions, isLoading } = useVersionHistory(documentId);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [comparison, setComparison] = useState<CompareResult | null>(null);
  const [changedOnly, setChangedOnly] = useState(true);
  const notify = useToast();
  const ref = useRef<HTMLDivElement>(null);
  const current = versions.find((v) => v.isCurrent);
  const statusLabel = docMetadata.status === "In Review" ? "Review" : docMetadata.status;

  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setIsCompareOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const triggerComparison = async (versionId: string) => {
    setIsCompareOpen(false);
    if (!current) return;
    try {
      setComparison(await DocumentService.compareVersions(documentId, versionId, current.id));
    } catch (e) {
      notify((e as Error).message, "error");
    }
  };

  return (
    <div className="doc-actionbar review-action-bar" ref={ref}>
      <span className="doc-actionbar__name">{docMetadata.icf_name}</span>
      <Button variant="outline" size="sm" icon={<GitCompareArrows />} onClick={() => setIsCompareOpen((v) => !v)} aria-expanded={isCompareOpen}>
        Compare Versions
      </Button>
      <Pill strong>
        {docMetadata.icf_version} {statusLabel}
      </Pill>
      {isCompareOpen && <VersionDropdown versions={versions} isLoading={isLoading} onSelect={triggerComparison} />}

      {comparison && (
        <Modal open wide onClose={() => setComparison(null)} icon={<GitCompareArrows size={16} />} title={`Compare ${comparison.v1.versionString} → ${comparison.v2.versionString} (current)`} headerExtra={
            <>
              <span className="badge badge--review">{comparison.changedCount} changed</span>
              <label className="compare-toggle">
                <input type="checkbox" checked={changedOnly} onChange={(e) => setChangedOnly(e.target.checked)} /> Changed sections only
              </label>
            </>
          }>
          <div className="compare-grid">
            <div className="compare-grid__head">{comparison.v1.versionString}</div>
            <div className="compare-grid__head">{comparison.v2.versionString} · Current</div>
            {comparison.rows.filter((r) => !changedOnly || r.changed).map((r) => (
              <div key={r.title} className={`compare-row ${r.changed ? "is-changed" : ""}`}>
                <div className="compare-cell">
                  <h4>{r.title}</h4>
                  {r.left === null ? <em>Not present</em> : <IcfMarkdown content={r.left} />}
                </div>
                <div className="compare-cell">
                  <h4>{r.title}</h4>
                  {r.right === null ? <em>Removed</em> : <IcfMarkdown content={r.right} />}
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
