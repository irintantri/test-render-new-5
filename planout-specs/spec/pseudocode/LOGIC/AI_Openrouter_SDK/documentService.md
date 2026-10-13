import { OpenAI } from 'openai';
import fs from 'fs';

/**
 * Initializes the OpenRouter client using the OpenAI SDK
 */
const getOpenRouterClient = () => {
  return new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_API_KEY
  });
};

/**
 * Processes document generation by chunking, calling OpenRouter, 
 * and persisting results to the database.
 */
export const processDocumentGeneration = async (documentData) => {
  const client = getOpenRouterClient();
  
  // 1. Load and encode file
  const fileBuffer = fs.readFileSync(documentData.source_filename);
  const base64Pdf = fileBuffer.toString("base64");

  // 2. Prepare messages for the LLM
  const messages = [
    {
      role: "user",
      content: [
        { type: "file", file: { data: base64Pdf, mime_type: "application/pdf" } },
        { type: "text", text: "Summarize this document and process sections based on provided values." }
      ]
    }
  ];

  // 3. Call OpenRouter API
  const response = await client.chat.completions.create({
    model: documentData.model || "google/gemini-pro-1.5",
    messages: messages
  });

  const summary = response.choices[0].message.content;

  // 4. Persist to DocumentGeneration entity
  const newDoc = await db.DocumentGeneration.create({
    template_id: documentData.template_id,
    source_filename: documentData.source_filename,
    model: documentData.model,
    values: documentData.values,
    filled_markdown: summary,
    pages: 1, // <!-- MISSING_FIELD: DocumentGeneration.pages (calculated from PDF metadata) -->
    created_at: new Date()
  });

  // 5. Parse sections and store in DocumentSection
  // Assuming the LLM returns structured content or we parse the summary
  const sections = parseSectionsFromMarkdown(summary); 
  for (const section of sections) {
    await db.DocumentSection.create({
      document_id: newDoc.id,
      title: section.title,
      content: section.content
    });
  }

  return newDoc;
};

/**
 * Helper to parse the LLM output into logical sections
 */
function parseSectionsFromMarkdown(markdown) {
  // Logic to split markdown into DocumentSection entities
  return [{ title: "Summary", content: markdown }];
}