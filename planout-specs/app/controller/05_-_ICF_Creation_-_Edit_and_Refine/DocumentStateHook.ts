/** Document lifecycle state for the Edit & Refine view. */
import { useCallback, useEffect, useState } from "react";
import type { DocumentView } from "@shared/types";
import { fetchDocumentById } from "./DocumentService";

export const useDocument = (id: string) => {
  const [document, setDocument] = useState<DocumentView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setIsLoading(true);
      try {
        setDocument(await fetchDocumentById(id));
        setError(null);
      } catch (e) {
        console.error("Error loading document:", e);
        setError((e as Error).message);
      } finally {
        setIsLoading(false);
      }
    },
    [id],
  );

  useEffect(() => {
    load();
  }, [load]);

  return { document, isLoading, error, reload: () => load(true), setDocument };
};
