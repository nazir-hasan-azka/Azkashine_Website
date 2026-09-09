@../AGENTS.md

# Azkashine website

Marketing site for **Azkashine**. Next.js App Router, TypeScript, Tailwind v4, exported as
static files to Hostinger. No backend, no database, no CDN.

`.claude/PLAN.md` is what is being built and in what order. `.claude/BRIEF.md` is the
diagnosis it all comes from — read it once. `.claude/DIRECTION.md` is where the design is
going: **the trace**, and the reading of the reference sites it came from. The language is
approved; individual chapters are not. It carries the implementation brief — read it
before building anything on the home page. **`.claude/BUILD-BRIEF.md` is the current
instruction** for the site as a whole: content sources, route inventory, and what must
not go wrong. `.claude/ECOSYSTEM-BRIEF.md` is the design for the spatial product floor, reasoned from
lusion.co without copying it. It names a route, `/ecosystem/`, that no longer exists — the
floor lives at the top of `/products/`. The reading of the reference still holds; see
`PLAN.md` for where it ended up and why.

Content sources beyond `lib/content/`: the previous app at `../new-azkashine-website/`
(copy and structure only — its visual system is what this project replaces) and the live
site at https://test.azkashine.com/. **About and Contact copy is hard-coded in the old
app's route files**, not in its content layer; it has to be lifted into `lib/content/`
before those pages are built.

## Where it stands

**Live in production.** Seventeen routes at **https://www.azkashine.com** since
2026-09-07, with staging at **https://test.azkashine.com**.

### Two repositories, and which is which

| | Repo | Branch | Deploys to |
|---|---|---|---|
| **Staging** | `nazir-hasan-azka/new-azkashine-website` | `main` | test.azkashine.com |
| **Production** | `nazir-hasan-azka/Azkashine_Website` | `master` | www.azkashine.com |

**Both hold the same application.** The split exists because FTP credentials are per
repository and cannot be moved: only the first can reach the staging folder, only the
second can reach the site root. **They drift** — production ran a day behind staging
within twenty-four hours, with a navigation bug live the whole time. Until they are
collapsed into one repository with two workflows, **anything merged to staging has to be
carried to production deliberately**, and the way to do that is in `PLAN.md` section 5.

**robots.txt is decided by the pipeline, not by editing a file.** `app/robots.ts`
disallows by default and allows only when `NEXT_PUBLIC_SITE_ENV=production`, which only
the production workflow sets. It used to be a hand-flipped switch, and the switch shipped
`Allow` to staging for two days — a complete crawlable duplicate of the live site,
pointing at the production sitemap. Do not turn it back into a switch.

The home page is the film: seven chapters on one continuous scroll, drawn by one canvas
and driven by one rAF loop (`components/film/`, `lib/film/`).

**`/products/` is the one other route that moves.** The floor opens it — eight coded
product interfaces standing in a dark room, turned by scroll, on the same rAF loop
(`components/floor/`, `lib/floor/`) — and the three practice bands follow it unchanged.
It was its own route, `/ecosystem/`, for two days; that route was deleted on 2026-09-09
because it was carrying a second copy of the product index while `/products/` showed none
of the products. `PLAN.md` has the reasoning.

The remaining fifteen routes are deliberately nothing like either: a buyer comparing
vendors needs those scannable and fast, so they carry a thin static trace down the gutter
and nothing else. **Do not spread the spatial treatment further** — that contrast is what
makes it land.

**This IS a git repository, and pushing to `main` deploys.**
`.github/workflows/deploy.yml` builds and FTPs `out/` into Hostinger's `test/` folder on
every push. Remote: `github.com/nazir-hasan-azka/new-azkashine-website` — and it is
**public**, which is why `/.claude/references` is gitignored: it holds the corporate
portfolio deck.

The previous site is preserved on the `archive/old-design` branch and in this branch's
history. The old app also still sits on disk at `../new-azkashine-website/`, no longer a
repo, kept as a copy reference.

**Two things must change before this deploys to the main site:**

- `app/robots.ts` disallows everything on purpose, because the deploy target is a public
  staging URL and a staging copy competing with azkashine.com in search is worse than no
  staging at all.
- `SITE.url` is the production host, so canonical URLs already point at azkashine.com.

Still missing for a real launch: `og:image`, a sitemap, and JSON-LD. Sharing a link today
gets a blank card.

---

# The four standards

These four are enforced by something that runs. Everything else is reference.

**A standard nobody can check is a wish.** A new rule that cannot be folded into one of
these four is advisory, and belongs in a rule file, not here.

| | Enforced by |
|---|---|
| **1 · It works on every screen** | `npm test` → `responsive.mjs` — 17 routes × 16 viewports, 320×568 to 2560×1440. No overflow, headline on the gutter at both edges, every gap that must stay positive |
| **2 · Every link resolves and can be clicked** | `npm test` → `links.mjs` — dead hrefs, links painted over at three widths, and 24×24 pointer targets (WCAG 2.2 SC 2.5.8, inline links exempt) |
| **3 · Copy and tokens hold** | `npm run check` → `standards.mjs` — apostrophes, double spaces, stray whitespace; no raw hex, no arbitrary type sizes |
| **4 · Types and lint are clean** | `npm run check` — `tsc --noEmit` and `eslint`, both exit 0 |

```bash
npm run dev     # localhost:3000
npm run check   # types, lint, copy, tokens — no server needed, run this first
npm test        # the browser suites — needs the dev server up
```

Both failures the link suite catches have happened here. A link can point nowhere, or it
can be **covered** — right href, painted over. The hero's closing band sat on "Book a
demo" at three phone sizes and nothing errored.

---

# How work happens

**Template B — new feature.** A new section or route, anything multi-file, or any change
to a shared contract. Write the plan, then wait for a go-ahead. `/plan-section` does this.

**Template D — small edit.** One file, no new data flow. Just do it.

Start in D and find yourself touching a second file? Stop and re-classify as B.

The loop for a new section is `/plan-section` → build → `/verify` → `/wrap`. Start a
session with `/kickoff`.

**Answer first, detail after. Short sentences, plain words.** Name the file and the line.

**Variations are how this project decides.** Two or three real built pages beat any amount
of prose about them. Take the ambitious version of an idea over the safe one; nothing in
this document exists to make the work smaller.

## Commits *(in force)*

`feat|fix|chore|docs|refactor|test|style|perf(scope): subject`. `npm run check` passes
first, and `npm run build` too — this is `output: "export"`, and a client/server boundary
mistake only surfaces there, never in dev.

**On the `Co-Authored-By` trailer:** this file used to forbid it. Claude Code is now
configured at the session level to add one, which overrides a project file, so every
commit since 2026-09-07 carries it. Flagged rather than silently reconciled — if the
trailer is unwanted, it has to be turned off in Claude Code's settings, not here.

---

# Reference

## Type

Three faces, through `next/font` in `lib/fonts.ts`, self-hosted into the build.

| Face | Token | Used for |
|---|---|---|
| **Archivo Black** | `--font-heavy` | The hero headline. Nothing else, so far |
| **Figtree** | `--font-sans` | Every heading and all body copy |
| **JetBrains Mono** | `--font-mono` | Small labels and eyebrows only |

**Mono never sets body copy.** The hero's lede was mono at 13px and read as console
output; it was the loudest wrong note on the page.

The scale to converge on — three exist today, the hero's, Tailwind's defaults, and a set
of arbitrary pixel values that came in with the staged components:

| Step | Size | Use |
|---|---|---|
| `label-sm` | 10px | Mono, uppercase, tracked `0.19em` |
| `label` | 11px | Mono eyebrow |
| `body-sm` | 14px | Captions, small print |
| `body` | 16px | Default |
| `body-lg` | 17px | Lede paragraphs |
| `h4` | 20px | |
| `h3` | 24px | |
| `h2` | 32px | Section subheads |
| `h1` | 44px | Section headings |
| `display` | fluid | Hero only, capped by width **and** height |

Weights: 400, 500, 600. Nothing else is loaded.

## Colour

Tokens live in `@theme` in `app/globals.css`. Ground `#fafbff`, ink `#0f1125`, deep
`#00357c`, brand `#5cc2ed` / `#85e2fe`, blues `#2185f8` / `#1964ba`. The hero's own ground
is pure white — against a saturated material anything short of white reads grey.

Contrast: **4.5:1** body text, **3:1** large text and UI components.

## Performance

Core Web Vitals at the 75th percentile: **LCP ≤ 2.5s · INP ≤ 200ms · CLS ≤ 0.1**. A static
export on a host with no CDN, so weight lands directly on the visitor.

## Code

- `@/` path alias. PascalCase components, kebab-case route segments.
- No `any` without a one-line reason. No `console.log`. No unused imports.
- One pass over a collection unless there is a reason for more.
- No type predicate that exists only to satisfy the compiler.
- Mirror what is already there. If a new pattern is needed, say so before writing it.
- **Verify, do not assume.** Has this been run, or only written? Code-complete is not
  working.

Detail that only matters inside one part of the tree lives in `.claude/rules/` and loads
when you open a matching file: `hero.md`, `content.md`, `styles.md`, `components.md`,
`tests.md`.
