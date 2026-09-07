// Every link resolves, and every link can actually be clicked.
//
// "Clickable" fails in two different ways and only one of them is obvious.
//
//   1. The link points nowhere — href="#", an empty href, or an internal route that
//      does not exist in the build. Loud once you look, silent until then.
//   2. The link is covered. The href is right, the route exists, and something is
//      painted on top of it. This one has already happened here: the hero's closing
//      band sat over "Book a demo" on three phone sizes and nothing errored.
//
// So this checks both, and checks the second at three widths, because what covers a
// link is usually a layout that only overlaps at one size.
//
// Needs a dev server: `npm run dev`, then `node tests/links.mjs`.

import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3000";

/**
 * Every route on the site, and the reason this list is written out by hand.
 *
 * A test that discovers its own targets by crawling can quietly discover nothing —
 * that is the failure this whole suite exists to refuse. Written down, a route that
 * stops existing is a 404 the suite reports, not a route it silently stops checking.
 *
 * Seventeen. If that number changes, this list and `ROUTES.length` below both have to
 * change with it, which is the point.
 */
const ROUTES = [
  "/",
  "/what-we-do/",
  "/what-we-do/ai-automation/",
  "/what-we-do/digital-platforms/",
  "/what-we-do/cloud-testing/",
  "/products/",
  "/products/savant-ai/",
  "/products/tawthiq/",
  "/products/agentos/",
  "/products/agent-siddhi/",
  "/products/smart-ai-assistant/",
  "/products/ethics-intelligence/",
  "/products/cloud-orchestration/",
  "/products/prosiddhi/",
  "/industries/",
  "/about/",
  "/contact/",
];

/**
 * Nothing is planned any more. Every route the navigation points at is built, so a
 * link to something outside `ROUTES` is a dead link and fails — there is no longer a
 * category of href that gets a warning instead of an error.
 */
const PLANNED = [];

if (ROUTES.length !== 17) {
  console.log(`    FAIL ROUTES holds ${ROUTES.length}, expected 17 — the site has seventeen routes`);
  process.exit(1);
}

const WIDTHS = [
  [390, 844],
  [1024, 768],
  [1440, 900],
];

let fails = 0;
let warns = 0;
const fail = (msg) => {
  fails++;
  console.log(`    FAIL ${msg}`);
};
const warn = (msg) => {
  warns++;
  console.log(`    warn ${msg}`);
};
const ok = (msg) => console.log(`    ok   ${msg}`);

const browser = await chromium.launch();

for (const route of ROUTES) {
  console.log(`\n  ${route}`);
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.setDefaultTimeout(90000);
  const res = await page.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  if (!res || res.status() >= 400) fail(`${route} returned ${res ? res.status() : "no response"}`);
  // The home page is the film: the hero's arrival runs 2.2s and the trace drops after.
  await page.waitForTimeout(route === "/" ? 4500 : 1800);

  const links = await page.evaluate(() =>
    [...document.querySelectorAll("a")].map((el) => ({
      href: el.getAttribute("href"),
      resolved: el.href,
      text: (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40),
      target: el.getAttribute("target"),
      rel: el.getAttribute("rel"),
      inHeader: !!el.closest("header"),
      inFooter: !!el.closest("footer"),
    })),
  );

  ok(`${links.length} links found`);

  // ── 1. every href goes somewhere ───────────────────────────────────────────
  const origin = new URL(BASE).origin;
  const planned = new Set();
  for (const l of links) {
    const label = `"${l.text}" → ${l.href}`;

    if (!l.href || l.href === "#" || l.href.startsWith("javascript:")) {
      fail(`dead href — ${label}`);
      continue;
    }

    if (l.href.startsWith("mailto:") || l.href.startsWith("tel:")) continue;

    if (l.resolved.startsWith(origin)) {
      const path = new URL(l.resolved).pathname;
      if (ROUTES.includes(path)) continue;
      const plannedRoot = PLANNED.find((p) => path === p || path.startsWith(p));
      if (plannedRoot) {
        planned.add(plannedRoot);
        continue;
      }
      fail(`internal link to a route that does not exist and is not planned — ${label}`);
      continue;
    }

    // External.
    if (!l.resolved.startsWith("https://")) {
      fail(`external link is not https — ${label}`);
    }
    if (l.target === "_blank" && !(l.rel || "").includes("noopener")) {
      fail(`target=_blank without rel="noopener" — ${label}`);
    }
  }

  if (planned.size) {
    warn(`${planned.size} link target(s) not built yet: ${[...planned].join(", ")}`);
  }

  // ── 2. nothing is covering anything ────────────────────────────────────────
  for (const [w, h] of WIDTHS) {
    await page.setViewportSize({ width: w, height: h });
    await page.waitForTimeout(900);

    /* One screenful at a time, top to bottom.
       This tested a single screen and skipped everything below the fold, which was
       right while the page was a hero and nothing else and wrong the moment a section
       landed under it. Scrolling is needed for a second reason too: a `.reveal-group`
       child sits at opacity 0 until its scroll-driven animation runs, and
       `checkVisibility({ opacityProperty: true })` reads that as not visible — so an
       unscrolled page reports every link in a revealed section as fine, having never
       looked at one. Both are the silent pass this suite exists to refuse. */
    const covered = [];
    const behindStack = [];
    let inspected = 0;
    const screens = await page.evaluate(() =>
      Math.max(1, Math.ceil(document.documentElement.scrollHeight / innerHeight)),
    );

    for (let s = 0; s < screens; s++) {
      await page.evaluate((i) => window.scrollTo(0, i * innerHeight), s);
      // Long enough for the scroll-driven reveals to settle at their finished state.
      await page.waitForTimeout(350);

      const found = await page.evaluate(async () => {
        const visible = (el) => {
          // display:none, visibility:hidden, opacity:0 anywhere up the tree.
          if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) {
            return false;
          }
          if (el.closest("[hidden], [inert], [aria-hidden='true']")) return false;
          // Collapsed panels. The mobile drawer here is a div with overflow-y:auto and
          // height 0 — its children are still laid out and still report boxes, so they
          // look like visible links being covered by the page behind them. They are not
          // covered; they are clipped, and nobody can reach them until the menu opens.
          for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
            const cs = getComputedStyle(n);
            const clipped = cs.overflow !== "visible" || cs.overflowY !== "visible" || cs.overflowX !== "visible";
            if (clipped && (n.clientHeight === 0 || n.clientWidth === 0)) return false;
          }
          return true;
        };

        /** Whatever is painted at the link's centre right now. */
        const blocker = (el) => {
          const r = el.getBoundingClientRect();
          const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
          if (!top) return null;
          if (el.contains(top) || el === top || top.contains(el)) return null;
          return top;
        };

        /* A stacking deck covers its own earlier cards on purpose — that is the
           shape, not a defect. So a link behind a *later* card of the same stack is
           expected and reported as a warning; anything else on top of a link is still
           a failure. The deck marks itself with `data-stack` / `data-stack-card`, and
           `tests/responsive.mjs` asserts separately that each of these links is
           reachable at the scroll position where its own card is in front — without
           that second check this allowance would be a hole. */
        const behindLaterCard = (el, top) => {
          const card = el.closest("[data-stack-card]");
          const overCard = top.closest ? top.closest("[data-stack-card]") : null;
          if (!card || !overCard || card === overCard) return false;
          const stack = card.closest("[data-stack]");
          if (!stack || overCard.closest("[data-stack]") !== stack) return false;
          const cards = [...stack.querySelectorAll("[data-stack-card]")];
          return cards.indexOf(overCard) > cards.indexOf(card);
        };

        const bad = [];
        const stacked = [];
        let seen = 0;

        // Snapshot first: the retry below scrolls, and collecting while scrolling
        // would let a link slip past unexamined at every screen.
        const onScreen = [];
        for (const el of document.querySelectorAll("a")) {
          if (!visible(el)) continue;
          const r = el.getBoundingClientRect();
          if (r.width < 1 || r.height < 1) continue;
          // Only test what is actually on screen; a link below the fold is not covered,
          // it is just further down the page.
          if (r.bottom < 0 || r.top > innerHeight) continue;
          onScreen.push(el);
        }

        const home = window.scrollY;
        for (const el of onScreen) {
          seen++;
          let top = blocker(el);

          /* A sticky header sits over whatever scrolls beneath it — at an arbitrary
             scroll offset that is the header doing its job, not a link nobody can
             click, and reporting it would bury the real thing this check exists for
             (the hero's closing band sat *permanently* over "Book a demo"). So the
             link gets the scroll position a person would actually reach for, and is
             only reported if it is still covered there. */
          if (top) {
            el.scrollIntoView({ block: "center" });
            await new Promise((r) => setTimeout(r, 200));
            top = blocker(el);
            window.scrollTo(0, home);
            await new Promise((r) => setTimeout(r, 120));
          }

          if (top) {
            const label = `"${(el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 30)}"`;
            if (behindLaterCard(el, top)) {
              stacked.push(`${label} sits behind a later card of its stack`);
            } else {
              bad.push(
                `${label} covered by <${top.tagName.toLowerCase()} class="${(top.className + "").slice(0, 40)}">`,
              );
            }
          }
        }

        return { bad, stacked, seen };
      });

      inspected += found.seen;
      for (const b of found.bad) if (!covered.includes(b)) covered.push(b);
      for (const s of found.stacked) if (!behindStack.includes(s)) behindStack.push(s);
    }

    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(250);

    // The count is part of the result. A pass that inspected nothing is worse than a
    // failure, because it looks like the same green line.
    if (inspected === 0) {
      fail(`${w}px — inspected no links at all across ${screens} screen(s)`);
    } else if (covered.length) {
      for (const c of covered) fail(`${w}px — ${c}`);
    } else {
      ok(
        `${w}px — ${inspected} link sightings across ${screens} screen(s), each the top element at its centre`,
      );
    }

    for (const s of behindStack) warn(`${w}px — ${s} (expected; reachable in front)`);
  }

  // ── 3. pointer targets are big enough (WCAG 2.2 SC 2.5.8, 24x24 CSS px) ─────
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(900);

  // Walks the page for the same reason the coverage check does: a link held at opacity
  // 0 by a reveal that has not run yet is invisible to `checkVisibility`, and skipping
  // it silently is how a too-small target ships.
  const small = [];
  let targets = 0;
  const targetScreens = await page.evaluate(() =>
    Math.max(1, Math.ceil(document.documentElement.scrollHeight / innerHeight)),
  );

  for (let s = 0; s < targetScreens; s++) {
    await page.evaluate((i) => window.scrollTo(0, i * innerHeight), s);
    await page.waitForTimeout(350);

    const found = await page.evaluate(() => {
    const visible = (el) => {
      // display:none, visibility:hidden, opacity:0 anywhere up the tree.
      if (el.checkVisibility && !el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) {
        return false;
      }
      if (el.closest("[hidden], [inert], [aria-hidden='true']")) return false;
      // Collapsed panels. The mobile drawer here is a div with overflow-y:auto and
      // height 0 — its children are still laid out and still report boxes, so they
      // look like visible links being covered by the page behind them. They are not
      // covered; they are clipped, and nobody can reach them until the menu opens.
      for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
        const cs = getComputedStyle(n);
        const clipped = cs.overflow !== "visible" || cs.overflowY !== "visible" || cs.overflowX !== "visible";
        if (clipped && (n.clientHeight === 0 || n.clientWidth === 0)) return false;
      }
      return true;
    };
    const out = [];
    let seen = 0;
    for (const el of document.querySelectorAll("a, button")) {
      if (!visible(el)) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      // Inline links inside a sentence are exempt under the "inline" exception.
      const inline = el.closest("p, li") && getComputedStyle(el).display === "inline";
      if (inline) continue;
      seen++;
      if (r.width < 24 || r.height < 24) {
        out.push(
          `"${(el.textContent || "").trim().slice(0, 24)}" ${Math.round(r.width)}x${Math.round(r.height)}`,
        );
      }
    }
      return { out, seen };
    });

    targets = Math.max(targets, found.seen);
    for (const o of found.out) if (!small.includes(o)) small.push(o);
  }

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);

  if (targets === 0) {
    fail(`390px — inspected no pointer targets at all across ${targetScreens} screen(s)`);
  } else if (small.length) {
    for (const s of small) fail(`390px — target under 24x24 — ${s}`);
  } else {
    ok(`390px — ${targets} targets inspected, every one at least 24x24`);
  }

  await page.close();
}

await browser.close();
console.log(
  fails === 0
    ? `\nlinks ok${warns ? ` (${warns} warning${warns > 1 ? "s" : ""})` : ""}\n`
    : `\n${fails} link check(s) failed\n`,
);
process.exit(fails === 0 ? 0 : 1);
