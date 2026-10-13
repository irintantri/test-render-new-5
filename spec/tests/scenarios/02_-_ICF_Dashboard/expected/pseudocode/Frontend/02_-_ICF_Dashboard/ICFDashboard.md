import React, { useState, useEffect } from 'react';
import { useFetch } from './hooks/useFetch'; // Hypothetical hook for API calls

/**
 * Asset: assets/9c78bc3d-f8fc-443c-a56d-64eda149905a.svg
 * ICF-Dashboard Main View
 */
export const ICFDashboard = () => {
  const [sortConfig, setSortConfig] = useState({ key: 'last_modified', direction: 'desc' });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch Stats
  const { data: stats, loading: statsLoading } = useFetch('/api/stats');
  
  // Fetch Protocols (Conditional based on search)
  const endpoint = searchQuery ? '/api/search' : '/api/protocol';
  const { data: protocols, loading: tableLoading } = useFetch(endpoint);

  const handleSort = (field) => {
    let direction = 'asc';
    if (sortConfig.key === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: field, direction });
  };

  return (
    <div className="dashboard-container">
      <Header />
      
      <div className="stats-row">
        <StatCard label="Total Consents" value={statsLoading ? '—' : stats?.total} />
        <StatCard label="In Review" value={statsLoading ? '—' : stats?.inReview} />
        <StatCard label="Approved" value={statsLoading ? '—' : stats?.approved} />
      </div>

      <SearchBar onSearch={setSearchQuery} />

      <ProtocolTable 
        data={protocols} 
        onSort={handleSort} 
        sortConfig={sortConfig} 
      />
    </div>
  );
};