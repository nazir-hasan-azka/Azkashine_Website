/**
 * The logos shown under the hero.
 *
 * CLEARED FOR USE, AND THE WORDING IS SETTLED. Nazir confirmed on 2026-09-06: all five
 * marks may be shown, and "Our partners" is the correct and truthful heading for all
 * five. The `HANDOFF.md` note in the previous app that recorded them as *not cleared*
 * is superseded.
 *
 * VECTOR ART: NOT PURSUED. Decided 2026-09-06 — the PNGs stay. At the sizes this row
 * renders (max 128×102 CSS px) they are effectively 1:1 on a 2× display and look fine;
 * the softness would only bite if they were ever shown much larger, and the chapter map
 * keeps them small. The findings below are kept so nobody repeats the search:
 *
 *   - **Vi** — myvi.in serves a real SVG, but it is a DIFFERENT LOCKUP from the file
 *     here (lowercase "vi" with the dot above the i, versus the uppercase mark below).
 *     Needs a decision about which is current before swapping.
 *   - **Sasken** — no SVG anywhere on sasken.com; their own site uses a 588×356 PNG,
 *     which is 2.4× ours and would be a straight improvement if re-measured.
 *   - **CSG** — do NOT take the mark from csgi.com. That is CSG Systems International,
 *     a different company. Ours carries the tagline "Secure | Resilient | Compliant".
 *   - **Alpha Power** and **CloudIT ME** — correct domains not known.
 *
 * If these are ever shown large, the heights below must be re-measured against whatever
 * new artwork arrives. They were computed from the measured ink of these exact files.
 *
 * WHY EACH LOGO HAS ITS OWN HEIGHT. Every file is the same 250×200 canvas, but the mark
 * inside occupies a wildly different part of it — measured ink boxes run from 145×118
 * (Vi) to 250×151 (Sasken) to 218×76 (CSG). Rendered at one shared height Sasken reads
 * half again as large as CSG and the row looks broken. These heights were computed from
 * the measured ink of each file so every mark carries the same optical weight; they are
 * not guesses, and they only hold for these exact files. New artwork means re-measuring.
 */

export interface ClientLogo {
  /** File in /public/partners, without the extension. */
  file: string;
  /** The company, as it should be read aloud by a screen reader. */
  name: string;
  /**
   * Render height in px for the 250×200 canvas at full size, from the optical
   * measurement above. `Clients.tsx` turns this into a fluid clamp — every logo scales
   * by the same factor, so the row stays optically balanced at every width rather than
   * jumping at a breakpoint.
   */
  height: number;
}

/**
 * The row's heading. Confirmed by Nazir on 2026-09-06 as true of all five: they are
 * partners, and the site may say so.
 */
export const CLIENTS_LABEL = "Our partners";

export const CLIENT_LOGOS: ClientLogo[] = [
  { file: "vi", name: "Vi", height: 100 },
  { file: "sasken", name: "Sasken", height: 68 },
  { file: "csg", name: "CSG", height: 102 },
  { file: "alpha-power", name: "Alpha Power", height: 87 },
  { file: "cloudit", name: "CloudIT ME", height: 96 },
];
