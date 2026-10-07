import Image from "next/image";
import { Counter } from "@/components/home/Counter";
import {
  CLIENT_LOGOS,
  CLIENTS_LABEL,
  CLIENTS_REACH,
  logoWidth,
} from "@/lib/content/clients";

/**
 * The partner logos: one counted claim, then a wall of cards.
 *
 * "15 PARTNERS ACROSS 7 COUNTRIES", then the cards, chosen by Nazir on 2026-10-07. The
 * claim came from a "reach" layout that also grouped the cards by region; he kept the
 * claim and the stationary card wall, and dropped the numbers strip after the hero so the
 * page would not count the partners twice. Moving rows were built and passed over too.
 * Both numbers are counted from `clients.ts`, never written down.
 *
 * Each card carries the partner's country. Five across from 1024px, three from 640px, two
 * on a phone, where the fifteenth card spans the row. FULL BRAND COLOUR, on the decision of
 * 2026-09-06; each logo's width comes from its shape — see `clients.ts`.
 *
 * `.clients-row` is the grid's name because `tests/responsive.mjs` counts logos through it.
 */
const COUNTRIES = new Set(
  CLIENT_LOGOS.flatMap((l) => (l.country ? l.country.split(" & ") : [])),
);

export function Clients() {
  return (
    <section aria-labelledby="clients-heading" className="clients">
      <div className="clients-inner">
        <h2 id="clients-heading" className="clients-label">
          {CLIENTS_LABEL}
        </h2>
        <p className="cr-stat">
          <span className="cr-num">
            <Counter value={CLIENT_LOGOS.length} />
          </span>{" "}
          {CLIENTS_REACH.partnersAcross}{" "}
          <span className="cr-num">
            <Counter value={COUNTRIES.size} />
          </span>{" "}
          {CLIENTS_REACH.countries}
        </p>

        <ul className="clients-row">
          {CLIENT_LOGOS.map((logo) => (
            <li key={logo.file} className="client-card">
              <div className="client-logo">
                <Image
                  src={`/partners/${logo.file}`}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                  style={{
                    width: `${logoWidth(logo, 52)}px`,
                    maxWidth: "100%",
                    height: "auto",
                  }}
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
