/**
 * Copyright (c) 2025-present Kolosal Inc. All rights reserved.
 *
 * PROPRIETARY AND CONFIDENTIAL.
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium, is strictly prohibited.
 */

import { join } from 'path';
import { test, expect } from 'vitest';
import { loadDir, loadAssertionsDir } from './fixture-io.js';
import { evaluate, type Assertion } from './assertion-kit.js';

export interface ScenarioOptions {
  minAssertionsPerScope?: number;
}

export function runScenario(scenarioDir: string, opts: ScenarioOptions = {}): void {
  const minAssertionsPerScope = opts.minAssertionsPerScope ?? 1;
  const expectedRoot = join(scenarioDir, 'expected');
  const code = loadDir(join(expectedRoot, 'app'));
  const pseudocode = loadDir(join(expectedRoot, 'pseudocode'));
  const assertions = loadAssertionsDir<Assertion[]>(join(expectedRoot, 'assertions'));

  test('scenario has at least one expected file (code or pseudocode)', () => {
    expect(code.size + pseudocode.size).toBeGreaterThan(0);
  });
  test('scenario has at least one assertion scope', () => {
    expect(assertions.size).toBeGreaterThan(0);
  });

  for (const [scope, list] of assertions) {
    test(`scope ${scope}: has at least ${minAssertionsPerScope} assertion(s)`, () => {
      expect(list.length).toBeGreaterThanOrEqual(minAssertionsPerScope);
    });
    for (const a of list) {
      test(`scope ${scope}: [${a.category}] ${a.id} (${a.check})`, () => {
        evaluate(a, { code, pseudocode, scope });
      });
    }
  }
}
