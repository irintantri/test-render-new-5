/**
 * Fetches all comments for a specific document.
 * Handles state management for the comment thread.
 */
function fetchComments(documentId: UUID) {
    const response = API.get("/api/comments", { params: { documentId } });
    
    // Store in local state for the UI to render
    // If component unmounts, clear state and cancel pending requests
    return response.data;
}

/**
 * Persists a new comment or reply to the database.
 */
function createComment(commentData: {
    document_id: UUID,
    section: string,
    owner: string,
    comment_text: string,
    parent_id?: UUID
}) {
    // Validate content before sending
    if (!commentData.comment_text) throw new Error("Comment text is required");
    
    const newComment = API.post("/api/comments", commentData);
    
    // Return the saved record to update the UI thread in real-time
    return newComment.data;
}