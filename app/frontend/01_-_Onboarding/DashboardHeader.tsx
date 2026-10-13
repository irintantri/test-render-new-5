/** Personalised welcome block: avatar, greeting, role badges, task summary. */
import type { TaskCounts } from "@shared/types";
import { initials } from "@shared/lib";
import { RoleBadge } from "./RoleBadge";

export interface DashboardHeaderProps {
  user: { firstName: string; lastName: string; avatarUrl: string | null; role: string; secondaryRole: string | null };
  tasks: TaskCounts;
}

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

export function DashboardHeader({ user, tasks }: DashboardHeaderProps) {
  return (
    <div className="welcome">
      <div className="welcome__avatar" aria-label={`${user.firstName} ${user.lastName}`}>
        {user.avatarUrl ? <img src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} /> : <span>{initials(user.firstName, user.lastName)}</span>}
      </div>

      <h1 className="welcome__title">Welcome back, {user.firstName}</h1>

      <div className="welcome__roles">
        <RoleBadge roleName={user.role} />
        {user.secondaryRole && (
          <>
            <span className="welcome__dot">·</span>
            <RoleBadge roleName={user.secondaryRole} />
          </>
        )}
      </div>

      <div className="welcome__tasks" aria-label="Task summary">
        <p>
          You have <b>{plural(tasks.draftsInProgress, "draft", "drafts")}</b> in progress and{" "}
          <b>{plural(tasks.itemsAwaitingReview, "item", "items")}</b> awaiting your review.
        </p>
        {(tasks.rejectedItems > 0 || tasks.approvedToPublish > 0) && (
          <p className="welcome__tasks-extra">
            {tasks.rejectedItems > 0 && <span>{plural(tasks.rejectedItems, "rejected item", "rejected items")}</span>}
            {tasks.rejectedItems > 0 && tasks.approvedToPublish > 0 && <span> · </span>}
            {tasks.approvedToPublish > 0 && <span>{plural(tasks.approvedToPublish, "item", "items")} approved to publish</span>}
          </p>
        )}
      </div>
    </div>
  );
}
