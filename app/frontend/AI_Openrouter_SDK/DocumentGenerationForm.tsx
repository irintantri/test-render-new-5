/** Collects inputs to trigger AI document generation via OpenRouter (POST /api/document/generate). */
import { useState } from "react";
import { Sparkles, FileText } from "lucide-react";
import { apiClient } from "@shared/http";
import { useForm, type FormErrors } from "@shared/hooks";
import { Button, ErrorBanner, Field, Form, IcfMarkdown, Input, TextArea } from "@shared/ui";
import type { GeneratedDocumentResponse } from "@shared/types";
import { parseDocument, type ParsedSection } from "./DocumentParser";
import "./generation-form.css";

interface GenerationFormValues extends Record<string, unknown> {
  template_id: string;
  source_filename: string;
  values: string;
  model: string;
}

const MODEL_RE = /^[\w.-]+\/[\w.:-]+$/;
const FILE_RE = /^[^<>:"|?*]+\.[A-Za-z0-9]{2,5}$/;

function validate(v: GenerationFormValues): FormErrors<GenerationFormValues> {
  const errors: FormErrors<GenerationFormValues> = {};
  if (!v.template_id.trim()) errors.template_id = "Template ID is required.";
  if (!v.source_filename.trim()) errors.source_filename = "Source filename is required.";
  else if (!FILE_RE.test(v.source_filename.trim())) errors.source_filename = "Must be a valid file name (e.g. protocol.pdf).";
  if (!v.model.trim()) errors.model = "AI model is required.";
  else if (!MODEL_RE.test(v.model.trim())) errors.model = "Must be a valid OpenRouter model identifier (provider/model).";
  try {
    const parsed = JSON.parse(v.values || "{}");
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) errors.values = "Must be a JSON object.";
  } catch {
    errors.values = "Must be valid JSON.";
  }
  return errors;
}

export function DocumentGenerationForm() {
  const form = useForm<GenerationFormValues>({ template_id: "standard", source_filename: "", values: "{}", model: "openai/gpt-4o" }, validate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [result, setResult] = useState<GeneratedDocumentResponse | null>(null);
  const [parsed, setParsed] = useState<ParsedSection[]>([]);

  async function handleSubmit() {
    if (!form.validateAll()) return;
    setIsSubmitting(true);
    setMessage(null);
    try {
      const { data } = await apiClient.post<GeneratedDocumentResponse>("/api/document/generate", {
        template_id: form.values.template_id.trim(),
        source_filename: form.values.source_filename.trim(),
        values: JSON.parse(form.values.values || "{}"),
        model: form.values.model.trim(),
      });
      setResult(data);
      setParsed(parseDocument(data.filled_markdown, data.id));
      setMessage({ kind: "ok", text: "Document Generated Successfully" });
    } catch (e) {
      setMessage({ kind: "err", text: `Generation failed: ${(e as Error).message}` });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="gen-form-page">
      <div className="gen-form card">
        <h1>
          <Sparkles size={18} /> AI Document Generation
        </h1>
        <p className="muted">Combine a template with source content and configuration values using an OpenRouter model.</p>
        <Form onSubmit={handleSubmit}>
          <Field label="Template ID" htmlFor="template_id" error={form.visibleError("template_id")}>
            <Input id="template_id" name="template_id" value={form.values.template_id} onChange={(e) => form.setField("template_id", e.target.value)} invalid={!!form.visibleError("template_id")} />
          </Field>
          <Field label="Source Filename" htmlFor="source_filename" error={form.visibleError("source_filename")} hint="A server path or a reference document name, e.g. OncoPlex-X_Investigator_Brochure_v4.pdf">
            <Input id="source_filename" name="source_filename" value={form.values.source_filename} onChange={(e) => form.setField("source_filename", e.target.value)} invalid={!!form.visibleError("source_filename")} />
          </Field>
          <Field label="AI Model" htmlFor="model" error={form.visibleError("model")}>
            <Input id="model" name="model" value={form.values.model} onChange={(e) => form.setField("model", e.target.value)} invalid={!!form.visibleError("model")} />
          </Field>
          <Field label="Configuration Values (JSON)" htmlFor="values" error={form.visibleError("values")}>
            <TextArea id="values" name="values" className="mono" rows={5} value={form.values.values} onChange={(e) => form.setField("values", e.target.value)} invalid={!!form.visibleError("values")} />
          </Field>
          {message?.kind === "err" && <ErrorBanner message={message.text} />}
          <Button type="submit" block loading={isSubmitting} icon={<Sparkles />}>
            Generate Document
          </Button>
        </Form>
      </div>

      {result && (
        <div className="gen-result card">
          <div className="gen-result__head">
            <span className="badge badge--approved">{message?.text}</span>
            <span className="muted">
              ID <span className="mono">{result.id.slice(0, 8)}</span> · {result.pages} page{result.pages === 1 ? "" : "s"} · {result.model}
              {result.mocked ? " · offline mock" : ""}
            </span>
          </div>
          <p className="muted" style={{ fontSize: 12 }}>
            Document structure parsed and sections ready for AI revision.
          </p>
          {parsed.map((s) => (
            <section key={s.id} className="gen-result__section">
              <h3>
                <FileText size={14} /> {s.title}
              </h3>
              <IcfMarkdown content={s.content} />
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
