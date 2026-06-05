"use client";

// OuroxShell — platform-level top bar for Ourox home and Arbiter pages.
// Verity pages use the modified AppShell (which integrates Ourox branding inline).
// Props: currentProduct drives the breadcrumb; children = page content below bar.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OuroxMark, OuroxWordmark } from "./OuroxLogo";
import { OuroxFooter } from "./OuroxFooter";

export type OuroxProduct = "Ourox" | "Verity" | "Arbiter";

interface OuroxShellProps {
  currentProduct?: OuroxProduct;
  children: React.ReactNode;
}

const NAV: { href: string; label: string; product: OuroxProduct }[] = [
  { href: "/verity", label: "Verity", product: "Verity" },
  { href: "/arbiter", label: "Arbiter", product: "Arbiter" },
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
              <span
                className="font-mono text-xs text-ourox-ink/60 truncate"
                style={{ fontFamily: "'Space Mono', monospace" }}
              >
                {currentProduct}
              </span>
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
