import Image from "next/image";
import { CLIENT_LOGOS, CLIENTS_LABEL, logoWidth } from "@/lib/content/clients";

/**
 * The partner logos, as a wall of cards.
 *
 * A CARD PER PARTNER, from 2026-10-07, chosen by Nazir over moving rows and a grouping
 * by region, all three built and compared in place. A plain grid of fifteen logos read
 * as a list; a card gives each mark its own ground, and the country under it gives each
 * one a fact. White cards, the site's flat `--shadow-hard`, a lift on hover.
 *
 * Five across from 1024px, three from 640px, two on a phone — where fifteen leaves one
 * over, so the last card spans the row rather than sitting alone.
 *
 * FULL BRAND COLOUR, on the decision of 2026-09-06: these are real marks, and dimming
 * them undersells them. Each logo's width comes from its shape — see `clients.ts`.
 *
 * `.clients-row` is kept as the grid's name because `tests/responsive.mjs` counts the
 * logos through it.
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
            <li key={logo.file} className="client-card">
              <div className="client-logo">
                <Image
                  src={`/partners/${logo.file}`}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                  style={{ width: `${logoWidth(logo, 52)}px`, maxWidth: "100%", height: "auto" }}
                />
              </div>
              <span className="client-country">{logo.country ?? ""}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
