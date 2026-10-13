/** Orchestrates AI-driven section refinement (OpenRouter or local mock). */
import { recordAudit, repos } from "@shared/db";
import { NotFoundError } from "@shared/errors";
import { AISectionRepository } from "@app/data/AI_Document_Editor/AISectionRepository";

export async function handleAISectionRefinement(
  documentId: string,
  sectionId: string,
  userPrompt: string,
  currentContent?: string,
  actor: { id: string; name: string } = { id: "u-1", name: "Mike Evans" },
) {
  const currentSection = repos.sections.findOne({ id: sectionId, document_id: documentId });
  if (!currentSection) throw new NotFoundError("Section not found");
  const updated = await AISectionRepository.updateSectionWithAI({
    documentId,
    sectionId,
    aiPrompt: userPrompt,
    currentContent: currentContent ?? currentSection.content,
  });
  repos.sections.update(sectionId, { status: "refined" });
  recordAudit(documentId, "AI Refinement", actor.id, actor.name, sectionId);
  return { ...updated, status: "refined" };
}
