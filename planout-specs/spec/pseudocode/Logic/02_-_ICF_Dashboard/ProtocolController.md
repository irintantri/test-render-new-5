/**
 * Handles retrieval of protocol data, search functionality, and dashboard statistics.
 */

// GET /api/protocol
// Fetches the list of protocols with optional sorting parameters
function getProtocols(sortBy: string, sortOrder: 'asc' | 'desc') {
    // Query Protocol table
    // Join with ICFFile table where Protocol.id = ICFFile.protocol_id
    // Apply sorting based on sortBy and sortOrder
    return database.query("SELECT * FROM Protocol LEFT JOIN ICFFile ON Protocol.id = ICFFile.protocol_id ORDER BY " + sortBy + " " + sortOrder);
}

// GET /api/search
// Searches protocols by name or ICF name
function searchProtocols(protocolName: string, icfName: string) {
    // Query Protocol table where protocol_name or icf_name matches input
    return database.query("SELECT * FROM Protocol WHERE protocol_name LIKE %" + protocolName + "% OR icf_name LIKE %" + icfName + "%");
}

// GET /api/stats
// Aggregates status counts for the dashboard header
function getDashboardStats() {
    // Calculate counts from Protocol.status
    const total = database.count("Protocol");
    const inReview = database.count("Protocol", { status: "In Review" });
    const approved = database.count("Protocol", { status: "Approved" });
    
    return {
        total,
        inReview,
        approved
    };
}

// Note: The following fields are mapped from the schema:
// Protocol: protocol_id, protocol_version, protocol_name, icf_name, icf_version, status, last_modified
// ICFFile: file_name, file_type, file_url, uploaded_at