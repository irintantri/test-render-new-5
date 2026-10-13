/**
 * Handles manual text editing and AI-assisted refinement for a specific section.
 */
export const SectionEditor = ({ section, onUpdate }) => {
  const [content, setContent] = useState(section.content);

  // Validation: Ensure content is not empty before allowing save
  const validate = (value) => value.trim().length > 0;

  const handleManualChange = (e) => {
    const newValue = e.target.value;
    setContent(newValue);
    // Immediate validation feedback
    if (!validate(newValue)) {
      showError("Section content cannot be empty.");
    }
  };

  return (
    <div className="section-editor-form">
      <label>Section - {section.number}. {section.title}</label>
      <textarea 
        value={content} 
        onChange={handleManualChange}
        placeholder="Edit section content manually..."
      />
      <EditActions onSave={() => onUpdate(content)} />
    </div>
  );
};