/** Threaded comments with status toggles, inline replies, and a pinned composer. */
import { useEffect, useMemo, useState } from "react";
import { CornerUpLeft, MessageSquare, Send } from "lucide-react";
import { useApi } from "@shared/hooks";
import { Avatar, EmptyState, PanelSpinner, useToast } from "@shared/ui";
import { formatTime, COMMENT_STATUS_OPTIONS } from "./commentUtils";
import type { Comment, CommentStatus, SectionView } from "@shared/types";
import { countOpenComments } from "@app/controller/Comment_Actions/ApprovalLogic";
import { CommentComposer, type SectionOption } from "./CommentComposer";
import { CommentService } from "./CommentService";
import "./comments.css";

function ReplyItem({ reply }: { reply: Comment }) {
  return (
    <div className="reply">
      <Avatar name={reply.owner} size={18} />
      <div>
        <div className="comment-card__who">
          <b>{reply.owner}</b> <span>{formatTime(reply.timestamp)}</span>
        </div>
        <p className="comment-card__text">{reply.comment_text}</p>
      </div>
    </div>
  );
}

function InlineReplyForm({ onSubmit }: { onSubmit: (text: string) => Promise<void> }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const send = async () => {
    if (!text.trim()) return;
    setBusy(true);
    try {
      await onSubmit(text.trim());
      setText("");
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="reply-form">
      <input autoFocus placeholder="Write a reply…" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} aria-label="Reply" />
      <button onClick={send} disabled={!text.trim() || busy} aria-label="Send reply">
        <Send size={12} />
      </button>
    </div>
  );
}

export function CommentCard({
  comment,
  replies,
  onStatusChange,
  onReply,
}: {
  comment: Comment;
  replies: Comment[];
  onStatusChange: (status: CommentStatus) => void;
  onReply: (text: string) => Promise<void>;
}) {
  const [replyFormVisible, setReplyFormVisible] = useState(false);
  return (
    <article className="comment-card">
      <div className="comment-card__section">{comment.section}</div>
      <div className="comment-card__main">
        <Avatar name={comment.owner} size={20} />
        <div>
          <div className="comment-card__who">
            <b>{comment.owner}</b> <span>{formatTime(comment.timestamp)}</span>
          </div>
          <p className="comment-card__text">{comment.comment_text}</p>
        </div>
      </div>

      <div className="status-toggle" role="radiogroup" aria-label="Comment status">
        {COMMENT_STATUS_OPTIONS.map((s) => (
          <button key={s} role="radio" aria-checked={comment.status === s} className={`status-toggle__opt ${comment.status === s ? `is-${s.toLowerCase()}` : ""}`} onClick={() => comment.status !== s && onStatusChange(s)}>
            {s}
          </button>
        ))}
      </div>

      {replies.length > 0 && (
        <div className="comment-card__replies">
          <div className="comment-card__reply-count">
            {replies.length} {replies.length === 1 ? "reply" : "replies"}
          </div>
          {replies.map((r) => (
            <ReplyItem key={r.id} reply={r} />
          ))}
        </div>
      )}

      <button className="comment-card__reply-btn" onClick={() => setReplyFormVisible((v) => !v)}>
        <CornerUpLeft size={13} /> Reply
      </button>
      {replyFormVisible && (
        <InlineReplyForm
          onSubmit={async (text) => {
            await onReply(text);
            setReplyFormVisible(false);
          }}
        />
      )}
    </article>
  );
}

export function CommentPanel({
  documentId,
  sections,
  onOpenCountChange,
  onActivity,
}: {
  documentId: string;
  sections: SectionView[];
  onOpenCountChange?: (n: number) => void;
  onActivity?: () => void;
}) {
  const notify = useToast();
  const { data: comments, loading, reload, setData } = useApi(() => CommentService.list(documentId), [documentId]);
  const openCommentCount = useMemo(() => countOpenComments(comments ?? []), [comments]);

  useEffect(() => {
    onOpenCountChange?.(openCommentCount);
  }, [openCommentCount, onOpenCountChange]);

  const sectionOptions: SectionOption[] = useMemo(
    () => sections.map((s) => ({ id: s.id, label: s.parent_id ? s.title : `${s.number}. ${s.title}` })),
    [sections],
  );

  const topLevel = (comments ?? []).filter((c) => !c.parent_id);
  const repliesOf = (id: string) => (comments ?? []).filter((c) => c.parent_id === id);

  const handleStatus = async (c: Comment, status: CommentStatus) => {
    setData((prev) => prev?.map((x) => (x.id === c.id ? { ...x, status } : x)) ?? prev);
    try {
      await CommentService.updateStatus(c.id, status);
      onActivity?.();
    } catch (e) {
      notify(`Failed to update status: ${(e as Error).message}`, "error");
      reload();
    }
  };

  const handleAdd = async (text: string, sectionLabel: string, parentId?: string) => {
    try {
      await CommentService.addComment({ documentId, sectionId: sectionLabel, text, parentId });
      await reload();
      onActivity?.();
    } catch (e) {
      notify((e as Error).message, "error");
      throw e;
    }
  };

  return (
    <div className="comment-panel">
      <div className="comment-panel__list">
        {loading && !comments ? (
          <PanelSpinner label="Loading comments…" />
        ) : topLevel.length === 0 ? (
          <EmptyState title="No comments yet" description="Start the review by adding a comment below." icon={<MessageSquare size={18} />} />
        ) : (
          topLevel.map((c) => (
            <CommentCard key={c.id} comment={c} replies={repliesOf(c.id)} onStatusChange={(s) => handleStatus(c, s)} onReply={(text) => handleAdd(text, c.section, c.id)} />
          ))
        )}
      </div>
      <CommentComposer sections={sectionOptions} onAdd={({ text, section }) => handleAdd(text, section?.label ?? "General")} />
    </div>
  );
}
