/**
 * Copyright (c) 2025-present Kolosal Inc. All rights reserved.
 *
 * PROPRIETARY AND CONFIDENTIAL.
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium, is strictly prohibited.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative } from 'path';

export type FileMap = Map<string, string>;

export function loadDir(dir: string): FileMap {
  const out: FileMap = new Map();
  if (!existsSync(dir)) return out;
  const walk = (current: string) => {
    for (const entry of readdirSync(current)) {
      const abs = join(current, entry);
      const stat = statSync(abs);
      if (stat.isDirectory()) walk(abs);
      else if (stat.isFile()) out.set(relative(dir, abs), readFileSync(abs, 'utf-8'));
    }
  };
  walk(dir);
  return out;
}

export function loadAssertionsDir<T = unknown>(dir: string): Map<string, T> {
  const out = new Map<string, T>();
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (!entry.endsWith('.json')) continue;
    const abs = join(dir, entry);
    if (!statSync(abs).isFile()) continue;
    const scope = entry.slice(0, -'.json'.length);
    out.set(scope, JSON.parse(readFileSync(abs, 'utf-8')) as T);
  }
  return out;
}
