/**
 * API Controller for the AI Document Editor endpoints.
 */

async function postAISectionRefinement(req, res) {
    const { id: documentId, sectionId } = req.params;
    const { prompt } = req.body;

    try {
        const result = await handleAISectionRefinement(documentId, sectionId, prompt);
        
        res.status(200).json({
            id: result.id,
            document_id: result.document_id,
            title: result.title,
            ai_label: "AI Refined",
            status: result.status,
            content: result.content,
            position: result.position,
            version: result.version
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to refine section with AI" });
    }
}