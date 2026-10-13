// This service handles the retrieval of document structure for the Table of Contents.

/**
 * Fetches all sections for a specific document to populate the Table of Contents.
 * The TOC requires the hierarchy (sections and subsections) and their ordering.
 * 
 * @param documentId - The UUID of the document
 * @returns List of Section entities ordered by their position field
 */
function getDocumentSections(documentId: UUID): List<Section> {
    return db.query(
        "SELECT * FROM Section WHERE document_id = :documentId ORDER BY position ASC",
        { documentId }
    );
}