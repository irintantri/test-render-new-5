/**
 * Service to handle retrieval of ICF documents and their associated audit trails
 * for the ReviewPage.
 */

// Fetches the full document details for the ReviewPage center panel
async function getDocumentById(documentId: string) {
    // Query DOCUMENT table where id matches documentId
    const document = await db.DOCUMENT.findUnique({
        where: { id: documentId }
    });

    if (!document) {
        throw new Error("Document not found");
    }

    return {
        id: document.id,
        protocol_id: document.protocol_id,
        icf_name: document.icf_name,
        icf_version: document.icf_version,
        template: document.template,
        status: document.status,
        content: document.content,
        metadata: document.metadata,
        published_at: document.published_at,
        created_at: document.created_at,
        last_modified: document.last_modified
    };
}

// Fetches the chronological audit trail for the ReviewPage Audit tab
async function getDocumentAuditTrail(documentId: string) {
    // Query AUDIT_LOG table for all entries associated with the document
    // Ordered by timestamp descending to show the most recent actions first
    const auditLogs = await db.AUDIT_LOG.findMany({
        where: { document_id: documentId },
        orderBy: { timestamp: 'desc' }
    });

    return auditLogs.map(log => ({
        id: log.id,
        user_id: log.user_id,
        action: log.action,
        timestamp: log.timestamp,
        resource_id: log.resource_id
    }));
}