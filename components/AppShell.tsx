"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { SyntheticDataLabel } from "./SyntheticDataLabel";
import { CommandBar } from "./command/CommandBar";

interface AppShellProps {
  children: React.ReactNode;
}

const NAV_LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/alerts", label: "Alert Queue" },
  { href: "/cases", label: "Cases" },
  { href: "/entities", label: "Wallets / Entities" },
  { href: "/patterns", label: "Pattern Intelligence" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" },
];

function isActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  // /wallet/* maps to Wallets / Entities (/entities)
  if (href === "/entities" && pathname.startsWith("/wallet")) return true;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-signal-bg">
      {/* Top nav */}
      <header className="w-full overflow-x-hidden border-b border-signal-border bg-white">
        <div className="mx-auto flex max-w-[1280px] items-center gap-3 px-4 lg:px-6">
          <div className="flex h-16 min-w-0 flex-1 items-center gap-3">
            {/* Brand */}
            <div className="flex shrink-0 items-center gap-3">
              <Logo />
              <span className="hidden h-5 w-px bg-signal-border 2xl:block" />
              <span className="hidden truncate text-xs text-signal-secondary 2xl:block">
                Analyst-Curated Fraud Intelligence
              </span>
            </div>

            {/* Nav links */}
            <nav className="flex min-w-0 flex-1 items-center gap-0.5 overflow-hidden">
              {NAV_LINKS.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`shrink-0 rounded-signalSm px-2.5 py-1.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-signal-accentSubtle text-signal-accent"
                        : "text-signal-secondary hover:bg-signal-muted hover:text-signal-heading"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Search affordance */}
            <div className="shrink">
              <CommandBar />
            </div>
          </div>
        </div>
      </header>

      {/* Synthetic data label bar */}
      <div className="border-b border-signal-borderSubtle bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-2.5 lg:px-6">
          <SyntheticDataLabel />
        </div>
      </div>

      {/* Page content */}
      <main className="mx-auto max-w-[1280px] px-4 py-8 lg:px-6 lg:py-10">
        {children}
      </main>
    </div>
  );
}
