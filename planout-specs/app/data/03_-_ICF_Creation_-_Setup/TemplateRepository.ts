/** Retrieval of ICF generation templates. */
import { makeValidator, zTemplateEntity } from "@shared/schema";
import { repos } from "@shared/db";
import type { z } from "zod";

export const templateSchema = zTemplateEntity;
export type Template = z.infer<typeof templateSchema>;
export const validate = makeValidator(templateSchema, "Template");

export const TemplateRepository = {
  async getAvailableTemplates(): Promise<Template[]> {
    return repos.templates.findMany().map(validate);
  },
};
