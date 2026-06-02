"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { PatternLibraryList } from "@/components/patterns/PatternLibraryList";
import { PatternDetailPanel } from "@/components/patterns/PatternDetailPanel";
import { PatternStatsCard } from "@/components/patterns/PatternStatsCard";
import { getPatternSummaries } from "@/lib/pattern-intelligence";

function PatternsContent() {
  const searchParams = useSearchParams();
  const patterns = useMemo(() => getPatternSummaries(), []);

  const defaultId = useMemo(() => {
    const paramId = searchParams.get("patternId");
    if (paramId) {
      const match = patterns.find((p) => p.pattern_id === paramId);
      if (match) return match.pattern_id;
    }
    return patterns.length > 0 ? patterns[0].pattern_id : null;
  }, [patterns, searchParams]);

  const [selectedPatternId, setSelectedPatternId] = useState<string | null>(defaultId);

  // Sync if URL param changes after mount (e.g. command modal navigation)
  useEffect(() => {
    const paramId = searchParams.get("patternId");
    if (paramId) {
      const match = patterns.find((p) => p.pattern_id === paramId);
      if (match) setSelectedPatternId(match.pattern_id);
    }
  }, [searchParams, patterns]);

  const selectedPattern = patterns.find((p) => p.pattern_id === selectedPatternId) ?? null;

  return (
    <>
      <div className="mb-8">
        <h1 className="text-[30px] leading-[38px] font-semibold tracking-tight text-signal-ink">Pattern Intelligence</h1>
        <p className="mt-2 text-[15px] leading-6 text-signal-slate">
          Browse synthetic analyst-curated patterns and linked wallets. This is a read-only view of
          the pattern layer.
        </p>
      </div>

      <div className="mb-6">
        <PatternStatsCard patterns={patterns} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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

        <div className="lg:sticky lg:top-6 lg:self-start">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-signal-secondary">Pattern Detail</h2>
          <PatternDetailPanel pattern={selectedPattern} />
        </div>
      </div>
    </>
  );
}

export default function PatternsPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="py-8 text-sm text-signal-secondary">Loading patterns…</div>}>
        <PatternsContent />
      </Suspense>
    </AppShell>
  );
}
