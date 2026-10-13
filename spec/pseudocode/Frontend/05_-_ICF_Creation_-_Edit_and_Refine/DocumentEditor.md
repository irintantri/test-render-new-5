import React, { useState, useEffect } from 'react';
import { useDocumentData } from './hooks/useDocumentData';

/**
 * Main container for the ICF Edit and Refine feature.
 * Asset: assets/ecabe235-1192-4f14-bb90-3389f1275208.svg
 */
export const DocumentEditor = ({ documentId }) => {
  const { document, loading, error } = useDocumentData(documentId);
  const [activeSection, setActiveSection] = useState(null);

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message="Failed to load document" />;

  return (
    <div className="editor-shell">
      <GlobalNavigationHeader />
      <ProgressStepper currentStep="Edit and Refine" />
      
      <main className="editor-layout">
        <aside className="toc-sidebar">
          <TableOfContents sections={document.metadata.sections} onSelect={setActiveSection} />
        </aside>
        
        <section className="document-canvas">
          {document.content.sections.map((section) => (
            <DocumentSectionCard 
              key={section.id} 
              data={section} 
              onEditWithAI={() => setActiveSection(section)} 
            />
          ))}
        </section>

        <aside className="ai-assistant-panel">
          {activeSection && (
            <SectionEditor 
              section={activeSection} 
              onUpdate={(newContent) => handleUpdate(activeSection.id, newContent)} 
            />
          )}
        </aside>
      </main>

      <BottomBarEdit documentId={documentId} />
    </div>
  );
};