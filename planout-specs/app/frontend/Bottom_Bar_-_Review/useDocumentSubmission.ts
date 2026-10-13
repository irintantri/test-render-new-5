import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@shared/lib";
import { useToast } from "@shared/ui";
import { postSubmitApproval } from "./API_Definition";

export function useDocumentSubmission(documentId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const notify = useToast();
  const navigate = useNavigate();

  async function submitForApproval() {
    setIsSubmitting(true);
    try {
      const response = await postSubmitApproval(documentId);
      if (response.data.success) {
        notify("Document submitted successfully", "success");
        navigate(ROUTES.preview(documentId));
      }
    } catch (error) {
      notify((error as Error).message || "Failed to submit document", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return { submitForApproval, isSubmitting };
}
