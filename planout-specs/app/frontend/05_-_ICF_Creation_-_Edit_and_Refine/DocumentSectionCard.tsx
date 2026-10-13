/** Section card with read / edit states and an AI overlay. */
import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { AiBadge, IcfMarkdown, Spinner } from "@shared/ui";
import type { SectionView } from "@shared/types";

export const DocumentSectionCard = ({
  data,
  subsections = [],
  onEditWithAI,
  isGenerating = false,
  generatingId,
  isSelected,
  renderEditor,
}: {
  data: SectionView;
  subsections?: SectionView[];
  onEditWithAI?: (section: SectionView) => void;
  isGenerating?: boolean;
  generatingId?: string | null;
  isSelected?: boolean;
  /** Return an editor node to replace a section's body (inline editing). */
  renderEditor?: (section: SectionView) => ReactNode | null;
}) => {
  const body = (s: SectionView) => renderEditor?.(s) ?? <IcfMarkdown content={s.content} />;
  const overlay = (
    <div className="ai-overlay">
      <Spinner size={22} />
      <p>AI is updating this section…</p>
    </div>
  );

  return (
    <article className={`section-card ${isSelected ? "section-card--selected" : ""}`} id={data.id}>
      <div className="section-header">
        <h3>
          {data.number}. {data.title}
        </h3>
        {data.isAiGenerated && <AiBadge label={data.ai_label === "AI Refined" || data.ai_label === "AI Edited" ? "AI Refined" : "AI Generated"} />}
        {onEditWithAI && (
          <button className="section-header__ai" onClick={() => onEditWithAI(data)}>
            <Sparkles size={14} /> Edit with AI
          </button>
        )}
      </div>

      <div className="section-body">
        {(isGenerating || generatingId === data.id) && overlay}
        {body(data)}
        {subsections.map((sub) => (
          <div key={sub.id} id={sub.id} className="subsection">
            {generatingId === sub.id && overlay}
            <div className="subsection__head">
              <span>{sub.title}</span>
              {onEditWithAI && (
                <button className="subsection__ai" onClick={() => onEditWithAI(sub)} aria-label={`Edit ${sub.title} with AI`}>
                  <Sparkles size={12} />
                </button>
              )}
            </div>
            {body(sub)}
          </div>
        ))}
      </div>
    </article>
  );
};
