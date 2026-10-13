import { useNavigate } from "react-router-dom";
import { ClipboardPen, Eye, FileText } from "lucide-react";
import type { DashboardProtocol } from "@shared/types";
import { ROUTES, formatDate } from "@shared/lib";
import { StatusBadge } from "@shared/ui";

export interface SortConfig {
  key: keyof DashboardProtocol | "actions";
  direction: "asc" | "desc";
}

const columns: { key: SortConfig["key"]; label: string }[] = [
  { key: "protocol_id", label: "Protocol ID" },
  { key: "protocol_version", label: "Protocol Ver." },
  { key: "protocol_name", label: "Protocol Name" },
  { key: "icf_name", label: "ICF Name" },
  { key: "icf_version", label: "ICF Version" },
  { key: "status", label: "Status" },
  { key: "last_modified", label: "Last Modified" },
  { key: "actions", label: "Actions" },
];

export const ProtocolTable = ({
  data,
  onSort,
  sortConfig,
}: {
  data: DashboardProtocol[] | null;
  onSort: (key: SortConfig["key"]) => void;
  sortConfig: SortConfig;
}) => {
  const navigate = useNavigate();
  const navigateToPreview = (id: string) => navigate(ROUTES.preview(id));
  const navigateToEdit = (id: string, status: string) => navigate(status === "Draft" ? ROUTES.edit(id) : ROUTES.review(id));

  return (
    <div className="table-scroll">
      <table className="ptable">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                onClick={() => col.key !== "actions" && onSort(col.key)}
                className={col.key !== "actions" ? "sortable" : undefined}
                aria-sort={sortConfig.key === col.key ? (sortConfig.direction === "asc" ? "ascending" : "descending") : undefined}
              >
                {col.label}
                {sortConfig.key === col.key && <span className="ptable__sort">{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((row) => {
            const archived = (row.status as string) === "Archived";
            return (
              <tr key={row.id} className={archived ? "is-archived" : undefined} onDoubleClick={() => !archived && navigateToEdit(row.id, row.status)}>
                <td>
                  <span className="ptable__id">
                    <FileText size={14} />
                    {row.protocol_id}
                  </span>
                </td>
                <td className="mono muted">{row.protocol_version}</td>
                <td>{row.protocol_name}</td>
                <td>{row.icf_name}</td>
                <td className="muted">{row.icf_version}</td>
                <td>
                  <StatusBadge status={row.status} />
                </td>
                <td className="muted">{formatDate(row.last_modified)}</td>
                <td>
                  {!archived ? (
                    <span className="ptable__actions">
                      <button className="icon-btn icon-btn--primary" title="View" aria-label={`View ${row.icf_name}`} onClick={() => navigateToPreview(row.id)}>
                        <Eye size={16} />
                      </button>
                      <button className="icon-btn" title="Open" aria-label={`Open ${row.icf_name}`} onClick={() => navigateToEdit(row.id, row.status)}>
                        <ClipboardPen size={16} />
                      </button>
                    </span>
                  ) : (
                    <span className="muted">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
