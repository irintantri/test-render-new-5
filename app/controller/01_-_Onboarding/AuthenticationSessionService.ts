/**
 * Validates the current session token.
 * Also exposes POST /api/auth/session — demo sign-in that issues the session token.
 */
import { Router, type Request } from "express";
import { resolveSessionUserId } from "@shared/middleware";
import { DEMO_TOKEN, DEMO_USER_ID, repos } from "@shared/db";
import { nowIso } from "@shared/lib";

export const AuthenticationSessionService = {
  /** Returns the user id for a valid Bearer token, otherwise null. */
  getAuthenticatedUserId: (request: Request): string | null => resolveSessionUserId(request),
};

export const router = Router();

router.post("/auth/session", (_req, res) => {
  repos.users.update(DEMO_USER_ID, { lastLoginAt: nowIso() });
  res.status(201).json({ token: DEMO_TOKEN, userId: DEMO_USER_ID });
});

router.delete("/auth/session", (_req, res) => {
  res.status(204).end();
});
