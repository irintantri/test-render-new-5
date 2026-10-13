/**
 * Review endpoints.
 *   GET /api/documents/:id        — served by the Edit & Refine router (superset view);
 *                                   handleGetDocument is the DTO-only variant at /api/review/documents/:id
 *   GET /api/documents/:id/audit
 */
import { Router, type Request, type Response } from "express";
import { asyncHandler, param } from "@shared/middleware";
import { getDocumentAuditTrail, getDocumentById } from "./DocumentService";

export const handleGetDocument = async (req: Request, res: Response) => {
  res.status(200).json(await getDocumentById(param(req, "id")));
};

export const handleGetAuditTrail = async (req: Request, res: Response) => {
  res.status(200).json(await getDocumentAuditTrail(param(req, "id")));
};

export const router = Router();
router.get("/review/documents/:id", asyncHandler(handleGetDocument));
router.get("/documents/:id/audit", asyncHandler(handleGetAuditTrail));
