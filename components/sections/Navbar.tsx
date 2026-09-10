"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/content/taxonomy";
import { PRODUCTS } from "@/lib/content/products";
import { INDUSTRIES } from "@/lib/content/industries";

/**
 * Nav follows the Services-and-Products-as-peers model: the two things Azkashine sells
 * sit at the same level, each with its own menu, rather than products hiding inside
 * services.
 *
 * NOTE: the markup reserves room to the right of the CTA for a future language toggle
 * (see the marker below). GCC positioning is English-only for now, but adding Arabic
 * later should not require re-laying-out the header.
 */

type MenuId = "what-we-do" | "products" | null;
type MobileSectionId = "what-we-do" | "products" | "industries";

const CAPABILITY_MENU = CATEGORIES.map((c) => ({
  label: c.name,
  href: `/what-we-do/${c.slug}/`,
  description: c.tagline,
}));

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menu, setMenu] = useState<MenuId>(null);
  const [section, setSection] = useState<MobileSectionId | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  /**
   * One ground on this site today — paper — so one chrome: a translucent bar with a
   * blur, which is correct over light content everywhere.
   *
   * The `light` prop the nav items take is kept even though nothing passes `true` yet.
   * It is how a dark section behind the header gets handled the day one exists, and
   * removing it would only mean writing it again.
   */
  const lightChrome = false;

  function closeAll() {
    setMenu(null);
    setMobileOpen(false);
    setSection(null);
  }

  function toggleSection(id: MobileSectionId) {
    setSection(section === id ? null : id);
  }

  /**
   * Close every menu when any link inside the header is clicked.
   *
   * The outside-click handler below cannot do this: the top-level links, logo, and CTA
   * all live *inside* the header, so navigating via one of them used to leave the open
   * dropdown behind. Delegating from the header catches all of them — panel links,
   * top-level links, logo, CTA, and the mobile list — including links to the current
   * page, where a route-change listener would never fire.
   */
  function handleHeaderClick(e: React.MouseEvent<HTMLElement>) {
    if ((e.target as HTMLElement).closest("a")) closeAll();
  }

  /**
   * Hover-to-open, but only on devices with a real pointer. On touch, `mouseenter` fires
   * on tap and would immediately fight the click handler, opening and closing the panel
   * in one gesture.
   */
  function canHover() {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    );
  }

  function hoverOpen(id: Exclude<MenuId, null>) {
    if (canHover()) setMenu(id);
  }

  // Close the desktop menus on Escape or on a click outside the header.
  useEffect(() => {
    if (!menu) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenu(null);
    }
    function onClick(e: MouseEvent) {
      if (!headerRef.current?.contains(e.target as Node)) setMenu(null);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [menu]);

  return (
    <header
      ref={headerRef}
      onClick={handleHeaderClick}
      onMouseLeave={() => {
        if (canHover()) setMenu(null);
      }}
      /* THE OUTER BAR PAINTS NOTHING. It is a transparent 5rem rail; the white you
         see is `.nav-pill` inside it, which contracts into a floating pill once you
         have scrolled past the first screen. Measured off tokens.studio, which does
         exactly this — see `.claude/TOKENS-STUDIO.md`. The styling lives in
         `globals.css` because the shape change is a scroll-driven CSS animation and
         there is no JavaScript in it at all. */
      className="site-header"
    >
      <div className="nav-pill">
        <nav className="flex h-20 items-center justify-between gap-6">
          <Link
            href="/"
            className="flex items-center"
            aria-label="Azkashine home"
            onClick={closeAll}
          >
            {/* The colour logo sits at ~115/255 luminance, which is unreadable on the
                dark hero. The light variant lifts luminance to ~206 while keeping the
                blue/orange hues, rather than flattening to a white silhouette. */}
            <Image
              src={lightChrome ? "/azkashine-logo-light.png" : "/azkashine-logo.png"}
              alt="Azkashine"
              width={133}
              height={37}
              priority
              className="h-9 w-auto"
            />
          </Link>

          {/* Desktop menu */}
          <ul className="hidden items-center gap-8 lg:flex">
            <li onMouseEnter={() => canHover() && setMenu(null)}>
              <TopLink href="/" onClick={closeAll} light={lightChrome}>
                Home
              </TopLink>
            </li>
            <li onMouseEnter={() => hoverOpen("what-we-do")}>
              <MenuLink
                href="/what-we-do/"
                label="What we do"
                light={lightChrome}
                open={menu === "what-we-do"}
                onToggle={() => setMenu(menu === "what-we-do" ? null : "what-we-do")}
              />
            </li>
            <li onMouseEnter={() => hoverOpen("products")}>
              <MenuLink
                href="/products/"
                label="Products"
                light={lightChrome}
                open={menu === "products"}
                onToggle={() => setMenu(menu === "products" ? null : "products")}
              />
            </li>
            <li onMouseEnter={() => canHover() && setMenu(null)}>
              <TopLink href="/industries/" onClick={closeAll} light={lightChrome}>
                Industries
              </TopLink>
            </li>
            <li onMouseEnter={() => canHover() && setMenu(null)}>
              <TopLink href="/about/" onClick={closeAll} light={lightChrome}>
                About
              </TopLink>
            </li>
          </ul>

          <div className="hidden items-center gap-4 lg:flex">
            <Link
              href="/contact/"
              onClick={closeAll}
              className="btn-motion inline-flex h-10 items-center rounded-md bg-brand-light px-5 text-[15px] font-semibold text-ink hover:opacity-90"
            >
              Contact us
            </Link>
            {/* LANGUAGE-TOGGLE SLOT — add the Arabic switcher here when /ar ships. */}
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(!mobileOpen);
              setSection(null);
            }}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-lg lg:hidden",
              lightChrome ? "text-white" : "text-ink",
            )}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <Hamburger open={mobileOpen} />
          </button>
        </nav>
      </div>

      {/* Desktop dropdown panels */}
      {menu === "what-we-do" && (
        <DesktopPanel onNavigate={() => setMenu(null)}>
          <div className="grid gap-8 py-8 lg:grid-cols-3">
            {CAPABILITY_MENU.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenu(null)}
                className="group rounded-xl p-4 transition-colors hover:bg-surface"
              >
                <span className="block text-lg font-semibold text-ink group-hover:text-brand">
                  {item.label}
                </span>
                <span className="mt-1 block text-sm text-muted">
                  {item.description}
                </span>
              </Link>
            ))}
          </div>
          <PanelFooter
            href="/what-we-do/"
            label="All twelve capabilities"
            onNavigate={() => setMenu(null)}
          />
        </DesktopPanel>
      )}

      {menu === "products" && (
        <DesktopPanel onNavigate={() => setMenu(null)}>
          <div className="grid gap-x-10 gap-y-8 py-8 lg:grid-cols-3">
            {CATEGORIES.map((cat) => {
              const items = PRODUCTS.filter((p) => p.category === cat.slug);
              if (items.length === 0) return null;
              return (
                <div key={cat.slug}>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                    {cat.name}
                  </p>
                  <ul className="mt-3 space-y-1">
                    {items.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/products/${p.slug}/`}
                          onClick={() => setMenu(null)}
                          className="block rounded-lg px-3 py-2 transition-colors hover:bg-surface"
                        >
                          <span className="block text-base font-semibold text-ink">
                            {p.name}
                          </span>
                          <span className="mt-0.5 block text-sm text-muted">
                            {p.tagline}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <PanelFooter
            href="/products/"
            label="All products"
            onNavigate={() => setMenu(null)}
          />
        </DesktopPanel>
      )}

      {/* Mobile menu panel.

          EVERY TOP-LEVEL ROW IS A LINK TO ITS PAGE, and the sub-items fold away behind a
          chevron: the same two-control split `MenuLink` makes on desktop, for the same
          reasons. It used to be the other way round. "Products" was a grey label, not a
          link, and the only way to /products/ from a phone was an "All products" link
          1,150px down a panel 497px tall, under all three practices and all eight
          products. Nazir could not reach the page from his phone. Folded, all six
          destinations sit on the first screen.

          No `onClick` on any link in here: `handleHeaderClick` closes the menu for every
          anchor inside the header, this list included. */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-border/70 bg-background lg:hidden"
        >
          <Container>
            <ul className="flex flex-col pt-2">
              <MobileTop href="/">Home</MobileTop>

              <MobileSection
                id="what-we-do"
                href="/what-we-do/"
                label="What we do"
                open={section === "what-we-do"}
                onToggle={toggleSection}
              >
                {CAPABILITY_MENU.map((c) => (
                  <MobileLink key={c.href} href={c.href}>
                    {c.label}
                  </MobileLink>
                ))}
              </MobileSection>

              <MobileSection
                id="products"
                href="/products/"
                label="Products"
                open={section === "products"}
                onToggle={toggleSection}
              >
                {PRODUCTS.map((p) => (
                  <MobileLink key={p.slug} href={`/products/${p.slug}/`}>
                    {p.name}
                  </MobileLink>
                ))}
              </MobileSection>

              <MobileSection
                id="industries"
                href="/industries/"
                label="Industries"
                open={section === "industries"}
                onToggle={toggleSection}
              >
                {INDUSTRIES.map((i) => (
                  <MobileLink key={i.slug} href={`/industries/#${i.slug}`}>
                    {i.name}
                  </MobileLink>
                ))}
              </MobileSection>

              <MobileTop href="/about/">About</MobileTop>
            </ul>

            <div className="pb-6 pt-5">
              <Link
                href="/contact/"
                className="inline-flex h-12 w-full items-center justify-center rounded-md bg-brand-light px-6 text-[15px] font-semibold text-ink"
              >
                Contact us
              </Link>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}

function TopLink({
  href,
  onClick,
  light,
  children,
}: {
  href: string;
  onClick?: () => void;
  light?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        /* `min-h-6` for WCAG 2.2 SC 2.5.8. The text alone is 20px tall, and
           `tests/links.mjs` lets it through only because its inline exception matches
           any anchor inside an `li` — which is meant for a link in a sentence, not for
           the main navigation. The row is 80px tall and the items are centred, so this
           changes nothing anybody can see. */
        "underline-wipe inline-flex min-h-6 items-center text-[17px] font-medium transition-colors hover:text-brand",
        light ? "text-white" : "text-ink",
      )}
    >
      {children}
    </Link>
  );
}

/**
 * A top-level item that BOTH navigates and opens a menu.
 *
 * It used to be a bare `<button>`, so "Products" and "What we do" went nowhere: clicking
 * either opened a panel, and the only route to the page itself was a 97x20 link at the
 * bottom of that panel. Nazir could not get to `/products/` from the menu bar, which is
 * exactly right — there was no link in it.
 *
 * TWO CONTROLS, NOT ONE, because they are two different jobs. The word is a link and goes
 * to the page. The chevron beside it is a button that discloses the panel and carries the
 * `aria-expanded`. Collapsing both into one control means picking which one to break: a
 * link cannot announce expanded state, and a button cannot be opened in a new tab or
 * followed by a crawler. The panel still opens on hover for a fine pointer, so nothing
 * changes for a visitor with a mouse.
 *
 * The chevron is 24x24 rather than the 12px glyph it draws, because WCAG 2.2 SC 2.5.8
 * measures the target and `tests/links.mjs` enforces it.
 */
function MenuLink({
  href,
  label,
  open,
  onToggle,
  light,
}: {
  href: string;
  label: string;
  open: boolean;
  onToggle: () => void;
  light?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-0.5">
      <Link
        href={href}
        className={cn(
          "underline-wipe inline-flex min-h-6 items-center text-[17px] font-medium transition-colors hover:text-brand",
          light ? "text-white" : "text-ink",
        )}
      >
        {label}
      </Link>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-label={`${label} menu`}
        className={cn(
          "inline-flex h-6 w-6 items-center justify-center transition-colors hover:text-brand",
          light ? "text-white" : "text-ink",
        )}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className={cn("transition-transform", open && "rotate-180")}
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    </span>
  );
}

function DesktopPanel({
  children,
}: {
  children: React.ReactNode;
  onNavigate: () => void;
}) {
  return (
    <div className="panel-in hidden border-t border-border bg-background shadow-[0_12px_32px_rgba(15,17,37,0.06)] lg:block">
      <Container>{children}</Container>
    </div>
  );
}

function PanelFooter({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <div className="border-t border-border py-4">
      <Link
        href={href}
        onClick={onNavigate}
        /* min-h-6 for SC 2.5.8: the text alone measures 20px tall, and this link is
           only ever on screen with the panel open, which is the one state
           `tests/links.mjs` never sees. */
        className="inline-flex min-h-6 items-center gap-1.5 text-sm font-semibold text-brand hover:text-blue-700"
      >
        {label}
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

/** A top-level row in the phone menu: full width, 48px tall, one tap to the page. */
function MobileTop({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li className="border-b border-border/60">
      <Link
        href={href}
        className="flex min-h-12 items-center text-[17px] font-semibold text-ink hover:text-brand"
      >
        {children}
      </Link>
    </li>
  );
}

/**
 * A phone-menu row that both navigates and discloses. The word goes to the page; the
 * chevron opens the list under it and carries the `aria-expanded`. The chevron is a full
 * 48x48 target rather than the 14px glyph it draws, because a thumb is not a cursor.
 *
 * The folded list is `hidden`, not merely clipped, so its links leave the tab order and
 * the accessibility tree along with the screen.
 */
function MobileSection({
  id,
  href,
  label,
  open,
  onToggle,
  children,
}: {
  id: MobileSectionId;
  href: string;
  label: string;
  open: boolean;
  onToggle: (id: MobileSectionId) => void;
  children: React.ReactNode;
}) {
  const listId = `mobile-menu-${id}`;
  return (
    <li className="border-b border-border/60">
      <div className="flex items-center justify-between gap-4">
        <Link
          href={href}
          className="flex min-h-12 flex-1 items-center text-[17px] font-semibold text-ink hover:text-brand"
        >
          {label}
        </Link>
        <button
          type="button"
          onClick={() => onToggle(id)}
          aria-expanded={open}
          aria-controls={listId}
          aria-label={`${label} menu`}
          className="-mr-3 inline-flex h-12 w-12 shrink-0 items-center justify-center text-ink hover:text-brand"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className={cn("transition-transform", open && "rotate-180")}
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <ul id={listId} hidden={!open} className="pb-3">
        {children}
      </ul>
    </li>
  );
}

function MobileLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link
        href={href}
        className="flex min-h-11 items-center rounded-lg px-3 text-[15px] font-medium text-ink/80 hover:bg-surface hover:text-brand"
      >
        {children}
      </Link>
    </li>
  );
}

function Hamburger({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={open ? "M6 6l12 12M18 6L6 18" : "M3 6h18M3 12h18M3 18h18"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
