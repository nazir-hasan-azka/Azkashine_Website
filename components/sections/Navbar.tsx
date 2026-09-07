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

const CAPABILITY_MENU = CATEGORIES.map((c) => ({
  label: c.name,
  href: `/what-we-do/${c.slug}/`,
  description: c.tagline,
}));

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menu, setMenu] = useState<MenuId>(null);
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
              <MenuButton
                label="What we do"
                light={lightChrome}
                open={menu === "what-we-do"}
                onToggle={() => setMenu(menu === "what-we-do" ? null : "what-we-do")}
              />
            </li>
            <li onMouseEnter={() => hoverOpen("products")}>
              <MenuButton
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
            onClick={() => setMobileOpen((v) => !v)}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-lg lg:hidden",
              lightChrome ? "text-white" : "text-ink",
            )}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
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

      {/* Mobile menu panel */}
      <div
        className={cn(
          "overflow-y-auto border-t border-border/70 bg-background lg:hidden",
          mobileOpen ? "max-h-[75vh]" : "max-h-0 border-t-0",
        )}
      >
        <Container>
          <div className="flex flex-col gap-6 py-6">
            <ul>
              <MobileLink href="/" onNavigate={() => setMobileOpen(false)}>
                Home
              </MobileLink>
            </ul>

            <MobileGroup title="What we do" seeAll={{ href: "/what-we-do/", label: "All capabilities" }} onNavigate={() => setMobileOpen(false)}>
              {CAPABILITY_MENU.map((c) => (
                <MobileLink key={c.href} href={c.href} onNavigate={() => setMobileOpen(false)}>
                  {c.label}
                </MobileLink>
              ))}
            </MobileGroup>

            <MobileGroup title="Products" seeAll={{ href: "/products/", label: "All products" }} onNavigate={() => setMobileOpen(false)}>
              {PRODUCTS.map((p) => (
                <MobileLink
                  key={p.slug}
                  href={`/products/${p.slug}/`}
                  onNavigate={() => setMobileOpen(false)}
                >
                  {p.name}
                </MobileLink>
              ))}
            </MobileGroup>

            <MobileGroup title="Industries" onNavigate={() => setMobileOpen(false)}>
              {INDUSTRIES.map((i) => (
                <MobileLink
                  key={i.slug}
                  href={`/industries/#${i.slug}`}
                  onNavigate={() => setMobileOpen(false)}
                >
                  {i.name}
                </MobileLink>
              ))}
            </MobileGroup>

            <div className="flex flex-col gap-2 border-t border-border pt-5">
              <MobileLink href="/about/" onNavigate={() => setMobileOpen(false)}>
                About
              </MobileLink>
              <Link
                href="/contact/"
                onClick={() => setMobileOpen(false)}
                className="mt-2 inline-flex h-11 w-full items-center justify-center rounded-md bg-brand-light px-6 text-[15px] font-semibold text-ink"
              >
                Contact us
              </Link>
            </div>
          </div>
        </Container>
      </div>
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
        "underline-wipe text-[17px] font-medium transition-colors hover:text-brand",
        light ? "text-white" : "text-ink",
      )}
    >
      {children}
    </Link>
  );
}

function MenuButton({
  label,
  open,
  onToggle,
  light,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  light?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      className={cn(
        "inline-flex items-center gap-1.5 text-[17px] font-medium transition-colors hover:text-brand",
        light ? "text-white" : "text-ink",
      )}
    >
      {label}
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
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:text-blue-700"
      >
        {label}
        <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

function MobileGroup({
  title,
  seeAll,
  onNavigate,
  children,
}: {
  title: string;
  seeAll?: { href: string; label: string };
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        {title}
      </p>
      <ul className="mt-2 flex flex-col gap-0.5">{children}</ul>
      {seeAll && (
        <Link
          href={seeAll.href}
          onClick={onNavigate}
          className="mt-2 inline-block px-2 text-sm font-semibold text-brand"
        >
          {seeAll.label} →
        </Link>
      )}
    </div>
  );
}

function MobileLink({
  href,
  onNavigate,
  children,
}: {
  href: string;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onNavigate}
        className="block rounded-lg px-2 py-2.5 text-[15px] font-medium text-ink/80 hover:bg-surface hover:text-brand"
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
