/**
 * Headless TOC controller: owns add-section / add-subsection behaviour
 * (append → activate → scroll) and hands state to a presentational view.
 */
import { useState, type ReactNode } from "react";
import type { SectionView } from "@shared/types";
import { addSection, addSubsection, scrollToSection } from "./TableOfContentsLogic";

export interface TocActions {
  addSection: () => Promise<void>;
  addSubsection: () => Promise<void>;
  isAdding: boolean;
  error: string | null;
}

export function useTableOfContentsActions(opts: {
  documentId: string;
  sections: SectionView[];
  activeSectionId: string | null;
  onActiveChange: (id: string) => void;
  onSectionsChanged: () => Promise<void> | void;
}): TocActions {
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (create: () => Promise<SectionView>) => {
    setIsAdding(true);
    setError(null);
    try {
      const created = await create();
      await opts.onSectionsChanged();
      opts.onActiveChange(created.id);
      setTimeout(() => scrollToSection(created.id), 80);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIsAdding(false);
    }
  };

  /** Parent for a new subsection: the active top-level section (or the active subsection's parent). */
  const parentForSubsection = () => {
    const active = opts.sections.find((s) => s.id === opts.activeSectionId);
    return active ? (active.parent_id ?? active.id) : (opts.sections.filter((s) => !s.parent_id).at(-1)?.id ?? null);
  };

  return {
    addSection: () => run(() => addSection(opts.documentId)),
    addSubsection: async () => {
      const parentId = parentForSubsection();
      if (!parentId) return setError("Add a section first");
      return run(() => addSubsection(opts.documentId, parentId));
    },
    isAdding,
    error,
  };
}

export function TableOfContentsComponent(props: Parameters<typeof useTableOfContentsActions>[0] & { children: (actions: TocActions) => ReactNode }) {
  const actions = useTableOfContentsActions(props);
  return <>{props.children(actions)}</>;
}
