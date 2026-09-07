// Copy and token standards. No browser, no server — reads the source and exits.
//
// Two things it enforces, both of which drift silently:
//
//   COPY. Every user-facing sentence lives in `lib/content/`, so it can all be checked
//   in one place. This catches the mechanical faults — straight apostrophes, double
//   spaces, stray whitespace. It cannot catch a sentence that is grammatical and wrong;
//   that still needs a person.
//
//   TOKENS. A raw hex or a one-off `text-[13px]` is how a design system dies. There are
//   already three type scales in this codebase — the hero's, Tailwind's defaults, and a
//   set of arbitrary pixel values carried in with the staged components — which is
//   exactly the drift this stops getting worse.
//
// Run: `node tests/standards.mjs`

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

let fails = 0;
const fail = (file, msg) => {
  fails++;
  console.log(`    FAIL ${file} — ${msg}`);
};
const ok = (msg) => console.log(`    ok   ${msg}`);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name === "out") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p.split("\\").join("/"));
  }
  return out;
}

const all = walk(".");
// A check that inspects nothing and reports green is worse than one that fails. This
// suite already did exactly that once, because `join(".", x)` drops the "./" prefix and
// every filter matched zero files.
if (all.length < 5) {
  console.log("    FAIL could not read the source tree — refusing to report a pass");
  process.exit(1);
}

/**
 * Every complete double-quoted string in a file.
 *
 * Matching "four characters or more" looked reasonable and was wrong: a short literal
 * like "vi" failed the minimum, so its closing quote became an opening quote and paired
 * with the next literal's opening quote — and the checker started reporting on the code
 * between strings. Matching every string, then filtering by what it looks like, keeps
 * the quotes paired correctly.
 */
const STRINGS = /"([^"\n\\]*(?:\\.[^"\n\\]*)*)"/g;

/** Does this literal look like a sentence a visitor will read, rather than a slug? */
const isProse = (s) => s.length >= 12 && s.includes(" ") && /[a-z]/.test(s);

// ─── copy ─────────────────────────────────────────────────────────────────────
console.log("\n  copy");

const contentFiles = all.filter((f) => f.startsWith("lib/content/"));
if (contentFiles.length === 0) {
  fail("lib/content", "no content files found — the copy rules checked nothing");
}

let prose = 0;
for (const file of contentFiles) {
  const src = readFileSync(file, "utf8");
  for (const m of src.matchAll(STRINGS)) {
    const text = m[1];
    if (!isProse(text)) continue;
    if (text.includes("http") || text.startsWith("/")) continue;
    prose++;

    if (text.includes("  ")) {
      fail(file, `double space — "${text.slice(0, 60)}"`);
    }
    if (/\w'\w/.test(text)) {
      fail(file, `straight apostrophe, use \u2019 — "${text.slice(0, 60)}"`);
    }
    if (text !== text.trim()) {
      fail(file, `leading or trailing space — "${text.slice(0, 60)}"`);
    }
  }
}
ok(`${contentFiles.length} content files, ${prose} sentences checked`);
if (!fails) ok("no double spaces, straight apostrophes or stray whitespace");

// ─── tokens ───────────────────────────────────────────────────────────────────
console.log("\n  tokens");

/**
 * Only OUR code. `components/ui` and `components/product-ui` came across from the
 * previous app finished and unreviewed — they carry the old scale, and holding them to
 * this today would produce a wall of failures for code nobody is editing. They join
 * when they get rebuilt.
 *
 * `components/sections` is named as a directory rather than file by file. It was
 * `components/sections/Clients` alone, which meant the next section built landed
 * *outside* the token rules and this suite would have reported a pass having never
 * opened it — the same silent-pass failure the header of this file exists to prevent.
 * Navbar and Footer came across finished and are exempt by name until rebuilt, so
 * exempting is a deliberate act now instead of the default.
 *
 * `components/variations/` was on this list until 2026-09-07. The prototypes it held
 * were retired when the film became the home page; the rule is kept in mind rather
 * than in code, because a filter matching a directory that does not exist is a rule
 * that silently protects nothing.
 */
const CARRIED_OVER = ["components/sections/Navbar", "components/sections/Footer"];

const OURS = (f) =>
  (f.startsWith("components/hero") ||
    // The film is not a prototype of the design system, it is where the home page is
    // being rebuilt — it swaps into `/` in one move. It is held to the rules from the
    // first file rather than from the day it moves.
    f.startsWith("components/film/") ||
    f.startsWith("components/site/") ||
    f.startsWith("lib/film/") ||
    (f.startsWith("components/sections/") &&
      !CARRIED_OVER.some((c) => f.startsWith(c))) ||
    f.startsWith("app/")) &&
  [".tsx", ".ts", ".css"].includes(extname(f));

const ours = all.filter(OURS);
if (ours.length === 0) {
  fail("components", "no files in scope — the token rules checked nothing");
}
ok(`${ours.length} files in scope (staged components exempt until rebuilt)`);

const before = fails;

for (const file of ours) {
  const src = readFileSync(file, "utf8");

  // Comments describe colours constantly — half the notes in globals.css name the hex
  // they replaced. Scanning them produced three findings that were prose.
  const code = src
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1");

  /**
   * Not every hex is a design decision. The mask in ApertureCanvas packs three fields
   * into the red, green and blue channels of one texture, so #ff0000 there is which
   * channel to write, not what colour to paint. Black and white are grounds.
   */
  const DATA = new Set(["#000", "#fff", "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff"]);

  if (file.endsWith(".tsx")) {
    for (const m of code.matchAll(/\btext-\[(\d+(?:\.\d+)?)(px|rem)\]/g)) {
      fail(file, `arbitrary type size text-[${m[1]}${m[2]}] — use a scale step`);
    }
    for (const m of code.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
      if (DATA.has(m[0].toLowerCase())) continue;
      fail(file, `raw hex ${m[0]} — use a token`);
    }
  }

  if (file.endsWith(".css")) {
    // The rule is about where a colour is NAMED versus where it is USED. A hex on the
    // right of a custom property is a token being defined, which is the whole point of
    // tokens. A hex on `background:` or `color:` is a value nobody can find again.
    for (const line of code.split("\n")) {
      const hexes = line.match(/#[0-9a-fA-F]{3,8}\b/g);
      if (!hexes) continue;
      if (/^\s*--[a-z0-9-]+\s*:/.test(line)) continue;
      for (const hex of hexes) {
        if (DATA.has(hex.toLowerCase())) continue;
        fail(file, `raw hex ${hex} used directly — define a custom property instead`);
      }
    }
  }
}
if (fails === before) ok("no raw hex or arbitrary type sizes in our code");

console.log(fails === 0 ? "\nstandards ok\n" : `\n${fails} standards check(s) failed\n`);
process.exit(fails === 0 ? 0 : 1);
