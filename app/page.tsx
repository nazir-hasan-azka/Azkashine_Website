import { Film } from "@/components/film/Film";

/**
 * Home — the film.
 *
 * Seven chapters on one continuous scroll, drawn by one canvas and driven by one rAF
 * loop. `components/film/Film.tsx` carries the chapter map and the reasoning behind its
 * order; `.claude/DIRECTION.md` is the design it comes from.
 *
 * It replaced a hero, a logo row and a stacking deck on 2026-09-07, which is the swap
 * `.claude/BUILD-BRIEF.md` asks for. The logo row was not dropped — it is chapter 06,
 * rendered by the same `Clients.tsx` that was signed off, logo heights and all.
 *
 * The other sixteen routes are deliberately nothing like this. A buyer comparing vendors
 * needs those scannable and fast; the cinema belongs here and nowhere else.
 */
export default function Home() {
  return <Film />;
}
