"use client";

interface WalletInvestigationHeaderProps {
  walletId: string;
  status?: string;
  balance?: number;
  scenarioLabel: string;
  primaryPatternName?: string;
  hasScenarioMatch: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  active: "border-signal-border bg-white text-signal-body",
  suspended: "border-signal-border bg-signal-muted text-severity-critical",
  under_review: "border-signal-accentBorder bg-signal-accentSubtle text-signal-accent",
  closed: "border-signal-border bg-signal-muted text-signal-secondary",
  frozen: "border-signal-border bg-signal-muted text-signal-body",
};

function formatTHB(amount: number): string {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
  }).format(amount);
}

function scrollToCaseHistory() {
  const el = document.getElementById("case-history");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function WalletInvestigationHeader({
  walletId,
  status,
  balance,
  scenarioLabel,
  primaryPatternName,
  hasScenarioMatch,
}: WalletInvestigationHeaderProps) {
  const statusKey = (status ?? "").toLowerCase();
  const statusStyle =
    STATUS_STYLES[statusKey] ?? "border-signal-border bg-signal-muted text-signal-secondary";

  return (
    <div className="rounded-signal border border-signal-border bg-white px-6 py-5 shadow-signal">
      <div className="flex flex-wrap items-start justify-between gap-4">
        {/* Left: title + metadata */}
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-signal-faint mb-1">
            Wallet Profile
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-signal-heading font-mono">
              {walletId}
            </h1>
            {status && (
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyle}`}
              >
                {status}
              </span>
            )}
          </div>

          {/* Metadata row */}
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2">
            {balance !== undefined && (
              <div>
                <span className="text-[11px] uppercase tracking-wide text-signal-faint">
                  Balance
                </span>
                <p className="text-sm font-semibold tabular-nums text-signal-heading">
                  {formatTHB(balance)}
                </p>
              </div>
            )}

            <div>
              <span className="text-[11px] uppercase tracking-wide text-signal-faint">
                Scenario match
              </span>
              <div className="mt-0.5 flex items-center gap-1.5">
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                    hasScenarioMatch ? "bg-signal-accent" : "bg-signal-faint"
                  }`}
                />
                <p
                  className={`text-sm font-medium ${
                    hasScenarioMatch ? "text-signal-accent" : "text-signal-faint"
                  }`}
                >
                  {scenarioLabel}
                </p>
              </div>
            </div>

            {primaryPatternName && (
              <div>
                <span className="text-[11px] uppercase tracking-wide text-signal-faint">
                  Primary pattern
                </span>
                <p className="text-sm text-signal-body mt-0.5">{primaryPatternName}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: primary action */}
        <button
          type="button"
          onClick={scrollToCaseHistory}
          className="inline-flex shrink-0 items-center gap-2 rounded-signalSm bg-signal-accent px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-signal-accentHover focus:outline-none focus:ring-2 focus:ring-signal-accent focus:ring-offset-2"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Draft closure note
        </button>
      </div>
    </div>
  );
}
