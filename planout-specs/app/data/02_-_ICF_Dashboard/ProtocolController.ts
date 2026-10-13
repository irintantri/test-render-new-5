/**
 * Request/response contracts + handlers mapping to ProtocolRepository.
 *   GET /api/protocol?sort_by&sort_order&protocolName&ICFName → { data }
 *   GET /api/stats → { total, inReview, approved }
 */
import { z } from "zod";
import type { Request, Response } from "express";
import { makeValidator, zSortOrder } from "@shared/schema";
import { dashboardProtocolSchema, getDashboardProtocols, getDashboardStats } from "./ProtocolRepository";

export const protocolQuerySchema = z.object({
  sort_by: z.string().optional(),
  sort_order: zSortOrder.optional(),
  protocolName: z.string().optional(),
  ICFName: z.string().optional(),
});
export type ProtocolQuery = z.infer<typeof protocolQuerySchema>;
export const validate = makeValidator(protocolQuerySchema, "ProtocolQuery");

export const protocolListResponseSchema = z.object({ data: z.array(dashboardProtocolSchema) });
export type ProtocolListResponse = z.infer<typeof protocolListResponseSchema>;

export function handleGetProtocols(req: Request, res: Response) {
  const q = validate(req.query);
  const data = getDashboardProtocols({
    search: q.protocolName || q.ICFName,
    sortBy: q.sort_by,
    sortOrder: q.sort_order,
  });
  res.json({ data } satisfies ProtocolListResponse);
}

export function handleGetStats(_req: Request, res: Response) {
  res.json(getDashboardStats());
}
