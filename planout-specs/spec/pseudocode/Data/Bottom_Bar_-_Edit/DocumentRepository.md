/**
 * Handles persistence logic for the Document entity.
 * Used by the Edit and Refine page to manage state transitions.
 */

FUNCTION updateDocumentContent(id: UUID, content: String, metadata: JSON):
    UPDATE Document
    SET 
        content = content,
        metadata = metadata,
        last_modified = CURRENT_TIMESTAMP
    WHERE id = id
    RETURN Document

FUNCTION transitionToInReview(id: UUID):
    UPDATE Document
    SET 
        status = 'In Review',
        last_modified = CURRENT_TIMESTAMP
    WHERE id = id
    RETURN Document

FUNCTION getDocumentById(id: UUID):
    SELECT * FROM Document WHERE id = id