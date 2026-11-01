# SMFGU Chart Studio — Replay Provenance & Protected-History Disclosure V20

**Project:** The Stock Market: From the Ground Up / Crownlight Chart Studio
**Company:** Cyber Nexus Publishing / Crown & Lantern Press
**Document ID:** SMFGU-CHART-PROVENANCE-020
**File:** `docs/qa/2026-11-01_CHART_PROVENANCE_AND_DISCLOSURE_V20.md` / Markdown
**Version:** 1.0
**Date:** November 1, 2026
**Status:** Implemented source; release and member acceptance require exact-SHA evidence
**GitHub location:** `cybernexuspublishing/stock-market-from-the-ground-up` / `main`
**Google Drive ID and path:** Not created / not assigned
**Purpose:** Prevent client-side replay flags from falsely certifying licensed market-data provenance, server-side grading safeguards, or hidden historical bars.
**New file:** Yes
**Dependencies:** Existing Chart Studio V2, protected historical replay service, shared Learning Engine and browser Chromium test gates. No SQL migration or new data store.

## Defect
The Chart Studio Source panel previously relied only on `sim.isServerReplay` to claim a published licensed historical data feed, server-enforced authorization, first-decision locking and a browser-visible history containing only revealed bars. That flag is client-side metadata; it cannot prove any of those facts. When a local fixture held 225 candles but disclosed only 25, the old Source panel misleadingly described all 225 as revealed.

## Corrective implementation
- Report **only completed revealed candle count** for a reported server replay; never disclose the buffered total through the Source panel.
- Keep local fictional practice identified as locally inspectable, with the actual completed/revealed count separately displayed.
- Mark market-data provenance, provider licensing and server authorization as requiring independent evidence, rather than implicitly certified by the chart.
- Disclose that grading and first-decision locking are independent protected-server requirements not provable by the chart interface.
- Preserve actual source data, server permissions, authored charts, all 419 Lab identities, Talia, workspaces and saved progress unchanged.

## Evidence
- Existing real Chromium chart suite verifies both local fictional practice and a deliberately inconsistent `isServerReplay=true` case where the client has more fixture bars than have been revealed.
- Existing separate-member fixture acceptance verifies provenance wording while using a mock authenticated Save/Restore API.
- The tests do **not** prove real production authentication, provider redistribution licensing, actual assessment protection or row-level security.

## Revision history
| Version | Date | Description | Acceptance |
| --- | --- | --- | --- |
| 1.0 | 2026-11-01 | Remove misleading replay provenance and future-buffer claims; extend existing Chromium tests | Exact-SHA CI pending |

**Footer:** SMFGU-CHART-PROVENANCE-020 · Internal QA · No billing, private data or trading actions.
