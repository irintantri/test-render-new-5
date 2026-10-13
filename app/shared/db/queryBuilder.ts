export type Filter<T> = Partial<T> | ((row: T) => boolean);

export interface QueryOptions<T> {
  orderBy?: keyof T & string;
  order?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export function matches<T>(row: T, filter?: Filter<T>): boolean {
  if (!filter) return true;
  if (typeof filter === "function") return filter(row);
  return Object.entries(filter).every(([k, v]) => v === undefined || (row as Record<string, unknown>)[k] === v);
}

export function compareValues(a: unknown, b: unknown): number {
  if (a == null && b == null) return 0;
  if (a == null) return -1;
  if (b == null) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
}

export function applyQuery<T>(rows: T[], filter?: Filter<T>, opts: QueryOptions<T> = {}): T[] {
  let out = rows.filter((r) => matches(r, filter));
  if (opts.orderBy) {
    const key = opts.orderBy;
    const dir = opts.order === "desc" ? -1 : 1;
    out = [...out].sort((a, b) => dir * compareValues(a[key], b[key]));
  }
  if (opts.offset) out = out.slice(opts.offset);
  if (opts.limit !== undefined) out = out.slice(0, opts.limit);
  return out;
}

/** Case-insensitive "LIKE %term%" across the given fields. */
export function likeAny<T>(fields: (keyof T)[], term: string) {
  const t = term.trim().toLowerCase();
  return (row: T) => !t || fields.some((f) => String(row[f] ?? "").toLowerCase().includes(t));
}
