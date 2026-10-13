/**
 * Custom hook to manage the document lifecycle in the Edit and Refine view.
 */

export const useDocument = (id: string) => {
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchDocumentById(id);
        setDocument(data);
      } catch (error) {
        // Handle error state (e.g., log to monitoring, show toast)
        console.error("Error loading document:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  return { document, isLoading };
};