// The home hero.
//
// Asserts the things a screenshot cannot. Chiefly that something is actually moving —
// an effect can be correct in the source and reach the browser as a stale CSS chunk
// that changes zero pixels, and a reveal wipe can be inverted so the material is
// masked out entirely while the page still looks plausible.
//
// Needs a dev server, and `npx playwright install chromium` once.
// Pass a directory as argv[2] to also write screenshots; without one it writes none.

import { chromium } from "playwright";

const OUT = process.argv[2] || null;
const BASE = process.env.BASE_URL || "http://localhost:3000";

const shot = (page, name) =>
  OUT ? page.screenshot({ path: `${OUT}/${name}.png` }) : page.screenshot();

let fails = 0;
const ok = (label, cond, extra = "") => {
  if (!cond) fails++;
  console.log(`  ${cond ? "ok  " : "FAIL"} ${label}${extra ? " — " + extra : ""}`);
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

const errors = [];
page.on("pageerror", (e) => errors.push(e.message.slice(0, 160)));
page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 160)));

await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.waitForTimeout(3000);
await page.mouse.move(520, 400);
await page.waitForTimeout(900);
await shot(page, "hero");

ok("no page errors", errors.length === 0, errors.slice(0, 2).join(" | "));

// The signed-off copy survived the re-breaking of the lines.
const heading = await page.evaluate(() => {
  const h = document.querySelector("h1");
  return h ? h.textContent.replace(/\s+/g, " ").trim() : "";
});
const squash = (t) => t.replace(/\s+/g, "");
ok(
  "h1 carries the signed-off words",
  squash(heading) === squash("Transform your business with AI-powered intelligence"),
  heading,
);

// The canvas took over, which is also what hands the glyphs their material.
const state = await page.evaluate(() => {
  const s = document.querySelector("[data-hero]");
  const c = document.querySelector(".hero-canvas");
  return {
    canvas: s?.getAttribute("data-canvas"),
    lit: s?.getAttribute("data-lit"),
    cw: c?.width ?? 0,
    dpr: devicePixelRatio,
    w: innerWidth,
  };
});
ok("canvas reported ready", state.canvas === "on");
ok("reveal completed", state.lit === "true");

/* `.hero-canvas` BY NAME, not the first canvas on the page.
   There are two canvases on `/` now — the trace's 2D context comes first in the DOM
   because it is fixed and has to sit behind everything — and asking a canvas that
   already holds a 2D context for a WebGL2 one returns null, not an error. The symptom
   was `Cannot read properties of null (reading 'readPixels')`, which says nothing at
   all about the actual cause. */

// The material is actually painted. A masked-out reveal leaves the glyphs empty while
// the edge shadow still draws, which looks deliberate — so read the buffer rather than
// trusting the picture. Scan a block over the type instead of point-sampling: which
// device pixel lands inside a letter depends on the viewport, and a guessed coordinate
// silently samples the gap between two words.
//
// This needs `preserveDrawingBuffer: true` on the context, which ApertureCanvas sets
// deliberately. Without it readPixels returns zeroes after compositing.
const px = await page.evaluate(() => {
  const c = document.querySelector(".hero-canvas");
  const gl = c.getContext("webgl2");
  const w = Math.round(c.width * 0.5);
  const h = Math.round(c.height * 0.4);
  const x0 = Math.round(c.width * 0.03);
  const y0 = Math.round(c.height * 0.3);
  const buf = new Uint8Array(w * h * 4);
  gl.readPixels(x0, y0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, buf);
  let best = [0, 0, 0, 0];
  let opaque = 0;
  for (let i = 0; i < buf.length; i += 4) {
    if (buf[i + 3] > 245) opaque++;
    if (buf[i + 3] > best[3]) best = [buf[i], buf[i + 1], buf[i + 2], buf[i + 3]];
  }
  return { best, opaque, total: w * h };
});
const share = px.opaque / px.total;
ok("glyphs are painted, not transparent", px.best[3] > 245, `peak alpha ${px.best[3]}`);
ok(
  "the type covers a real share of the block",
  share > 0.05,
  `${(share * 100).toFixed(1)}% opaque`,
);
ok(
  "and the material is blue, not paper",
  px.best[2] > px.best[0],
  `r${px.best[0]} g${px.best[1]} b${px.best[2]}`,
);

const a = await page.screenshot();
await page.waitForTimeout(1400);
const b = await page.screenshot();
ok("pixels change over time", Buffer.compare(a, b) !== 0);

const hits = await page.evaluate(() => {
  const links = [...document.querySelectorAll("a")].filter((el) =>
    /Explore our products|Book a demo/i.test(el.textContent || ""),
  );
  return links.map((el) => {
    const r = el.getBoundingClientRect();
    const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return { label: el.textContent.trim().slice(0, 24), hit: el.contains(top) || el === top };
  });
});
ok(
  "both CTAs are the top element at their centre",
  hits.length === 2 && hits.every((h) => h.hit),
  JSON.stringify(hits),
);

// Resize with no reload — the failure mode the previous canvas hero had.
await page.setViewportSize({ width: 1024, height: 780 });
await page.waitForTimeout(1200);
await shot(page, "hero-1024");
const after = await page.evaluate(() => {
  const c = document.querySelector(".hero-canvas");
  return { cw: c.width, w: innerWidth, dpr: devicePixelRatio };
});
ok(
  "canvas backing store followed the resize",
  Math.abs(after.cw - Math.round(after.w * Math.min(after.dpr, 2))) <= 2,
  `${after.cw} for ${after.w}`,
);

// 390px: the section clips, so a box check never sees an overrun. Measure the glyphs.
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(1200);
await shot(page, "hero-390");
const narrow = await page.evaluate(() => {
  const h = document.querySelector("h1");
  let widest = 0;
  const walk = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
  for (let n = walk.nextNode(); n; n = walk.nextNode()) {
    if (!n.textContent.trim()) continue;
    const r = document.createRange();
    r.selectNodeContents(n);
    widest = Math.max(widest, r.getBoundingClientRect().right);
  }
  return {
    right: Math.round(widest),
    w: innerWidth,
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
  };
});
ok("no horizontal overflow at 390px", narrow.scrollW <= narrow.clientW + 1);
ok("headline glyphs fit at 390px", narrow.right <= narrow.w + 1, `${narrow.right} vs ${narrow.w}`);

await page.close();

// Reduced motion: nothing loops.
const rm = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
await rm.goto(`${BASE}/`, { waitUntil: "networkidle" });
/* WAIT FOR THE STATE THIS IS ABOUT, not for a stopwatch.
   It waited a flat 2400ms, which was a race: the hero boots behind
   `document.fonts.load`, and under reduced motion it paints exactly once when that
   resolves. If that single paint landed between the two screenshots the check failed,
   and whether it did depended on how much layout work the rest of the page happened to
   be doing — so an unrelated change elsewhere could flip it. `data-lit` is set by the
   hero at the moment it has drawn, which is the thing "holds still" starts from. */
await rm.waitForSelector('[data-hero][data-lit="true"]', { timeout: 30000 });
await rm.waitForTimeout(1200);
const r1 = await rm.screenshot();
await rm.waitForTimeout(1600);
const r2 = await rm.screenshot();
ok("holds still under prefers-reduced-motion", Buffer.compare(r1, r2) === 0);
await shot(rm, "hero-reduced");
await rm.close();

await browser.close();
console.log(fails === 0 ? "\nall checks passed" : `\n${fails} check(s) failed`);
process.exit(fails === 0 ? 0 : 1);
