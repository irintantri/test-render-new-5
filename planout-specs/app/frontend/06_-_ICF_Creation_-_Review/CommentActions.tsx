/**
 * Comments tab container. Renders the full comment panel when one is provided
 * (slot), otherwise a minimal composer posting to POST /api/documents/:id/comments.
 */
import { useState, type ReactNode } from "react";
import { apiClient } from "@shared/http";
import { Button, TextArea, useToast } from "@shared/ui";

export const CommentActions = ({ document_id, children, onPosted }: { document_id: string; children?: ReactNode; onPosted?: () => void }) => {
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);
  const notify = useToast();

  if (children) return <div className="comments-panel">{children}</div>;

  const handlePostComment = async () => {
    if (!comment.trim()) return;
    setPosting(true);
    try {
      await apiClient.post(`/api/documents/${document_id}/comments`, { comment_text: comment });
      setComment("");
      onPosted?.();
    } catch (e) {
      notify((e as Error).message, "error");
    } finally {
      setPosting(false);
    }
  };

  return (
    <div className="comments-panel" style={{ padding: 10, display: "flex", flexDirection: "column", gap: 8 }}>
      <TextArea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add feedback..." />
      <Button size="sm" loading={posting} disabled={!comment.trim()} onClick={handlePostComment}>
        Post Comment
      </Button>
    </div>
  );
};
