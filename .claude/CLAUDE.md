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

Content sources beyond `lib/content/`: the decks in `.claude/references/` (gitignored) and
the live site. The previous app that About and Contact copy was lifted from is gone from
disk as of 2026-09-10; everything it contributed is already in `lib/content/`.

## Where it stands

**Live in production.** Seventeen routes at **https://www.azkashine.com** since
2026-09-07, with staging at **https://test.azkashine.com**.

### One repository, three branches, three folders

Everything is **`nazir-hasan-azka/Azkashine_Website`** since 2026-09-10. The branch
decides where a push goes; each branch has its own folder on disk.

| Branch | Deploys to | robots.txt | Folder |
|---|---|---|---|
| `main` | www.azkashine.com (site root) | Allow | `C:\dev\Azkashine\Azkashine-Website\Production\` |
| `staging` | test.azkashine.com (`test/`) | Disallow | `C:\dev\Azkashine\Azkashine-Website\Staging\` |
| `old` | never | — | `C:\dev\Azkashine\Azkashine-Website\Old\` |

**Work happens in `Staging`.** Push `staging`, check test.azkashine.com, then promote by
merging `staging` into `main` and pushing — from the `Production` folder, or with
`git push origin staging:main` when `main` has nothing of its own. `Old` is the site that
was live until 2026-09-07, kept to read and never to deploy.

**The three folders are separate clones**, not worktrees, so deleting one cannot break the
others. Each carries the full history — about 650MB of `.git`, mostly the old site's media.

**Two FTP accounts, one workflow.** `main` uses the `FTP_*` secrets, rooted at the site
root. `staging` uses `STAGING_FTP_*`, the deploybot account chrooted to `public_html`. A
staging push with its secrets missing stops before building; it never falls back to the
production account.

Until 2026-09-10 this was two repositories — `new-azkashine-website` for staging and this
one for production — because FTP secrets cannot be copied between repositories. They
drifted within a day: production ran a navigation bug staging had already fixed. One
repository ended that.

**robots.txt is decided by the pipeline, not by editing a file.** `app/robots.ts`
disallows by default and allows only when `NEXT_PUBLIC_SITE_ENV=production`, which the
workflow sets for `main` and nothing else. It used to be a hand-flipped switch, and the switch shipped
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

**Pushing deploys.** `.github/workflows/deploy.yml` builds and FTPs `out/` on every push to
`main` (the site root) or `staging` (the `test/` folder). The repository is **public**,
which is why `/.claude/references` is gitignored: it holds the corporate portfolio deck.

**What is kept, and where.** The site that was live until 2026-09-07 is the `old` branch,
minus its deploy workflow so it can never deploy again. The last commit of production's
former `master` is the tag `archive/master-2026-09-10`. The previous redesign attempt lived
in the retired staging repository and goes with it.

**`assets/` is gitignored here and backed up privately.** It holds the 15MB design source —
the Landing Page comp as PDF, PNG and SVG, the extracted imagery, and the partner logos. It
is in `.gitignore` because this repo is public, so for two days it was in no branch of any
repo and came within one command of being deleted with the old app. Since 2026-09-10 a copy
lives in **`nazir-hasan-azka/azkashine-design-source` (private)** — new design source goes
there too, never here. `.claude/references/` (the portfolio deck) is still one copy on
this laptop, deliberately: it is an internal document, and where it is kept is Nazir's call.

Launch is done: `og:image`, `sitemap.xml`, JSON-LD, a real 404 and a canonical `SITE.url`
all shipped on 2026-09-07. Sharing a link gets a real card.

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
