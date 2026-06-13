"use client";

// OuroxShell — platform-level top bar for Ourox home and Arbiter pages.
// Verity pages use the modified AppShell (which integrates Ourox branding inline).
// Props: currentProduct drives the breadcrumb; children = page content below bar.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OuroxMark, OuroxWordmark } from "./OuroxLogo";
import { OuroxFooter } from "./OuroxFooter";

export type OuroxProduct = "Ourox" | "Verity" | "Arbiter" | "Ops" | "Guide";

interface OuroxShellProps {
  currentProduct?: OuroxProduct;
  children: React.ReactNode;
}

const NAV: { href: string; label: string; product: OuroxProduct }[] = [
  { href: "/verity", label: "Verity", product: "Verity" },
  { href: "/arbiter", label: "Arbiter", product: "Arbiter" },
  { href: "/ops", label: "Ops", product: "Ops" },
  { href: "/guide", label: "Guide", product: "Guide" },
];

export function OuroxShell({ currentProduct = "Ourox", children }: OuroxShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-ourox-obsidian flex flex-col">
      {/* Platform top bar */}
      <header className="w-full border-b border-ourox-obsidianMid bg-ourox-obsidian flex-shrink-0">
        <div className="mx-auto flex max-w-[1280px] items-center gap-4 px-6 h-11">
          {/* Ourox mark → home */}
          <Link
            href="/"
            aria-label="Ourox home"
            className="flex shrink-0 items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange focus-visible:ring-offset-2 focus-visible:ring-offset-ourox-obsidian rounded"
          >
            <span style={{ display: 'inline-flex', width: 22, height: 22 }}>
              <OuroxMark s={22} />
            </span>
            <OuroxWordmark size={14} />
          </Link>

          {/* Breadcrumb separator + product */}
          {currentProduct !== "Ourox" && (
            <span className="flex items-center gap-2 min-w-0">
              <span className="text-ourox-ink/30 select-none" aria-hidden="true">/</span>
              {currentProduct === "Ops" ? (
                <span className="flex items-center gap-1.5 min-w-0">
                  <img
                    src="/logos/ourox-ops-icon.svg"
                    alt=""
                    width={16}
                    height={16}
                    className="shrink-0"
                    aria-hidden="true"
                  />
                  <span
                    className="font-mono text-xs text-ourox-ink/60 truncate"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    {currentProduct}
                  </span>
                </span>
              ) : currentProduct === "Arbiter" ? (
                <span className="flex items-center gap-1.5 min-w-0">
                  {/* Arbiter dial icon — inline SVG, no font dependency */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100"
                    width="16"
                    height="16"
                    fill="none"
                    role="img"
                    aria-label="Arbiter"
                    className="shrink-0"
                  >
                    <path d="M 8.06 57.73 A 42 42 0 0 1 19.74 30.88 L 30.55 41.28 A 27 27 0 0 0 23.04 58.54 Z" fill="#5C6B7A" />
                    <path d="M 21.41 29.23 A 42 42 0 0 1 48.46 18.03 L 49.01 33.02 A 27 27 0 0 0 31.62 40.22 Z" fill="#FFC72C" />
                    <path d="M 51.54 18.03 A 42 42 0 0 1 78.59 29.23 L 68.38 40.22 A 27 27 0 0 0 50.99 33.02 Z" fill="#FF8200" />
                    <path d="M 80.26 30.88 A 42 42 0 0 1 91.94 57.73 L 76.96 58.54 A 27 27 0 0 0 69.45 41.28 Z" fill="#C2541A" />
                    <line x1="50" y1="60" x2="63" y2="24.29" stroke="#ECEFF3" strokeWidth="3.4" strokeLinecap="round" />
                    <circle cx="50" cy="60" r="6.2" fill="#101820" stroke="#ECEFF3" strokeWidth="2.4" />
                    <circle cx="50" cy="60" r="1.8" fill="#FF8200" />
                  </svg>
                  <span
                    className="font-mono text-xs text-ourox-ink/60 truncate"
                    style={{ fontFamily: "'Space Mono', monospace" }}
                  >
                    {currentProduct}
                  </span>
                </span>
              ) : (
                <span
                  className="font-mono text-xs text-ourox-ink/60 truncate"
                  style={{ fontFamily: "'Space Mono', monospace" }}
                >
                  {currentProduct}
                </span>
              )}
            </span>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Product nav */}
          <nav
            className="flex items-center gap-0.5"
            aria-label="Ourox platform navigation"
          >
            {NAV.map(({ href, label, product }) => {
              const active = currentProduct === product ||
                (pathname !== null && (pathname === href || pathname.startsWith(`${href}/`)));
              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange focus-visible:ring-offset-2 focus-visible:ring-offset-ourox-obsidian ${
                    active
                      ? "bg-ourox-obsidianLight text-ourox-orange"
                      : "text-ourox-ink/60 hover:bg-ourox-obsidianLight hover:text-ourox-ink"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Page content */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>

      {/* Shared platform footer */}
      <OuroxFooter variant="dark" />
    </div>
  );
}
