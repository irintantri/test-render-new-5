/** State + handlers for the Edit Action Bar. */
import { useState } from "react";
import { z } from "zod";
import { makeValidator } from "@shared/schema";
import { DocumentActionsService } from "./DocumentActionsService";

export const documentActionsStateSchema = z.object({ isProcessing: z.boolean() });
export type DocumentActionsState = z.infer<typeof documentActionsStateSchema>;
export const validate = makeValidator(documentActionsStateSchema, "DocumentActionsState");

export const useDocumentActions = (documentId: string) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleEdit = async (sectionId: string, newContent: string) => {
    setIsProcessing(true);
    try {
      await DocumentActionsService.updateSection(documentId, sectionId, newContent);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (sectionId: string) => {
    setIsProcessing(true);
    try {
      await DocumentActionsService.deleteSection(documentId, sectionId);
    } finally {
      setIsProcessing(false);
    }
  };

  return { handleEdit, handleDelete, isProcessing };
};
