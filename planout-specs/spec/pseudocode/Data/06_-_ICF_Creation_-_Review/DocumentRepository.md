/**
 * Fetches the full document state for the Review screen.
 * Maps to GET /api/documents/:id
 */
FUNCTION getDocumentById(id: UUID): DOCUMENT {
    RETURN DB.query("SELECT * FROM DOCUMENT WHERE id = ?", [id]);
}

/**
 * Fetches the chronological audit trail for a specific document.
 * Maps to GET /api/documents/:id/audit
 */
FUNCTION getAuditTrailByDocumentId(documentId: UUID): LIST<AUDIT_LOG> {
    RETURN DB.query(
        "SELECT * FROM AUDIT_LOG WHERE document_id = ? ORDER BY timestamp DESC", 
        [documentId]
    );
}