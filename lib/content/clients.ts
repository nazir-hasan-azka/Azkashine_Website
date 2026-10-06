/**
 * The partner logos, shown in the closing chapter of the home page.
 *
 * FIFTEEN PARTNERS FROM 2026-10-06, named by Nazir in this order. Alpha Power, one of
 * the original five, is not among them and was removed. "Our partners" is the heading he
 * confirmed for the original five on 2026-09-06; the new list came from him as partners.
 *
 * WHERE THE ARTWORK CAME FROM. Every mark was taken from the company's own website on
 * 2026-10-06 — the logo file its header serves, as SVG where the site has one (Vi, VVDN,
 * MVS360) and as the largest PNG it serves otherwise, trimmed to its ink. Three needed
 * more than a download, and are worth knowing about before anyone replaces them:
 *
 *   - **Qudrah** and **Open Insights Technology** set their names as live text beside an
 *     icon, so there is no single logo file. Both were rebuilt from the company's own
 *     icon file and the exact font and weight the site uses (DM Sans 800 for Qudrah,
 *     Montserrat 700 for Open Insights). Qudrah's name is white on its dark site; here it
 *     is set in near-black for a light background. Open Insights' 8px tagline was left
 *     off, as it is unreadable at this size. If either company supplies artwork, use it.
 *   - **AionX** designs its logo as a white mark on a navy block, so the block is kept.
 *   - **Prowess** only serves a 264×40 file, which is a little soft on a 2× screen. A
 *     larger file from them would be an improvement.
 *
 * Vi's mark is the current lowercase "vi" lockup from myvi.in, not the older uppercase
 * one the previous file showed. CSG is Centre Systems Group (centresystemsgroup.net) —
 * NOT CSG Systems International at csgi.com, which is a different company.
 *
 * WHY EACH LOGO IS SIZED BY ITS SHAPE. A square mark and a long wordmark at the same
 * height make the wordmark look tiny; at the same width, the square looks huge. The row
 * reads as balanced when each mark covers roughly the same AREA, so `Clients.tsx` gives
 * each one a width that grows with its aspect ratio (to the power 0.6 — a touch more than
 * equal area, because a long wordmark's letters are thin). `weight` is the hand
 * correction on top, for marks whose ink is unusually dense or light for their shape.
 */

export interface ClientLogo {
  /** File in /public/partners, with its extension. */
  file: string;
  /** The company, as it should be read aloud by a screen reader. */
  name: string;
  /** The file's intrinsic size, trimmed to its ink. Only the ratio matters. */
  width: number;
  height: number;
  /** Optical correction on top of the shape rule. 1 is none. */
  weight?: number;
  /** Where the partner is based, as Nazir listed them on 2026-10-06. */
  country?: string;
}

/** The row's heading. */
export const CLIENTS_LABEL = "Our partners";

export const CLIENT_LOGOS: ClientLogo[] = [
  { file: "vi.svg", name: "Vodafone Idea (Vi)", width: 60, height: 60, weight: 0.9, country: "India" },
  { file: "sasken.png", name: "Sasken Technologies", width: 578, height: 350, country: "India" },
  { file: "vvdn.svg", name: "VVDN Technologies", width: 981, height: 342, country: "India" },
  { file: "cloudit.png", name: "CloudIT ME", width: 491, height: 210, country: "Qatar" },
  { file: "engineai.png", name: "Engine AI", width: 1196, height: 194, country: "Oman" },
  { file: "ixai.png", name: "IXAI Solutions", width: 129, height: 122, weight: 0.9, country: "Spain" },
  { file: "mvs360.svg", name: "MVS360", width: 160, height: 84, country: "USA" },
  { file: "csg.png", name: "Centre Systems Group", width: 1562, height: 527, country: "Saudi Arabia & UAE" },
  { file: "qudrah.png", name: "Qudrah Software and Digital Solutions", width: 1170, height: 267, weight: 0.85, country: "Saudi Arabia" },
  { file: "telenoc.png", name: "Telenoc", width: 391, height: 147, country: "Saudi Arabia" },
  { file: "mruqmi.png", name: "Mishroua Ruqmi for IT Systems", width: 1192, height: 193, country: "Saudi Arabia" },
  { file: "prowess.png", name: "Prowess", width: 264, height: 40, weight: 0.8, country: "Saudi Arabia" },
  { file: "mizala.png", name: "Mizala", width: 698, height: 190, weight: 0.9, country: "Saudi Arabia" },
  { file: "openinsights.png", name: "Open Insights Technology", width: 1398, height: 461, weight: 1.15, country: "UAE" },
  { file: "aionx.png", name: "AionX Techno Space", width: 367, height: 163, weight: 0.85, country: "India" },
];

/**
 * A logo's width in px at full size, from its shape (see the note at the top). `base` is
 * the width of a square mark; every other width follows from it.
 */
export function logoWidth(logo: ClientLogo, base = 62): number {
  return Math.round(base * Math.pow(logo.width / logo.height, 0.6) * (logo.weight ?? 1));
}
