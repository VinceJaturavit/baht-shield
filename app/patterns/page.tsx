"use client";

import { useState, useMemo } from "react";
import { AppShell } from "@/components/AppShell";
import { PatternLibraryList } from "@/components/patterns/PatternLibraryList";
import { PatternDetailPanel } from "@/components/patterns/PatternDetailPanel";
import { PatternStatsCard } from "@/components/patterns/PatternStatsCard";
import { getPatternSummaries } from "@/lib/pattern-intelligence";

export default function PatternsPage() {
  const patterns = useMemo(() => getPatternSummaries(), []);
  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(
    patterns.length > 0 ? patterns[0].pattern_id : null
  );

  const selectedPattern = patterns.find((p) => p.pattern_id === selectedPatternId) ?? null;

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-signal-heading">Pattern Intelligence</h1>
        <p className="mt-2 text-[15px] text-signal-secondary">
          Browse synthetic analyst-curated patterns and linked wallets. This is a read-only view of
          the pattern layer.
        </p>
      </div>

      <div className="mb-6">
        <PatternStatsCard patterns={patterns} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Pattern library list */}
        <div>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-signal-secondary">
            Pattern Library{" "}
            <span className="ml-1 rounded-full bg-signal-muted px-1.5 py-0.5 text-xs tabular-nums text-signal-secondary">
              {patterns.length}
            </span>
          </h2>
          <PatternLibraryList
            patterns={patterns}
            selectedPatternId={selectedPatternId}
            onSelectPattern={setSelectedPatternId}
          />
        </div>

        {/* Pattern detail drill-in */}
        <div className="lg:sticky lg:top-6 lg:self-start">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-signal-secondary">Pattern Detail</h2>
          <PatternDetailPanel pattern={selectedPattern} />
        </div>
      </div>
    </AppShell>
  );
}
