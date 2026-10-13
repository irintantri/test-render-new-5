/** Read-only section card for the Review page. */
import { AiBadge, IcfMarkdown } from "@shared/ui";

export const DocumentSectionCard = ({
  id,
  title,
  content,
  isAiGenerated,
  subsections = [],
}: {
  id: string;
  title: string;
  content: string;
  isAiGenerated: boolean;
  subsections?: { id: string; title: string; content: string }[];
}) => {
  return (
    <article className="section-card" id={id}>
      <div className="section-header card-header">
        <h3 className="section-title">{title}</h3>
        {isAiGenerated && <AiBadge />}
      </div>
      <div className="section-body card-body">
        <IcfMarkdown content={content} />
        {subsections.map((s) => (
          <div key={s.id} id={s.id} className="subsection">
            <div className="subsection__head">
              <span>{s.title}</span>
            </div>
            <IcfMarkdown content={s.content} />
          </div>
        ))}
      </div>
    </article>
  );
};
