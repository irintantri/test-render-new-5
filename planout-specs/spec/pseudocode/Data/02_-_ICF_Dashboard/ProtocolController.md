// API Endpoints mapping to Repository functions

// GET /api/protocol
// Query params: sort_by, sort_order, protocolName, ICFName
function handleGetProtocols(req, res) {
  const data = getDashboardProtocols({
    search: req.query.protocolName || req.query.ICFName,
    sortBy: req.query.sort_by,
    sortOrder: req.query.sort_order
  });
  
  res.json({ data });
}

// GET /api/stats
function handleGetStats(req, res) {
  const stats = getDashboardStats();
  res.json(stats);
}