/**
 * Copyright (c) 2025-present Kolosal Inc. All rights reserved.
 *
 * PROPRIETARY AND CONFIDENTIAL.
 * Unauthorized copying, distribution, or modification of this file,
 * via any medium, is strictly prohibited.
 */

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { describe } from 'vitest';
import { runScenario } from '../../helpers/scenario-runner.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("Bottom Bar - Generate", () => {
  runScenario(__dirname);
});
