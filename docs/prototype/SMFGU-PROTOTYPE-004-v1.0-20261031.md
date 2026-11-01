# SMFGU-PROTOTYPE-004 — Membership-Specific Advanced Lab Classroom

**Project:** The Stock Market: From the Ground Up — Crownlight Prototype Center  
**Owner / publisher:** Crown & Lantern Press  
**Document ID:** SMFGU-PROTOTYPE-004  
**Version:** 1.0  
**Date:** 2026-10-31  
**Status:** Source implemented — CI and authenticated acceptance subject to verification  
**File type:** Markdown (.md)  
**Filename:** SMFGU-PROTOTYPE-004-v1.0-20261031.md  
**Authoritative source location:** GitHub `cybernexuspublishing/stock-market-from-the-ground-up/docs/prototype/`, `main`  
**Google Drive location:** Not assigned or verified  
**Purpose:** Record eight membership-specific visual designs, twenty adjustable classroom presets, and advanced OHLC candlestick inspection.  
**Dependencies:** Prototype Center V3 private-document gate, ECharts 6.1.0, existing protected instructional-case API and frozen Lab/Boot Camp teaching model.  
**New file required:** Yes; this record preserves prior prototype acceptance decisions without altering archived versions.

## Product-owner decision
A **single** shared Lab/Boot Camp teaching engine drives all membership presentations. There is no duplicate course, grading engine, wallet, grade, data source or entitlement grant per membership. The selector is available to Owner/Admin prototype designers and changes **only visual design previews**; it does not override server-granted membership access.

The eight source-grounded membership codes for this design scope are:
| Code | Owner/Admin prototype identity | Selected base preset |
|---|---|---|
| FREE | Free Membership — Foundations Focus | Foundations Focus |
| FOUNDING_14 | Founding 14-Day Starter — Guided Workshop | Guided Workshop |
| FOUNDING_30 | Founding 30-Day — Analysis Desk | Analysis Desk |
| FOUNDING_60 | Founding 60-Day — Flagship Classroom | Flagship Classroom |
| FULL_MONTHLY | Full Platform Monthly — Professional Studies | Technical Analysis |
| FULL_ANNUAL | Full Platform Annual — Study Academy | Knowledge Transfer |
| LIFETIME | Lifetime Platform Access — Lifetime Study Suite | Full-Detail Bar Analysis |
| ONDEMAND_MONTHLY | Historical Replay / OnDemand Monthly — Replay Classroom | Historical Replay Control |

Product code references derive from the existing approved Founding and platform catalog, not newly invented Stripe prices or entitlements. An à-la-carte tool purchase is a distinct access mechanism and is not mislabeled as a membership. A product's inclusion in this internal prototype does **not** mean it is available for sale, released or entitled.

## Twenty preset templates
1. Foundations Focus
2. Guided Workshop
3. Analysis Desk
4. Flagship Classroom
5. First Principles
6. Numerical Walkthrough
7. Candle Anatomy
8. VWAP Proxy Laboratory
9. Volume Evidence
10. Market Structure
11. Breakout Diagnostics
12. Historical Replay Control
13. Talia Coaching
14. Socratic Inquiry
15. Risk Planning
16. Assessment Layout Preview
17. Knowledge Transfer
18. Presentation
19. Accessibility First
20. Full-Detail Bar Analysis

Each membership has separate Owner/Admin browser-local saved layout adjustments. Controls include layout, reading density, Talia placement, five bar detail modes, candle width, wick thickness, chart height, price gridlines, detailed tooltip labels, high-contrast bars, bar-inspector volume display and teaching notes. Save/restore is limited to per-user local browser storage; server-synchronized administrator preset publishing is **NOT IMPLEMENTED**.

## Bar-quality engineering
The existing locally hosted ECharts candlestick plot receives the selected membership's precise candle width, wick thickness, colors, high-contrast switch, gridline control, detailed tooltip and height. Click a fictional candle to inspect source OHLC values and derived full range, body, upper/lower wick, price change, percentage moves, closing position inside range, midpoint, typical price, and (if present) bar volume. Computations use selected OHLC bars; no future unrevealed candle is introduced into replay.

No transaction-level bid/ask delta, true trade-print VWAP, broker execution data, live market prices or future events are fabricated. Existing instructor explanation and private assessment boundaries remain identical in quality across all memberships whenever content is legitimately accessible.

## Files changed
- New `assets/js/prototype-membership-builder-v1.js` — eight membership profiles, twenty presets, independent local visual draft states, configuration UI and numeric OHLC inspector.
- Updated `prototype.html` — membership selector, script, chart-inspector panel.
- Updated `assets/js/prototype-center-v1.js` — membership rendering, state synchronization, ECharts style/inspector integration and save/reset/clear.
- Updated `assets/css/prototype-center-v1.css` — responsive controls, clear focus, numeric inspector grid.
- New `tests/prototype-membership-builder-v1.test.mjs` — membership identity, state isolation, 20 preset and OHLC math checks.
- Updated `tests/prototype-center-v2-browser.test.mjs` — selects plans, presets and verifies cross-membership visual draft isolation.
- Updated `.github/workflows/prototype-center-v1.yml` — syntax, Node contract and Chromium assertions.

## Acceptance and security
- Source and configuration: implemented; CI run status must be confirmed separately.
- Actual enrolled membership rendering: NOT IMPLEMENTED in production classroom. All membership context switching remains Owner/Admin preview-only.
- Backend entitlement, Talia depth, private grading, tuition, pricing, payment and rewards ledger: unchanged.
- No migration required. No payment, Lumen, account, entitlement, Stripe or actual instructional record writes performed.
- ECharts exact historical bar provenance, full accessibility / screen-reader testing and authenticated production Owner/Admin acceptance remain separate open gates.
- Rollback: revert these targeted commits on `main` while preserving Prototype Center V3 access boundaries; no database reversal is needed.

## Revision history
| Version | Date | Change | Status |
|---|---|---|---|
| 1.0 | 2026-10-31 | Eight membership classroom designs; twenty preset controls; precision OHLC inspection and planned CI | Implementation, awaiting final acceptance |
