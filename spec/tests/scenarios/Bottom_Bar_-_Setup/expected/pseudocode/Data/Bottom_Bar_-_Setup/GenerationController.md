/**
 * API Endpoint: POST /api/generate
 * Entry point for the ICF generation flow triggered from the Setup page.
 */
ENDPOINT POST /api/generate(request_body):
    // Extract protocol_id and template_value from request
    // Call GenerationService.initiateICFGeneration
    // Return 202 Accepted with the GenerateJobAccepted JSON schema
    RESPONSE 202 {
        "job_id": uuid,
        "protocol_id": string
    }