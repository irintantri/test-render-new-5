export const ProtocolTable = ({ data, onSort, sortConfig }) => {
  const columns = [
    { key: 'protocol_id', label: 'Protokoll-ID' },
    { key: 'protocol_version', label: 'Protokoll-Vers.' },
    { key: 'protocol_name', label: 'Protokollname' },
    { key: 'icf_name', label: 'ICF-Name' },
    { key: 'icf_version', label: 'ICF-Version' },
    { key: 'status', label: 'Status' },
    { key: 'last_modified', label: 'Zuletzt geändert' },
    { key: 'actions', label: 'Aktionen' }
  ];

  return (
    <table>
      <thead>
        <tr>
          {columns.map(col => (
            <th key={col.key} onClick={() => col.key !== 'actions' && onSort(col.key)}>
              {col.label}
              {sortConfig.key === col.key && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.map((row) => (
          <tr key={row.id}>
            <td>{row.protocol_id}</td>
            <td>{row.protocol_version}</td>
            <td>{row.protocol_name}</td>
            <td>{row.icf_name}</td>
            <td>{row.icf_version}</td>
            <td><StatusBadge status={row.status} /></td>
            <td>{row.last_modified}</td>
            <td>
              {row.status !== 'Archived' ? ( // Example logic for non-clickable rows
                <>
                  <button onClick={() => navigateToPreview(row.id)}>View</button>
                  <button onClick={() => navigateToEdit(row.id, row.status)}>Open</button>
                </>
              ) : '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};