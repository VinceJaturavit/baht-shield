import Link from "next/link";
import { TraceLogo } from "../TraceLogo";
import { TraceGuideSection, TraceGuideProse } from "./TraceGuideSection";
import { TraceGuideSectionIndex } from "./TraceGuideSectionIndex";
import {
  TRACE_GUIDE_AI,
  TRACE_GUIDE_CO_MINGLING,
  TRACE_GUIDE_FORWARD_BACKWARD,
  TRACE_GUIDE_INSUFFICIENT_EVIDENCE,
  TRACE_GUIDE_IS_LIST,
  TRACE_GUIDE_IS_NOT_LIST,
  TRACE_GUIDE_METHODS,
  TRACE_GUIDE_NAV,
  TRACE_GUIDE_RECOVERY_MINDSET,
  TRACE_GUIDE_SYNTHETIC,
  TRACE_GUIDE_VASP,
  TRACE_GUIDE_WHAT_IS,
  TRACE_GUIDE_WORKFLOW,
} from "@/lib/trace/trace-guide-content";

export function TraceGuidePage() {
  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
        <TraceGuideSectionIndex />

        <div className="min-w-0 flex-1 space-y-12">
          <header className="border-b border-trace-border pb-8">
            <div className="flex items-center gap-3">
              <TraceLogo size={40} className="shrink-0" />
              <div className="min-w-0 border-l border-trace-border pl-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-trace-primary">
                  Ourox Trace
                </p>
                <h1 className="text-xl font-semibold tracking-tight text-trace-heading">
                  Reviewer guide
                </h1>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-trace-body">
              A concise guide to the recovery-tracing workflow, methodology, and honest product
              boundary. Public-safe documentation for reviewers exploring the synthetic demo.
            </p>
            <p className="mt-2 text-xs text-trace-secondary">
              Synthetic data only · Public-safe · Methodology education, not legal advice
            </p>
            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs">
              <Link
                href={TRACE_GUIDE_NAV.backToTrace.href}
                className="text-trace-primary hover:text-trace-blue1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-trace-primary"
              >
                {TRACE_GUIDE_NAV.backToTrace.label}
              </Link>
              <Link
                href={TRACE_GUIDE_NAV.openCaseWorkflow.href}
                className="text-trace-primary hover:text-trace-blue1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-trace-primary"
              >
                {TRACE_GUIDE_NAV.openCaseWorkflow.label}
              </Link>
            </div>
          </header>

          <TraceGuideSection id="what-trace-is" title={TRACE_GUIDE_WHAT_IS.heading}>
            <TraceGuideProse>
              <p className="font-medium text-trace-heading">{TRACE_GUIDE_WHAT_IS.thesis}</p>
              <p>{TRACE_GUIDE_WHAT_IS.explanation}</p>
              <p className="font-medium text-trace-heading">{TRACE_GUIDE_WHAT_IS.boundary}</p>
            </TraceGuideProse>
          </TraceGuideSection>

          <TraceGuideSection id="is-is-not" title="What it is / is not">
            <TraceGuideProse>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-trace-secondary">
                  Is
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  {TRACE_GUIDE_IS_LIST.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-trace-secondary">
                  Is not
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  {TRACE_GUIDE_IS_NOT_LIST.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </TraceGuideProse>
          </TraceGuideSection>

          <TraceGuideSection
            id="recovery-mindset"
            title={TRACE_GUIDE_RECOVERY_MINDSET.heading}
          >
            <TraceGuideProse>
              <p className="font-medium text-trace-heading">
                {TRACE_GUIDE_RECOVERY_MINDSET.principle}
              </p>
              <p>{TRACE_GUIDE_RECOVERY_MINDSET.body}</p>
            </TraceGuideProse>
          </TraceGuideSection>

          <TraceGuideSection
            id="forward-vs-backward"
            title={TRACE_GUIDE_FORWARD_BACKWARD.heading}
          >
            <TraceGuideProse>
              <p>{TRACE_GUIDE_FORWARD_BACKWARD.forward}</p>
              <p>{TRACE_GUIDE_FORWARD_BACKWARD.backward}</p>
              <p className="font-medium text-trace-heading">
                {TRACE_GUIDE_FORWARD_BACKWARD.traceRole}
              </p>
            </TraceGuideProse>
          </TraceGuideSection>

          <TraceGuideSection id="co-mingling" title={TRACE_GUIDE_CO_MINGLING.heading}>
            <TraceGuideProse>
              <p>{TRACE_GUIDE_CO_MINGLING.intro}</p>
              <p>{TRACE_GUIDE_CO_MINGLING.method}</p>
            </TraceGuideProse>
          </TraceGuideSection>

          <TraceGuideSection id="tracing-methods" title={TRACE_GUIDE_METHODS.heading}>
            <TraceGuideProse>
              <ul className="space-y-2">
                {TRACE_GUIDE_METHODS.items.map((method) => (
                  <li key={method.id}>
                    <span className="font-medium text-trace-heading">{method.label}</span>
                    {" — "}
                    {method.description}
                  </li>
                ))}
              </ul>
              <p>{TRACE_GUIDE_METHODS.samePool}</p>
              <p>{TRACE_GUIDE_METHODS.utxoNote}</p>
              <p className="text-xs text-trace-secondary">{TRACE_GUIDE_METHODS.caveat}</p>
            </TraceGuideProse>
          </TraceGuideSection>

          <TraceGuideSection id="vasp-recovery" title={TRACE_GUIDE_VASP.heading}>
            <TraceGuideProse>
              <p>{TRACE_GUIDE_VASP.intro}</p>
              <p className="font-medium text-trace-heading">{TRACE_GUIDE_VASP.pathway}</p>
              <ul className="space-y-2">
                {TRACE_GUIDE_VASP.definitions.map((item) => (
                  <li key={item.term}>
                    <span className="font-medium text-trace-heading">{item.term}:</span>{" "}
                    {item.definition}
                  </li>
                ))}
              </ul>
            </TraceGuideProse>
          </TraceGuideSection>

          <TraceGuideSection id="ai-assists" title={TRACE_GUIDE_AI.heading}>
            <TraceGuideProse>
              <p className="font-medium text-trace-heading">{TRACE_GUIDE_AI.principle}</p>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-trace-secondary">
                  AI can
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  {TRACE_GUIDE_AI.can.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-trace-secondary">
                  AI cannot
                </p>
                <ul className="list-disc space-y-1 pl-5">
                  {TRACE_GUIDE_AI.cannot.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <p>{TRACE_GUIDE_AI.humanOwned}</p>
            </TraceGuideProse>
          </TraceGuideSection>

          <TraceGuideSection
            id="insufficient-evidence"
            title={TRACE_GUIDE_INSUFFICIENT_EVIDENCE.heading}
          >
            <TraceGuideProse>
              <p>{TRACE_GUIDE_INSUFFICIENT_EVIDENCE.body}</p>
            </TraceGuideProse>
          </TraceGuideSection>

          <TraceGuideSection id="workflow" title={TRACE_GUIDE_WORKFLOW.heading}>
            <TraceGuideProse>
              <ol className="list-decimal space-y-2 pl-5">
                {TRACE_GUIDE_WORKFLOW.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </TraceGuideProse>
          </TraceGuideSection>

          <TraceGuideSection id="synthetic-boundary" title={TRACE_GUIDE_SYNTHETIC.heading}>
            <TraceGuideProse>
              <p>{TRACE_GUIDE_SYNTHETIC.body}</p>
              <p>{TRACE_GUIDE_SYNTHETIC.purpose}</p>
            </TraceGuideProse>
          </TraceGuideSection>
        </div>
      </div>
    </div>
  );
}
