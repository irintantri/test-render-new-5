/**
 * Component: DocumentGenerationForm
 * Purpose: Collects user inputs to trigger AI-powered document generation via OpenRouter SDK.
 */

STATE:
  - template_id: string (default: "")
  - source_filename: string (default: "")
  - values: json (default: {})
  - model: string (default: "openai/gpt-4o")
  - isSubmitting: boolean (default: false)
  - errors: object (default: {})

VALIDATION RULES (Triggered on change):
  - template_id: Required. Must be a non-empty string.
  - source_filename: Required. Must be a valid file path/name string.
  - model: Required. Must be a valid OpenRouter model identifier.
  - values: Must be a valid JSON object.

UI ELEMENTS:
  - Input(name="template_id", label="Template ID", onChange=validate)
  - Input(name="source_filename", label="Source Filename", onChange=validate)
  - Input(name="model", label="AI Model", onChange=validate)
  - TextArea(name="values", label="Configuration Values (JSON)", onChange=validate)
  - Button(label="Generate Document", onClick=handleSubmit)

FUNCTION handleSubmit():
  IF errors is empty:
    SET isSubmitting = TRUE
    CALL API POST /document/generate WITH:
      template_id: template_id
      source_filename: source_filename
      values: values
      model: model
    ON SUCCESS (response):
      DISPLAY "Document Generated Successfully"
      // Response contains: id, filled_markdown, pages
      STORE response.id, response.filled_markdown, response.pages
    ON ERROR:
      DISPLAY "Generation failed: " + error.message
    SET isSubmitting = FALSE