/** ISO timestamp → YYYY-MM-DD */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return iso.slice(0, 10);
}

/** ISO timestamp → M/D/YYYY (document header style) */
export function formatShortDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

/** ISO timestamp → "10:23 AM" */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function initials(first?: string | null, last?: string | null): string {
  return `${(first ?? "").charAt(0)}${(last ?? "").charAt(0)}`.toUpperCase() || "?";
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/);
  return initials(parts[0], parts.length > 1 ? parts[parts.length - 1] : "");
}

/** Seconds → "MM:SS" */
export function formatEta(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function uuid(): string {
  return globalThis.crypto.randomUUID();
}

/** Stable colour for avatar initials, derived from a string. */
const AVATAR_COLORS = ["#009689", "#E17100", "#E7000B", "#4F39F6", "#0084D1", "#9810FA", "#00A63E"];
export function colorFor(key: string): string {
  let h = 0;
  for (const c of key) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
