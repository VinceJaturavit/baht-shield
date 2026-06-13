export function OpsProtectedCapacityNote() {
  return (
    <div className="rounded-lg border border-ourox-orange/20 bg-ourox-orange/[0.04] px-3 py-2.5">
      <p className="text-xs leading-relaxed text-ourox-ink/75">
        Officer reserve is protected capacity. Officers cannot be fully loaded with routine intake
        because RFR, LAR, escalations, QA, and final decisions require available senior capacity.
      </p>
      <p className="mt-1 text-[11px] text-ourox-ink/50">
        Officer assignment capacity = total capacity minus protected reserve.
      </p>
      <p className="mt-1.5 text-[10px] text-ourox-ink/40">
        Protected reserve kept for complex cases, escalations, QA, and final decisions.
      </p>
    </div>
  );
}
