"use client";

import type { EvidenceToggleCategory, EvidenceToggleOption } from "@/lib/types";

interface EvidenceToggleGroupProps {
  options: EvidenceToggleOption[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

const CATEGORY_ORDER: EvidenceToggleCategory[] = [
  "Pattern Match",
  "Device / SIM Evidence",
  "Transaction Behavior",
  "KYC / Onboarding",
  "Endpoint / Beneficiary",
  "Case Context",
];

const SOURCE_BADGE: Record<EvidenceToggleOption["source"], string> = {
  scenario: "bg-signal-accentSubtle text-signal-accent border-signal-accentBorder",
  pattern: "bg-signal-muted text-signal-secondary border-signal-border",
  wallet: "bg-signal-muted text-signal-secondary border-signal-border",
  transaction: "bg-signal-muted text-signal-secondary border-signal-border",
  case: "bg-signal-muted text-signal-secondary border-signal-border",
  manual: "bg-signal-muted text-signal-secondary border-signal-border",
};

const SOURCE_LABEL: Record<EvidenceToggleOption["source"], string> = {
  scenario: "scenario",
  pattern: "pattern",
  wallet: "wallet",
  transaction: "transaction",
  case: "case",
  manual: "manual",
};

export function EvidenceToggleGroup({ options, selectedIds, onToggle }: EvidenceToggleGroupProps) {
  const grouped = CATEGORY_ORDER.reduce<Record<string, EvidenceToggleOption[]>>((acc, cat) => {
    const items = options.filter((o) => o.category === cat);
    if (items.length > 0) acc[cat] = items;
    return acc;
  }, {});

  if (options.length === 0) {
    return (
      <p className="text-xs text-signal-faint italic">
        No evidence toggle options available for this case.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <p className="text-[11px] uppercase tracking-wide font-medium text-signal-faint mb-2">
            {category}
          </p>
          <div className="space-y-2">
            {items.map((opt) => {
              const isSelected = selectedIds.includes(opt.id);
              return (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 rounded-signalSm border px-3 py-2.5 cursor-pointer transition-colors ${
                    isSelected
                      ? "border-signal-accentBorder bg-signal-accentSubtle"
                      : "border-signal-border bg-signal-surface hover:border-signal-borderStrong hover:bg-signal-muted"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(opt.id)}
                    className="mt-0.5 h-4 w-4 rounded border-signal-borderStrong text-signal-accent focus:ring-signal-accent shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-medium ${
                          isSelected ? "text-signal-heading" : "text-signal-body"
                        }`}
                      >
                        {opt.label}
                      </span>
                      <span
                        className={`inline-flex items-center rounded border px-1.5 py-0 text-[10px] font-medium ${
                          SOURCE_BADGE[opt.source]
                        }`}
                      >
                        {SOURCE_LABEL[opt.source]}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-signal-secondary leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
