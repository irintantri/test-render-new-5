/** Draft → In Review transition, then navigate to the Review page. */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@shared/http";
import { ROUTES } from "@shared/lib";
import { useToast } from "@shared/ui";

export function useDocumentActions(documentId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const notify = useToast();

  async function submitForReview() {
    setIsSubmitting(true);
    try {
      const response = await apiClient.post<{ id: string; status: string }>(`/api/documents/${documentId}/submit-review`);
      if (response.status === 200) {
        notify("Submitted for review", "success");
        navigate(ROUTES.review(documentId));
      }
    } catch (error) {
      notify((error as Error).message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submitForReview, isSubmitting };
}
