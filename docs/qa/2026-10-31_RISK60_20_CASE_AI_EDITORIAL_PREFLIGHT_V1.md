# Risk60 — Twenty Source-Day AI Editorial Preflight Decisions

**Document ID:** SMFGU-ACADEMY-RISK60-AI-PREFLIGHT-001  
**Project:** The Stock Market: From the Ground Up — Boot Camp Academy  
**Filename / file type:** `docs/qa/2026-10-31_RISK60_20_CASE_AI_EDITORIAL_PREFLIGHT_V1.md` / Markdown  
**Authoritative location:** `cybernexuspublishing/stock-market-from-the-ground-up`, `main`  
**Google Drive / document ID:** Not created or assigned; do not infer a Drive URL  
**Version:** 1.0, October 31, 2026  
**Status:** AI-SOURCE-PREFLIGHT ONLY — **NOT INDEPENDENT HUMAN EDITORIAL APPROVAL**  
**Scope:** The *first twenty* individually authored fictional Risk60 day-specific cases (not another twenty newly authored program days).  
**AI reviewer:** GPT-6, designated working AI editor and authoring reviewer; **not a distinct human Beta Tester or independent reviewer**.  
**Dependencies:** `academy-risk60-learning-batch01-v1.js`; `tests/test_academy_risk60_case_review_20_v1.mjs`; `bootcamp-247-editorial-preflight-v1.yml`; existing 247-unit editorial register, approval policy and private grading hold.  
**Purpose:** Document twenty distinct case-specific QA checks and two actual authoring corrections without manipulating independent human attestation or protected grading.  
**New file required:** Yes, to preserve case-by-case AI review distinct from the controlling 247-unit independent acceptance ledger.

## Decision scale

**AI-CHECKED:** The observed fictional arithmetic/logic and source-day alignment have been individually examined; any individual primary claim may still require exact-date authoritative verification, classroom observation, or rework. No protected assessment is approved.

**AI-CORRECTED:** A source deficiency was found and revised in the public *ungraded* teaching case; remaining source/subject review still applies.

**HUMAN-PENDING:** Independent editor/reviewer evidence and protected new-case assessment are absent. This status applies to **all twenty** cases.

| Canonical day | Source day | Specific AI review result | AI action | Independent status |
| --- | ---: | --- | --- | --- |
| Risk60 D01 | 1 | No original issuer filing or fresh quote is available at the stated cutoff. Correct action is WAIT, not a market order. | AI-CHECKED | HUMAN-PENDING |
| Risk60 D02 | 2 | Price change 8.00→8.40 is 5%; current 8.32/8.40 spread is 0.08 and 0.95694% of midpoint 8.36, appropriately rounded to 0.96%. Transaction costs/depth not implied. | AI-CHECKED | HUMAN-PENDING |
| Risk60 D03 | 3 | Nine complete out of twelve decisions = 75%; excluded three must remain in original process denominator. | AI-CHECKED | HUMAN-PENDING |
| Risk60 D04 | 4 | 1,200,000 reported traded shares / 300,000 dated estimated float shares = 4.0× mechanical turnover; not unique holders, and does not establish executable liquidity. | AI-CHECKED | HUMAN-PENDING |
| Risk60 D05 | 6 | Visible offer depth 80+120=200 shares; hypothetical 250-share order exceeds display by 50. A complete fill cannot be assigned from this snapshot. | AI-CHECKED | HUMAN-PENDING |
| Risk60 D06 | 8 | Bid 4.90, ask 4.99 imply midpoint 4.945 and spread 1.82002%; this violates precommitted 1% gate independent of scanner rank. | AI-CHECKED | HUMAN-PENDING |
| Risk60 D07 | 10 | 24.00 entry less 23.60 invalidation = 0.40/share; 80/0.40=200 theoretical shares, 4,800 notional. Stop gaps/fees remain unmodeled. | AI-CHECKED | HUMAN-PENDING |
| Risk60 D08 | 11 | 200 long minus 50 sold = 150 remaining; 50 × (10.50−10.00) = 25 gross realized price difference before fees. | AI-CHECKED | HUMAN-PENDING |
| Risk60 D09 | 12 | Static 80×4.10 + 120×4.15 = 826 for 200 shares; assumed weighted price 4.13. This is not a real fill or guaranteed routing outcome. | AI-CHECKED | HUMAN-PENDING |
| Risk60 D10 | 13 | Higher-high/higher-low claim previously lacked reproducible pivot confirmation. **Revised** to explicit 2-left/2-right *completed-bar* pivots, excluding unclosed bar/future prices. | AI-CORRECTED | HUMAN-PENDING |
| Risk60 D11 | 16 | 9.20→8.95 is 0.25 decline, 0.25/9.20=2.71739% (~2.72%). A red candle alone cannot prove panic or trader intent. | AI-CHECKED | HUMAN-PENDING |
| Risk60 D12 | 17 | 120-share short at 10.00, cover at 12.00: 2.00 adverse/share, 240 gross loss before borrow, broker fees and slippage. | AI-CHECKED | HUMAN-PENDING |
| Risk60 D13 | 19 | Nine wins among ten *selected* promotional screenshots is 90% only of the shown sample, not independently verified complete performance. | AI-CHECKED | HUMAN-PENDING |
| Risk60 D14 | 20 | Price 50→60 equals 20%; dated short-interest alone cannot prove individual forced short-covering or causal mechanism. | AI-CHECKED | HUMAN-PENDING |
| Risk60 D15 | 23 | Initial example claimed failed spread gate but omitted the quote. **Revised** to bid 10.01, ask 10.17, midpoint 10.09, spread 0.16/10.09=1.58573% (~1.59%), violating 1% ceiling; unverified catalyst independently vetoes. | AI-CORRECTED | HUMAN-PENDING |
| Risk60 D16 | 24 | Social assertion at 08:13 cannot rely on issuer disclosure first available at 08:20 for a decision at 08:15; proposals are not completed financings. | AI-CHECKED | HUMAN-PENDING |
| Risk60 D17 | 25 | Three recorded order attempts have already met three-attempt session limit; a fourth is not permitted under the stated rule regardless of future outcome. | AI-CHECKED | HUMAN-PENDING |
| Risk60 D18 | 26 | 09:00 source state must remain immutable after a contradictory 10:15 amendment; create new version and reapply eligibility checks. | AI-CHECKED | HUMAN-PENDING |
| Risk60 D19 | 27 | A later +8% price change does not retroactively create a filled trade or invalidate earlier WAIT when current quote was unavailable. | AI-CHECKED | HUMAN-PENDING |
| Risk60 D20 | 30 | Sixteen of twenty = 80% source completeness; twelve of twenty = 60% risk-calculation completeness. Neither is validated return/mastery; transfer 11/12≈91.67%, 9/12=75%. | AI-CHECKED | HUMAN-PENDING |

## Technical and source limitations

1. The individual check code `tests/test_academy_risk60_case_review_20_v1.mjs` recomputes the numerical cases, enforces the revised swing and breakout-veto evidence, source-day identity, twenty distinct worked cases/transfers and *all ungraded* flags. **CI is not counted as passed until the exact workflow jobs report a completed success.**
2. These are fictional examples; SEC Investor.gov background references cover broad due diligence and order concepts but do **not** establish a claim-specific verified historical OHLCV case, distribution license, brokerage fill or market return.
3. Still required per day: exact source/claim acceptance, fresh independent protected assessment and numeric tolerance, real authenticated teaching and accessibility checks, qualified non-author human editorial signoff with time/identity/evidence and updated controlling register.
4. The 20 AI checks are a **new QA batch** on already authored Risk60 Days 1–20, **not 20 additional authored study days**. Original authoring inventory remains **117/247 = 47.4%** until new unique Days 21–60 or Practicum90 cases are actually attached. All 247 independent day acceptances remain **0/247**.
5. No paid service, existing customer, entitlement, author role, human reviewer identity, B01 private key, Lumen balance, protected grade or LIVE payment was changed to produce this record.

## Next prioritized batch

Finish genuine real Standard/Professional Studio mobile/CAS acceptance; proceed to **20 original Risk60 practice-phase lessons for Days 21–40** with the same individual evidence standards; then final Risk60 twenty transfer days and 90 Practicum90 days. In parallel begin the qualified volunteer beta-editor intake and restricted Track B workflow, without collapsing the AI author/independent reviewer boundary.

## Revision history

| Version | Date | Change | Disposition |
| --- | --- | --- | --- |
| 1.0 | 2026-10-31 | AI case-by-case review of first 20 Risk60 lessons, two remedial source edits and exact-run nonapproving test coverage | AI preliminary, formal acceptance HOLD |

**Footer:** Crown & Lantern Press / Cyber Nexus. Internal educational authoring evidence, not investment advice, certified educational mastery, legal compliance opinion or independent editorial authorization.
