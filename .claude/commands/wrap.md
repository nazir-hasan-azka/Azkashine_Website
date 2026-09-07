---
description: End a session — leave the plan true and the next session able to start cold
---

1. Run `/verify`. Do not wrap on red without saying it is red.
2. Update `.claude/PLAN.md`: move what got built out of "next", and record anything tried
   and rejected with the reason. **A rejected idea with its reason is worth more than a
   tidy list** — it is what stops the next session rebuilding it.
3. Record every decision the user made this session, in their words where they were
   specific.
4. Record every question you asked that did not get answered. These are the ones that go
   stale silently.
5. If a gotcha cost more than ten minutes, add it to the matching file in
   `.claude/rules/`, not to a summary that disappears.

Then report: what shipped, what is open, and the single next action.
