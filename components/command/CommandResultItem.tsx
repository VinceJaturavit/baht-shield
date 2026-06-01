import type { SearchResult, SearchResultType } from "@/lib/types";

interface CommandResultItemProps {
  result: SearchResult;
  isSelected: boolean;
  onSelect: () => void;
}

const TYPE_LABEL: Record<SearchResultType, string> = {
  command: "Command",
  wallet: "Wallet",
  alert: "Alert",
  case: "Case",
  pattern: "Pattern",
  device: "Device",
  endpoint: "Endpoint",
};

export function CommandResultItem({
  result,
  isSelected,
  onSelect,
}: CommandResultItemProps) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      onMouseDown={(e) => {
        e.preventDefault();
        onSelect();
      }}
      className={`flex w-full items-center gap-3 rounded-signalSm px-3 py-2 text-left transition-colors ${
        isSelected
          ? "bg-signal-accentSubtle ring-1 ring-signal-accent/20"
          : "hover:bg-signal-muted"
      }`}
    >
      <span
        className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
          result.type === "command"
            ? "bg-signal-muted text-signal-secondary"
            : "bg-signal-accentSubtle text-signal-accent"
        }`}
      >
        {TYPE_LABEL[result.type]}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-signal-heading">
          {result.title}
        </span>
        {result.subtitle && (
          <span className="block truncate text-xs text-signal-secondary">
            {result.subtitle}
          </span>
        )}
      </span>
      {isSelected && (
        <span className="shrink-0 text-xs text-signal-accent">↵</span>
      )}
    </button>
  );
}
