import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodTypeAny } from "zod";
import { AppError, UnauthorizedError, ValidationError, type ErrorEnvelope } from "../errors";
import { createLogger } from "../lib/logger";
import { repos } from "../db/documents";

const httpLog = createLogger("http");

export const requestLogger: RequestHandler = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    if (req.headers.accept === "text/event-stream") return;
    httpLog.info(`${req.method} ${req.originalUrl} → ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
};

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const appErr =
    err instanceof AppError ? err : new AppError(err instanceof Error ? err.message : "Unexpected error");
  if (appErr.status >= 500) httpLog.error(appErr.message, err);
  const body: ErrorEnvelope = { error: appErr.message, message: appErr.message, code: appErr.code, details: appErr.details };
  res.status(appErr.status).json(body);
}

/** Validate req.body against a Zod schema; replaces body with parsed output. */
export function validateBody(schema: ZodTypeAny, firstIssueMessage = false): RequestHandler {
  return (req, _res, next) => {
    const parsed = schema.safeParse(req.body ?? {});
    if (!parsed.success) {
      const msg = firstIssueMessage
        ? parsed.error.issues[0].message
        : parsed.error.issues.map((i) => `${i.path.join(".") || "body"}: ${i.message}`).join("; ");
      return next(new ValidationError(msg, parsed.error.issues));
    }
    req.body = parsed.data;
    next();
  };
}

export interface AuthedRequest extends Request {
  userId?: string;
}

/** Resolve "Authorization: Bearer <token>" against the session store. */
export function resolveSessionUserId(req: Request): string | null {
  const header = req.headers.authorization ?? "";
  const token = header.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;
  return repos.sessions.findOne({ token })?.userId ?? null;
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const userId = resolveSessionUserId(req);
  if (!userId) return next(new UnauthorizedError());
  (req as AuthedRequest).userId = userId;
  next();
};

/** Current actor for audit entries; falls back to the demo author. */
export function actorOf(req: Request): { id: string; name: string } {
  const id = resolveSessionUserId(req) ?? "u-1";
  const u = repos.users.findById(id);
  return { id, name: u ? `${u.firstName} ${u.lastName}` : "Unknown user" };
}

/** Read a route param as a string (Express 5 types params as string | string[]). */
export function param(req: Request, name: string): string {
  const v = (req.params as Record<string, string | string[] | undefined>)[name];
  return Array.isArray(v) ? v[0] : (v ?? "");
}

/** Wrap async handlers so rejections reach errorHandler. */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => unknown): RequestHandler =>
  (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
