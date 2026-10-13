/** AI editing panel: section content, quick prompts, instruction, Ask AI. Asset: 7c11f251 */
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronRight, Sparkles } from "lucide-react";
import { Button, TextArea, useToast } from "@shared/ui";
import type { SectionView } from "@shared/types";
import { AIService } from "./AIService";
import { DocumentService } from "./DocumentService";
import "./AIDocumentEditor.css";

export const QUICK_PROMPTS = ["Simplify language for patient readability", "Check for regulatory compliance", "Add plain-language summary"];

export function AIDocumentEditor({
  sectionData,
  focusKey = 0,
  readOnly = false,
  onProcessingChange,
  onSectionUpdated,
}: {
  sectionData: SectionView | null;
  /** Changes when the user explicitly picks a section ("Edit with AI") */
  focusKey?: number;
  /** Review mode: suggestions are not written back */
  readOnly?: boolean;
  onProcessingChange?: (sectionId: string | null) => void;
  onSectionUpdated?: (sectionId: string, content: string) => void | Promise<void>;
}) {
  const [currentContent, setCurrentContent] = useState(sectionData?.content ?? "");
  const [userPrompt, setUserPrompt] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const notify = useToast();

  useEffect(() => {
    setCurrentContent(sectionData?.content ?? "");
    setSuggestion(null);
  }, [sectionData?.id, sectionData?.content]);

  useEffect(() => {
    if (focusKey > 0) {
      setShowContent(!readOnly);
      promptRef.current?.focus();
    }
  }, [focusKey, readOnly]);

  const label = sectionData ? (sectionData.parent_id ? sectionData.title : `${sectionData.number}. ${sectionData.title}`) : null;

  async function handleAskAI() {
    if (!sectionData || !userPrompt.trim()) return;
    setIsProcessing(true);
    onProcessingChange?.(sectionData.id);
    try {
      if (readOnly) {
        // Review: preview the suggestion without persisting
        setSuggestion(await AIService.suggest(sectionData.document_id, sectionData.id, userPrompt));
        return;
      }
      // 1. Save manual changes first
      if (currentContent !== sectionData.content) await DocumentService.saveSection(sectionData.id, currentContent);
      // 2. Call AI service
      const updatedContent = await AIService.rewriteSection(sectionData.id, currentContent, userPrompt);
      // 3. Update UI instantly
      setCurrentContent(updatedContent);
      await onSectionUpdated?.(sectionData.id, updatedContent);
      notify(`AI updated “${label}”`, "success");
      setUserPrompt("");
    } catch (e) {
      notify(`AI request failed: ${(e as Error).message}`, "error");
    } finally {
      setIsProcessing(false);
      onProcessingChange?.(null);
    }
  }

  return (
    <div className="ai-editor">
      <div className="ai-editor__title">
        <Sparkles size={14} />
        AI Assistant
      </div>

      {label && (
        <button className="ai-editor__context" onClick={() => !readOnly && setShowContent((v) => !v)} aria-expanded={showContent} disabled={readOnly}>
          {!readOnly && (showContent ? <ChevronDown size={12} /> : <ChevronRight size={12} />)}
          <span>
            {readOnly ? "Section" : "Editing"}: <b>{label}</b>
          </span>
        </button>
      )}

      {showContent && sectionData && !readOnly && (
        <TextArea className="ai-editor__content" value={currentContent} onChange={(e) => setCurrentContent(e.target.value)} rows={8} aria-label="Section content" />
      )}

      <TextArea
        ref={promptRef}
        className="ai-editor__prompt"
        placeholder="Ask AI to refine content, simplify language, check compliance..."
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && (e.metaKey || e.ctrlKey) && handleAskAI()}
        rows={2}
      />
      <Button block size="sm" className="ai-editor__ask" disabled={!userPrompt.trim() || isProcessing || !sectionData} onClick={handleAskAI}>
        {isProcessing ? "Asking…" : "Ask AI"}
      </Button>

      <div className="ai-editor__quick-label">Quick prompts:</div>
      <div className="ai-editor__quick">
        {QUICK_PROMPTS.map((p) => (
          <button key={p} className="ai-editor__chip" onClick={() => setUserPrompt(p)}>
            {p}
          </button>
        ))}
      </div>

      {suggestion && (
        <div className="ai-editor__suggestion">
          <div className="ai-editor__quick-label">Suggestion (not applied):</div>
          <pre>{suggestion}</pre>
        </div>
      )}
    </div>
  );
}
