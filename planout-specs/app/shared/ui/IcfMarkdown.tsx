import { Fragment } from "react";
import { parseMarkdown, type MdInline } from "../lib/markdown";

function Inlines({ parts }: { parts: MdInline[] }) {
  return (
    <>
      {parts.map((p, i) => (p.bold ? <strong key={i}>{p.text}</strong> : <Fragment key={i}>{p.text}</Fragment>))}
    </>
  );
}

/** Renders ICF section markdown (paragraph lines, bullets, bold). */
export function IcfMarkdown({ content, className }: { content: string | null | undefined; className?: string }) {
  const blocks = parseMarkdown(content);
  return (
    <div className={["icf-md", className].filter(Boolean).join(" ")}>
      {blocks.map((b, i) =>
        b.type === "gap" ? (
          <div key={i} className="icf-gap" />
        ) : b.type === "ul" ? (
          <ul key={i}>
            {b.items.map((it, j) => (
              <li key={j}>
                <Inlines parts={it} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={i}>
            <Inlines parts={b.inlines} />
          </p>
        ),
      )}
    </div>
  );
}
