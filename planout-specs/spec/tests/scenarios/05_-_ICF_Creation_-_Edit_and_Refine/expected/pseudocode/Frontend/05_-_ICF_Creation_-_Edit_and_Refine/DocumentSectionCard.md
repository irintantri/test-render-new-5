/**
 * Renders individual sections with read/edit states.
 */
export const DocumentSectionCard = ({ data, onEditWithAI }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  return (
    <div className="section-card">
      <div className="section-header">
        <h3>{data.title}</h3>
        {data.isAiGenerated && <Badge icon="sparkles">AI Generated</Badge>}
        <button onClick={onEditWithAI}>
          <Icon name="sparkles" /> Edit with AI
        </button>
      </div>

      <div className="section-body">
        {isGenerating && (
          <div className="ai-overlay">
            <Spinner />
            <p>AI is updating this section…</p>
          </div>
        )}
        <IcfMarkdown content={data.content} />
      </div>
    </div>
  );
};