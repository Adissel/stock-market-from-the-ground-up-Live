# SMFGU-TALIA-TERMINAL-004 — Major Professional Classroom Release
**Company:** Cyber Nexus Publishing / Crown & Lantern Press
**Project:** The Stock Market: From the Ground Up
**Document ID:** SMFGU-TALIA-TERMINAL-004
**Filename / type:** SMFGU-TALIA-TERMINAL-004-v1-20261102.md / Markdown
**Authoritative location:** GitHub main, docs/releases/
**Google Drive location / document ID:** Not created / unassigned
**Version/date/status:** 1.0 / 2026-11-02 / Source submitted; CI and real-member browser acceptance pending
**Purpose:** Integrate richer ECharts/Talia teaching into existing classroom without creating duplicate learning engines.
**Dependencies:** TaliaClassroom.tsx, ECharts 6.1, Cloudflare Pages, Supabase member authentication, Learning v3.3 and Lab v3.2.

## Major improvements
1. Extend reviewed 12 fictional candles by 248 deterministic synthetic one-minute candles; never pretend these are real market history.
2. Add an explicit completed 200-bar demonstration, one-bar step backward, and reset.
3. Derive 1-, 3- and 5-minute charts from complete *revealed* base bars only; partial intervals are concealed.
4. Aggregate synthetic proxy volume and compute VWAP proxy, not trade-print VWAP.
5. Add optional simultaneous EMA 9/20/200 and VWAP proxy comparisons; preserve initialization warmup.
6. Identify confirmed local swing highs/lows and compare them into HH, LH, HL and LL labels.
7. Offer horizontal pan buttons and pointer release cleanup alongside ECharts chart gestures.
8. Improve colors, contrast, chart shading, typography, responsive presentation and reduced-motion handling.
9. Include revealed-only chart click context for Talia and preserve member-owned protected Tutor endpoints.
10. Cache-bust the member bundle and V4 styles; maintain both member and staff prototype presentation.
11. Add dedicated source tests into the Pages build.
12. Preserve entitlements, private assessments, Labs, Boot Camps, Stripe and wallets.

## Safety and acceptance
- Full fictional fixture is in client code: ungraded illustration only, not a protected exam or server-gated replay.
- EMA 200 requires 200 *completed displayed-timeframe* bars; it will not appear after only 200 base bars at 3-minute or 5-minute aggregation.
- Full continuous Talia synchronization, 419-Lab conversion, server-published administrative layouts, authenticated pointer interaction and accessibility release acceptance are **not** included.
- CI completion, Cloudflare exact-commit deploy, and real Owner/Admin member browser QA must be independently verified.

## Revision history
| Version | Date | Change | Status |
| 1.0 | 2026-11-02 | Professional classroom V4 major source release | Submitted; release acceptance pending |
