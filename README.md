# Azkashine website

Marketing site for Azkashine. Next.js App Router, TypeScript, Tailwind v4, exported as
static files.

This is a clean rebuild of `../new-azkashine-website`. That app had accumulated eleven
preview routes and their components, several orphaned heroes, and about six hundred
lines of preview-only CSS — all arguing for directions that had since been rejected.
Only the parts that were still true came across.

## What is here

| | |
|---|---|
| **Home** | The hero, and nothing below it |
| **Navbar / Footer** | Carried over finished. Their links point at routes not yet rebuilt |
| **Content layer** | `lib/content/` — the practices, the nine products, industries, client work |
| **Tokens and motion** | `app/globals.css` — the palette, type, durations and easings |
| **Staged, unused** | `components/product-ui/`, most of `components/ui/`, `public/img/` — carried over finished, waiting for the sections that use them |
| **Nothing else** | There is one hero and one route. Every alternative was built, compared and deleted |
| **Working docs** | `.claude/` — `CLAUDE.md` (standards), `PLAN.md` (what we are building), `BRIEF.md` (the diagnosis), `rules/`, `commands/`. Plus `AGENTS.md` and `tests/README.md` |

Sections two through six are absent on purpose. The brief's diagnosis of the old home
page was "six sections, one shape"; carrying them over would have imported the problem.

## Running it

```bash
npm install
npm run dev            # http://localhost:3000
```

```bash
npm run build          # static export into out/
python -m http.server 3100 --directory out
```

`next start` does not work — the site is `output: export`.

```bash
npx playwright install chromium   # once
npm test                          # needs a dev server running
```

## The hero

The headline is cut out of the paper: a WebGL2 volume moves inside the letterforms,
light from it falls on the sheet around them, and the cursor is the light source.

It measures nothing — every dimension comes from the window, never from an element —
and the `<h1>` is a real heading in ink underneath the canvas, so a browser without
WebGL2 gets a finished page rather than a gap.

On arrival the letters fly in and assemble into the sentence; once they land the hero is
pixel-identical to its resting state, because that state is drawn by the original code
path and then left alone.

`GROUND` in `components/hero/Hero.tsx` switches between `paper` (what ships) and `deep`.

## Not done yet

- Sections below the hero
- The eighteen routes of the previous site (`/what-we-do`, `/products`, `/industries`,
  `/about`, `/contact`) — the Navbar links to them already
- Launch readiness: `og:image`, sitemap, robots, JSON-LD, a 404 page, favicons
- Deployment. `.github/workflows/deploy.yml` is here but inert — this folder is not a
  git repository yet, so nothing runs it
