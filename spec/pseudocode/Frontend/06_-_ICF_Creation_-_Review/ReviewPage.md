import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

/**
 * Main Review Page Component
 * Orchestrates the display of the ICF document, audit trail, and review actions.
 */
export const ReviewPage = () => {
  const { id } = useParams<{ id: string }>();

  // Fetch Document Data
  const { data: document, isLoading: isDocLoading } = useQuery(['document', id], () => 
    fetch(`/api/documents/${id}`).then(res => res.json())
  );

  // Fetch Audit Trail
  const { data: auditLogs, isLoading: isAuditLoading } = useQuery(['audit', id], () => 
    fetch(`/api/documents/${id}/audit`).then(res => res.json())
  );

  if (isDocLoading || isAuditLoading) return <LoadingSpinner />;

  return (
    <div className="review-page-layout">
      <GlobalNavigationHeader />
      <WrapperShell protocol_id={document.protocol_id} icf_name={document.icf_name} />
      <ProgressStepper currentStep="Review" />
      
      <div className="main-content-grid">
        <TableOfContents content={document.content} />
        
        <main className="document-viewer">
          {/* Render sections as cards */}
          {parseContentToSections(document.content).map((section) => (
            <DocumentSectionCard 
              key={section.id} 
              title={section.title} 
              content={section.content} 
              isAiGenerated={section.metadata?.is_ai_generated} 
            />
          ))}
        </main>

        <aside className="right-panel">
          <Tabs>
            <Tab label="Comments">
              <CommentActions document_id={id} />
            </Tab>
            <Tab label="Audit Trail">
              <AuditTrail logs={auditLogs} />
            </Tab>
          </Tabs>
        </aside>
      </div>

      <BottomBarReview />
    </div>
  );
};