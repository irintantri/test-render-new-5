/**
 * Authenticated user session context (GET /api/users/me payload).
 */
import { z } from "zod";
import { makeValidator, zNullableTimestamp } from "@shared/schema";
import { repos } from "@shared/db";
import { NotFoundError } from "@shared/errors";
import { getUserTaskCounts, taskCountsSchema } from "./TaskService";

export const userMeSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().nullable(),
  role: z.string(),
  secondaryRole: z.string().nullable(),
  locale: z.string(),
  timezone: z.string(),
  lastLoginAt: zNullableTimestamp,
  taskCounts: taskCountsSchema,
  /** Alias used by the Logic-lane contract */
  taskSummary: taskCountsSchema,
});
export type UserMe = z.infer<typeof userMeSchema>;
export const validate = makeValidator(userMeSchema, "UserMe");

/** GET_USER_ME — builds the response payload for an authenticated user id. */
export function GET_USER_ME(userId: string): UserMe {
  const profile = repos.users.findById(userId);
  if (!profile) throw new NotFoundError("User not found");
  const counts = getUserTaskCounts(userId);
  return validate({
    id: profile.id,
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    avatarUrl: profile.avatarUrl,
    role: profile.role,
    secondaryRole: profile.secondaryRole,
    locale: profile.locale,
    timezone: profile.timezone,
    lastLoginAt: profile.lastLoginAt,
    taskCounts: counts,
    taskSummary: counts,
  });
}
