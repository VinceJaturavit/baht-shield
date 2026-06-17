"use client";

import { useCallback, useMemo, useState } from "react";
import type { TraceCase, TraceMethod, TraceAuditEvent } from "@/lib/trace/types";
import type { TraceWorkflowStepId } from "@/lib/trace/workflow-steps";
import { isStepLocked } from "@/lib/trace/workflow-steps";
import { buildAttributionRows } from "@/lib/trace/attribution";
import {
  createAiAssistEvent,
  createMethodSelectedEvent,
  createReviewApprovedEvent,
  createReviewRejectedEvent,
  validateMethodSave,
  validateReviewApprove,
  validateReviewReject,
} from "@/lib/trace/audit";
import { generateDeterministicAiAssist, getAiAssistFullSummary } from "@/lib/trace/ai-assist";
import { TRACE_CASE_001_STORY } from "@/data/trace/trace-preview-cases";
import { TraceCaseHeader } from "./TraceCaseHeader";
import { TraceWorkflowStepper } from "./TraceWorkflowStepper";
import { TraceBoundaryBanner } from "./TraceBoundaryBanner";
import { TraceBoundaryDrawer } from "./TraceBoundaryDrawer";
import { TraceCaseStoryCard } from "./TraceCaseStoryCard";
import { TraceMiniFlow } from "./TraceMiniFlow";
import { TraceIntakeOverview } from "./TraceIntakeOverview";
import { TraceCoMinglingOverview } from "./TraceCoMinglingOverview";
import { TraceVendorEvidence } from "./TraceVendorEvidence";
import { TraceFrozenPoolLedger } from "./TraceFrozenPoolLedger";
import { TraceMethodComparison } from "./TraceMethodComparison";
import { TraceVictimAttributionTable } from "./TraceVictimAttributionTable";
import { TraceEvidencePackageSummary } from "./TraceEvidencePackageSummary";
import { TraceReviewAudit } from "./TraceReviewAudit";

interface TraceCaseWorkspaceProps {
  traceCase: TraceCase;
}

export function TraceCaseWorkspace({ traceCase }: TraceCaseWorkspaceProps) {
  const [activeStep, setActiveStep] = useState<TraceWorkflowStepId>("method-decision");
  const [selectedMethod, setSelectedMethod] = useState<TraceMethod | null>(null);
  const [methodRationale, setMethodRationale] = useState("");
  const [savedMethod, setSavedMethod] = useState<TraceMethod | null>(null);
  const [savedRationale, setSavedRationale] = useState("");
  const [methodSaved, setMethodSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [reviewStatus, setReviewStatus] = useState(traceCase.status);
  const [reviewerNote, setReviewerNote] = useState("");
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [auditEvents, setAuditEvents] = useState<TraceAuditEvent[]>([]);
  const [aiSummaryLogged, setAiSummaryLogged] = useState(false);

  const aiOutput = useMemo(() => generateDeterministicAiAssist(traceCase), [traceCase]);

  const attributionRows = useMemo(
    () => buildAttributionRows(traceCase, savedMethod),
    [traceCase, savedMethod],
  );

  const handleStepChange = useCallback(
    (step: TraceWorkflowStepId) => {
      if (!isStepLocked(step, methodSaved)) {
        setActiveStep(step);
      }
    },
    [methodSaved],
  );

  const handleSaveMethod = useCallback(() => {
    const validation = validateMethodSave(selectedMethod, methodRationale);
    if (!validation.ok) {
      setSaveError(validation.error);
      return;
    }
    setSaveError(null);
    setSavedMethod(selectedMethod);
    setSavedRationale(methodRationale);
    setMethodSaved(true);
    setReviewStatus("pending-review");
    const events = createMethodSelectedEvent(selectedMethod!, methodRationale);
    setAuditEvents((prev) => [...prev, ...events]);
  }, [selectedMethod, methodRationale]);

  const handleLogAiSummary = useCallback(() => {
    const summary = getAiAssistFullSummary(aiOutput);
    setAuditEvents((prev) => [...prev, createAiAssistEvent(summary)]);
    setAiSummaryLogged(true);
  }, [aiOutput]);

  const handleUseRationaleStarter = useCallback(() => {
    if (!methodRationale.trim()) {
      setMethodRationale(aiOutput.rationaleStarter);
    }
  }, [aiOutput.rationaleStarter, methodRationale]);

  const handleApprove = useCallback(() => {
    const validation = validateReviewApprove(savedMethod, savedRationale);
    if (!validation.ok) {
      setReviewError(validation.error);
      return;
    }
    setReviewError(null);
    setReviewStatus("approved");
    setAuditEvents((prev) => [...prev, createReviewApprovedEvent(reviewerNote)]);
  }, [savedMethod, savedRationale, reviewerNote]);

  const handleReject = useCallback(() => {
    const validation = validateReviewReject(reviewerNote);
    if (!validation.ok) {
      setReviewError(validation.error);
      return;
    }
    setReviewError(null);
    setReviewStatus("rejected");
    setAuditEvents((prev) => [...prev, createReviewRejectedEvent(reviewerNote)]);
  }, [reviewerNote]);

  const story =
    traceCase.caseId === "TRACE-CASE-001"
      ? TRACE_CASE_001_STORY
      : `${traceCase.title}. Synthetic recovery case for workflow demonstration.`;

  return (
    <div className="max-w-6xl overflow-x-hidden">
      <TraceCaseHeader traceCase={traceCase} reviewStatus={reviewStatus} />

      <div className="mb-4 space-y-2">
        <TraceBoundaryBanner />
        <TraceBoundaryDrawer />
      </div>

      <div className="mb-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TraceCaseStoryCard story={story} />
        <TraceMiniFlow />
      </div>

      <div className="mb-6">
        <TraceWorkflowStepper
          activeStep={activeStep}
          methodSaved={methodSaved}
          reviewStatus={reviewStatus}
          onStepChange={handleStepChange}
        />
      </div>

      <div className="mt-6 pb-8">
        {activeStep === "intake" && <TraceIntakeOverview traceCase={traceCase} />}
        {activeStep === "vendor-evidence" && (
          <TraceVendorEvidence evidence={traceCase.vendorEvidence} />
        )}
        {activeStep === "frozen-funds" && (
          <TraceFrozenPoolLedger traceCase={traceCase} />
        )}
        {activeStep === "co-mingling" && (
          <TraceCoMinglingOverview traceCase={traceCase} />
        )}
        {activeStep === "method-decision" && (
          <TraceMethodComparison
            traceCase={traceCase}
            selectedMethod={selectedMethod}
            methodRationale={methodRationale}
            saveError={saveError}
            methodSaved={methodSaved}
            aiOutput={aiOutput}
            aiSummaryLogged={aiSummaryLogged}
            onSelectMethod={setSelectedMethod}
            onRationaleChange={setMethodRationale}
            onSave={handleSaveMethod}
            onLogAiSummary={handleLogAiSummary}
            onUseRationaleStarter={handleUseRationaleStarter}
          />
        )}
        {activeStep === "victim-attribution" && (
          <TraceVictimAttributionTable
            rows={attributionRows}
            asset={traceCase.asset}
            methodSaved={methodSaved}
          />
        )}
        {activeStep === "evidence-package" && (
          <TraceEvidencePackageSummary
            traceCase={traceCase}
            selectedMethod={savedMethod}
            methodRationale={savedRationale}
            attributionRows={attributionRows}
            reviewStatus={reviewStatus}
            auditEvents={auditEvents}
            methodSaved={methodSaved}
            aiOutput={aiOutput}
          />
        )}
        {activeStep === "senior-review" && (
          <TraceReviewAudit
            selectedMethod={savedMethod}
            methodRationale={savedRationale}
            methodSaved={methodSaved}
            reviewStatus={reviewStatus}
            reviewerNote={reviewerNote}
            reviewError={reviewError}
            auditEvents={auditEvents}
            onReviewerNoteChange={setReviewerNote}
            onApprove={handleApprove}
            onReject={handleReject}
          />
        )}
      </div>
    </div>
  );
}
