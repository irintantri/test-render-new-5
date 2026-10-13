/**
 * Copyright (c) 2025-present Kolosal Inc. All rights reserved.
 *
 * PROPRIETARY AND CONFIDENTIAL.
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium, is strictly prohibited.
 */

import { parse } from '@babel/parser';
import type { FileMap } from './fixture-io.js';

export interface Assertion {
  id: string;
  category: 'structural' | 'behavioural' | 'cross-swimlane';
  target: string;
  check: CheckName;
  args?: Record<string, unknown>;
  rationale?: string;
}

export type CheckName =
  | 'file_exists'
  | 'source_parses'
  | 'export_present'
  | 'package_json_has_dep'
  | 'source_contains_regex'
  | 'source_contains_string'
  | 'source_has_import'
  | 'schema_block_present'
  | 'url_in_routes'
  | 'identifier_subset';

export interface EvaluateContext {
  code: FileMap;
  pseudocode?: FileMap;
  scope: string;
}

export function evaluate(a: Assertion, ctx: EvaluateContext): void {
  switch (a.check) {
    case 'file_exists':            return checkFileExists(a, ctx);
    case 'source_parses':          return checkSourceParses(a, ctx);
    case 'export_present':         return checkExportPresent(a, ctx);
    case 'package_json_has_dep':   return checkPackageJsonHasDep(a, ctx);
    case 'source_contains_regex':  return checkSourceContainsRegex(a, ctx);
    case 'source_contains_string': return checkSourceContainsString(a, ctx);
    case 'source_has_import':      return checkSourceHasImport(a, ctx);
    case 'schema_block_present':   return checkSchemaBlockPresent(a, ctx);
    case 'url_in_routes':          return checkUrlInRoutes(a, ctx);
    case 'identifier_subset':      return checkIdentifierSubset(a, ctx);
    default:
      throw new Error(`Unsupported check "${String(a.check)}" (id=${a.id})`);
  }
}

function readSource(ctx: EvaluateContext, target: string): string {
  // Fall back to pseudocode lookup so pseudocode-mode bundles (plan 25)
  // can assert on markdown files under expected/pseudocode/ without a
  // separate check name. Namespaces don't collide in practice because
  // code and pseudocode use different extensions.
  const source = ctx.code.get(target) ?? ctx.pseudocode?.get(target);
  if (source === undefined) throw new Error(`File not found: ${target}`);
  return source;
}

function requireArg<T>(a: Assertion, key: string): T {
  if (!a.args || !(key in a.args)) {
    throw new Error(`Assertion ${a.id} missing arg "${key}"`);
  }
  return a.args[key] as T;
}

function checkFileExists(a: Assertion, ctx: EvaluateContext): void {
  if (!ctx.code.has(a.target)) throw new Error(`File does not exist: ${a.target}`);
}

function checkSourceParses(a: Assertion, ctx: EvaluateContext): void {
  const source = readSource(ctx, a.target);
  const plugins = a.target.endsWith('.tsx')
    ? (['typescript', 'jsx'] as const)
    : a.target.endsWith('.ts')
      ? (['typescript'] as const)
      : (['jsx'] as const);
  try {
    parse(source, { sourceType: 'module', plugins: [...plugins], errorRecovery: false });
  } catch (err) {
    throw new Error(`Source does not parse: ${a.target} — ${(err as Error).message}`);
  }
}

function checkExportPresent(a: Assertion, ctx: EvaluateContext): void {
  const name = requireArg<string>(a, 'name');
  const source = readSource(ctx, a.target);
  const patterns = [
    new RegExp(`export\\s+(?:async\\s+)?(?:function|class|const|let|var|interface|type|enum)\\s+${escapeRegex(name)}\\b`),
    new RegExp(`export\\s*\\{[^}]*\\b${escapeRegex(name)}\\b[^}]*\\}`),
    new RegExp(`export\\s+default\\s+(?:function|class)?\\s*${escapeRegex(name)}\\b`),
  ];
  if (!patterns.some((p) => p.test(source))) {
    throw new Error(`Export "${name}" not found in ${a.target}`);
  }
}

function checkPackageJsonHasDep(a: Assertion, ctx: EvaluateContext): void {
  const dep = requireArg<string>(a, 'dep');
  const source = readSource(ctx, a.target);
  const parsed = JSON.parse(source) as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };
  const found = (parsed.dependencies && dep in parsed.dependencies) ||
    (parsed.devDependencies && dep in parsed.devDependencies);
  if (!found) throw new Error(`Dependency "${dep}" missing from ${a.target}`);
}

function checkSourceContainsRegex(a: Assertion, ctx: EvaluateContext): void {
  const pattern = requireArg<string>(a, 'pattern');
  const flags = (a.args?.['flags'] as string | undefined) ?? '';
  const source = readSource(ctx, a.target);
  if (!new RegExp(pattern, flags).test(source)) {
    throw new Error(`Regex /${pattern}/${flags} did not match in ${a.target}`);
  }
}

function checkSourceContainsString(a: Assertion, ctx: EvaluateContext): void {
  const needle = requireArg<string>(a, 'needle');
  const source = readSource(ctx, a.target);
  if (!source.includes(needle)) throw new Error(`String "${needle}" not found in ${a.target}`);
}

function checkSourceHasImport(a: Assertion, ctx: EvaluateContext): void {
  const moduleName = requireArg<string>(a, 'module');
  const source = readSource(ctx, a.target);
  const re = new RegExp(`(?:import\\s+[^;]+\\s+from\\s+|import\\s*\\(\\s*)['"]${escapeRegex(moduleName)}['"]`);
  if (!re.test(source)) throw new Error(`Import of "${moduleName}" not found in ${a.target}`);
}

const SCHEMA_BLOCK_RE = /<!-- SCHEMA\s+(\{[\s\S]*?\})\s+-->/;

function checkSchemaBlockPresent(a: Assertion, ctx: EvaluateContext): void {
  const entity = requireArg<string>(a, 'entity');
  if (!ctx.pseudocode) throw new Error(`schema_block_present requires pseudocode context (id=${a.id})`);
  const source = ctx.pseudocode.get(a.target);
  if (source === undefined) throw new Error(`Pseudocode file not found: ${a.target}`);

  const match = source.match(SCHEMA_BLOCK_RE);
  if (!match?.[1]) throw new Error(`No <!-- SCHEMA --> block in ${a.target}`);

  let parsed: unknown;
  try { parsed = JSON.parse(match[1]); }
  catch (err) { throw new Error(`SCHEMA block is not valid JSON in ${a.target}: ${(err as Error).message}`); }

  if (
    typeof parsed !== 'object' || parsed === null ||
    !('entities' in parsed) ||
    typeof (parsed as { entities: unknown }).entities !== 'object' ||
    (parsed as { entities: unknown }).entities === null
  ) {
    throw new Error(`SCHEMA block missing 'entities' object in ${a.target}`);
  }

  const entities = (parsed as { entities: Record<string, { fields?: Array<{ name: string }> }> }).entities;
  if (!(entity in entities)) throw new Error(`Entity "${entity}" not declared in SCHEMA of ${a.target}`);

  const requiredFields = a.args?.['fields'] as string[] | undefined;
  if (requiredFields && requiredFields.length > 0) {
    const present = new Set((entities[entity].fields ?? []).map(f => f.name));
    const missing = requiredFields.filter(f => !present.has(f));
    if (missing.length > 0) {
      throw new Error(`Entity "${entity}" missing fields in ${a.target}: ${missing.join(', ')}`);
    }
  }
}

function checkUrlInRoutes(a: Assertion, ctx: EvaluateContext): void {
  const url = requireArg<string>(a, 'url');
  const routeFiles = requireArg<string[]>(a, 'routeFiles');
  const combined = routeFiles.map((f) => readSource(ctx, f)).join('\n');
  if (!combined.includes(url)) throw new Error(`URL "${url}" not in ${routeFiles.join(', ')}`);
}

function checkIdentifierSubset(a: Assertion, ctx: EvaluateContext): void {
  const needed = requireArg<string[]>(a, 'needed');
  const haystackFile = requireArg<string>(a, 'haystack');
  const haystack = readSource(ctx, haystackFile);
  const missing = needed.filter((id) => !new RegExp(`\\b${escapeRegex(id)}\\b`).test(haystack));
  if (missing.length > 0) throw new Error(`Missing identifiers: ${missing.join(', ')}`);
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
