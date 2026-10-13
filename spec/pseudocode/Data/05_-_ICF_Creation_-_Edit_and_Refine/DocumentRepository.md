// This layer handles the persistence logic for the ICF document lifecycle.

FUNCTION getDocumentById(id: UUID): Document {
    // Fetches the full document state for the editor
    RETURN DB.query("SELECT * FROM Document WHERE id = ?", [id]);
}

FUNCTION updateDocumentContent(id: UUID, content: Text, metadata: JSON): Document {
    // Updates the document content and refreshes the last_modified timestamp
    RETURN DB.execute(
        "UPDATE Document SET content = ?, metadata = ?, last_modified = NOW() WHERE id = ?",
        [content, metadata, id]
    );
}