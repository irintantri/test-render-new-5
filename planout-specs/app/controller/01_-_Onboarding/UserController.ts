/** GET /api/users/me — 401 { error: "Unauthorized" } | 200 profile + taskSummary */
import { Router, type Request } from "express";
import { GET_USER_ME, type UserMe } from "@app/data/01_-_Onboarding/UserController";
import { AuthenticationSessionService } from "./AuthenticationSessionService";

export function handleGetUsersMe(request: Request): { status: 200; body: UserMe } | { status: 401; body: { error: string } } {
  const userId = AuthenticationSessionService.getAuthenticatedUserId(request);
  if (!userId) return { status: 401, body: { error: "Unauthorized" } };
  return { status: 200, body: GET_USER_ME(userId) };
}

export const router = Router();

router.get("/users/me", (req, res) => {
  const result = handleGetUsersMe(req);
  res.status(result.status).json(result.body);
});
