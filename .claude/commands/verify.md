---
description: Run the four standards and report honestly
---

1. `npm run check` — types, lint, copy, tokens. No server needed.
2. Confirm the dev server is up, then `npm test`.
3. If anything fails, read the failure before changing anything. The suites assert on
   measured geometry, so a failure is usually real and usually not where it says.

Report the actual output. A suite that was skipped is reported as skipped, not as passing.
A suite that inspected zero files has failed, whatever it printed.

Then, in one line each: what passed, what failed, and what you changed if anything.
