/**
 * Splits document text into DocumentSection-shaped chunks ({ title, content })
 * ready for AI revision. Headings ("#", numbered "1." / "1.2") start a section.
 */
export interface ParsedSection {
  id: string;
  document_id: string | null;
  title: string;
  content: string;
}

const HEADING = /^(#{1,3}\s+.+|\d+(\.\d+)*\.?\s+[A-Z].{0,80})$/;

export function processSections(sections: Omit<ParsedSection, "id" | "document_id">[], documentId: string | null = null): ParsedSection[] {
  return sections.map((s, i) => ({ id: `parsed-${i + 1}`, document_id: documentId, title: s.title, content: s.content.trim() }));
}

export function parseDocument(rawText: string, documentId: string | null = null): ParsedSection[] {
  const out: { title: string; content: string }[] = [];
  let current: { title: string; content: string } | null = null;
  for (const line of rawText.replace(/\r\n/g, "\n").split("\n")) {
    if (HEADING.test(line.trim())) {
      current = { title: line.trim().replace(/^#+\s*/, ""), content: "" };
      out.push(current);
    } else {
      if (!current) {
        current = { title: "Summary", content: "" };
        out.push(current);
      }
      current.content += `${line}\n`;
    }
  }
  return processSections(out.filter((s) => s.title || s.content.trim()), documentId);
}

/** Read a browser File as text (PDFs are passed by name; the server extracts them). */
export async function parseFile(file: File): Promise<ParsedSection[]> {
  if (file.type === "application/pdf") return [];
  return parseDocument(await file.text());
}
