/**
 * Handles data retrieval and persistence for the Comments tab.
 */
FUNCTION fetchCommentsByDocument(documentId):
    // Retrieve all comments associated with the document_id
    // Includes both top-level comments and nested replies
    RETURN SELECT * FROM COMMENT 
    WHERE document_id = documentId 
    ORDER BY timestamp ASC

FUNCTION createComment(commentData):
    // Persist a new COMMENT record
    // commentData includes: document_id, section, owner, comment_text, status, parent_id, timestamp
    INSERT INTO COMMENT (id, document_id, section, owner, comment_text, status, parent_id, timestamp)
    VALUES (
        UUID(), 
        commentData.document_id, 
        commentData.section, 
        commentData.owner, 
        commentData.comment_text, 
        'open', 
        commentData.parent_id, 
        CURRENT_TIMESTAMP
    )
    RETURN newly_created_comment

FUNCTION updateCommentStatus(commentId, newStatus):
    // Update the status of a specific comment (e.g., 'open' to 'resolved')
    UPDATE COMMENT 
    SET status = newStatus 
    WHERE id = commentId
    RETURN updated_comment