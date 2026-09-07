import { Hero } from "@/components/hero/Hero";
import { TraceCanvas } from "@/components/film/TraceCanvas";
import { Request } from "@/components/film/chapters/Request";
import { Gate } from "@/components/film/chapters/Gate";
import { Breath } from "@/components/film/chapters/Breath";
import { Ledger } from "@/components/film/chapters/Ledger";
import { Running } from "@/components/film/chapters/Running";
import { RunningPanels } from "@/components/film/chapters/RunningPanels";
import { Failure } from "@/components/film/chapters/Failure";
import { Why } from "@/components/film/chapters/Why";
import { Signed } from "@/components/film/chapters/Signed";

/**
 * THE FILM. The home page as one continuous piece — see `.claude/DIRECTION.md`.
 *
 * ONE CANVAS, MOUNTED HERE, FOR EVERY CHAPTER. `TraceCanvas` is the only 2D context on
 * the page and the hero's WebGL context is the only other context of any kind. Chapters
 * register *segments* into the one that exists; not one of them creates its own. This is
 * the decision `DIRECTION.md` says is most likely to be broken by accident, so it is
 * worth saying plainly: if a chapter file ever calls `getContext`, that is the bug.
 *
 * Nothing here draws into the hero's canvas either. It paints its resting frame once and
 * is never woken, which is the whole reason the arrival costs nothing after it is over.
 *
 * THE CHAPTER MAP, and why it is in this order:
 *
 *   00  Aperture         the hero, unchanged. The line leaves a letterform it measured
 *   01  The request      AI & Automation — the branch, then the gate
 *   02  What we do       the breath. Near-empty, and the reason 35 screens is survivable
 *   03  The ledger       three practices, twelve capabilities, a different move for each
 *   04  Already running  eight product interfaces, travelling
 *   05  The failure      Cloud Services & Testing — the only backwards motion on the site
 *   06  The case         the three reasons, each showing the receipt for itself
 *   07  Signed           industries, partners, the mark. Not a scene; the film lets go
 *
 * THE THREE PRACTICES CARRY EQUAL WEIGHT BY CONSTRUCTION, not by good intentions.
 * Chapter 01 is AI & Automation and chapter 05 is Cloud Services & Testing, each with a
 * move nothing else has. Digital Platforms runs through chapter 03 — where its lanes are
 * one of the three distinct trace behaviours — and chapter 04, where the audit trail
 * that is its argument is applied to the website's own copy. The ledger comes BEFORE the
 * products deliberately: the products split five, two and one across the practices, and
 * the capabilities split four, four and four. Leading with the twelve is the honest
 * order for a company that does three things in equal measure.
 *
 * Anyone editing this file should read that paragraph again before reordering it.
 */
export function Film() {
  return (
    <div className="film">
      <TraceCanvas />

      <Hero />
      <Request />
      <Gate />
      <Breath />
      <Ledger />
      {/* The panels are passed in rather than imported by `Running`, so the eight coded
          interfaces stay server-rendered and never reach the browser bundle. */}
      <Running>
        <RunningPanels />
      </Running>
      <Failure />
      <Why />
      <Signed />
    </div>
  );
}
