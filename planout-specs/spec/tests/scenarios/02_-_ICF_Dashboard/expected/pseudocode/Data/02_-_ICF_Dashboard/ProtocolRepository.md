// Logic to handle data retrieval for the ICF Dashboard

function getDashboardProtocols(filters: { search?: string, sortBy?: string, sortOrder?: 'asc' | 'desc' }) {
  // Query Protocol table
  // Apply filters: protocol_name or icf_name matching search string
  // Apply sorting: order by sortBy field in sortOrder direction
  return db.Protocol.findMany({
    orderBy: { [filters.sortBy]: filters.sortOrder }
  });
}

function getDashboardStats() {
  // Aggregate counts for the dashboard header
  const total = db.Protocol.count();
  const inReview = db.Protocol.count({ where: { status: 'In Review' } });
  const approved = db.Protocol.count({ where: { status: 'Approved' } });
  
  return { total, inReview, approved };
}