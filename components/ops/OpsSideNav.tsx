"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type OpsWorkspaceView = "queue" | "aging" | "roster" | "reviews" | "kpi";

interface NavItem {
  id: OpsWorkspaceView;
  label: string;
  disabled?: boolean;
  suffix?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "queue", label: "Queue Board" },
  { id: "aging", label: "Aging & SLA" },
  { id: "roster", label: "Roster" },
  { id: "reviews", label: "Reviews" },
  { id: "kpi", label: "KPI" },
];

interface Props {
  active: OpsWorkspaceView;
  onSelect: (view: OpsWorkspaceView) => void;
}

function navItemClass(isActive: boolean, disabled?: boolean) {
  if (disabled) {
    return "cursor-not-allowed border-transparent text-ourox-ink/30";
  }
  if (isActive) {
    return "border-ourox-orange/35 bg-ourox-orange/[0.08] text-ourox-ink";
  }
  return "border-transparent text-ourox-ink/65 hover:border-ourox-obsidianMid hover:bg-ourox-obsidianLight/40 hover:text-ourox-ink";
}

export function OpsSideNav({ active, onSelect }: Props) {
  const pathname = usePathname();
  const guideActive = pathname === "/ops/guide";

  return (
    <nav
      aria-label="Ops workspaces"
      className="w-full shrink-0 lg:w-[11rem] xl:w-[12.5rem]"
    >
      <ul className="flex gap-1 lg:flex-col lg:gap-0.5">
        {NAV_ITEMS.map(({ id, label, disabled, suffix }) => {
          const isActive = !disabled && !guideActive && active === id;
          return (
            <li key={id} className="flex-1 lg:flex-none">
              <button
                type="button"
                disabled={disabled}
                onClick={() => !disabled && onSelect(id)}
                aria-current={isActive ? "page" : undefined}
                className={`w-full rounded border px-2.5 py-2 text-left text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange lg:px-3 lg:py-2.5 ${navItemClass(isActive, disabled)}`}
              >
                <span className="block truncate">{label}</span>
                {suffix && (
                  <span className="mt-0.5 block text-[10px] font-normal text-ourox-ink/25">
                    {suffix}
                  </span>
                )}
              </button>
            </li>
          );
        })}
        <li className="flex-1 lg:mt-1 lg:flex-none lg:border-t lg:border-ourox-obsidianMid lg:pt-1.5">
          <Link
            href="/ops/guide"
            aria-current={guideActive ? "page" : undefined}
            className={`block w-full rounded border px-2.5 py-2 text-left text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange lg:px-3 lg:py-2.5 ${navItemClass(guideActive)}`}
          >
            Guide
          </Link>
        </li>
      </ul>
    </nav>
  );
}
