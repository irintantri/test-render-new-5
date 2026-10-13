/**
 * Reviewer approval popover: lists reviewers with an "Act" action and shows
 * readiness (all comments resolved AND all reviewers acted).
 */
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Clock3, Users } from "lucide-react";
import { useApi } from "@shared/hooks";
import { Avatar, Button, useToast } from "@shared/ui";
import { canSubmitForApproval, countOpenComments } from "@app/controller/Comment_Actions/ApprovalLogic";
import { CommentService } from "./CommentService";
import "./comments.css";

export function ApprovalGate({ documentId, refreshKey = 0, onChange }: { documentId: string; refreshKey?: number; onChange?: () => void }) {
  const notify = useToast();
  const [open, setOpen] = useState(false);
  const [acting, setActing] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const { data: reviewers, reload: reloadReviewers } = useApi(() => CommentService.listReviewers(documentId), [documentId]);
  const { data: comments, reload: reloadComments } = useApi(() => CommentService.list(documentId), [documentId]);

  useEffect(() => {
    if (refreshKey) {
      reloadComments();
      reloadReviewers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  useEffect(() => {
    const close = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const list = reviewers ?? [];
  const actedCount = list.filter((r) => r.acted).length;
  const openCount = countOpenComments(comments ?? []);
  const isReadyForApproval = canSubmitForApproval(comments ?? [], list);

  const act = async (id: string) => {
    setActing(id);
    try {
      await CommentService.markReviewerActed(id);
      await reloadReviewers();
      onChange?.();
    } catch {
      notify("Failed to update reviewer status", "error");
    } finally {
      setActing(null);
    }
  };

  return (
    <div className="approval-gate" ref={ref}>
      <Button variant="outline" icon={isReadyForApproval ? <CheckCircle2 color="var(--green-btn)" /> : <Users />} onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        Reviewers {actedCount}/{list.length}
      </Button>
      {open && (
        <div className="approval-gate__pop" role="dialog" aria-label="Approval readiness">
          <div className="approval-gate__title">Approval readiness</div>
          <ul>
            {list.map((r) => (
              <li key={r.id}>
                <Avatar name={r.name} size={24} />
                <div className="approval-gate__who">
                  <b>{r.name}</b>
                  <span>{r.role}</span>
                </div>
                {r.acted ? (
                  <span className="badge badge--approved">
                    <CheckCircle2 /> Approved
                  </span>
                ) : (
                  <Button size="sm" variant="outline" loading={acting === r.id} onClick={() => act(r.id)}>
                    Act
                  </Button>
                )}
              </li>
            ))}
          </ul>
          <div className={`approval-gate__status ${isReadyForApproval ? "is-ready" : ""}`}>
            {isReadyForApproval ? <CheckCircle2 size={14} /> : <Clock3 size={14} />}
            {isReadyForApproval
              ? "Ready to submit for approval"
              : [openCount > 0 && `${openCount} open comment${openCount === 1 ? "" : "s"}`, actedCount < list.length && `${list.length - actedCount} reviewer(s) pending`].filter(Boolean).join(" · ")}
          </div>
        </div>
      )}
    </div>
  );
}
