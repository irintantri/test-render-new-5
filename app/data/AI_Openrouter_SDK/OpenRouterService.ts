/** OpenRouter interaction via the OpenAI SDK (falls back to local mock offline). */
import { z } from "zod";
import { makeValidator } from "@shared/schema";
import { getOpenRouterClient, isAiConfigured, mockRewrite } from "@shared/ai";

export const processDocumentInputSchema = z.object({
  base64Pdf: z.string(),
  prompt: z.string().min(1),
  model: z.string().min(1),
});
export type ProcessDocumentInput = z.infer<typeof processDocumentInputSchema>;
export const validate = makeValidator(processDocumentInputSchema, "ProcessDocumentInput");

export async function processDocument(base64Pdf: string, prompt: string, model: string): Promise<string> {
  validate({ base64Pdf, prompt, model });
  if (!isAiConfigured()) return mockRewrite(prompt, "summary");
  const response = await getOpenRouterClient().chat.completions.create({
    model,
    messages: [
      {
        role: "user",
        // OpenRouter accepts file parts; the OpenAI SDK types don't model them yet.
        content: [
          ...(base64Pdf ? [{ type: "file", file: { file_data: `data:application/pdf;base64,${base64Pdf}`, filename: "source.pdf" } }] : []),
          { type: "text", text: prompt },
        ] as never,
      },
    ],
  });
  return response.choices[0]?.message?.content ?? "";
}
