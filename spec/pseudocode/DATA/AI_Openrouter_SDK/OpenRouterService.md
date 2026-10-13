/**
 * Logic for interacting with the OpenRouter API via OpenAI SDK.
 */
import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY
});

async function processDocument(base64Pdf: string, prompt: string, model: string) {
  const response = await client.chat.completions.create({
    model: model,
    messages: [
      {
        role: "user",
        content: [
          { type: "file", file: { data: base64Pdf, mime_type: "application/pdf" } },
          { type: "text", text: prompt }
        ]
      }
    ]
  });

  return response.choices[0].message.content;
}