/**
 * Handles document retrieval and section-level modifications
 * for the Edit and Refine page.
 */

FUNCTION getDocumentDetails(documentId):
    // Fetch full document object including metadata and sections
    document = READ Document WHERE id = documentId
    RETURN document

FUNCTION deleteSection(documentId, sectionId):
    // Remove the specific section
    DELETE Section WHERE id = sectionId AND document_id = documentId
    
    // Re-sequence remaining sections to maintain order_index integrity
    remainingSections = READ Section WHERE document_id = documentId ORDER BY order_index ASC
    FOR index, section IN remainingSections:
        UPDATE Section SET order_index = index WHERE id = section.id
    
    RETURN SUCCESS

FUNCTION updateSectionContent(documentId, sectionId, newContent):
    // Persist manual text modifications
    updatedSection = UPDATE Section 
                     SET content = newContent 
                     WHERE id = sectionId AND document_id = documentId
    
    // Audit trail: Record manual edit
    // <!-- MISSING_FIELD: ActivityLog.action_type -->
    // <!-- MISSING_FIELD: ActivityLog.document_id -->
    CREATE ActivityLog(
        action_type = "MANUAL_EDIT",
        document_id = documentId,
        timestamp = CURRENT_TIMESTAMP
    )
    
    RETURN updatedSection

FUNCTION generateICFIdentifier():
    // Format: PROTO-year-three digit random number-ICF
    year = CURRENT_YEAR
    randomNumber = GENERATE_RANDOM_NUMBER(100, 999)
    icfId = "PROTO-" + year + "-" + randomNumber + "-ICF"
    
    // Verify uniqueness
    existing = READ Document WHERE icf_name = icfId
    IF existing IS NOT NULL:
        RETURN generateICFIdentifier() // Recursive retry if collision
    
    RETURN icfId