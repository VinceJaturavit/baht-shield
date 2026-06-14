"use client";

export type OpsRosterSubView =
  | "roster"
  | "dailyOwnership"
  | "weeklySchedule"
  | "fairness"
  | "performance"
  | "qa";

interface NavItem {
  id: OpsRosterSubView;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "roster", label: "Roster" },
  { id: "dailyOwnership", label: "Daily Ownership" },
  { id: "weeklySchedule", label: "Weekly Schedule" },
  { id: "fairness", label: "Fairness" },
  { id: "performance", label: "Performance" },
  { id: "qa", label: "QA" },
];

interface Props {
  active: OpsRosterSubView;
  onSelect: (view: OpsRosterSubView) => void;
}

function navItemClass(isActive: boolean) {
  if (isActive) {
    return "border-ourox-orange/35 bg-ourox-orange/[0.08] text-ourox-ink";
  }
  return "border-transparent text-ourox-ink/65 hover:border-ourox-obsidianMid hover:bg-ourox-obsidianLight/40 hover:text-ourox-ink";
}

export function OpsRosterSubNav({ active, onSelect }: Props) {
  return (
    <nav aria-label="Roster sub-views" className="min-w-0">
      <ul className="flex flex-wrap gap-1">
        {NAV_ITEMS.map(({ id, label }) => {
          const isActive = active === id;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => onSelect(id)}
                aria-current={isActive ? "page" : undefined}
                className={`rounded border px-2.5 py-1.5 text-left text-[11px] font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ourox-orange ${navItemClass(isActive)}`}
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
