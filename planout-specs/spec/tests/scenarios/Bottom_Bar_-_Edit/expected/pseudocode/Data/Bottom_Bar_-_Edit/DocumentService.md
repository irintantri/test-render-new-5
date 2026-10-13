/**
 * Orchestrates business logic for the Bottom Action Bar.
 * Ensures that document status constraints are met before submission.
 */

FUNCTION submitDocumentForApproval(id: UUID):
    // 1. Fetch current document state
    document = getDocumentById(id)
    
    // 2. Validate state transition
    IF document.status != 'Draft':
        THROW Error("Only documents in Draft status can be submitted for approval.")
    
    // 3. Perform transition
    updatedDoc = transitionToInReview(id)
    
    RETURN updatedDoc

FUNCTION saveDraft(id: UUID, content: String, metadata: JSON):
    // Persist changes without triggering status transition
    RETURN updateDocumentContent(id, content, metadata)