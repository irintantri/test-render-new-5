/**
 * Custom hook to manage the state of the version dropdown in the Review Action Bar.
 */
import { useState, useEffect } from 'react';

export function useDocumentVersions(documentId: string) {
    const [versions, setVersions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchVersions() {
            setLoading(true);
            try {
                const data = await getDocumentVersions(documentId);
                setVersions(data);
            } catch (error) {
                console.error("Failed to fetch document versions", error);
            } finally {
                setLoading(false);
            }
        }

        if (documentId) {
            fetchVersions();
        }
    }, [documentId]);

    return { versions, loading };
}