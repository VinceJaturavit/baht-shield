// Arbiter Spec-005 — /arbiter/feedback route
//
// Server component: loads static ML artifacts, runs feedback analysis and
// simulated back-test. No API calls. No runtime inference. No JDM changes.

import ArbiterFeedbackWorkspace from "@/components/arbiter/feedback/ArbiterFeedbackWorkspace";
import {
  getDefaultFeedbackCandidate,
  runFeedbackBacktest,
} from "@/lib/arbiter/feedback-backtest";
import { OuroxShell } from "@/components/ourox/OuroxShell";

export default function ArbiterFeedbackPage() {
  const candidate = getDefaultFeedbackCandidate();
  const backtestResult = runFeedbackBacktest(candidate);

  return (
    <OuroxShell currentProduct="Arbiter">
      <ArbiterFeedbackWorkspace
        candidate={candidate}
        backtestResult={backtestResult}
      />
    </OuroxShell>
  );
}
