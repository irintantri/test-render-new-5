/**
 * Controller endpoints for the ICF Review process.
 */

// GET /api/documents/:id
// Returns the document object to populate the ReviewPage UI
export const handleGetDocument = async (req, res) => {
    const { id } = req.params;
    const document = await getDocumentById(id);
    res.status(200).json(document);
};

// GET /api/documents/:id/audit
// Returns the audit history for the ReviewPage Audit tab
export const handleGetAuditTrail = async (req, res) => {
    const { id } = req.params;
    const auditTrail = await getDocumentAuditTrail(id);
    res.status(200).json(auditTrail);
};