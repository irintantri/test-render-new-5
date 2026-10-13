import type { DocumentVersionView } from "@shared/types";
import { formatDate } from "@shared/lib";

export function VersionDropdown({ versions, onSelect, isLoading }: { versions: DocumentVersionView[]; onSelect: (id: string) => void; isLoading?: boolean }) {
  return (
    <ul className="version-dropdown" role="listbox" aria-label="Versions">
      {isLoading && <li className="version-dropdown__empty">Loading versions…</li>}
      {!isLoading && versions.length <= 1 && <li className="version-dropdown__empty">No earlier versions to compare.</li>}
      {versions.map((version) => (
        <li key={version.id}>
          <button role="option" aria-selected={false} disabled={version.isCurrent} onClick={() => onSelect(version.id)}>
            <span className="version-dropdown__v">{version.versionString}</span>
            <span className="badge badge--draft">{version.status}</span>
            {version.isCurrent && <span className="version-dropdown__current">Current</span>}
            <span className="version-dropdown__date">{formatDate(version.createdAt)}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
