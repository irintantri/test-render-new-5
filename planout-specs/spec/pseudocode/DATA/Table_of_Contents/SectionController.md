// API endpoints for managing document structure and TOC data.

/**
 * GET /api/documents/:id/sections
 * Returns the ordered list of sections used to render the Table of Contents.
 */
function handleGetSections(request: Request): Response {
    const documentId = request.params.id;
    const sections = getDocumentSections(documentId);
    return Response.json(sections);
}

/**
 * POST /api/documents/:id/sections
 * Creates a new section or subsection.
 * The frontend expects the updated list of sections to refresh the TOC.
 */
function handleCreateSection(request: Request): Response {
    const { documentId, title, parentId } = request.body;
    
    // Logic to determine position: find max position for current document/parent
    const newPosition = calculateNextPosition(documentId, parentId);
    
    const newSection = db.insert("Section", {
        document_id: documentId,
        title: title,
        position: newPosition,
        status: "draft",
        version: "1.0"
    });
    
    return Response.json(newSection, 201);
}