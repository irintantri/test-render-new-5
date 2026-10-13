/**
 * Handles reviewer comments on the document.
 * Note: Fields like 'comment_text' are ORPHAN_FIELDs as they are not in the provided schema.
 */
export const CommentActions = ({ document_id }) => {
  const [comment, setComment] = useState(""); // ORPHAN_FIELD: comment_text

  const handlePostComment = () => {
    // Logic to post comment to backend
    // ORPHAN_FIELD: POST /api/documents/:id/comments
  };

  return (
    <div className="comments-panel">
      <textarea 
        value={comment} 
        onChange={(e) => setComment(e.target.value)}
        placeholder="Add feedback..."
      />
      <button onClick={handlePostComment}>Post Comment</button>
    </div>
  );
};

// Asset: assets/a1745dc6-62ab-4081-95eb-18ec7b877997.svg