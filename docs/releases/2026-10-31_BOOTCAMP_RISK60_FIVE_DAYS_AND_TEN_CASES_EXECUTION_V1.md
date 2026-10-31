# Boot Camp Owner Execution — Risk60 Advanced Days 1–5 and Ten Private Assessment Drafts

**Document ID:** SMFGU-ACADEMY-OWNER-EXECUTION-009  
**Project:** The Stock Market: From the Ground Up — Boot Camp Academy  
**Version:** 1.0  
**Date:** October 31, 2026  
**File type:** Markdown (.md)  
**Filename:** `2026-10-31_BOOTCAMP_RISK60_FIVE_DAYS_AND_TEN_CASES_EXECUTION_V1.md`  
**GitHub location:** `cybernexuspublishing/stock-market-from-the-ground-up/docs/releases/` on `main`  
**Google Drive location/document ID:** Not created / not assigned  
**Status:** SOURCE IMPLEMENTED; first two original upgraded days PASS dedicated CI; five-day acceptance CI and Cloudflare deployment after source fix pending; ten protected cases COMPLETE DRAFT FIELDS / official grading inactive  
**Purpose:** Separately account for substantive actions completed by the delegated Owner/Editor/QA operator, and prevent simulation or content-field completion from being mistaken for evidence of authenticated testing or official grading.

## 1. Original Risk60 day-by-day implementation

| Canonical Risk60 day | Original parent source-day | New individually authored formative Q + feedback | New advanced fictional worked case / independent transfer | Authored / source-integrated | Release status |
|---:|---:|---:|---:|---|---|
| 1 | 1 | 12 | 1 — issuer identity, source cutoff, pre-order risk veto | Yes | Original two-day dedicated CI passed |
| 2 | 2 | 12 | 1 — price-change vs midpoint spread denominator and veto | Yes | Original two-day dedicated CI passed |
| 3 | 3 | 12 | 1 — sample process-rate denominator and outcome bias | Yes | Five-day CI pending |
| 4 | 4 | 12 | 1 — turnover vs dated float and execution evidence | Yes | Five-day CI pending |
| 5 | 6 | 12 | 1 — three-price-book size limits, notional and slippage | Yes | Five-day CI pending |
| **Totals** | Original parent mapping preserved | **60** | **5** | **5/5** | **2/5 have prior completed CI; 3/5 pending the expanded gate** |

Source modules: `functions/_lib/academy-risk60-depth-initial-v1.js`; `functions/_lib/academy-risk60-depth-followup-v1.js`. Both are mapped into the existing `functions/_lib/bootcamp-academy-v014168.js` engine without changing Risk60 day IDs or source-day mapping. `assets/js/academy-guided-v1.js` now uses the same required advanced case reasoning, per-option free feedback, twelve formative-answer reviews and ungraded stage gates on *original lessons that actually contain the complete deep-teaching package*. Each such day receives a **suggested 45-minute self-paced active-work itinerary**; the remaining original days retain the 35-minute suggested plan, which is not a seat-time certification.

These exercises use fictional case data, explicit source limitations, and no independent market-performance or brokerage claims. The Owner authorizes their teaching use after the matching source/browser/deployment gates pass. No independent professional certification, historical-data license, official mastery, rewards or grades are represented.

## 2. Protected assessments — 10 complete inactive drafts, zero approved graded cases

Live guarded, case-specific Supabase revisions are complete for the ten candidate IDs:

| Protected candidate | Private rubrics | Individual option feedback | Grading / independent reviewer |
|---|---:|---:|---|
| `BC3_TAPE10_D01_V1` | 4 | 12 | Inactive, not independently reviewed |
| `BC3_TAPE10_D02_V1` | 4 | 12 | Inactive, not independently reviewed |
| `BC3_TAPE10_D03_V1` | 4 | 12 | Inactive, not independently reviewed |
| `BC3_TAPE10_D03_V2` | 4 | 12 | Inactive, not independently reviewed |
| `BC3_INDICATORS10_D01_V1` | 4 | 12 | Inactive, not independently reviewed |
| `BC3_INDICATORS10_D02_V1` | 4 | 12 | Inactive, not independently reviewed |
| `BC3_INDICATORS10_D02_V2` | 4 | 12 | Inactive, not independently reviewed |
| `BC3_FILINGS7_D01_V1` | 4 | 12 | Inactive, not independently reviewed |
| `BC3_FILINGS7_D02_V1` | 4 | 12 | Inactive, not independently reviewed |
| `BC3_FILINGS7_D02_V2` | 4 | 12 | Inactive, not independently reviewed |
| **Totals** | **40/216** | **120/648** | **0/54 official case approvals** |

**Remaining draft work:** 176 private rubrics, 528 option-specific explanations, 44 still-incomplete case drafts, and case-level scoring/security/reviewer acceptance for all 54. Database postflight confirmed **216/216 private scoring key links resolve**, none of the 54 has `active=true`, and none has a reviewer-approved state. The ten cases above have both full private-field counts. Private answer keys and option text remain exclusively in Supabase, not this public document.

The newly drafted variants use distinct numbers, issuer conditions, cutoff times and depth/VWAP examples to reduce rote-answer memorization. This draft originality is **not** a completed independent case-review decision.

## 3. Verification and production correction

- **Full 274-day baseline:** GitHub Actions [41236543559](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41236543559) passed full source/build/browser regression.
- **Risk60 first two deep lessons:** GitHub Actions [41237262356](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41237262356) completed SUCCESS.
- **Expanded five-day source and browser:** GitHub Actions [41237571436](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41237571436) queued at this report check.
- **Risk60 independent transfer validation defect:** The 20 complete third-cycle lesson cases had 13 concise topic titles shorter than a mistakenly global 35-character threshold. Substantive content passed the 35-character minimum. Updated `functions/_lib/academy-risk60-transfer-batch03-v1.js` to validate topic titles at 12 characters while retaining the existing substantive teaching threshold. Fix commit `d02013d6e049217a45c608399600874fe0953d2b`. Updated dedicated workflow trigger in commit `1cac1c5b890694e0a2944bdc8abfcb8356f80259`, which queued run [41237868004](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41237868004). Earlier failed Cloudflare deployments specifically showed this issue in their Function-publish logs; later exact-revision production recovery must be rechecked before sign-off.

**Security decision:** `ACADEMY_THREE_CAMPS_ENABLED=false`, `ACADEMY_THREE_CAMPS_BETA_ENABLED=true`; only existing allowlisted QA identities can access the invited three courses; no LIVE charges or paid services initiated.

## 4. Fixed-denominator progress, without artificial approvals

The controlling ledger has **380 items**: 27 approved new instructional days, 45 original advanced new-course cases, 54 official graded-case approvals, 6 real tester-course journeys, 247 original advanced-depth study-day upgrades, and 1 software acceptance. **Baseline formally accepted is 73/380 = 19.2%.** The five Risk60 days above have now reached the content/source threshold; only two have a completed CI run, while full five-day and restored production evidence remains pending. Once five-day source/browser/deployment gates are accepted and the Owner editorial record is issued, the fixed ledger may advance to **78/380 = 20.5%**, not sooner. The three-new-course scope stays **73/133 = 54.9%** until a real QA journey or protected grading case is individually accepted.

The **six genuine signed-in tester-course journeys are still 0/6** at the last database check; synthetic browser fixtures are not real-user evidence and no fake sessions were inserted.

## 5. Next execution sequence

1. Verify the two queued dedicated acceptance workflows and a successful production descendant of the transfer-validator fix; resolve any newly observed failure, then record the five-day Owner teaching acceptance.
2. Finish individualized private rubrics/feedback for the other 44 cases, independently check every scoring choice and fair distractor, and verify original versus retake independence. Do not enable graded results until real case review and secure RPC acceptance pass.
3. Run six genuine signed-in Beta journeys in the already authorized two QA accounts, with individual private progress/reopen, revision conflict, access denial and accessible browser evidence.
4. Extend the 12-question-plus-advanced-case daily package from the first five Risk60 days to the remaining original 242 days, preserving original B01 and all canonical IDs. Original-case-only authoring and full advanced day acceptance are separate metrics.

## Revision history

| Version | Date | Status | Summary |
|---|---|---|---|
| 1.0 | October 31, 2026 | SOURCE IMPLEMENTED / BETA GATES OPEN | Five Risk60 days deep-authored; ten private candidates fully drafted; 216 valid key links; fixed 380-item denominator maintained; Risk60 transfer validator corrected. |

**Footer:** Crown & Lantern Press — internal controlled release evidence; not independent accounting/legal advice, actual broker execution, paid QA or externally certified editorial review.
