// Runs every browser suite against a running dev server and exits non-zero on the
// first failure, so `npm test` is one command.
//
// `npm run check` is the other half — type-check, lint and the standards scan, none of
// which need a server. Run that one first; it is faster and catches more.

import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SUITES = ["standards.mjs", "responsive.mjs", "links.mjs", "hero.mjs"];

let failed = 0;
for (const suite of SUITES) {
  process.stdout.write(`\n──── ${suite} ${"─".repeat(Math.max(0, 56 - suite.length))}\n`);
  const r = spawnSync(process.execPath, [fileURLToPath(new URL(suite, import.meta.url))], {
    stdio: "inherit",
    env: process.env,
  });
  if (r.status !== 0) failed++;
}

process.stdout.write(
  failed === 0 ? "\n\nall suites passed\n" : `\n\n${failed} suite(s) failed\n`,
);
process.exit(failed === 0 ? 0 : 1);
