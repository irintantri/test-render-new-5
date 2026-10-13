/**
 * Service to handle interactions for the Document Edit Action Bar.
 * Maps UI intent to API endpoints defined in the canvas.
 */

export const DocumentActionsService = {
  /**
   * Fetches the full document state for the Edit/Refine page.
   * @param documentId - The UUID of the document to load.
   */
  async getDocument(documentId: string): Promise<Document> {
    const response = await fetch(`/api/documents/${documentId}`);
    return response.json();
  },

  /**
   * Persists manual text modifications to a specific section.
   * Triggers a MANUAL_EDIT log entry on the server.
   */
  async updateSection(documentId: string, sectionId: string, content: string): Promise<void> {
    await fetch(`/api/documents/${documentId}/sections/${sectionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
  },

  /**
   * Permanently removes a section from the document.
   * Requires confirmation in the UI layer before calling.
   */
  async deleteSection(documentId: string, sectionId: string): Promise<void> {
    await fetch(`/api/documents/${documentId}/sections/${sectionId}`, {
      method: 'DELETE'
    });
  }
};