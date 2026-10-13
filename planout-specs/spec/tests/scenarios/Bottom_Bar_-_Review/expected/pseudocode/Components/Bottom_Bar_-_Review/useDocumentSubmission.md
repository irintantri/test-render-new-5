/**
 * Hook: useDocumentSubmission
 * Manages the API interaction for submitting the document for approval.
 */

Hook useDocumentSubmission(documentId: string) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    Function submitForApproval() {
        setIsSubmitting(true);
        
        try {
            // API Call: POST /api/documents/{documentId}/submit-approval
            const response = API.post(`/api/documents/${documentId}/submit-approval`);
            
            if (response.success) {
                // Handle success (e.g., redirect to dashboard or show success toast)
                notify("Document submitted successfully");
            }
        } catch (error) {
            // Handle error
            notify("Failed to submit document");
        } finally {
            setIsSubmitting(false);
        }
    }

    return { submitForApproval, isSubmitting };
}