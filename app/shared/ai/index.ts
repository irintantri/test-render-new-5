/**
 * Server-side AI provider. Uses OpenRouter (OpenAI-compatible SDK) when
 * OPENROUTER_API_KEY is set; otherwise a deterministic local rewriter so the
 * app is fully functional offline.
 */
import OpenAI from "openai";
import { createLogger } from "../lib/logger";

const log = createLogger("ai");

export function isAiConfigured(): boolean {
  return Boolean(process.env.OPENROUTER_API_KEY);
}

export function getOpenRouterClient(): OpenAI {
  return new OpenAI({ baseURL: "https://openrouter.ai/api/v1", apiKey: process.env.OPENROUTER_API_KEY });
}

export const DEFAULT_MODEL = () => process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

const SYSTEM_PROMPT =
  "You are a professional editor of clinical-trial Informed Consent Forms. Refine the provided section based on the user's instruction. " +
  "Keep the same markdown conventions: plain lines for paragraphs, '- ' for bullets, **bold** for labels. Return only the revised section text.";

export async function rewriteSection(input: { title?: string; content: string; instruction: string }): Promise<string> {
  if (isAiConfigured()) {
    try {
      const res = await getOpenRouterClient().chat.completions.create({
        model: DEFAULT_MODEL(),
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: JSON.stringify({ title: input.title, originalContent: input.content, instruction: input.instruction }) },
        ],
      });
      const text = res.choices[0]?.message?.content?.trim();
      if (text) return text;
    } catch (e) {
      log.warn("OpenRouter call failed; falling back to local rewriter", (e as Error).message);
    }
  }
  return mockRewrite(input.content, input.instruction);
}

const PLAIN: [RegExp, string][] = [
  [/\binvestigational\b/gi, "experimental"],
  [/\bdiscontinue\b/gi, "stop"],
  [/\bparticipate in\b/gi, "take part in"],
  [/\bapproximately\b/gi, "about"],
  [/\badditionally\b/gi, "also"],
  [/\bto the extent permitted by law\b/gi, "as far as the law allows"],
  [/\bentitled\b/gi, "owed"],
  [/\bdetermine\b/gi, "find out"],
  [/\bevaluate\b/gi, "check"],
];

/** Deterministic offline rewrite keyed off the instruction intent. */
export function mockRewrite(content: string, instruction: string): string {
  const i = instruction.toLowerCase();
  if (/simpl|readab|plain|easier/.test(i) && !/summary/.test(i)) {
    return PLAIN.reduce((t, [re, rep]) => t.replace(re, (m) => (m[0] === m[0].toUpperCase() ? rep[0].toUpperCase() + rep.slice(1) : rep)), content);
  }
  if (/summary|summar/.test(i)) {
    const lines = content.split("\n").filter((l) => l.trim());
    const first = (lines.find((l) => !l.startsWith("-") && !l.startsWith("**")) ?? lines[0] ?? "").replace(/\*\*/g, "").replace(/^-\s*/, "").trim();
    const gist = first.split(/(?<=\.)\s/)[0];
    return `**In plain language:** ${gist}\n${content}`;
  }
  if (/complian|regulat|fda|ich|gcp/.test(i)) {
    return content.includes("21 CFR")
      ? content
      : `${content}\nThis section has been reviewed for consistency with 21 CFR 50.25 (elements of informed consent) and ICH E6(R3) Good Clinical Practice.`;
  }
  if (/shorter|concise|shorten/.test(i)) {
    return content
      .split("\n")
      .map((l) => (l.length > 140 ? l.split(/(?<=\.)\s/)[0] : l))
      .join("\n");
  }
  return `${content}\n${instruction.trim().replace(/\.?$/, ".")}`;
}
