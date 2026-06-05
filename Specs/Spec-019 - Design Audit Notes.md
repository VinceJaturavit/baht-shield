# Spec-019 — Design Audit Notes

**Audited:** 2026-06-05  
**Executor:** Cursor (Build node)  
**Option:** B — shared shell + design system, Verity stays light

---

## Audit: `/` (Ourox Home)

| Attribute | Current State |
|---|---|
| Shell / header | Custom-built, NOT using OuroxShell. Logo is a `<span>`, not a `<Link>`. |
| Footer | Present. Space Mono, small, good synthetic-data honesty copy. |
| Product indicator | Platform name only ("Ourox"). No breadcrumb needed on home. |
| Type scale | Montserrat 700 for logo, Space Mono for metadata, Inter body. Correct. |
| Spacing | Generous outer margin (px-6, py-16). Correct. |
| Accent usage | Orange only. Correct. |
| Status indicators | None needed on home page. |
| Synthetic-data line | Visible in footer. |
| SignalOS | None found. |
| Issues | Logo not a link (bad UX — clicking the home logo should nav to /). Custom header is structurally identical to OuroxShell but not using it — risks drift. |

**Planned change:** Replace custom header/footer with OuroxShell usage. Page content becomes children only.

---

## Audit: `/verity` (Verity Dashboard)

| Attribute | Current State |
|---|---|
| Shell / header | Uses AppShell (white background, light theme). |
| Footer | None at page bottom. SyntheticDataLabel bar is pinned below the nav, not a footer. |
| Product indicator | `OuroxMark` + `/` + `VerityLogo` + "Verity" text. OuroxWordmark (OURO·X) is absent. |
| Type scale | Inter body, consistent Verity signal tokens. |
| Spacing | max-w-[1280px], px-4/6, py-8/10. Good. |
| Accent usage | Indigo (signal-indigo) for active nav items and focus rings. Orange is absent in shell chrome. |
| Status indicators | Text + color. Acceptable. |
| Synthetic-data line | SyntheticDataLabel bar in AppShell (below header). Visible but no footer. |
| SignalOS | None found in user-facing text. |
| Issues | No OuroxWordmark → the "OURO·X" brand identity is invisible in Verity. AppShell focus ring uses indigo instead of orange for the Ourox mark link (platform-level element). No footer with synthetic data honesty. |

**Planned change (minimal):** Add OuroxWordmark next to OuroxMark in AppShell header. Change Ourox mark focus ring to ourox-orange. Add OuroxFooter at the bottom of AppShell. Do NOT re-theme Verity interior (indigo active nav stays, light theme stays).

**Intentionally preserved:** Light theme, signal-indigo active nav states, MetricCard panels, interior navigation structure, About button, GitHub link, CommandBar.

---

## Audit: `/arbiter` (Arbiter Score Explorer)

| Attribute | Current State |
|---|---|
| Shell / header | Uses OuroxShell with `currentProduct="Arbiter"`. Correct dark chrome. |
| Footer | None at page bottom. ArbiterSyntheticBanner is inside content area (top of content). |
| Product indicator | "OURO·X / Arbiter" breadcrumb. Correct. |
| Type scale | Montserrat in logo, Inter body, Space Mono for metadata. |
| Spacing | max-w-[1280px], px-4/6, py-8/10. Good. |
| Accent usage | Orange primary. Correct. DecisionBadge uses text + icon + color. Correct. |
| Status indicators | Decision badges have icon + text + color. Compliant. |
| Synthetic-data line | ArbiterSyntheticBanner present. |
| SignalOS | None found. |
| Issues | No footer. |

**Planned change:** Add OuroxFooter via OuroxShell. Confirm shell consistency.

---

## Audit: `/arbiter/tuning` (Arbiter Tuning Workspace)

| Attribute | Current State |
|---|---|
| Shell / header | OuroxShell with `currentProduct="Arbiter"`. Correct. But tuning page wraps content in `<main className="min-h-screen bg-ourox-obsidian">` inside OuroxShell — adds nested background. |
| Footer | Tiny internal workspace footer inside ArbiterTuningWorkspace (`text-[11px]`, very faint). No page-level OuroxFooter. |
| Product indicator | No "Tuning" sub-indicator. Users navigating to /arbiter/tuning still see "/ Arbiter" in header, which is correct. |
| Type scale | Consistent with Arbiter (Ourox tokens). Good. |
| Spacing | max-w-7xl, px-6, py-6. Slightly different from Explorer's max-w-[1280px]. |
| Accent usage | Orange primary. Correct. |
| Status indicators | Decision text in EventSummaryCard is color-only for text (BLOCK=text-red-400, etc.). Should pair with text label — currently the text IS the label, so this is acceptable. |
| Synthetic-data line | TuningSyntheticBanner present at top. |
| SignalOS | None found. |
| Major issues | **Default state reads as broken:** At default thresholds (25/50/75), many fraud events score in the STEP_UP band (25–50), not REVIEW/BLOCK. The tuning matrix evaluates only score-band decisions, so TP=0 or near-zero at defaults. Explorer shows ~148 BLOCK from Zen-Engine rule overrides (R3 MULE_TARGET_PROHIBITED etc.) — this discrepancy confuses users. No explainer context present. No instructive preset. |

**Planned change:** Add score-band matrix explainer. Add "Show tradeoff preset" button (Option 1). Add rule-inclusive BLOCK reconciliation strip. Remove internal footer (OuroxShell/OuroxFooter handles it). Remove redundant nested `min-h-screen`.

---

## Cross-Surface Incoherence Summary

| Element | Home `/` | Verity `/verity` | Arbiter `/arbiter` | Tuning `/arbiter/tuning` |
|---|---|---|---|---|
| OuroxShell used | ✗ (custom) | ✗ (AppShell) | ✓ | ✓ |
| OuroxWordmark visible | ✓ (large) | ✗ | ✓ (14px) | ✓ (14px) |
| Ourox link focus ring | — | indigo | orange | orange |
| Footer | ✓ (custom) | ✗ | ✗ | tiny internal |
| Synthetic data honesty | footer | SyntheticDataLabel | ArbiterSyntheticBanner | TuningSyntheticBanner |

---

## Geo-Velocity Audit

**Mule farm (WAL_MF_*):** All history and event geo use `rand_geo_th()` (Thailand bounds). Previous geo = Thailand, current geo = Thailand → small geo_velocity. No IMPOSSIBLE_TRAVEL. ✓

**Sleeper activation (WAL_SM_*):** All history and event geo use `rand_geo_th()`. Same as above. No IMPOSSIBLE_TRAVEL. ✓

**APP scam cashout (WAL_APP_*):** Most events use Thailand geo. **Exception:** `i % 4 == 0` → approximately 12/50 events use `rand_geo_abroad()` (European coordinates). History inbound record uses `rand_geo_th()`. This means those 12 events trigger IMPOSSIBLE_TRAVEL as a top driver on what is supposed to be an APP scam pattern, not an ATO pattern. **Issue.**

**ATO events (EVT_ATO_*):** Explicitly use abroad geo (Tokyo, Sydney, Berlin). Intentional. IMPOSSIBLE_TRAVEL fires here correctly. ✓

**Background (WAL_BG_*):** All Thailand geo. No IMPOSSIBLE_TRAVEL. ✓

**Fix:** Remove `rand_geo_abroad()` usage from the APP scam section (keep ATO events unchanged).

---

## Planned Smallest Changes

1. Create `OuroxFooter` component.
2. OuroxShell: add OuroxFooter at bottom of page layout.
3. Ourox home: use OuroxShell, remove custom header/footer from page.
4. AppShell: add OuroxWordmark next to OuroxMark; fix Ourox link focus ring to orange; add OuroxFooter at bottom.
5. ArbiterTuningWorkspace: add score-band explainer; add tradeoff preset button; add rule-inclusive comparison strip; remove internal footer.
6. Mockingbird: change APP scam non-ATO events to use only Thailand geo.
7. Regenerate mockingbird data.

No interior Verity redesign. No Arbiter scoring changes. No new features.
