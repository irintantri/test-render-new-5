/**
 * Logic for handling the ICF Preview and Publication lifecycle.
 */

// 1. Fetch data on page load
// Triggered when the user navigates to the Preview screen.
async function loadICFPreview(documentId: string) {
    try {
        // Fetch metadata (e.g., title, status)
        const metadata = await fetch(`/api/documents/${documentId}`, { method: 'GET' });
        
        // Fetch content sections for the simulated PDF view
        const sections = await fetch(`/api/documents/${documentId}/sections`, { method: 'GET' });
        
        return {
            metadata: await metadata.json(),
            sections: await sections.json()
        };
    } catch (error) {
        handleError("Failed to load ICF preview data", error);
    }
}

// 2. Publish ICF
// Triggered when the user clicks the "Publish" button.
async function publishICF(documentId: string) {
    // Ensure approval gates are checked before calling the API
    // (Logic assumes approval status is verified by the UI/State before invocation)
    
    try {
        const response = await fetch('/api/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ documentId })
        });

        if (response.ok) {
            // Return success status to trigger the "ICF Published Successfully" badge
            return { success: true, data: await response.json() };
        } else {
            throw new Error("Publishing failed");
        }
    } catch (error) {
        handleError("Error during publication", error);
        return { success: false };
    }
}

function handleError(message: string, error: any) {
    console.error(message, error);
    // Logic to trigger notification system or UI error state
}