// Responsive audit for the home hero.
//
// The hero places almost everything absolutely and sizes its type from the window, so
// the failure mode is never a broken layout — it is a collision. The headline growing
// into the eyebrow, the copy sliding under the closing band, a line of type running off
// the gutter. None of those throw, and a screenshot at one width will not show them.
//
// So this measures, at every size, the four gaps that have to stay positive and the one
// number that has to stay zero.
//
// Needs a dev server: `npm run dev`, then `node tests/responsive.mjs [screenshot-dir]`.

import { chromium } from "playwright";

const OUT = process.argv[2] || null;
const BASE = process.env.BASE_URL || "http://localhost:3000";

const SIZES = [
  [320, 568, "iphone se, smallest in play"],
  [360, 640, "small android"],
  [390, 844, "iphone 14"],
  [414, 896, "iphone plus"],
  [600, 960, "phablet"],
  [768, 1024, "ipad portrait"],
  [820, 1180, "ipad air"],
  [1024, 768, "ipad landscape"],
  [1180, 820, "tablet landscape"],
  [1280, 720, "small laptop"],
  [1366, 768, "common laptop"],
  [1440, 900, "macbook"],
  [1520, 720, "short laptop"],
  [1600, 600, "very short window"],
  [1920, 1080, "desktop"],
  [2560, 1440, "large desktop"],
];

let fails = 0;
const log = (ok, label, detail) => {
  if (!ok) fails++;
  console.log(`    ${ok ? "ok  " : "FAIL"} ${label}${detail ? " — " + detail : ""}`);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.setDefaultTimeout(90000);

const errors = [];
page.on("pageerror", (e) => errors.push(e.message.slice(0, 140)));

await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
// The hero arrival runs 2.2s and the trace drops 3.4s after that.
await page.waitForTimeout(6000);

for (const [w, h, name] of SIZES) {
  await page.setViewportSize({ width: w, height: h });
  // The canvas rebuilds its mask on a debounce, and the type resizes with it.
  await page.waitForTimeout(1100);

  const m = await page.evaluate(() => {
    const box = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right };
    };

    // The drawn glyphs, not the h1's box — the box is width-constrained and the
    // section clips, so an overrun never shows up in the element's own rectangle.
    const h1 = document.querySelector("h1");
    let inkLeft = Infinity;
    let inkRight = -Infinity;
    let inkTop = Infinity;
    let inkBottom = -Infinity;
    const walk = document.createTreeWalker(h1, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      if (!n.textContent.trim()) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      const r = range.getBoundingClientRect();
      inkLeft = Math.min(inkLeft, r.left);
      inkRight = Math.max(inkRight, r.right);
      inkTop = Math.min(inkTop, r.top);
      inkBottom = Math.max(inkBottom, r.bottom);
    }

    /* Read from an element that actually resolves the gutter.
       This read `.hero-frame`'s padding-left, which went to 0 when the horizontal
       padding moved to its children so the closing band could run full width — and
       `--page-gutter` is `max(4.5rem, calc((100% - 1440px) / 2))`, which a custom
       property lookup on :root hands back unresolved. So the two gutter assertions
       below have been measuring the headline against zero: they could only catch type
       running off the viewport, never type off the gutter, which is the thing standard
       1 names. `.clients-inner` pads with `var(--page-gutter)` directly. */
    const gutter = parseFloat(
      getComputedStyle(document.querySelector(".clients-inner")).paddingLeft,
    );

    const cta = [...document.querySelectorAll("a")].filter((el) =>
      /Explore our products|Book a demo/i.test(el.textContent || ""),
    );
    const ctaHits = cta.map((el) => {
      const r = el.getBoundingClientRect();
      const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return el.contains(top) || el === top;
    });

    return {
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
      ink: { left: inkLeft, right: inkRight, top: inkTop, bottom: inkBottom },
      heroTop: box("[data-hero]"),
      bottom: box(".hero-bottom"),
      hero: box("[data-hero]"),
      clients: box(".clients"),
      logos: [...document.querySelectorAll(".clients-row img")].map((el) => {
        const r = el.getBoundingClientRect();
        return { w: Math.round(r.width), h: Math.round(r.height) };
      }),
      header: box("header"),
      gutter,
      ctaCount: cta.length,
      ctaHits,
      w: innerWidth,
      h: innerHeight,
      fontSize: parseFloat(getComputedStyle(h1).fontSize),
    };
  });

  console.log(`\n  ${String(w).padStart(4)}x${String(h).padEnd(5)} ${name}`);

  log(m.scrollW <= m.clientW + 1, "no horizontal overflow", `${m.scrollW} vs ${m.clientW}`);
  log(
    m.ink.left >= m.gutter - 1.5,
    "headline starts on the gutter",
    `${m.ink.left.toFixed(0)} vs ${m.gutter.toFixed(0)}`,
  );
  log(
    m.ink.right <= m.w - m.gutter + 1.5,
    "headline ends inside the gutter",
    `${m.ink.right.toFixed(0)} vs ${(m.w - m.gutter).toFixed(0)}`,
  );
  log(
    m.ink.top >= m.header.bottom - 1,
    "headline clears the header",
    `gap ${(m.ink.top - m.header.bottom).toFixed(0)}px`,
  );
  log(
    m.ink.bottom <= m.bottom.top + 1,
    "headline clears the copy",
    `gap ${(m.bottom.top - m.ink.bottom).toFixed(0)}px`,
  );
  log(
    m.bottom.bottom <= m.hero.bottom + 1,
    "copy sits inside the hero",
    `gap ${(m.hero.bottom - m.bottom.bottom).toFixed(0)}px`,
  );
  // The logo row is the hero's floor, so it has to be reachable without hunting and
  // every mark has to render — a missing file shows as a zero-height image, not an error.
  log(
    m.clients !== null && m.logos.length === 5,
    "five client logos render",
    `${m.logos.length} found`,
  );
  log(
    m.logos.every((l) => l.w > 8 && l.h > 8),
    "no logo collapsed",
    JSON.stringify(m.logos),
  );
  log(
    m.ctaCount === 2 && m.ctaHits.every(Boolean),
    "both CTAs are clickable",
    `${m.ctaCount} found, hits ${JSON.stringify(m.ctaHits)}`,
  );

  /* The stacking deck that used to be measured here is gone: `/` is the film now and
     the three practices are chapter 03, which is a pinned scene rather than a card
     stack. What replaced this check is bigger than it was — the whole-site sweep
     below, which walks every one of the seventeen routes at every one of these
     sizes. The deck's own lesson survives in it: measure TEXT INK, not element
     boxes, because a grid child will not shrink under its longest word and paints
     outside a box that never changes. */

  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);

  if (OUT) {
    await page.screenshot({ path: `${OUT}/resp-${w}x${h}.png`, timeout: 90000 });
  }
}

log(errors.length === 0, "no page errors across the home sweep", errors.slice(0, 2).join(" | "));

/* ─── Every route, every size ─────────────────────────────────────────────────

   The checks above are about the hero and only the hero. This is standard 1 for the
   rest of the site: seventeen routes across sixteen viewports, 320x568 to 2560x1440.

   Until 2026-09-07 this file opened `/` and nothing else, so it reported green having
   never looked at a single interior page. That is the third time that class of bug has
   appeared in this repo, and it is why every block below counts what it inspected and
   fails if the count is zero.

   TWO THINGS ARE MEASURED, and the second is the one that catches real faults:

     1. The document does not scroll sideways. Cheap, and it is the headline promise.
     2. No VISIBLE TEXT crosses either page edge. An element box can stay put while the
        glyphs inside it paint outside — a grid child defaults to `min-width: auto` and
        will not shrink below its longest word. Ink is measured with a Range, not a
        bounding box.

   Text clipped by an ancestor is skipped rather than reported. The film's stages are
   `overflow: hidden` and its traversing track is deliberately wider than the window;
   flagging that would be flagging the design working. What is checked is what a
   visitor can actually see. */

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

if (ROUTES.length !== 17) {
  log(false, `ROUTES holds ${ROUTES.length}, expected 17`);
}

console.log("\n\n  ── every route, every size ──────────────────────────────────");

let measured = 0;
const sweep = await browser.newPage({ viewport: { width: 1440, height: 900 } });
sweep.setDefaultTimeout(90000);
const sweepErrors = [];
sweep.on("pageerror", (e) => sweepErrors.push(e.message.slice(0, 140)));

for (const route of ROUTES) {
  const res = await sweep.goto(`${BASE}${route}`, { waitUntil: "networkidle" });
  if (!res || res.status() >= 400) {
    log(false, `${route} loads`, `status ${res ? res.status() : "none"}`);
    continue;
  }
  await sweep.waitForTimeout(route === "/" ? 5000 : 900);

  const bad = [];
  for (const [w, h] of SIZES) {
    await sweep.setViewportSize({ width: w, height: h });
    // Long enough for the hero to rebuild its mask and for fluid type to resettle.
    await sweep.waitForTimeout(route === "/" ? 900 : 320);

    const m = await sweep.evaluate(() => {
      const doc = document.documentElement;
      const clientW = doc.clientWidth;

      /** Is this node clipped away by an ancestor rather than painted outside? */
      const clipRight = (el) => {
        let limit = Infinity;
        for (let n = el; n && n !== doc; n = n.parentElement) {
          const cs = getComputedStyle(n);
          if (cs.overflowX !== "visible" || cs.overflow !== "visible") {
            limit = Math.min(limit, n.getBoundingClientRect().right);
          }
        }
        return limit;
      };
      const clipLeft = (el) => {
        let limit = -Infinity;
        for (let n = el; n && n !== doc; n = n.parentElement) {
          const cs = getComputedStyle(n);
          if (cs.overflowX !== "visible" || cs.overflow !== "visible") {
            limit = Math.max(limit, n.getBoundingClientRect().left);
          }
        }
        return limit;
      };

      let worstRight = 0;
      let worstLeft = 0;
      let sample = "";
      let inspected = 0;
      const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = walk.nextNode(); n; n = walk.nextNode()) {
        const text = (n.textContent || "").trim();
        if (!text) continue;
        const el = n.parentElement;
        if (!el) continue;
        if (el.closest("[aria-hidden='true'], [hidden]")) continue;
        if (el.checkVisibility && !el.checkVisibility({ opacityProperty: false, visibilityProperty: true })) {
          continue;
        }
        const range = document.createRange();
        range.selectNodeContents(n);
        const r = range.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        inspected++;

        // Only the part a visitor can see. Anything an ancestor clips away is not on
        // the page, whatever its rectangle says.
        const right = Math.min(r.right, clipRight(el));
        const left = Math.max(r.left, clipLeft(el));
        if (right <= left) continue;

        const overRight = right - clientW;
        const overLeft = -left;
        if (overRight > worstRight) {
          worstRight = overRight;
          sample = text.slice(0, 44);
        }
        if (overLeft > worstLeft) {
          worstLeft = overLeft;
          sample = text.slice(0, 44);
        }
      }

      return {
        scrollW: doc.scrollWidth,
        clientW,
        worstRight,
        worstLeft,
        sample,
        inspected,
      };
    });

    measured += m.inspected;
    if (m.inspected === 0) bad.push(`${w}x${h} inspected no text at all`);
    if (m.scrollW > m.clientW + 1) {
      bad.push(`${w}x${h} scrolls sideways (${m.scrollW} vs ${m.clientW})`);
    }
    // A glyph's side bearing can sit a hair outside its own text box.
    if (m.worstRight > 1.5) {
      bad.push(`${w}x${h} text ${m.worstRight.toFixed(0)}px past the right edge — "${m.sample}"`);
    }
    if (m.worstLeft > 1.5) {
      bad.push(`${w}x${h} text ${m.worstLeft.toFixed(0)}px past the left edge — "${m.sample}"`);
    }
  }

  if (bad.length) {
    for (const b of bad.slice(0, 4)) log(false, `${route} — ${b}`);
    if (bad.length > 4) log(false, `${route} — and ${bad.length - 4} more`);
  } else {
    log(true, `${route}`, `${SIZES.length} sizes, no overflow, no text off the page`);
  }
}

await sweep.close();

// A green check that inspected nothing is worse than a red one.
log(measured > 5000, "the sweep actually looked at something", `${measured} text runs measured`);
log(sweepErrors.length === 0, "no page errors across the route sweep", sweepErrors.slice(0, 2).join(" | "));

await browser.close();
console.log(fails === 0 ? "\nall sizes pass\n" : `\n${fails} check(s) failed\n`);
process.exit(fails === 0 ? 0 : 1);
