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
                    className={`shrink-0 rounded-signalSm px-2.5 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-signal-indigo focus-visible:ring-offset-2 ${
                      active
                        ? "bg-signal-indigoSubtle text-signal-indigo"
                        : "text-signal-slate hover:bg-signal-surfaceSubtle hover:text-signal-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* GitHub link */}
            <a
              href="https://github.com/VinceJaturavit/baht-shield"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              className="shrink-0 text-slate-400 transition-colors hover:text-slate-600"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>

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
