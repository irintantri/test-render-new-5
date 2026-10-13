/**
 * Service layer to interface with the Document entity.
 */

export const DocumentService = {
    /**
     * Updates the status of the document to trigger the workflow transition.
     */
    async submitForApproval(id: string) {
        // Perform the database write operation
        // Mapping to Document.status as per schema requirements
        return await db.Document.update({
            where: { id: id },
            data: { 
                status: "In Review",
                last_modified: new Date() 
            }
        });
    }
};