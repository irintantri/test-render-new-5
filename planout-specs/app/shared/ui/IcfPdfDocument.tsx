import type { DocumentView, SectionView } from "../schema/views";
import { formatShortDate } from "../lib/format";
import { IcfMarkdown } from "./IcfMarkdown";
import "./icf-pdf.css";

/** Simulated PDF page of the ICF — shared by the Preview page and the Preview Draft modal. */
export function IcfPdfDocument({ document, sections, draft }: { document: DocumentView; sections?: SectionView[]; draft?: boolean }) {
  const list = sections ?? document.metadata.sections;
  const sponsor = (document.sponsor ?? "Sponsor").replace(/\.$/, "");
  return (
    <article className="icf-paper">
      {draft && <div className="icf-paper__watermark">DRAFT</div>}
      <header className="icf-paper__header">
        <div className="icf-paper__eyebrow">{sponsor.toUpperCase()}. — CLINICAL RESEARCH</div>
        <h1 className="icf-paper__title">INFORMED CONSENT FORM</h1>
        <div className="icf-paper__subtitle">{document.icf_name}</div>
        <div className="icf-paper__meta">
          <span>
            Protocol: <b>{document.protocol_id}</b>
          </span>
          <span className="icf-paper__dot">•</span>
          <span>
            Version: <b>{document.icf_version}</b>
          </span>
          <span className="icf-paper__dot">•</span>
          <span>
            Date: <b>{formatShortDate(document.published_at ?? document.last_modified)}</b>
          </span>
        </div>
      </header>
      {list.map((s) =>
        s.parent_id ? (
          <section key={s.id} className="icf-paper__sub">
            <h4>{s.title}</h4>
            <IcfMarkdown content={s.content} />
          </section>
        ) : (
          <section key={s.id} className="icf-paper__section">
            <h2>
              {s.number}. {s.title}
            </h2>
            <IcfMarkdown content={s.content} />
          </section>
        ),
      )}
    </article>
  );
}
