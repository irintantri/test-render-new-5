/**
 * Minimal ICF markdown dialect used for section content:
 *   - plain lines           → paragraph lines
 *   - "- item"              → bullet list
 *   - "**bold**"            → inline bold
 * Framework-agnostic: returns a block tree that UI layers render.
 */
export type MdInline = { text: string; bold: boolean };
export type MdBlock = { type: "p"; inlines: MdInline[] } | { type: "ul"; items: MdInline[][] } | { type: "gap" };

export function parseInline(text: string): MdInline[] {
  const out: MdInline[] = [];
  const re = /\*\*(.+?)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ text: text.slice(last, m.index), bold: false });
    out.push({ text: m[1], bold: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last), bold: false });
  return out;
}

export function parseMarkdown(src: string | null | undefined): MdBlock[] {
  const blocks: MdBlock[] = [];
  const lines = (src ?? "").replace(/\r\n/g, "\n").split("\n");
  let list: MdInline[][] | null = null;
  for (const raw of lines) {
    const line = raw.trimEnd();
    const bullet = /^\s*[-*•]\s+(.*)$/.exec(line);
    if (bullet) {
      if (!list) {
        list = [];
        blocks.push({ type: "ul", items: list });
      }
      list.push(parseInline(bullet[1]));
      continue;
    }
    list = null;
    if (!line.trim()) {
      if (blocks.length && blocks[blocks.length - 1].type !== "gap") blocks.push({ type: "gap" });
      continue;
    }
    blocks.push({ type: "p", inlines: parseInline(line.trim()) });
  }
  while (blocks.length && blocks[blocks.length - 1].type === "gap") blocks.pop();
  return blocks;
}

export function stripMarkdown(src: string): string {
  return src.replace(/\*\*(.+?)\*\*/g, "$1").replace(/^\s*[-*•]\s+/gm, "");
}
