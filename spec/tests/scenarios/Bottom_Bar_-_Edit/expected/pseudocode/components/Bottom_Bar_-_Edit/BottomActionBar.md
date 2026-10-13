/**
 * Component: BottomActionBar
 * Renders the persistent navigation and action bar at the bottom of the Edit/Refine page.
 * Asset: assets/654ba2f3-e0f3-4925-a8d3-d0cb06fad61f.svg
 */
Component BottomActionBar(documentId, protocolId) {
    // Hook to handle API interactions and navigation
    const { submitForReview, isSubmitting } = useDocumentActions(documentId);

    Render Container (Fixed Bottom Position) {
        // Ghost button for navigation back to setup
        Button(variant="ghost", label="Back to Setup") {
            OnClick: NavigateTo("/setup/" + protocolId)
        }

        // Primary action button
        Button(variant="primary", label="Submit for Review", disabled=isSubmitting) {
            OnClick: async () => {
                await submitForReview();
            }
        }
    }
}