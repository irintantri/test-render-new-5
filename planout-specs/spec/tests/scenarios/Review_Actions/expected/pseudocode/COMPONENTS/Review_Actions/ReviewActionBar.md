// Component: The main container for the Review Actions bar.
// Asset: assets/f754b406-69db-48ed-afd2-6d63f1fa2aae.svg

Component ReviewActionBar(documentId, currentVersionId) {
    // Fetch document metadata and version history
    const { data: docMetadata } = useDocumentMetadata(documentId);
    const { data: versions, isLoading } = useVersionHistory(documentId);
    
    // State for comparison mode
    const [isCompareOpen, setIsCompareOpen] = useState(false);

    Render {
        Container(className="review-action-bar") {
            // Document Name/ICF ID
            Text(docMetadata.name) 
            
            // Current Version Label
            Label(text=`v${currentVersionId} ${docMetadata.status}`)
            
            // Compare Versions Dropdown Trigger
            Button(onClick=toggleCompare) {
                Icon("compare-icon")
                Text("Compare Versions")
            }

            // Conditional Dropdown
            If (isCompareOpen) {
                VersionDropdown(
                    versions=versions, 
                    onSelect=(selectedVersion) => triggerComparison(selectedVersion)
                )
            }
        }
    }
}