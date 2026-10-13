/**
 * Handles the initiation of the ICF generation process.
 * Triggered by the "Generate ICF" action in the Setup Bottom Bar.
 */
function handleGenerateICF(request) {
    // 1. Validate input
    const { protocol_id, template_id } = request.body;
    
    if (!protocol_id || !template_id) {
        return respond(400, { error: "Missing required protocol or template identifiers." });
    }

    // 2. Initialize the GenerationJob record
    const newJob = {
        id: generateUUID(),
        protocol_id: protocol_id,
        status: "PENDING",
        created_at: getCurrentTimestamp()
    };

    // 3. Persist to database
    saveToDatabase("GenerationJob", newJob);

    // 4. Trigger asynchronous parsing pipeline
    // The parsing logic is decoupled to allow the API to return the job ID immediately
    triggerParsingPipeline(newJob.id, template_id);

    // 5. Return the job status to the frontend
    return respond(200, {
        id: newJob.id,
        status: newJob.status,
        created_at: newJob.created_at
    });
}