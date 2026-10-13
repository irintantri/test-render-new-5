import React, { useState, useEffect } from 'react';
import { fetchProtocols, fetchTemplates, uploadReferenceDocument } from './api';

/**
 * Asset: assets/dd46e12b-d629-4482-aabd-05f3d2b04e38.svg
 */
export const SetupPage = () => {
  const [protocols, setProtocols] = useState([]);
  const [filteredProtocols, setFilteredProtocols] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [referenceDocs, setReferenceDocs] = useState({ 'Investigation Brochure': null, 'Lab Manual': null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([fetchProtocols(), fetchTemplates()])
      .then(([p, t]) => {
        setProtocols(p);
        setFilteredProtocols(p);
        setTemplates(t);
        setLoading(false);
      })
      .catch(() => setError("Failed to load setup data."));
  }, []);

  const handleSearch = (query) => {
    const q = query.toLowerCase();
    setFilteredProtocols(protocols.filter(p => 
      p.protocol_name.toLowerCase().includes(q) || p.protocol_id.toLowerCase().includes(q)
    ));
  };

  const handleUpload = async (docKind, file) => {
    if (!selectedProtocol) {
      setError("Select a protocol first");
      return;
    }
    // POST /api/reference/{protocolId}/upload
    const result = await uploadReferenceDocument(selectedProtocol.protocol_id, file, docKind);
    setReferenceDocs(prev => ({ ...prev, [docKind]: result }));
  };

  return (
    <div className="setup-container">
      <ErrorBanner message={error} />
      
      {/* Column 1: Protocol Selection */}
      <section>
        <input placeholder="Search protocols…" onChange={(e) => handleSearch(e.target.value)} />
        {loading ? <Spinner /> : filteredProtocols.map(p => (
          <div 
            key={p.id} 
            className={selectedProtocol?.id === p.id ? 'selected' : ''}
            onClick={() => setSelectedProtocol(p)}
          >
            <span>{p.protocol_id}</span>
            <span>{p.phase}</span>
            <h3>{p.protocol_name}</h3>
            <p>📖 {p.category}</p>
            {/* ORPHAN_FIELD: drug_code */}
          </div>
        ))}
      </section>

      {/* Column 2: Reference Documents */}
      <section>
        <p>Documents provide reference context for AI generation.</p>
        {['Investigation Brochure', 'Lab Manual'].map(kind => (
          <div key={kind}>
            <h4>{kind}</h4>
            {referenceDocs[kind] ? (
              <div>
                <span>{referenceDocs[kind].file_name}</span>
                <button onClick={() => setReferenceDocs(prev => ({...prev, [kind]: null}))}>×</button>
              </div>
            ) : (
              <>
                <button>Fetch DMS</button>
                <input type="file" onChange={(e) => handleUpload(kind, e.target.files[0])} />
              </>
            )}
          </div>
        ))}
      </section>

      {/* Column 3: Template Selection */}
      <section>
        {templates.map(t => (
          <div 
            key={t.id} 
            onClick={() => setSelectedTemplate(t.id)}
            className={selectedTemplate === t.id ? 'selected' : ''}
          >
            <h3>{t.name}</h3>
            {t.recommended && <span>✓ Recommended</span>}
            <p>{t.description}</p>
          </div>
        ))}
      </section>
    </div>
  );
};