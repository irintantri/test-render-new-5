/**
 * Protocol discovery for the Setup wizard.
 *   GET /api/catalog/protocols
 *   GET /api/protocol/search?q=   (min 3 chars, else [])
 */
import { Router } from "express";
import { asyncHandler } from "@shared/middleware";
import { ProtocolRepository, SEARCH_MIN_CHARS } from "@app/data/03_-_ICF_Creation_-_Setup/ProtocolRepository";

export function getProtocolCatalog() {
  return ProtocolRepository.getAllProtocols();
}

export async function searchProtocols(query: string) {
  if (query.length >= SEARCH_MIN_CHARS) return ProtocolRepository.searchProtocols(query);
  return [];
}

export const router = Router();

router.get("/catalog/protocols", asyncHandler(async (_req, res) => res.json(await getProtocolCatalog())));
router.get(
  "/protocol/search",
  asyncHandler(async (req, res) => res.json(await searchProtocols(String(req.query.q ?? "")))),
);
