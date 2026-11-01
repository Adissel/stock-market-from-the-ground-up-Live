# SMFGU-CHART-CANDLE-READER-V19 — Keyboard Completed-Candle Inspection

**Project:** The Stock Market: From the Ground Up — member Crownlight Chart Studio
**Company:** Cyber Nexus Publishing / Crown & Lantern Press
**Document ID:** SMFGU-CHART-CANDLE-READER-V19
**File:** `docs/qa/2026-11-01_CHART_COMPLETED_CANDLE_READER_V19.md` (Markdown)
**Version:** 1.0 | **Date:** 2026-11-01 | **Status:** Source implementation / release CI pending
**Authoritative location:** GitHub `cybernexuspublishing/stock-market-from-the-ground-up` / `main`
**Google Drive file ID/location:** Not created / not assigned
**Purpose:** WCAG-targeted keyboard/screen-reader OHLCV inspection for the actual member chart, constrained to completed revealed historical bars.
**New file:** Yes.
**Dependencies:** Existing Lightweight Charts, Crownlight Studio, existing Supabase account/session boundaries, shared Historical Replay, Talia chart coach, main CI.
**Requirement:** CHART-A11Y-V19, chart interaction/no-lookahead and member-session isolation.

## Engineering and teaching
- Use native Previous/Next Candle buttons with Enter/Space keyboard activation and explicit labels. Maintain the normal hover crosshair for pointer users and a separate polite live readout for non-pointer users.
- The reader indexes only `sim.candles.slice(0,state.count)` and states candle ordinal, date/time in Eastern, OHLC and volume. It makes no prediction and awards no mastery.
- The reader clears on a member change or sign-out, and cannot step across the already-revealed final candle. No new database, Python server, ECharts trade plot, entitlements, payment system, or expensive services are needed.
- The existing 390/768/1440 real Chromium chart test verifies keyboard inspection, final-boundary clamp, semantic live region, and session-scrub alongside the previously accepted pointer movement and earlier/later panning.
- Actual screen-reader testing, touch hardware and authenticated production browser remain independent acceptance requirements; a fixture test does not establish full WCAG 2.2 AA conformance.

## Revision history
| Version | Date | Change | Acceptance |
| --- | --- | --- | --- |
| 1.0 | 2026-11-01 | Add keyboard candle inspection and private session cleanup | Await exact-SHA CI |

**Footer:** SMFGU-CHART-CANDLE-READER-V19 · No unrevealed candles, member grades, wallets or paid operations.
