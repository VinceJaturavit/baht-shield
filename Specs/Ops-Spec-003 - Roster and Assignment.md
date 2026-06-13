# Ops-Spec-003 — Roster & Assignment

**Project:** Ourox / Ops Layer  
**Spec:** Ops-Spec-003  
**Issued from:** Ops-Brief-003  
**Build mode:** Cursor AUTO mode, one-session scope  
**Status:** Implemented locally — pending review before push

---

## Objective

Build Screen 3 of Ourox Ops: **Roster & Assignment** — planned queue ownership, officer vs contractor role separation, current load vs capacity (derived from existing synthetic cases), overload visibility, officer protected capacity, and daily owner + backup rotation by queue. Static synthetic view only; no live reassignment, drag-and-drop, simulation, KPI screen, scoring, or ML.

## Delivered scope

### Data & logic

- `lib/ops/roster-types.ts` — `OpsTeamMember`, `OpsTeamMemberWithLoad`, `OpsQueueOwnership`, role/attendance types
- `data/ops/ops-team.ts` — 12-person synthetic roster (4 officers, 8 contractors)
- `data/ops/ops-queue-ownership.ts` — daily ownership for Urgent + five streams
- `lib/ops/roster.ts` — open-case filter, load-by-owner, assignment capacity, overload helpers

### UI

- `components/ops/OpsSideNav.tsx` — Roster nav item activated (KPI remains Coming)
- `components/ops/OpsWorkspace.tsx` — `roster` workspace view wired
- `components/ops/OpsRosterWorkspace.tsx` — header, protected-capacity note, roster + queue ownership layout
- `components/ops/OpsRosterTable.tsx` — Officers / Contractors grouped dense tables
- `components/ops/OpsRosterLoadBar.tsx` — split capacity bar (assigned / protected reserve / overload)
- `components/ops/OpsRoleBadge.tsx`, `OpsAttendanceBadge.tsx` — indicator + label badges
- `components/ops/OpsQueueOwnershipTable.tsx` — daily owner, backup, next rotation, ownership rules
- `components/ops/OpsProtectedCapacityNote.tsx` — officer reserve rationale

### Tests

- `tests/ops/ops-roster.test.ts` — roster size, role split, load derivation, overload logic, queue ownership rules

## Roster

| Role | Count | Names |
|------|-------|-------|
| Officers | 4 | Ops Lead, Analyst A, Analyst B, Queue Owner |
| Contractors | 8 | Contractor A–H |

- Existing case owner names reused for officers so load derives from `data/ops/ops-cases.ts`
- Officers: `protectedCapacityReserve: 2`; `assignmentCapacity = capacity - 2`
- Contractors: full capacity is assignment capacity; no protected reserve

## Load derivation

- Open cases = all cases where `status !== "Closed"`
- `currentLoad` = count of open cases where `case.owner === member.name`
- Overload: officers when `currentLoad > assignmentCapacity`; contractors when `currentLoad > capacity`
- Case data unchanged; no data model change

## Queue ownership

| Queue | Owner today | Backup | Next rotation | Rule |
|-------|-------------|--------|---------------|------|
| Urgent overlay | Ops Lead | Analyst A | Analyst B | Officer-owned |
| RFR | Ops Lead | Analyst A | Analyst B | Officer-owned |
| LAR | Analyst A | Queue Owner | Ops Lead | Officer-owned |
| PRO | Queue Owner | Ops Lead | Analyst B | Officer-owned (escalation path) |
| DSP | Contractor A | Contractor B | Contractor C | Contractor-owned under SOP |
| PRF | Contractor E | Contractor B | Contractor H | Contractor-owned under SOP |

Rotation: **Rotates daily** on every row.

## Protected capacity

- Section note above roster tables explains officer reserve rationale
- Per-officer load bar shows assigned load, assignment capacity, and protected reserve segment
- Copy: *Protected reserve kept for complex cases, escalations, QA, and final decisions.*

## Out of scope (confirmed not built)

- Live reassignment / drag-and-drop
- KPI screen
- Attendance/overtime engine
- Data model changes
- Arbiter scoring/ML/JDM/API changes

## Guardrails

- Synthetic only
- Non-identifying labels (RFR/DSP/LAR/PRO/PRF)
- No TrueMoney/Kraken/Payward on public surfaces
- No SignalOS on user-visible surfaces (test guard arrays only)
- No emoji
- No card soup; dense dark doctrine-aligned tables

## Verification

- `npm test`: pass (223 tests)
- `npm run test:slow`: pass (3 tests)
- `npm run build`: pass
- Arbiter diff: no changes
