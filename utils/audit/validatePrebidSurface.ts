#!/usr/bin/env node
/**
 * CLI Entrypoint for Professor Prebid Surface Audit
 *
 * Usage:
 *   npx ts-node -T utils/audit/validatePrebidSurface.ts
 *   npx ts-node -T utils/audit/validatePrebidSurface.ts --url https://www.eatpicks.com/
 *   npm run audit:surface -- --url https://www.heise.de/
 */

import { spawn } from 'child_process';
import path from 'path';

const args = process.argv.slice(2);
let targetUrl: string | undefined;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--url' && args[i + 1]) {
    targetUrl = args[i + 1];
    break;
  }
}

const env = { ...process.env };
if (targetUrl) {
  env.AUDIT_URL = targetUrl;
  console.log(`[Audit Runner] Starting surface audit against target URL: ${targetUrl}`);
} else {
  console.log(`[Audit Runner] Starting synthetic prebid surface audit matrix...`);
}

const testPath = path.resolve(__dirname, '../../e2e/specs/09_prebid_surface_audit.spec.ts');
const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const child = spawn(npxCmd, ['playwright', 'test', testPath, '--reporter=list'], {
  env,
  stdio: 'inherit',
  cwd: path.resolve(__dirname, '../..'),
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
