# SMFGU-PROTOTYPE-009 — Crownlight Interactive Charting and Teaching Workbench V2

**Document ID:** SMFGU-PROTOTYPE-009  
**Project:** The Stock Market: From the Ground Up / Crownlight Prototype Center  
**Company / imprint:** Cyber Nexus / Crown & Lantern Press  
**Filename:** `SMFGU-PROTOTYPE-009-v1.0-20261031.md`  
**File type:** Markdown (.md)  
**Version:** 1.0  
**Date:** October 31, 2026 (America/Chicago)  
**Repository location:** `cybernexuspublishing/stock-market-from-the-ground-up/docs/prototype/`, `main`  
**Google Drive location:** Not assigned or verified; no Google Drive copy created  
**Document status:** Implementation and source acceptance recorded; exact-commit CI, deployment and authenticated Owner acceptance must be distinguished.  
**Purpose:** Explain the user-facing functionality, source-data restrictions, educational scope, permissions, testing and acceptance of the advanced three-page Prototype Suite V2.  
**Dependencies:** Existing staff-only `/prototype.html` bootstrap, Supabase Owner/Admin role verification, Cloudflare Pages, React 19.1.1, TypeScript 5.9.3, self-hosted Apache ECharts 6.1.0, `CrownlightIndicatorMath`, fictional OHLCV and the pre-existing 61-guide authored public Tutor catalog.  
**New document required:** Yes. V2 capabilities need an independent control and acceptance record without modifying frozen V1 records.

## Controlling decisions

1. The internal prototype should **behave like a working product**. ECharts pan/zoom, replay, chart overlays, indicators, parameters, editing controls and teaching practice must be functional and browser-testable.
2. Never infer an actual live data feed, subscription entitlement, brokerage order, protected grading or account write from a working preview. All market bars and learning figures in this experience are deterministic fictional examples.
3. Keep the previously approved eight membership preview codes and three independent Studio tier presentations. Lesson quality and Talia teaching depth do not vary by paid membership when a lesson is legitimately accessible.
4. Preserve the existing restricted Owner/Admin Prototype Center and current production website routes. Do not add exposed standalone files, billing writes, schema migrations, or new dependencies.

## Implemented experience

### Chart controls and navigation
- Drag the actual ECharts plotting area horizontally to pan the displayed data window.
- Control + mouse wheel zoom, interactive ECharts range slider, keyboard-operable pan left/right, zoom in/out and fit-all buttons; accessible viewport readout reports numeric start/end percentage.
- Linked ECharts time axes and hover inspection on price, volume and selected indicator panes. No unrevealed future bars are passed to ECharts.
- Selected fictional candle inspector, replay slider and stepwise reveal coexist with chart panning. Indicator calculations honor completed bars and warm-up periods.

### Indicator availability
15 calculation-ready visual study entries using the shared math engine and explicitly defined fixture assumptions:
1. Fast EMA (configurable period).
2. Slow EMA (configurable period).
3. SMA (configurable period).
4. Cumulative HLC3×bar-volume **VWAP proxy**, not true trade-print VWAP.
5. Bollinger middle/upper/lower (period and standard-deviation multiplier).
6. Observed high of day.
7. Observed low of day.
8. Opening range high/low (minutes).
9. Confirmed HH/HL/LH/LL pivots (confirmation-bar parameter).
10. Bar volume.
11. Volume SMA (period).
12. Wilder RSI (period).
13. MACD line/signal/histogram (fast/slow/signal).
14. Wilder ATR (period).
15. On-balance volume.

The catalog also exposes the existing 61 original public indicator teaching briefs, including concept, formula, limitation and common-error material. **The additional guides are not falsely represented as 61 fully computed or independently data-verified chart studies.** Their chart coverage depends on appropriate calculation implementation and, for some studies, unavailable trade-print, comparable-session, derivative, breadth or order-book inputs. No fabricated indicator values are accepted.

### Better guided instruction
- Talia Mercer has nine distinct stage-specific VWAP and candlestick explanations instead of recycling a few rotating blurbs.
- Four functional teaching actions: Explain This Concept, Guided Example, Try Another Example, Teach This in More Depth.
- Worked financial math includes numerator, denominator, intermediate amounts and $/share units; candlesticks distinguish high–low range, body and upper/lower wicks.
- Diagnostic feedback identifies mistaken unweighted transaction averages and confused body-versus-range calculations, then explains the correction.
- A new transfer task presents fresh fictional numbers and checks an independent user response. This preview remains ungraded; real private question banks, protected answers and member progress are excluded.
- Talia is an authored deterministic instructor in these pages, not a claimed live generative-AI service. Actual production beta-Tutor migration is **NOT IMPLEMENTED** by this internal prototype release.

## Source inventory
| File | Role |
|---|---|
| `assets/js/prototype-indicator-workbench-v2.js` | New mathematical adapter and current-bar-only chart series |
| `src/prototype/PrototypeExperiences.tsx` | React controls, dynamic multi-pane ECharts visualization, teaching and diagnostic feedback |
| `assets/css/prototype-experiences-v1.css` | Scoped responsive professional indicator desk, gesture guidance and Talia workbench |
| `prototype.html` | Connect existing pinned indicator math source before rendering the private React Suite |
| `tests/prototype-indicator-workbench-v2.test.mjs` | 15-study, 61-guide, warm-up and no-lookahead contract |
| `tests/prototype-experiences-v1-browser.test.mjs` | Restricted-role Chromium test for chart controls, actual drag, lessons and transfer |
| `.github/workflows/prototype-center-v1.yml` | Static, strict-build, synthetic role and browser tests |

**No database migration.** No changes to Stripe, Cloudflare account configuration, Supabase privileges, real-market data procurement, pricing, member entitlements, payments or rewards ledger.

## Acceptance protocol
- Confirm GitHub `main` final source SHA and no unintended branch.
- Strict TypeScript, original and new source contracts, and exact Cloudflare Pages build artifacts must pass on the final commit.
- Browser checks: Owner/Admin mock role access; rejected Free/Moderator roles; desktop/tablet/mobile shell; indicator catalog count 61; parameters and toggles; mouse drag changes viewport; pan/zoom controls; two teaching topics; targeted explanations and transfer feedback; no React browser exceptions.
- Check Cloudflare Pages production deployment **SHA parity and success**, not just a queued build.
- Live authenticated Owner review, manual screen-reader/accessibility audit, real beta-user instructional outcomes, feedback/assessment retention and entitlement integration remain separate open release gates.

## Operational notes
- To return to the original staff-only Prototype Center, use `/prototype.html`.
- To view the advanced workspaces, open `/prototype.html?experience=a`, `?experience=b`, or `?experience=c` while authenticated with the preexisting administrative access.
- A low-cost future migration to beta member experiences requires independently approved server entitlement integration and real-user acceptance. The present prototype does not alter existing beta tester instruction or their progress records.

## Rollback
Revert only the V2 targeted main-branch source commits while preserving all previously accepted Prototype Center V1–V7 and Prototype Suite V1 files and existing role gates. No SQL rollback is required.

## Revision history
| Version | Date | Change | Status |
|---|---|---|---|
| 1.0 | 2026-10-31 | Real chart dragging and study settings, fifteen calculations, 61-guide explorer and stage-aware Talia teaching | Source implemented, final deployment/CI recorded separately |
