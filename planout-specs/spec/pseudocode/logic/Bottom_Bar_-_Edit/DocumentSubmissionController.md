/**
 * Logic for handling the "Submit for Review" action on the Edit and Refine page.
 * This controller manages the transition of the document status to 'In Review'.
 */

function handleSubmitForReview(documentId: UUID) {
    // 1. Validate that the document exists in the system
    const document = Database.read("Document", { id: documentId });
    
    if (!document) {
        throw new Error("Document not found");
    }

    // 2. Update the document status to 'In Review'
    // Note: The status field is updated to reflect the transition from Draft to In Review
    const updatedDocument = Database.update("Document", {
        id: documentId,
        status: "In Review",
        last_modified: CurrentTimestamp()
    });

    // 3. Return the updated document state to the frontend for navigation
    return {
        id: updatedDocument.id,
        status: updatedDocument.status
    };
}