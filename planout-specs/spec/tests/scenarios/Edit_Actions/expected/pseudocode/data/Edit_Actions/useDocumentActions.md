/**
 * Custom hook to manage the state and action handlers for the Edit Action Bar.
 */
import { useState } from 'react';
import { DocumentActionsService } from './DocumentActionsService';

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
    // UI layer should handle the confirmation prompt before invoking this
    setIsProcessing(true);
    try {
      await DocumentActionsService.deleteSection(documentId, sectionId);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    handleEdit,
    handleDelete,
    isProcessing
  };
};