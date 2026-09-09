import type { CSSProperties } from "react";
import Link from "next/link";
import { FLOOR } from "@/lib/content/floor";
import { PRODUCTS_IN_RUN_ORDER } from "@/lib/content/products";
import { CATEGORIES, CATEGORY_BY_SLUG } from "@/lib/content/taxonomy";
import { INDUSTRIES } from "@/lib/content/industries";
import { ProductVisual, hasVisual } from "@/components/product-ui/ProductVisual";
import {
  DESKTOP,
  HANDHELD,
  focusAngle,
  poseFor,
  radiusFor,
  signStand,
  standFor,
  standTransform,
  timeline,
} from "@/lib/floor/room";

/**
 * What stands in the room: the signage on the walls and the eight coded product
 * interfaces. The floor is not here — it lives in `Room.tsx`, outside the turning element,
 * for the performance reason recorded on `floorTransform`.
 *
 * A SERVER COMPONENT, the same split `RunningPanels.tsx` uses — the interfaces are several
 * hundred lines of JSX and none of it needs to reach the browser as JavaScript. `Room.tsx`
 * takes all of it as `children`.
 *
 * THE OPENING POSE IS IN THE MARKUP, as `--tf0` and `--tf0-sm`, so the room is standing
 * before hydration rather than assembling itself once JavaScript arrives. That is only
 * possible because the geometry is hashed rather than random.
 */

const COUNT = PRODUCTS_IN_RUN_ORDER.length;
const SIGNS = [
  ...CATEGORIES.map((c) => c.navLabel),
  ...INDUSTRIES.map((i) => i.name),
];

const OPEN = timeline(0, COUNT);

/* The stands are fixed, so the opening angles are too. Computed once at module scope. */
const STANDS = PRODUCTS_IN_RUN_ORDER.map((p, i) => standFor(p.slug, i, COUNT));
const AIM = focusAngle(
  OPEN,
  STANDS.map((s) => s.angle),
  DESKTOP.hold,
);

/* The room's radius follows the panel's width, and the panel's width is a CSS rule — so
   the markup has to assume one. These are that rule evaluated at the two reference
   windows: `min(32rem, 46vw)` at 1440, and `min(26rem, 82vw)` at 390. They govern only the
   first painted frame; the browser measures the real width on its first tick and the room
   resizes to whatever the stylesheet actually gave it. */
const RD = radiusFor(Math.min(32 * 16, 1440 * 0.46));
const RH = radiusFor(Math.min(26 * 16, 390 * 0.82));

const REST = { x: 0, y: 0, bank: 0 };

export function RoomPanels() {
  return (
    <>
      {/* The signs, offset half a slot from the products so a word is never directly
          behind the panel you are reading. Every one is also real text elsewhere on the
          page — in a panel's practice label or in the index below — so hiding it from
          assistive technology loses nothing. */}
      {SIGNS.map((label, i) => {
        const d = signStand(label, i, SIGNS.length);
        const tf = (radius: number) =>
          `rotateY(${((d.angle * 180) / Math.PI).toFixed(2)}deg) translateZ(${(
            d.reach * radius
          ).toFixed(0)}px) translateY(${(d.rise * radius).toFixed(0)}px)`;
        return (
          <span
            key={label}
            aria-hidden="true"
            className="room-sign"
            style={{ "--tf0": tf(RD), "--tf0-sm": tf(RH) } as CSSProperties}
          >
            {label}
          </span>
        );
      })}

      {PRODUCTS_IN_RUN_ORDER.map((product, i) => {
        const stand = STANDS[i];
        const d = poseFor(stand, i, AIM, RD, OPEN, DESKTOP);
        const h = poseFor(stand, i, AIM, RH, OPEN, HANDHELD);
        const category = CATEGORY_BY_SLUG[product.category];

        return (
          <article
            key={product.slug}
            className="room-panel"
            /* Read by the painter in `Room.tsx`. Passing them through the DOM rather than
               as props is what keeps `products.ts` out of the client bundle. */
            data-slug={product.slug}
            data-band={d.band}
            data-name={product.name}
            style={
              {
                "--tf0": standTransform(d, REST),
                "--tf0-sm": standTransform(h, REST),
                "--haze0": d.haze.toFixed(3),
                "--haze0-sm": h.haze.toFixed(3),
                "--cap0": d.caption.toFixed(3),
              } as CSSProperties
            }
          >
            {hasVisual(product.slug) && (
              <div className="room-panel-ui">
                <ProductVisual slug={product.slug} />
                {/* The haze. Distance is the room's own ground laid OVER an opaque panel,
                    never the panel going transparent — see `haze` in `room.ts`. Its own
                    element, so the painter writes one non-inherited `opacity` without
                    touching the interface under it. */}
                <span aria-hidden="true" className="room-haze" />
              </div>
            )}

            {/* Name and label are always in the DOM whatever the depth — the brief's rule
                that depth is never the only signal. What focus changes is how readable
                this is, never whether it exists. */}
            <div className="room-cap">
              <p className="room-cap-meta">
                <span className="room-cap-cat">{category.navLabel}</span>
                <span aria-hidden="true" className="room-cap-count">
                  {String(i + 1).padStart(2, "0")} {FLOOR.counterSeparator}{" "}
                  {String(COUNT).padStart(2, "0")}
                </span>
              </p>
              <h2 className="room-cap-name">{product.name}</h2>
              <p className="room-cap-line">{product.tagline}</p>
              <Link href={`/products/${product.slug}/`} className="tlink room-cap-link">
                {FLOOR.openLabel} {product.name}
                <span aria-hidden="true" className="nudge">
                  →
                </span>
              </Link>
            </div>
          </article>
        );
      })}
    </>
  );
}
