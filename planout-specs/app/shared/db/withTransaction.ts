import { Database } from "./adapter";

/**
 * Run fn atomically: on throw, the store is restored to its pre-call snapshot.
 * Use from any controller that mutates two or more collections.
 */
export async function withTransaction<T>(fn: () => T | Promise<T>): Promise<T> {
  const adapter = Database.get();
  const before = Database.snapshot();
  try {
    const result = await fn();
    adapter.persist();
    return result;
  } catch (err) {
    adapter.replace(before);
    adapter.persist();
    throw err;
  }
}
