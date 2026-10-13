/**
 * Logic for managing the Table of Contents (TOC) and section lifecycle.
 * The TOC is derived from the ordered list of Section entities.
 */

// Fetch all sections for the current document to populate the TOC
FUNCTION fetchDocumentSections(documentId: UUID):
    CALL GET /documents/:documentId/sections
    RETURN list of Section objects sorted by Section.position

// Handle creation of a new top-level section
FUNCTION addSection(documentId: UUID):
    payload = {
        "title": "New Section",
        "document_id": documentId
    }
    newSection = CALL POST /documents/:documentId/sections WITH payload
    
    // Trigger UI update:
    // 1. Append newSection to local state
    // 2. Set activeSectionId = newSection.id
    // 3. Scroll to element with ID newSection.id
    RETURN newSection

// Handle creation of a new subsection
// Note: Subsections are treated as Section entities with specific positioning logic
FUNCTION addSubsection(documentId: UUID):
    payload = {
        "title": "New Subsection",
        "document_id": documentId
    }
    newSubsection = CALL POST /documents/:documentId/sections WITH payload
    
    // Trigger UI update:
    // 1. Append newSubsection to local state
    // 2. Set activeSectionId = newSubsection.id
    // 3. Scroll to element with ID newSubsection.id
    RETURN newSubsection