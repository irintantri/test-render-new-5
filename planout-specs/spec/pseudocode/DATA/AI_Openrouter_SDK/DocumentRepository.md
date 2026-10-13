/**
 * Persists the result of the OpenRouter generation process.
 * Maps the raw JSON response and extracted sections into the database.
 */
function saveGeneratedDocument(data: {
  template_id: string,
  source_filename: string,
  model: string,
  values: object,
  filled_markdown: string,
  pages: number,
  sections: Array<{ title: string, content: string }>
}) {
  // 1. Create the primary DocumentGeneration record
  const doc = db.DocumentGeneration.insert({
    template_id: data.template_id,
    source_filename: data.source_filename,
    model: data.model,
    values: data.values,
    filled_markdown: data.filled_markdown,
    pages: data.pages,
    created_at: new Date()
  });

  // 2. Map and insert individual sections for structured retrieval
  data.sections.forEach(section => {
    db.DocumentSection.insert({
      document_id: doc.id,
      title: section.title,
      content: section.content
    });
  });

  return doc.id;
}