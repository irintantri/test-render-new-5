import type { CollectionName, Collections } from "../schema/entities";
import { Database } from "./adapter";
import { applyQuery, type QueryOptions, type Filter } from "./queryBuilder";
import { NotFoundError } from "../errors";

/**
 * Generic repository over one collection. Feature repositories extend or
 * compose this; they never touch the adapter state directly.
 */
export class Repository<K extends CollectionName, T extends Collections[K] & { id: string } = Collections[K] & { id: string }> {
  constructor(readonly collection: K) {}

  protected rows(): T[] {
    return Database.get().state()[this.collection] as unknown as T[];
  }

  findMany(filter?: Filter<T>, opts?: QueryOptions<T>): T[] {
    return applyQuery(this.rows(), filter, opts);
  }

  findOne(filter: Filter<T>): T | null {
    return applyQuery(this.rows(), filter)[0] ?? null;
  }

  findById(id: string): T | null {
    return this.rows().find((r) => r.id === id) ?? null;
  }

  getById(id: string, label: string = this.collection): T {
    const row = this.findById(id);
    if (!row) throw new NotFoundError(`${label} ${id} not found`);
    return row;
  }

  count(filter?: Filter<T>): number {
    return applyQuery(this.rows(), filter).length;
  }

  insert(row: T): T {
    this.rows().push(row);
    Database.get().persist();
    return row;
  }

  update(id: string, patch: Partial<T>): T {
    const row = this.getById(id);
    Object.assign(row, patch);
    Database.get().persist();
    return row;
  }

  delete(id: string): boolean {
    const rows = this.rows();
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) return false;
    rows.splice(idx, 1);
    Database.get().persist();
    return true;
  }

  deleteWhere(filter: Filter<T>): number {
    const doomed = new Set(this.findMany(filter).map((r) => r.id));
    const rows = this.rows();
    for (let i = rows.length - 1; i >= 0; i--) if (doomed.has(rows[i].id)) rows.splice(i, 1);
    if (doomed.size) Database.get().persist();
    return doomed.size;
  }
}
