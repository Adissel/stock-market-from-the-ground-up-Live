# SMFGU-CHART-KEYBOARD-PAN-V18 — Bounded Keyboard Chart Navigation
**Company:** Cyber Nexus Publishing / Crown & Lantern Press
**Project:** The Stock Market: From the Ground Up — member Chart Studio
**Document ID:** SMFGU-CHART-KEYBOARD-PAN-V18
**Filename:** `docs/qa/2026-11-01_CHART_KEYBOARD_PAN_V18.md` | **Type:** Markdown
**Version:** 1.0 | **Date:** 2026-11-01
**Status:** Source implementation and Chromium test pending exact-SHA CI acceptance
**GitHub location:** `cybernexuspublishing/stock-market-from-the-ground-up`, `main`
**Google Drive location / document ID:** Not created / unassigned
**Purpose:** Enable members who cannot hold-and-drag a chart to pan to earlier or later completed candles.
**Dependencies:** Existing Crownlight Chart Studio V2, browser Lightweight Charts v5.2.1, existing saved member follow state, no new backend or data source.
**New file:** Yes

## Requirement, implementation, and evidence
- **SMFGU-CHART-PAN-018**: Mouse drag remains available, and semantically labeled Earlier/Later native buttons accept Enter/Space and have minimum 44-pixel height for touch operation.
- Both buttons preserve the current logical viewport width; the earlier bound is logical index -1, and the later bound is the latest **already revealed** candle plus the existing configurable empty right margin.
- Panning deliberately stops chart follow and uses existing member follow preference storage. It changes neither candles, grading, entitlement, replay progression, nor Talia's evidence cutoff.
- Extend real Chromium desktop fixture acceptance to operate Earlier with Enter and Later with Space and assert that the viewport moves without expanding revealed OHLCV.
- Add touch target, focus-visible contrast, and responsive styling within existing CSS. No new React or ECharts engine is needed for this established market-chart control.
- Existing PostgreSQL, Supabase RLS, Cloudflare APIs, shared learning engines and progress tables remain unchanged. No schema migration or payment writes.
- **Known open evidence:** Authenticated production-member keyboard and screen-reader testing, cross-device display behavior, independent WCAG 2.2 AA audit, and final exact-SHA deployment acceptance.

## Revision history
| Version | Date | Change | Approval |
| --- | --- | --- | --- |
| 1.0 | 2026-11-01 | Bounded native chart panning and Chromium acceptance | Subject to CI |

**Footer:** SMFGU-CHART-KEYBOARD-PAN-V18 · read-only chart controls · no trades, payment, or grading changes.
