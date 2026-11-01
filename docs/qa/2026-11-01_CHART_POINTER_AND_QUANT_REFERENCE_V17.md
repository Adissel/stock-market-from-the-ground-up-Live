# SMFGU-CHART-QA-V17 — Mouse Release and Independent Quantitative Acceptance

**Company:** Cyber Nexus Publishing / Crown & Lantern Press
**Project:** The Stock Market: From the Ground Up / Crownlight Chart Studio & Historical Replay
**Document ID:** SMFGU-CHART-QA-V17
**Filename:** `docs/qa/2026-11-01_CHART_POINTER_AND_QUANT_REFERENCE_V17.md`
**File type:** Markdown
**Version:** 1.0
**Date:** 2026-11-01
**Status:** Implemented as fixture-only automated CI; real authenticated production member acceptance pending
**Repository / branch:** `cybernexuspublishing/stock-market-from-the-ground-up` / `main`
**Google Drive location and document ID:** Not assigned / no new Drive document
**Purpose:** Prevent the observed mouse-release chart-dragging regression; independently verify core trading indicator computations and completed multi-minute aggregation.
**New file required:** Yes
**Dependencies:** Existing Cloudflare build and GitHub CI, Lightweight Charts 5.2.1, first-party JS indicator math, historical replay classroom, Python 3 stdlib; no new database, endpoint, hosting or paid service.

## Changes and acceptance
1. Expose the non-sensitive, read-only current logical viewport through the existing Chart Studio status accessor.
2. On actual pinned Chromium canvas, first zoom to a pan-able 65-bar fictional display. Verify a held-button pan changes the logical range, releasing the mouse stops further movement, and free mouse movement does not continue dragging. Preserve existing 390-, 768- and 1440-pixel responsive scenarios.
3. Independently calculate 240 fictional one-minute bars using Python standard library. Compare exact first-party JavaScript outputs with numerical tolerances for SMA9, EMA9/20/200, RSI14, ATR14, Bollinger20, MACD12/26/9 and the completed-bar HLC3 volume-weighted proxy. Confirm EMA200 never appears without 200 completed closes.
4. Extract the actual published Historical Replay `aggregate(source,k)` function into an isolated Node VM; compare completed 1/3/5-minute OHLCV outputs to independent Python bucket aggregation for full and partial revealed histories. Reject incomplete future bars and test session changes.
5. Feed these into the existing no-cost Chart Studio real Chromium workflow. Do not duplicate market sources, protected grading or learning-progress APIs.

## Security and limitations
All tests use only fictional generated candles; there are no real trading transactions, member records, market API calls, AI purchases, grades, payments or RLS changes. A green fixture test is **not** a real authenticated production browser acceptance or independent certification of all 73 indicator guides or 419 Labs.

## Revisions
| Version | Date | Content | Status |
| --- | --- | --- | --- |
| 1.0 | 2026-11-01 | No-drift drag acceptance and Python-independent quantitative calculations | Pending exact-SHA CI verification |

**Footer:** SMFGU-CHART-QA-V17 · Internal QA · No live financial or member writes.
