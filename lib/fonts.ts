import { Archivo_Black, Figtree, JetBrains_Mono } from "next/font/google";

/**
 * The site's three faces.
 *
 * next/font self-hosts each of these into the build output, so this is still safe
 * under `output: export` on a host with no CDN in front of it: no runtime request
 * to Google, and no render-blocking `<link>`.
 *
 * - `figtree`  — the body face, from the Figma tokens.
 * - `heavy`    — display. The hero draws it into a canvas as a mask, so it needs
 *                the family name at runtime; `heavy.style.fontFamily` gives it
 *                without reading a computed style off an element.
 * - `mono`     — labels, eyebrows and the small print.
 */
export const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const heavy = Archivo_Black({
  variable: "--font-heavy",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const mono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});
