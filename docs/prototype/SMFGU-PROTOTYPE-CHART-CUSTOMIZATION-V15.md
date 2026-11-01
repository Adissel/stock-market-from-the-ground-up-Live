# Crownlight Chart Studio — Customization and Historical Replay Prototype

**Project:** The Stock Market: From the Ground Up  
**Document ID:** SMFGU-PROTOTYPE-CHART-CUSTOMIZATION-V15  
**Version:** 1.0  
**Date:** 2026-11-01  
**Status:** Source implementation; CI / member-release acceptance pending  
**Filename / file type:** `docs/prototype/SMFGU-PROTOTYPE-CHART-CUSTOMIZATION-V15.md` / Markdown  
**Authoritative GitHub location:** `cybernexuspublishing/stock-market-from-the-ground-up` / `main`  
**Google Drive location / ID:** Not assigned  
**Dependencies:** Existing ECharts loader, Shared Indicator Math, prototype adapter, shared Labs/Talia teaching, staff-only chart prototype  
**Purpose:** Implement appearance controls and causally sound replay demonstrations without altering production market data or academic grading.

## Implementation coverage
- Bullish, bearish, doji candle colors, grid line color, individual indicator line colors, line styles, visual Bar Appearance presets, right-side empty axis buffer, and configurable spacing.
- New EMA 200 study calculation based on shared mathematical rules, with deterministic fictional prior-session 1-minute data (1080 bars) used exclusively for warmup. The new study changes computed-study inventory from 15 to 16; 61 research guides remain distinct.
- 1m/3m/5m simulated completed-bar aggregation, confirmed HH/HL/LH/LL with confirmation delay, Talia evidence-context annotations.
- Chart opens at eight completed lesson bars with 12 visually labeled prior-session context candles and an empty right buffer; no future price values displayed.
- Playback exposes stepwise **synthetic** intrabar OHLC movement with explicit attribution: OHLCV alone cannot reconstruct the actual order of trades, so paths are instructional illustrations only.
- Functional simulation/offline status, pause/play/speed, and styled reactive ECharts controls.

## Architecture and boundaries
React + TypeScript + JavaScript + ECharts + HTML5/CSS3. Reuse current Cloudflare/Supabase, membership entitlements and original indicator math; no Python runtime added to the client. Settings currently persist in local browser only; production cross-device member profiles require authenticated API/RLS acceptance. Source historical context is fully fictional; there is no real tick feed, live brokerage execution, guaranteed indicator signal, or independent grade.

## Outstanding acceptance
Verify exact-commit source/Chromium CI, interactive script output, mobile accessibility, screenshot/editor Exit/text-color, and production deployment. No owner action until consolidated acceptance.

## Revision history
| Date | Version | Status |
| --- | --- | --- |
| 2026-11-01 | 1.0 | Implemented synthetic chart personalization and replay; review pending |

**Footer:** Internal prototype; fictional source; no actual trade data or billing modification.
