import type { ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { colorFor, initials as toInitials } from "../lib/format";

/* ---------- StatusBadge ---------- */
const STATUS_CLASS: Record<string, string> = {
  Approved: "badge--approved",
  "In Review": "badge--review",
  Draft: "badge--draft",
  Rejected: "badge--rejected",
};
export function StatusBadge({ status }: { status: string }) {
  return <span className={`badge ${STATUS_CLASS[status] ?? "badge--draft"}`}>{status}</span>;
}

export function AiBadge({ label = "AI Generated" }: { label?: string }) {
  return (
    <span className="badge badge--ai">
      <Sparkles />
      {label}
    </span>
  );
}

export function Badge({ children, tone = "indigo" }: { children: ReactNode; tone?: "indigo" | "ai" | "draft" | "approved" | "review" }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

/* ---------- Avatar ---------- */
export function Avatar({ name, src, size = 32, color }: { name: string; src?: string | null; size?: number; color?: string }) {
  const parts = name.trim().split(/\s+/);
  const ini = toInitials(parts[0], parts.length > 1 ? parts[parts.length - 1] : "");
  return (
    <span className="avatar" style={{ width: size, height: size, fontSize: Math.round(size * 0.4), background: color ?? colorFor(name) }} title={name} aria-label={name}>
      {src ? <img src={src} alt={name} /> : ini}
    </span>
  );
}

/* ---------- Tabs ---------- */
export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: ReactNode }[]; value: T; onChange: (id: T) => void }) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={value === t.id} className={`tab ${value === t.id ? "tab--active" : ""}`} onClick={() => onChange(t.id)}>
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Pill({ children, mono, strong }: { children: ReactNode; mono?: boolean; strong?: boolean }) {
  return <span className={["pill", mono && "pill--mono", strong && "pill--strong"].filter(Boolean).join(" ")}>{children}</span>;
}
