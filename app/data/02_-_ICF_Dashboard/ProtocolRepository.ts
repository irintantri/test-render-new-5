/**
 * Data retrieval for the ICF Dashboard: protocol rows (Protocol ⋈ ICF document) and stats.
 */
import { z } from "zod";
import { makeValidator, zDocumentStatus, zSortOrder } from "@shared/schema";
import { applyQuery, likeAny, repos } from "@shared/db";

export const dashboardProtocolSchema = z.object({
  id: z.string(),
  protocol_id: z.string(),
  protocol_version: z.string(),
  protocol_name: z.string(),
  icf_name: z.string(),
  icf_version: z.string(),
  status: zDocumentStatus,
  last_modified: z.string(),
});
export type DashboardProtocol = z.infer<typeof dashboardProtocolSchema>;
export const validate = makeValidator(dashboardProtocolSchema, "DashboardProtocol");

export const dashboardStatsSchema = z.object({
  total: z.number().int().min(0),
  inReview: z.number().int().min(0),
  approved: z.number().int().min(0),
});
export type DashboardStats = z.infer<typeof dashboardStatsSchema>;

export const SORTABLE_FIELDS = dashboardProtocolSchema.keyof().options;
export const dashboardFiltersSchema = z.object({
  search: z.string().optional(),
  sortBy: z.enum(SORTABLE_FIELDS as [string, ...string[]]).default("last_modified"),
  sortOrder: zSortOrder.default("desc"),
});
export type DashboardFilters = z.input<typeof dashboardFiltersSchema>;

function allRows(): DashboardProtocol[] {
  return repos.documents.findMany().map((doc) => {
    const p = repos.protocols.findOne({ protocol_id: doc.protocol_id });
    return {
      id: doc.id,
      protocol_id: doc.protocol_id,
      protocol_version: p?.protocol_version ?? doc.icf_version,
      protocol_name: p?.protocol_name ?? doc.icf_name,
      icf_name: doc.icf_name,
      icf_version: doc.icf_version,
      status: doc.status,
      last_modified: doc.last_modified,
    };
  });
}

export function getDashboardProtocols(filters: DashboardFilters): DashboardProtocol[] {
  const f = dashboardFiltersSchema.parse(filters);
  return applyQuery(
    allRows(),
    f.search ? likeAny<DashboardProtocol>(["protocol_name", "icf_name", "protocol_id"], f.search) : undefined,
    { orderBy: f.sortBy as keyof DashboardProtocol & string, order: f.sortOrder },
  );
}

export function getDashboardStats(): DashboardStats {
  return dashboardStatsSchema.parse({
    total: repos.documents.count(),
    inReview: repos.documents.count({ status: "In Review" }),
    approved: repos.documents.count({ status: "Approved" }),
  });
}
