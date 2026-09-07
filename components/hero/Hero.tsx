import Link from "next/link";
import { HOME_HERO } from "@/lib/content/home";
import { ApertureCanvas, type HeroGround } from "@/components/hero/ApertureCanvas";
import { heavy } from "@/lib/fonts";

/**
 * The home hero.
 *
 * The headline is the only object on the page, and it is cut out of the paper: inside
 * the letterforms a lit volume moves, and light from it falls on the sheet around them.
 * There is no graphic beside the copy, because there is no graphic — every earlier
 * version of this hero was a different object to the right of a paragraph, and the
 * object was never the thing holding it back.
 *
 * LAYERING, and it is load-bearing. The `<h1>` is a real heading in ink, sitting
 * *underneath* the canvas. On arrival the canvas floods the letters with light from
 * left to right; where the wipe has not yet reached, the ink shows through. Once it
 * passes, the ink fades out and the glyphs belong to the canvas. That ordering is why
 * the entrance reads as ignition rather than as a fade-in, and it is also the fallback:
 * with no WebGL2, no JavaScript, or a font that never loads, the wipe never starts and
 * the page stays a heavy ink headline — finished, not broken.
 *
 * MATERIAL. There is one, and it is settled: the refraction splits across the colour
 * channels the way light through thick glass does, and moving the pointer strikes rings
 * that travel out through the volume and bend it as they pass. Four earlier materials
 * (cut, flood, ink, and ripple on its own) were built, compared, and dropped.
 *
 * GROUND is the part still open, so it is the prop — `/lab/ground/*` renders this same
 * component on each. `/` takes the default.
 */
const GROUND: HeroGround = "paper";

export function Hero({ ground = GROUND }: { ground?: HeroGround } = {}) {
  // Four lines. The words and their order are exactly `HOME_HERO`'s — only where they
  // break differs, and it is derived from the signed-off string rather than retyped.
  const words = HOME_HERO.headingLine1.split(" ");
  const lines = [
    words.slice(0, 2).join(" "),
    words.slice(2).join(" "),
    HOME_HERO.headingAccent,
    HOME_HERO.headingLine2,
  ];

  return (
    <section
      data-hero
      data-ground={ground}
      className="relative isolate -mt-20 min-h-[100svh] overflow-hidden pt-20"
    >
      {/* Order matters: ink heading, then canvas over it, then the page chrome. */}
      <h1 className="hero-h1">
        {lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h1>

      <ApertureCanvas lines={lines} fontFamily={heavy.style.fontFamily} ground={ground} />

      <div aria-hidden="true" className="hero-grain" />

      <div className="hero-frame">
        {/* Nothing sits up here now. The company name went because the logo is
            directly above it in the header, and the eyebrow went because it named the
            three practices that the closing band already names, numbered. */}

        <div className="hero-bottom">
          <p className="hero-lede">{HOME_HERO.lede}</p>
          <div className="hero-cta">
            <Link href={HOME_HERO.primary.href} className="hero-btn hero-btn-solid">
              {HOME_HERO.primary.label}
              <span className="nudge" aria-hidden="true">
                →
              </span>
            </Link>
            <Link href={HOME_HERO.secondary.href} className="hero-btn hero-btn-ghost">
              {HOME_HERO.secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
