/** Chronological feed of document events (most recent first). */
import { History } from "lucide-react";
import type { AuditEntryDTO } from "@shared/types";
import { Avatar, EmptyState } from "@shared/ui";
import { formatDateTime } from "@shared/lib";

const ACTION_TONE: [RegExp, string][] = [
  [/approv|publish/i, "approved"],
  [/submit/i, "review"],
  [/delete/i, "rejected"],
  [/ai/i, "ai"],
];
const toneFor = (action: string) => ACTION_TONE.find(([re]) => re.test(action))?.[1] ?? "draft";

export const AuditTrail = ({ logs }: { logs: AuditEntryDTO[] }) => {
  if (!logs.length) return <EmptyState title="No activity yet" icon={<History size={18} />} />;
  return (
    <ol className="audit-trail-container">
      {logs.map((log) => (
        <li key={log.id} className="audit-entry">
          <Avatar name={log.user_name} size={24} color={log.user_id === "ai" ? "var(--violet-600)" : undefined} />
          <div className="entry-details">
            <span className="entry-title">
              <b>{log.user_name}</b> · {log.action}
            </span>
            <span className="entry-meta">
              <span className={`badge badge--${toneFor(log.action)}`}>{log.action}</span>
              <span className="entry-timestamp">{formatDateTime(log.timestamp)}</span>
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
};
