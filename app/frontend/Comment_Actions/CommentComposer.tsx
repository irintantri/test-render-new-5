/** Pinned composer; section dropdown appears on focus. Asset: a5ff0cd2 */
import { useRef, useState } from "react";
import { Send } from "lucide-react";

export interface SectionOption {
  id: string;
  label: string;
}

export function CommentComposer({
  sections,
  defaultSection,
  onAdd,
}: {
  sections: SectionOption[];
  defaultSection?: SectionOption | null;
  onAdd: (p: { text: string; section: SectionOption | null }) => Promise<void>;
}) {
  const [text, setText] = useState("");
  const [selectedSection, setSelectedSection] = useState<SectionOption | null>(defaultSection ?? null);
  const [isFocused, setIsFocused] = useState(false);
  const [sending, setSending] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = selectedSection ?? defaultSection ?? sections[0] ?? null;

  const submit = async () => {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      await onAdd({ text: text.trim(), section: current });
      setText("");
      setIsFocused(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="composer"
      ref={rootRef}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => !rootRef.current?.contains(e.relatedTarget as Node) && !text && setIsFocused(false)}
    >
      {isFocused && sections.length > 0 && (
        <select className="composer__section" value={current?.id ?? ""} onChange={(e) => setSelectedSection(sections.find((s) => s.id === e.target.value) ?? null)} aria-label="Comment section">
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      )}
      <div className="composer__row">
        <input
          className="composer__input"
          placeholder="Add comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          aria-label="Add comment"
        />
        <button className="composer__send" onClick={submit} disabled={!text.trim() || sending} aria-label="Submit comment">
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
