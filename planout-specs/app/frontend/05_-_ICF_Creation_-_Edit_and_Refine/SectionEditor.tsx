/** Manual text editing for a section (inline in its card). */
import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button, TextArea } from "@shared/ui";
import type { SectionView } from "@shared/types";

export const SectionEditor = ({
  section,
  onUpdate,
  onCancel,
  saving,
}: {
  section: SectionView;
  onUpdate: (content: string) => void | Promise<void>;
  onCancel: () => void;
  saving?: boolean;
}) => {
  const [content, setContent] = useState(section.content);
  const [error, setError] = useState<string | null>(null);

  const validate = (value: string) => value.trim().length > 0;

  const handleManualChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);
    setError(validate(newValue) ? null : "Section content cannot be empty.");
  };

  const label = section.parent_id ? section.title : `${section.number}. ${section.title}`;

  return (
    <div className="section-editor-form">
      <label className="section-editor-form__label" htmlFor={`edit-${section.id}`}>
        Section - {label}
      </label>
      <TextArea id={`edit-${section.id}`} value={content} onChange={handleManualChange} placeholder="Edit section content manually..." rows={Math.min(18, Math.max(6, content.split("\n").length + 2))} invalid={!!error} autoFocus />
      <div className="section-editor-form__foot">
        <span className="section-editor-form__hint">{error ?? "Use “- ” for bullets and **text** for bold."}</span>
        <Button variant="ghost" size="sm" icon={<X />} onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" icon={<Check />} disabled={!!error || !validate(content) || content === section.content} loading={saving} onClick={() => onUpdate(content)}>
          Save
        </Button>
      </div>
    </div>
  );
};
