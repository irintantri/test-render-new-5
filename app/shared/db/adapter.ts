import fs from "node:fs";
import path from "node:path";
import type { CollectionName, Collections } from "../schema/entities";
import { createSeedState } from "./seed";
import { createLogger } from "../lib/logger";

export type DbState = { [K in CollectionName]: Collections[K][] };

/** Every storage backend satisfies this interface. */
export interface DatabaseAdapter {
  readonly name: string;
  state(): DbState;
  replace(state: DbState): void;
  /** Called after each successful write. */
  persist(): void;
}

const clone = <T>(v: T): T => structuredClone(v);

/** In-memory, seeded on boot. Default in development. */
export class MockDatabase implements DatabaseAdapter {
  readonly name = "mock";
  private data: DbState = createSeedState();
  state() {
    return this.data;
  }
  replace(state: DbState) {
    this.data = state;
  }
  persist() {}
}

/**
 * File-backed JSON store at DB_URL (e.g. "file:./.data/consent-iq.json").
 * Seeds the file on first boot; persists after every write.
 */
export class RealDatabase implements DatabaseAdapter {
  readonly name = "file";
  private data: DbState;
  private readonly file: string;
  private readonly log = createLogger("db");

  constructor(dbUrl = process.env.DB_URL || "file:./.data/consent-iq.json") {
    this.file = path.resolve(dbUrl.replace(/^file:/, ""));
    if (fs.existsSync(this.file)) {
      this.data = { ...createSeedState(), ...JSON.parse(fs.readFileSync(this.file, "utf8")) };
      this.log.info(`Loaded ${this.file}`);
    } else {
      this.data = createSeedState();
      this.persist();
      this.log.info(`Seeded ${this.file}`);
    }
  }
  state() {
    return this.data;
  }
  replace(state: DbState) {
    this.data = state;
  }
  persist() {
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2));
  }
}

export const Database = {
  adapter: null as DatabaseAdapter | null,
  setAdapter(adapter: DatabaseAdapter) {
    this.adapter = adapter;
  },
  get(): DatabaseAdapter {
    if (!this.adapter) this.adapter = new MockDatabase();
    return this.adapter;
  },
  snapshot(): DbState {
    return clone(this.get().state());
  },
};
