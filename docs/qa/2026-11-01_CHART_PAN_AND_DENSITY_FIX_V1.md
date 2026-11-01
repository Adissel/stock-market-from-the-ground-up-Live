# SMFGU-CHART-PAN-DENSITY-001 — Production Chart Release and Sparse-Bar Viewport
**Project:** The Stock Market: From the Ground Up / Crownlight Chart Studio
**Company:** Cyber Nexus / Crown & Lantern Press
**File:** `docs/qa/2026-11-01_CHART_PAN_AND_DENSITY_FIX_V1.md`
**Document ID:** SMFGU-CHART-PAN-DENSITY-001
**File type:** Markdown
**Version:** 1.0
**Date:** 2026-11-01
**Status:** Source change, pending exact-head CI and independent production browser acceptance
**Google Drive folder / ID:** Not assigned / not created
**Purpose:** Repair production Lightweight Charts mouse-release inertia and preserve normal bar density at early replay stages.
**Dependencies:** `AGENTS.md`, `PROJECT_SITEWIDE_RULES.md`, existing `assets/js/crownlight-chart-studio-v2.js`, authenticated Chart Studio rights, fictional and user-provided replay data.
**New file:** This QA register.

## Observed defect
The production chart uses Lightweight Charts v5 with `handleScroll.pressedMouseMove=true` and `kineticScroll.mouse=true`. Mouse release can therefore continue inertial movement. The initial `fitVisible` range varies drastically with sparse replay history, enlarging only a few revealed candles. The staff-only React/ECharts prototype was separately corrected and is not a substitute for the member application fix.

## Implementation
1. Set `kineticScroll.mouse=false`, retaining hold-and-drag movement and touch momentum.
2. Reduce default bar spacing from 14 to 10 pixels.
3. Keep a 96-logical-bar viewport (`visibleBars=80` plus `rightPadding=16`) when Fit is selected or when a new data source starts, so 8 completed bars remain narrow and reveal naturally fills the session instead of repeatedly re-zooming.
4. Do not change the data source, bar data, revealed-index boundary, timeframe calculation, price signals, 16 prototype studies, membership entitlement, drawing layers, saved workspace endpoint, or any transaction.
5. Strengthen the existing paper-workbench source regression for release-to-stop and fixed viewport bounds.

## Verification and limitations
Source assertions guard the configuration. A genuine mouse-release browser acceptance on the actual member chart, user-device comparison, touch/pinch behavior, timeline labels, and authenticated no-lookahead replay must still pass before final acceptance. Existing `/api/chart-workspace` and Supabase RLS remain authoritative for member workspace storage; the prototype's local appearance controls must not be mistaken for cross-device production saves.

**DB/API dependencies:** No migration or API contract change. SQL preflight and postflight are not applicable.
**Security impact:** None intended; no new data flow or persistence.
**Rollback:** Revert the source commit on `main`; no DB rollback required.

## Revision history
| Date | Version | Change |
| --- | --- | --- |
| 2026-11-01 | 1.0 | Mouse kinetic scrolling disabled, sparse-bar viewport stabilized, regression guard added |

**Footer:** SMFGU-CHART-PAN-DENSITY-001 · v1.0 · Implementation evidence is not production acceptance.
