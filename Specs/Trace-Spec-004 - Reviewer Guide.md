# Trace-Spec-004 — In-App Reviewer Guide for Ourox Trace

**Project:** Ourox Trace  
**Spec:** Trace-Spec-004  
**Issued from:** Trace-Brief-004  
**Build mode:** Cursor AUTO mode, one-session scope  
**Status:** Implemented locally — report before push

## Objective

Add a concise, public-safe reviewer guide for **Ourox Trace** at `/trace/guide`, reachable from the Trace landing/header. Content/documentation only — no workflow logic, method math, gates, audit, or AI behaviour changes.

## Implementation scope

- Reviewer guide route: `app/trace/guide/page.tsx`
- Guide content: `lib/trace/trace-guide-content.ts`
- Guide UI: `components/trace/guide/TraceGuidePage.tsx` (+ section/index helpers)
- Guide link from Trace landing header and case workspace header
- Sticky section index (11 sections)
- Content tests: `tests/trace/trace-guide.test.ts`

## Guide sections

1. What Ourox Trace is (thesis + boundary)
2. What it is / is not
3. Recovery mindset: start from frozen funds
4. Forward vs backward tracing
5. Co-mingling and method choice
6. The four methods (FIFO/LIFO/LIBR/pro-rata + UTXO/account note)
7. VASP attribution and recovery endpoint (Freeze → Seize → Restitution)
8. Where AI assists — and where it must not
9. Insufficient evidence is a valid outcome
10. Workflow at a glance (8 steps)
11. Synthetic boundary

## Safe constraints

- No changes to recovery workflow logic, method math, case data, review gates, audit logic, or AI-assist behaviour
- No proof-layer content, real data/addresses/API/key, forbidden names, emoji, card soup, or horizontal scroll
- No Ops/Verity/Arbiter changes
