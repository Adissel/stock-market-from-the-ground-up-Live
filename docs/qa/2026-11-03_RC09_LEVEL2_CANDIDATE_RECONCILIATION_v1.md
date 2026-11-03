# RC09 — Level II Official Competency Candidate Reconciliation

**Company:** Cyber Nexus Publishing / Crown & Lantern Press  
**Project:** THE STOCK MARKET: FROM THE GROUND UP  
**Document ID:** SMFGU-RC09-LEVEL2-CANDIDATE-001  
**Filename and type:** `docs/qa/2026-11-03_RC09_LEVEL2_CANDIDATE_RECONCILIATION_v1.md` — Markdown  
**Google Drive location / Drive document ID:** Not created / not assigned; GitHub is the source of record  
**Version:** 1.0  
**Date:** November 3, 2026 UTC (November 2 Central)  
**Status:** OWNER-AUTHORIZED SOURCE CANDIDATE; production verification separately required  
**Purpose:** Reconcile the existing 30 official competency definitions with 419 one-primary-skill candidate Lab mappings without grading or rights expansion.  
**Dependencies:** v0.13.4 canonical competency definitions; v0.14.0.105 existing mapping; active `platform_labs`; issue #159 release control.  
**New file required:** Yes — one immutable, separately auditable scoped correction and rollback; do not edit already installed v0.14.0.105 migration.

## Verified preflight
Production contains 30 active official competencies, including `LEVEL2_READING`. The 419 existing canonical Lab mapping rows are all `candidate`, with 29 distinct codes; the knowledge-map table uses `lab_id` as its primary key, so adding a second code would be invalid. Three existing Chapter 9 *Reading the Tape* Labs directly concern Level II, but each was assigned `TAPE_READING` by the original ungraded keyword heuristic. The chosen primary candidate is only `TAPE-C09-L02` — “Read Level II as a Partial Order Book — Walk through the display”. Its original candidate is unreviewed with rubric version 0; no graded attempts exist for that Lab and no existing `LEVEL2_READING` competency evidence exists.

## Scoped decision
Reclassify the **candidate primary competency** for `TAPE-C09-L02` to `LEVEL2_READING`; retain every other Lab mapping, 419 canonical Lab identities, existing private records and member data. Maintain `review_state=candidate`, `rubric_version=0`, and null reviewer fields. This is topic classification only; NOT a reviewed rubric, scored assessment, knowledge award or mastery credential. The original `TAPE_READING` skill remains represented by its other Labs.

## Execution controls
- Forward SQL: `supabase/admin/20261103_RC09_LEVEL2_CANDIDATE_RECONCILIATION.sql`. Strong preflight guards, exact prior values, 1-row conditional update, fully atomic rollback on unexpected state.
- Rollback: `supabase/rollbacks/20261103_RC09_LEVEL2_CANDIDATE_RECONCILIATION_ROLLBACK.sql`. Only reverses its own ungraded suggestion when no new learner evidence exists.
- Source CI: `tests/test_rc09_level2_candidate_reconciliation_v1.mjs` and the narrowly scoped GitHub Actions workflow.
- Production postflight: verify 419 rows, 30 distinct codes, 0 approved mappings, the exact target `LEVEL2_READING` candidate, the other Chapter 9 suggestions still `TAPE_READING`, and no related attempts/evidence.
- Record actual SHA, CI and production results in [release control issue #159](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/issues/159). Do not claim success until observed.

## Boundaries
No real feed redistribution, protected answer-key changes, independent editorial signoff, grading activation, membership/entitlement manipulation or LIVE financial transaction.

## Revision history
| Date | Version | Action | Status |
| --- | --- | --- | --- |
| 2026-11-03 | 1.0 | Controlling one-primary-skill candidate correction and reversible QA design | Source ready; live execution tracked separately |

**Footer:** SMFGU-RC09-LEVEL2-CANDIDATE-001 · v1.0 · Candidate mapping is not proof of skill mastery or permission to trade.
