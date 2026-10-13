/** GET /api/catalog/templates — templates for the ICF configuration wizard. */
import { Router } from "express";
import { asyncHandler } from "@shared/middleware";
import { TemplateRepository } from "@app/data/03_-_ICF_Creation_-_Setup/TemplateRepository";

export function getAvailableTemplates() {
  return TemplateRepository.getAvailableTemplates();
}

export const router = Router();

router.get("/catalog/templates", asyncHandler(async (_req, res) => res.json(await getAvailableTemplates())));
