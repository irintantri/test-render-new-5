import React, { useState, useEffect } from 'react';
import { fetchDocument, fetchDocumentSections, publishDocument } from './api';

/**
 * ICFPreviewPage: Renders the final simulated PDF view of the ICF.
 * Asset: assets/296abc29-be91-4796-bd36-496013ee60e5.svg
 */
export const ICFPreviewPage = ({ documentId }) => {
  const [documentData, setDocumentData] = useState(null);
  const [sections, setSections] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100); // <!-- ORPHAN_FIELD: zoomLevel -->

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Fetch document metadata (id, title, status, created_at)
      const doc = await fetchDocument(documentId);
      // Fetch sections content
      const sec = await fetchDocumentSections(documentId);
      
      setDocumentData(doc);
      setSections(sec.sections);
      setIsLoading(false);
    };
    loadData();
  }, [documentId]);

  const handlePublish = async () => {
    try {
      const response = await publishDocument({ documentId });
      if (response.status === 'success') {
        setIsPublished(true);
      }
    } catch (error) {
      console.error("Publishing failed", error);
    }
  };

  if (isLoading) return <div>Loading Preview...</div>;

  return (
    <div className="wrapper-shell">
      <GlobalNavigationHeader />
      <ProgressStepper />
      
      <div className="document-toolbar">
        <span>{documentData.title}</span> <!-- Field: title -->
        <span>Page 1 of 1</span> <!-- ORPHAN_FIELD: pageCount -->
        <button onClick={() => setZoomLevel(prev => prev + 10)}>+</button>
        <button onClick={() => setZoomLevel(prev => prev - 10)}>-</button>
      </div>

      <div className="icf-pdf-container" style={{ transform: `scale(${zoomLevel/100})` }}>
        <h1>INFORMED CONSENT FORM</h1>
        {sections.map((section, index) => (
          <div key={index} className="section">
            <h3>{index + 1}. {section.title}</h3>
            <p>{section.content}</p> <!-- ORPHAN_FIELD: content -->
          </div>
        ))}
      </div>

      <div className="action-footer">
        <button onClick={() => window.history.back()}>Back to Review</button>
        
        {isPublished ? (
          <div className="success-badge">ICF Published Successfully</div>
        ) : (
          <button onClick={handlePublish}>Publish</button>
        )}
      </div>
    </div>
  );
};