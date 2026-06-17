"use client";

import { useCallback, useMemo, useState } from "react";
import type { TraceCase, TraceMethod, TraceTab, TraceAuditEvent } from "@/lib/trace/types";
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
import { TRACE_BOUNDARY } from "@/lib/trace/boundary";
import { TraceCaseHeader } from "./TraceCaseHeader";
import { TraceTabs } from "./TraceTabs";
import { TraceBoundaryPanel } from "./TraceBoundaryPanel";
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
  const [activeTab, setActiveTab] = useState<TraceTab>("method-comparison");
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

  return (
    <div className="max-w-6xl overflow-x-hidden">
      <TraceCaseHeader traceCase={traceCase} reviewStatus={reviewStatus} />

      <div className="mb-6">
        <TraceBoundaryPanel />
      </div>

      <p className="mb-4 text-[11px] text-ourox-ink/50 border-l-2 border-ourox-orange/40 pl-3">
        {TRACE_BOUNDARY.aiRoleStatement}
      </p>

      <TraceTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6 pb-8">
        {activeTab === "vendor-evidence" && (
          <TraceVendorEvidence evidence={traceCase.vendorEvidence} />
        )}
        {activeTab === "frozen-pool" && (
          <TraceFrozenPoolLedger traceCase={traceCase} />
        )}
        {activeTab === "method-comparison" && (
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
        {activeTab === "victim-attribution" && (
          <TraceVictimAttributionTable rows={attributionRows} asset={traceCase.asset} />
        )}
        {activeTab === "evidence-package" && (
          <TraceEvidencePackageSummary
            traceCase={traceCase}
            selectedMethod={savedMethod}
            methodRationale={savedRationale}
            attributionRows={attributionRows}
            reviewStatus={reviewStatus}
            auditEvents={auditEvents}
          />
        )}
        {activeTab === "review-audit" && (
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
