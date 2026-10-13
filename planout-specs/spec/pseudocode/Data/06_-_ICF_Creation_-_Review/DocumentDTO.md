/**
 * Data Transfer Object representing the Document state.
 * Used for both initial load and subsequent review updates.
 */
TYPE DocumentDTO = {
    id: String,
    protocol_id: String,
    icf_name: String,
    icf_version: String,
    template: String | Null,
    status: String,
    content: String | Null,
    metadata: Object,
    published_at: DateTime | Null,
    created_at: DateTime,
    last_modified: DateTime
}

/**
 * Data Transfer Object representing an Audit entry.
 */
TYPE AuditEntryDTO = {
    userId: String,
    action: String,
    timestamp: DateTime,
    resourceId: String
}