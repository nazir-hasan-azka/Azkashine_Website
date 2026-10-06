import { HomeBody } from "@/components/home/HomeBody";

/**
 * The home page. `components/home/HomeBody.tsx` is the page: the hero, then sections that
 * scroll normally, with the trace down the gutter and the products' sideways traverse.
 *
 * It replaced the scroll film on 2026-10-07. Management found the film slow and unclear —
 * about 24 of its 29 desktop screens held the scroll — and its copy was rewritten for an
 * enterprise reader in the same change.
 */
export default function Home() {
  return <HomeBody />;
}
