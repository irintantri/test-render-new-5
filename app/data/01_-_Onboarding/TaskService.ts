/**
 * Service to calculate real-time task counts for the user dashboard.
 */
import { z } from "zod";
import { makeValidator } from "@shared/schema";
import { repos } from "@shared/db";

export const taskCountsSchema = z.object({
  draftsInProgress: z.number().int().min(0),
  itemsAwaitingReview: z.number().int().min(0),
  rejectedItems: z.number().int().min(0),
  approvedToPublish: z.number().int().min(0),
});
export type TaskCounts = z.infer<typeof taskCountsSchema>;
export const validate = makeValidator(taskCountsSchema, "TaskCounts");

/** GET_USER_TASK_COUNTS — aggregate counts across content modules. */
export function getUserTaskCounts(userId: string): TaskCounts {
  const docs = repos.documents;
  return validate({
    draftsInProgress: docs.count({ status: "Draft", owner_id: userId }),
    // "PENDING" content == documents In Review assigned to this reviewer
    itemsAwaitingReview: docs.count({ status: "In Review", reviewer_id: userId }),
    rejectedItems: docs.count({ status: "Rejected", owner_id: userId }),
    approvedToPublish: docs.count((d) => d.status === "Approved" && d.owner_id === userId && !d.published_at),
  });
}
