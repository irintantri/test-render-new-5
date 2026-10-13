/** GET /api/user/context → UserContext | 500 { message: "Failed to load user context" } */
import { Router } from "express";
import { z } from "zod";
import { makeValidator } from "@shared/schema";
import { resolveSessionUserId } from "@shared/middleware";
import { createLogger } from "@shared/lib";
import { getUserContext } from "./UserContextService";

const log = createLogger("user-context");

export const userContextErrorSchema = z.object({ message: z.literal("Failed to load user context") });
export type UserContextError = z.infer<typeof userContextErrorSchema>;
export const validate = makeValidator(userContextErrorSchema, "UserContextError");

export const router = Router();

router.get("/user/context", (req, res) => {
  try {
    res.status(200).json(getUserContext(resolveSessionUserId(req)));
  } catch (e) {
    log.error("context failed", e);
    res.status(500).json({ message: "Failed to load user context" } satisfies UserContextError);
  }
});
