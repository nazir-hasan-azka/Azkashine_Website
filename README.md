# Azkashine website

Marketing site for Azkashine, live at **https://www.azkashine.com**. Next.js App Router,
TypeScript, Tailwind v4, exported as static files and deployed to Hostinger over FTP.

## Branches and folders

One repository, `nazir-hasan-azka/Azkashine_Website`:

| Branch | What it is | Deploys | Folder |
|---|---|---|---|
| `main` | the site | www.azkashine.com, on every push | `C:\dev\Azkashine\Azkashine-Website\Production` |
| `old` | the site that was live until 2026-09-07 | never | `C:\dev\Azkashine\Azkashine-Website\Old` |

There is no test site. Check a change on your machine before pushing it.

## Running it

```bash
npm install
npm run dev                       # http://localhost:3000
```

```bash
npm run check                     # types, lint, copy and token rules - no server needed
npx playwright install chromium   # once
npm test                          # browser suites - needs the dev server running
```

```bash
npm run build                     # static export into out/
python -m http.server 3100 --directory out
```

`next start` does not work — the site is `output: export`.

## What is here

| | |
|---|---|
| **Home** | The film: seven chapters on one continuous scroll, one canvas, one rAF loop (`components/film/`, `lib/film/`) |
| **Products** | Opens with the floor — eight coded product interfaces in a dark room, turned by scroll (`components/floor/`, `lib/floor/`) |
| **Every other route** | Fifteen conventional, fast pages with a thin static trace down the gutter |
| **Content** | `lib/content/` — every sentence on the site |
| **Tokens and motion** | `app/globals.css` and `app/styles/` |
| **Working docs** | `.claude/` — start with `CLAUDE.md`, then `PLAN.md` |

`assets/` (the design source) and `.claude/references/` (the portfolio deck) are
gitignored, because this repository is public. The design source is backed up in the
private repository `nazir-hasan-azka/azkashine-design-source`.

## Deploying

Push to `main`. `.github/workflows/deploy.yml` builds with `NEXT_PUBLIC_SITE_ENV=production`
— the only build whose robots.txt allows indexing — and uploads `out/` to the site root.
Rolling back is `git revert <sha>` and a push.
