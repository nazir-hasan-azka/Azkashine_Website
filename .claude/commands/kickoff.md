---
description: Start a session — read the state, report it, ask nothing that is already written down
---

Orient, then stop. Do not start building.

1. Read `.claude/PLAN.md`. Identify the next unbuilt item and any decision marked open.
2. `git status` if there is a repo. There is not yet — say so rather than assuming clean.
3. Run `npm run check`. If it fails, that is the first thing to report and probably the
   first thing to fix.
4. Check whether a dev server is already up on :3000 before starting another.

Then report, in this order and nothing more:

- **Where it stands** — one sentence.
- **Next up** — the next item from the plan, named.
- **Open decisions** — anything the plan records as unanswered. These are the user's to
  make; do not resolve them by picking.
- **Anything red** — a failing check, a stale `.next`, a missing dependency.

Do not re-derive the brief, re-explain the standards, or propose a plan yet. Wait.
