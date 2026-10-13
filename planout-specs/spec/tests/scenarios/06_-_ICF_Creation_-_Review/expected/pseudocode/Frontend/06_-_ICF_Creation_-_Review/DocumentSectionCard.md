/**
 * Renders individual document sections as cards.
 */
export const DocumentSectionCard = ({ title, content, isAiGenerated }) => {
  return (
    <div className="section-card">
      <div className="card-header">
        <span className="section-title"><strong>{title}</strong></span>
        {isAiGenerated && <Badge icon="sparkles">AI Generated</Badge>}
      </div>
      <div className="card-body">
        <IcfMarkdown content={content} />
      </div>
    </div>
  );
};