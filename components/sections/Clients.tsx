import Image from "next/image";
import { CLIENT_LOGOS, CLIENTS_LABEL } from "@/lib/content/clients";

/**
 * The logo row, directly under the hero.
 *
 * This is the page's floor for the hero and its first piece of evidence — the one thing
 * a visitor can check that is not Azkashine describing itself. It replaced a band that
 * listed the three practices, which the very next section names again in full.
 *
 * DELIBERATELY QUIET. The hero above it is a prismatic headline on white; a row of logos
 * in five different brand colours immediately beneath would fight it, and these five
 * carry red, orange, purple, green and blue between them. Silhouetted, they read as one
 * row rather than five competing marks, and they hand the colour back to the hero. Full
 * colour returns on hover, which is where a visitor actually looking at a logo will be.
 *
 * The heights come from `clients.ts` and are per-logo on purpose — see the note there
 * about why one shared height makes this row look broken.
 */
export function Clients() {
  return (
    <section aria-labelledby="clients-heading" className="clients">
      <div className="clients-inner">
        <h2 id="clients-heading" className="clients-label">
          {CLIENTS_LABEL}
        </h2>

        <ul className="clients-row">
          {CLIENT_LOGOS.map((logo) => (
            <li key={logo.file}>
              <Image
                src={`/partners/${logo.file}.png`}
                alt={logo.name}
                width={250}
                height={200}
                /*
                 * Fluid, not stepped. Each logo reaches its full measured height at
                 * about 1600px and shrinks proportionally below that, so all five scale
                 * by the same factor and the optical balance holds at every width. A
                 * breakpoint would hold them still and then jump.
                 */
                style={{
                  height: `clamp(${Math.round(logo.height * 0.5)}px, ${(
                    logo.height / 16
                  ).toFixed(2)}vw, ${logo.height}px)`,
                  width: "auto",
                }}
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
