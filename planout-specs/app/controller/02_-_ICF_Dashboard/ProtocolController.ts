/**
 * Protocol data, search, and dashboard statistics.
 *   GET /api/protocol?sort_by&sort_order
 *   GET /api/search?protocolName&icfName
 *   GET /api/stats
 */
import { Router } from "express";
import { handleGetProtocols, handleGetStats } from "@app/data/02_-_ICF_Dashboard/ProtocolController";
import { getDashboardProtocols } from "@app/data/02_-_ICF_Dashboard/ProtocolRepository";

export function searchProtocols(protocolName: string, icfName: string, sortBy?: string, sortOrder?: "asc" | "desc") {
  return getDashboardProtocols({ search: protocolName || icfName, sortBy, sortOrder });
}

export const router = Router();

router.get("/protocol", handleGetProtocols);
router.get("/stats", handleGetStats);
router.get("/search", (req, res) => {
  const q = req.query as Record<string, string | undefined>;
  const term = q.protocolName ?? q.icfName ?? q.ICFName ?? q.q ?? "";
  res.json({ data: searchProtocols(term, term, q.sort_by, q.sort_order as "asc" | "desc" | undefined) });
});
