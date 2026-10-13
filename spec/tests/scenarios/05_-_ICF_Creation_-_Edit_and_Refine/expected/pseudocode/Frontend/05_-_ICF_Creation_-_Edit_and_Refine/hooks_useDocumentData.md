/**
 * Data fetching hook using authoritative API definitions.
 */
export const useDocumentData = (id) => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // GET /api/documents/:id
    fetch(`/api/documents/${id}`)
      .then(res => res.json())
      .then(data => {
        setDocument(data);
        setLoading(false);
      });
  }, [id]);

  return { document, loading };
};

// ORPHAN_FIELD: sections (nested in metadata/content)
// ORPHAN_FIELD: isAiGenerated (metadata flag)
// ORPHAN_FIELD: number (section identifier)