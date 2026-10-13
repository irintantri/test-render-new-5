/** Maps the session User entity to the UserContext DTO for the global header. */
import { z } from "zod";
import { makeValidator } from "@shared/schema";
import { repos } from "@shared/db";
import { initials } from "@shared/lib";

export const userContextSchema = z.object({
  id: z.string().nullable(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string(),
  secondaryRole: z.string().nullable(),
  taskCounts: z.number().int().min(0),
  // apiService contract
  fullName: z.string(),
  initials: z.string(),
});
export type UserContext = z.infer<typeof userContextSchema>;
export const validate = makeValidator(userContextSchema, "UserContext");

export function getUserContext(sessionUserId: string | null): UserContext {
  const user = sessionUserId ? repos.users.findById(sessionUserId) : null;
  if (!user) {
    return validate({
      id: null, firstName: "User", lastName: "Name", role: "ICF Author", secondaryRole: null, taskCounts: 0,
      fullName: "User Name", initials: "UN",
    });
  }
  return validate({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    secondaryRole: user.secondaryRole,
    taskCounts: user.pendingNotifications,
    fullName: `${user.firstName} ${user.lastName}`,
    initials: initials(user.firstName, user.lastName),
  });
}
