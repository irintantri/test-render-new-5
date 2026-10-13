// Logic layer for API interactions
SERVICE CommentService:
    FUNCTION addComment(payload):
        // payload: { documentId, sectionId, text, parentId? }
        RETURN API.post("/api/comments", payload)

    FUNCTION updateStatus(commentId, newStatus):
        RETURN API.patch("/api/comments/{commentId}/status", { status: newStatus })

    FUNCTION submitApproval(documentId):
        RETURN API.post("/api/documents/{documentId}/submit-approval")