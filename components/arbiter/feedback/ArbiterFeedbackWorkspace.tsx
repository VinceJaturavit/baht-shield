"use client";

import { ArbiterSectionNav } from "@/components/arbiter/ArbiterSectionNav";
import { ArbiterSyntheticBanner } from "@/components/arbiter/ArbiterSyntheticBanner";
import { FeedbackFramingBanner } from "./FeedbackFramingBanner";
import { MissClusterSummary } from "./MissClusterSummary";
import { DominantPatternPanel } from "./DominantPatternPanel";
import { CandidateRefinementPanel } from "./CandidateRefinementPanel";
import { BacktestSimulationPanel } from "./BacktestSimulationPanel";
import { FeedbackLoopStepper } from "./FeedbackLoopStepper";
import { FeedbackCaseTable } from "./FeedbackCaseTable";

import {
  getMlHighRuleLowCases,
  groupMissesByTypology,
  groupMissesByFeaturePattern,
  getDominantMissCluster,
} from "@/lib/arbiter/feedback-analysis";
import type {
  FeedbackBacktestResult,
  FeedbackCandidateRule,
} from "@/lib/arbiter/feedback-backtest";

interface Props {
  backtestResult: FeedbackBacktestResult;
  candidate: FeedbackCandidateRule;
}

export default function ArbiterFeedbackWorkspace({ backtestResult, candidate }: Props) {
  const misses = getMlHighRuleLowCases();
  const typologyRows = groupMissesByTypology();
  const patternGroups = groupMissesByFeaturePattern();
  const dominantCluster = getDominantMissCluster();

  return (
    <div
      className="min-h-screen bg-ourox-obsidian"
      style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
    >
      <div className="mx-auto max-w-[1280px] px-6 py-6">
        <div className="mb-6">
          <p
            className="mb-1 text-xs font-medium uppercase tracking-wider text-ourox-orange"
            style={{ fontFamily: "'Space Mono', monospace" }}
          >
            Arbiter
          </p>
          <h1 className="mb-1 text-xl font-semibold tracking-tight text-ourox-ink">
            Feedback — closing the loop
          </h1>
          <p className="text-sm text-ourox-ink/50">
            Closing the loop from model disagreement to rule refinement.
          </p>
        </div>

        <div className="mb-5">
          <ArbiterSectionNav />
        </div>

        <div className="mb-4">
          <ArbiterSyntheticBanner />
        </div>

        <div className="mb-6">
          <FeedbackFramingBanner />
        </div>

        <div className="mb-6">
          <FeedbackLoopStepper />
        </div>

        <div className="space-y-6">
          <MissClusterSummary totalMisses={misses.length} typologyRows={typologyRows} />

          <DominantPatternPanel cluster={dominantCluster} patternGroups={patternGroups} />

          <CandidateRefinementPanel candidate={candidate} />

          <BacktestSimulationPanel result={backtestResult} />

          <FeedbackCaseTable cases={backtestResult.newlyFlaggedCases} />
        </div>
      </div>
    </div>
  );
}
