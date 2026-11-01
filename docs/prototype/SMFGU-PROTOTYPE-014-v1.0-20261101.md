# SMFGU-PROTOTYPE-014 — Talia Mercer Interactive Evidence Desk

**Project:** The Stock Market: From the Ground Up / Crownlight Prototype Center  
**Document ID:** SMFGU-PROTOTYPE-014  
**Filename:** `docs/prototype/SMFGU-PROTOTYPE-014-v1.0-20261101.md`  
**File type:** Markdown (.md)  
**Version:** 1.0  
**Date:** 2026-11-01  
**Status:** Implemented in source; CI and Cloudflare acceptance require exact-commit confirmation.  
**Branch:** main only.  
**Google Drive location / file ID:** Not created / not assigned.  
**Purpose:** Apply the owner-provided Talia Mercer 19-section requirements screenshot inventory to the actual Chart Studio prototype without claiming the full authenticated Tutor service has been built.  
**New file required:** Yes (this implementation record).

## Requirements & authority
- TUTOR-01: The existing four free instructional actions stay free and do not call a paid AI provider.
- TUTOR-02: Context follows a selected, **already revealed** synthetic candle with timestamp and actual OHLCV.
- TUTOR-03: Show calculations, units, limitations, source attribution and observation-versus-inference.
- TUTOR-04: Guided practice, correction, valid retries, and optional stage navigation remain *ungraded*; do not expose protected assessment answers.
- TUTOR-05: No-lookahead evidence boundaries and accurate treatment of HLC3 vs trade-print VWAP.
- TUTOR-06: Preserve nine saved teaching stages while correctly mapping all ten visible instructional steps.
- TUTOR-07: Staff-only synthetic data and strict no financial, ledger, subscription, RLS or assessment writes.

## Implementation
- Talia evidence desk is integrated in the existing React teaching panel for Option A and Option B (and any other shared Lesson usage), not built as a second standalone Tutor service.
- Four interactive desk modes: Inspect candle (context and calculations), Compare bars (prior revealed bar and volume changes), Practice reasoning (no-lookahead check, numerical calculation, error diagnosis, repeatable retries, transfer-stage navigation) and Sources & limits.
- Evidentiary candle marker and crosshair reference on the ECharts price series follow the selected bar. Member cannot inspect a future bar beyond the reveal state.
- Correct mapped stages: display [0..9] → authored instructor stages [0,1,2,3,4,5,6,5,7,8].
- Add browser assertions for context accuracy, selecting prior bar, diagnosing a wrong answer, no-lookahead source disclosure and continued availability of the four free actions.

## Explicitly not implemented
The screenshots cover many product targets not demonstrated by the current source: actual authenticated AI conversation memory, service-based response generation, all 419 individual Lab acceptances, real learner personalization/competency persistence, the entire Boot Camp editorial corpus, all trading/indicator research contexts, voice narration, automated teaching-source provenance, and all administrative controls. These remain open workstreams and must not be signed off from this prototype.

## Quality gates
GitHub source syntax/build; synthetic Chromium interaction; denied-role access; mobile/desktop responsive inspection; no lookahead/answer-key leakage; exact-commit Cloudflare deployment. Human instructional review remains separate. Roll back via commit revert (no migration).

## Revision history
| Version | Date | Change | Status |
| --- | --- | --- | --- |
| 1.0 | 2026-11-01 | Deterministic Tutor chart evidence and practice prototype | CI pending |

**Footer:** SMFGU-PROTOTYPE-014 / Staff-only, fictional and ungraded / No live AI or market feeds.
