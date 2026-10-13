/** ICF Dashboard main view. Asset: 9c78bc3d */
import { useMemo, useState } from "react";
import { CircleCheck, Clock3, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { apiClient, qs } from "@shared/http";
import { useApi, useDebounce, usePagination } from "@shared/hooks";
import { EmptyState, ErrorBanner, PanelSpinner } from "@shared/ui";
import type { DashboardStats, ProtocolListResponse } from "@shared/types";
import { Header } from "./Header";
import { SearchBar } from "./SearchBar";
import { ProtocolTable, type SortConfig } from "./ProtocolTable";
import "./dashboard.css";

const PAGE_SIZE = 6;
const STATUS_FILTERS = ["All statuses", "Draft", "In Review", "Approved"] as const;

function StatCard({ label, value, icon, tone }: { label: string; value: number | string | undefined; icon: React.ReactNode; tone: "blue" | "orange" | "green" }) {
  return (
    <div className="stat-card">
      <div>
        <div className="stat-card__label">{label}</div>
        <div className="stat-card__value">{value ?? "—"}</div>
      </div>
      <span className={`stat-card__icon stat-card__icon--${tone}`}>{icon}</span>
    </div>
  );
}

export const ICFDashboard = () => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "last_modified", direction: "desc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_FILTERS)[number]>("All statuses");
  const debouncedQuery = useDebounce(searchQuery.trim(), 200);

  const { data: stats, loading: statsLoading } = useApi(() => apiClient.get<DashboardStats>("/api/stats").then((r) => r.data), []);

  // Fetch protocols (search endpoint when a query is present)
  const endpoint = debouncedQuery ? "/api/search" : "/api/protocol";
  const params = { sort_by: sortConfig.key, sort_order: sortConfig.direction, ...(debouncedQuery ? { protocolName: debouncedQuery } : {}) };
  const { data: protocols, loading: tableLoading, error } = useApi(
    () => apiClient.get<ProtocolListResponse>(`${endpoint}${qs(params)}`).then((r) => r.data.data),
    [endpoint, debouncedQuery, sortConfig.key, sortConfig.direction],
  );

  const filtered = useMemo(
    () => (protocols ?? []).filter((p) => statusFilter === "All statuses" || p.status === statusFilter),
    [protocols, statusFilter],
  );
  const pager = usePagination(filtered, PAGE_SIZE);

  const handleSort = (field: SortConfig["key"]) => {
    let direction: SortConfig["direction"] = "asc";
    if (sortConfig.key === field && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key: field, direction });
  };

  return (
    <div className="dashboard-container">
      <Header />

      <div className="stats-row">
        <StatCard label="Total Consents" value={statsLoading ? "—" : stats?.total} icon={<FileText size={18} />} tone="blue" />
        <StatCard label="In Review" value={statsLoading ? "—" : stats?.inReview} icon={<Clock3 size={18} />} tone="orange" />
        <StatCard label="Approved" value={statsLoading ? "—" : stats?.approved} icon={<CircleCheck size={18} />} tone="green" />
      </div>

      <section className="table-card">
        <div className="table-card__head">
          <h2>Recent Consent Forms</h2>
          <div className="table-card__tools">
            <SearchBar onSearch={setSearchQuery} />
            <select className="status-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as (typeof STATUS_FILTERS)[number])} aria-label="Filter by status">
              {STATUS_FILTERS.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="table-card__spacer" />

        {error ? (
          <div style={{ padding: 16 }}>
            <ErrorBanner message={error} />
          </div>
        ) : tableLoading && !protocols ? (
          <PanelSpinner label="Loading protocols…" />
        ) : filtered.length === 0 ? (
          <EmptyState title="No consent forms found" description={searchQuery ? `Nothing matches “${searchQuery}”.` : "Create a new consent to get started."} />
        ) : (
          <>
            <ProtocolTable data={pager.pageItems} onSort={handleSort} sortConfig={sortConfig} />
            {pager.pageCount > 1 && (
              <div className="pager">
                <span>
                  Showing {pager.from}–{pager.to} of {pager.total}
                </span>
                <div className="pager__btns">
                  <button className="icon-btn" onClick={pager.prev} disabled={pager.page === 1} aria-label="Previous page">
                    <ChevronLeft size={16} />
                  </button>
                  <span>
                    {pager.page} / {pager.pageCount}
                  </span>
                  <button className="icon-btn" onClick={pager.next} disabled={pager.page === pager.pageCount} aria-label="Next page">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};
