/**
 * Component: ReviewBottomBar
 * Asset: assets/51f28719-6e79-4309-8c86-767cbbd45bf3.svg
 * 
 * Renders the sticky bottom navigation bar on the Review page.
 * Provides navigation back to the Edit page and a conditional submission action.
 */

Component ReviewBottomBar(documentId: string, openCommentsCount: number) {
    
    // Hook to handle submission logic
    const { submitForApproval, isSubmitting } = useDocumentSubmission(documentId);
    const navigate = useNavigate();

    // Derived state for button label
    const submitButtonLabel = openCommentsCount > 0 
        ? `Submit for Approval (${openCommentsCount} open)` 
        : "Submit for Approval";

    return (
        <Container className="bottom-bar-review">
            <Button 
                variant="secondary" 
                onClick={() => navigate("/edit-page")}
            >
                Back to Edit
            </Button>

            <Button 
                variant="primary" 
                disabled={isSubmitting}
                onClick={() => submitForApproval()}
            >
                {submitButtonLabel}
            </Button>
        </Container>
    );
}