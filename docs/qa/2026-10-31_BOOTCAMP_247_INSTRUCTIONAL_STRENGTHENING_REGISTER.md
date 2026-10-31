# Boot Camp 247 — Instructional Strengthening and Independent Acceptance Register

**Document ID:** SMFGU-ACADEMY-247-ACCEPTANCE-001  
**Project:** The Stock Market: From the Ground Up  
**File:** `docs/qa/2026-10-31_BOOTCAMP_247_INSTRUCTIONAL_STRENGTHENING_REGISTER.md`  
**File type:** Markdown  
**Version:** 0.5 · October 31, 2026  
**Status:** **ACTIVE DRAFT; NO INDIVIDUAL FORMAL ACCEPTANCES RECORDED**  
**GitHub:** `cybernexuspublishing/stock-market-from-the-ground-up`, `main` only  
**Google Drive:** Not created; no designated Drive path has been supplied.  
**Purpose:** Preserve unit-level educational acceptance evidence while improving the original seven Boot Camps without falsely reporting a structurally populated course as approved.  
**Dependencies:** `AGENTS.md`, approved B01 decisions, original 30-day curriculum, `academyPrograms`, 247-unit editorial queue, paid-training entitlement contract, protected grading and server-owned member progress.

## 1. Controlling inventory and stage allocation

| Original program | Canonical days | Substantive original instructional case(s) attached | Initial drafting still required | Independent editorial accepted |
|---|---:|---:|---:|---:|
| `truth5` | 5 | 5 retained, frozen B01; three approved supplemental exercises | 0 | 0 verified in the unit acceptance ledger |
| `watchlist7` | 7 | 7 distinct new source/check cases | 0 | 0 |
| `scanners10` | 10 | 10 distinct new scan/risk cases | 0 | 0 |
| `foundations30` | 30 | 30 distinct additional cases on existing canonical days | 0 | 0 |
| `charts45` | 45 | 45 day-specific fictional cases across fifteen subjects and three phases | 0 | 0 |
| `risk60` | 60 | 20 original Learn cases plus 20 distinct guided Practice cases; final 20 Transfer days remain | 40 | 0 |
| `practicum90` | 90 | Parent-derived day objectives currently only | 90 | 0 |
| **TOTAL** | **247** | **137 authored study-day modules** | **110** | **0 independently evidenced** |

**Inventory note:** The three separately drafted 10-, 10- and 7-day courses add 27 further positions and are excluded from the original 247-day freeze. The five Free Foundations lessons are also excluded from this Boot Camp inventory.

## 2. Implementation evidence — authoring versus approval

- The canonical five B01 day lessons remain as originally authored. Only owner-approved source-literacy supplements for Days 1, 3 and 4 are displayed as separate, ungraded material.
- The 17 Watchlist/Scanner days now contain individual fictional worked cases, source procedures, limitations, misconceptions, independent transfer situations and original topical references.
- The 30-day original Boot Camp retains every controlling day title, objective, ID, related Lab association, entitlement and progress contract. Additional original day-specific fictional teaching is attached to all 30 days.
- Charts45 now has 45 distinct fictional worked scenarios and 45 distinct transfer cases mapped to the fifteen original subjects and the learning/practice/transfer phases. Chart literacy is not proof of historical-pattern profitability or independently verified replay.
- Talia's ten-stage workstation uses these authored cases and case-appropriate numeric checks instead of generic source text where an original module exists.
- Only educational, ungraded calculation fixtures are held in the public authored cases. The existing private assessment service retains authority over independent grading and protected answers.
- The source links checked during this authoring wave were broad SEC Investor.gov investment research, SEC EDGAR discovery, SEC order and execution education, and SEC antifraud materials. These validate narrow general reference topics, **not** unit-specific historical market claims, source timing or licensing.
- Do not claim editor-reviewed, rights-cleared, historical-replay-complete, authenticated-resume-accepted or professionally certified outcomes from these additions.

## 3. Acceptance gates applied per canonical day

1. Day ID, title, original objective, prerequisites and learning competency unchanged.
2. Original explanation that defines terms, measures, context and evidence provenance.
3. Reproducible worked case with verified arithmetic and units, or explicit N/A for nonnumeric exercises.
4. Claim-specific authority source with exact checked URL, publication/effective date and case scope.
5. Common error, no-trade/invalidation boundary, and free corrective remediation.
6. Distinct unfamiliar transfer situation, with no future facts from the historical observation cutoff.
7. Separate independent protected assessment reviewed without moving private scoring keys into the public client.
8. Authenticated member roles/entitlements, save-resume, grade separation and cross-account isolation validated in browser tests.
9. Desktop/tablet/mobile and keyboard/screen-reader checks completed.
10. Independent editor name, review date, source hash, counterexample test and explicit accepted/rejected decision recorded.

**Accept only if all applicable gates have evidence.** A successful unit test or fictional worked example is not an independent review or release certificate.

## 4. Exact unit-by-unit queue and batch execution

Run `node scripts/bootcamp-247-editorial-preflight-v1.mjs` from repository root. It generates:
- `artifacts/bootcamp-247-editorial-queue.csv` — all 247 canonical day IDs and content hashes, lesson-authoring flags, arithmetic-fixture counts, required next actions and explicit pending source/assessment/editorial status.
- `artifacts/bootcamp-247-batch-manifest.json` — 22 reference days, 225 original parent-derived days, their authored progress, and 12 subsequent approximately twenty-day work batches.

The reproducible GitHub Actions workflows upload these artifacts as QA evidence. The artifact queue is not a replacement for independent human/editorial decisions; `docs/curriculum-acceptance-decisions-v014150.json` remains authoritative until properly supported new decisions are entered.

**Next blocking authoring batches:** 20 remaining `risk60` transfer days and all 90 `practicum90` days. **Next verification across all 137 authored days:** claim-specific primary-source evidence, individual numerical and misconception review, truly independent protected assessments, rights-cleared historical replay where required, and authenticated member testing. Research exact primary sources, fresh cases and mathematical assertions per lesson before enabling a protected assessment.

## 4A. Risk60 first-cycle original learning batch — 2026-10-31

**Source:** `functions/_lib/academy-risk60-learning-batch01-v1.js`. Twenty individually authored original fictional learning cases were added for canonical `risk60` Days 1–20, mapped one-for-one to existing parent source days `1,2,3,4,6,8,10,11,12,13,16,17,19,20,23,24,25,26,27,30`. No canonical day ID, Boot Camp count, registry reference, progress storage or existing grade was replaced.

**Instructional scope:** Each case now has a subject-specific explanation, a worked fictional case, a stepwise method, a precise common error, a different transfer scenario, a corrective review, evidence and time boundaries, and explicitly limited SEC Investor.gov reference scope. The existing guided ten-stage course interface renders the new material through the same shared authored-lesson contract. It remains **ungraded and not independent-editorially approved**.

**Numerical examples:** The source includes reviewable fictional arithmetic for quoted spreads, return versus spread denominators, process sample rates, turnover, maximum theoretical share quantity, partial exit, static-book VWAP-like fill approximation, price decline, short-side loss and learning-audit rates. New `tests/test_academy_risk60_batch01_v1.mjs` independently recomputes these selected numerical cases, enforces twenty distinct explanations/transfers and checks ungraded flags and the 247-day source manifest. The existing Charts45 manifest expectations were updated without weakening their unchanged 45-case checks.

**CI:** `.github/workflows/bootcamp-247-editorial-preflight-v1.yml` now includes this source and test; its result must be read from the exact GitHub Actions run and is **not assumed to have passed** merely because source was committed. The workflow is configured to post successful run/commit evidence to issue #157.

**Updated authoring baseline:** Original 247 study days at the first-cycle batch snapshot were 117/247; after the separate second-cycle integration described below, the controlling inventory is **137 source-authored / 110 requiring an original day case**. Of these 130, twenty are Risk60 final transfer-phase days and ninety are Practicum90. All 247 still require independent source, content, fresh protected assessment and authenticated member acceptance. No student mastery, certificate, reward, security entitlement, Lumen or payment changes were made by this batch.

## 4B. Risk60 second-cycle guided-practice source — 2026-10-31

**Source file:** `functions/_lib/academy-risk60-practice-batch02-v1.js`; integrated through existing `bootcamp-academy-v014168.js`, preserving canonical 60 study IDs, twenty source-day anchors and private progress/version contracts.

**Authoring:** Twenty distinct original fictional worked examples and fresh ungraded transfer exercises were authored for Risk60 Days **21–40** (guided Practice). Each has the relevant concept, step-by-step numerical/evidence method, one specific error, formative prompts, source scope and an explicit NO TRADE/WAIT policy. The public lessons contain neither private answer keys nor official grading.

**Automated checks:** `tests/test_academy_risk60_batch02_v1.mjs` checks every one of the twenty day and source mappings, uniqueness of cases/transfers, ungraded flags, mathematical fixtures (price/spread, turnover, depth, risk cap, partial exits, hypothetical execution, short exposure and cohort quality), and the full original 247-day manifest. It is included in `.github/workflows/bootcamp-247-editorial-preflight-v1.yml`. **Do not mark this CI accepted until its exact GitHub Actions run is verified.**

**Controlling authored tally:** **137 / 247 = 55.5% source-authored**, **110 days = 44.5% still require distinct authored cases**. Remaining source authoring: Risk60 final 20 Transfer days, Practicum90 90 days. This metric does not count 27 separately approved invitation-only Beta teaching days or Free Foundations.

**Editorial:** `docs/qa/2026-10-31_RISK60_20_CASE_AI_EDITORIAL_PREFLIGHT_V1.md` separately records 20 GPT-6 AI editorial preflight reviews of the *earlier Days 1–20* and two factual teaching corrections. Those checks do not constitute new Days 21–40, do not grant independent human approval and do not award protected grades. All original 247 days still require independent editorial signoff, claim-level sources, a fresh protected competency assessment, accessibility, rights and genuine member acceptance.

## 5. Security, commerce, release and operational boundaries

- `main` only; no feature branches or paid external services.
- No subscription, membership, Lumen price, wallet, stripe charge, entitlement or customer wallet writes.
- No market-data claims, fictitious brokerage fills, private rubrics, future-bar disclosures, fabricated source citations or auto-assigned mastery.
- No automatically approved day. Live release acceptance requires exact-commit production deployment and authenticated member QA; GitHub source tests alone are insufficient.
- Rollback: revert the specific source integration commits while retaining the original canonical program definitions, individual member records and original immutable historical evidence.

## 6. Revision history

| Version | Date | Change | Status |
|---|---|---|---|
| 0.1 | 2026-10-31 | Created owner-directed 247-day acceptance program and frozen B01 boundary | Draft |
| 0.2 | 2026-10-31 | 17 Watchlist/Scanner and 30 Foundations study-day teaching modules, new source/math tests and reproducible 247-day QA queue | Implementation draft; approval pending |
| 0.3 | 2026-10-31 | Charts45 supplemental 45 individual day/phase scenarios; 97 authored total; 150 remaining authoring days | Draft; independent editorial approval pending |
| 0.4 | 2026-10-31 | Risk60 first 20 distinct fictional source-day lessons; 117 authored total; 130 remaining; CI and separate reviewer gates retained | Source integrated; CI exact-run and independent editorial acceptance separately pending |
| 0.5 | 2026-10-31 | Risk60 guided Practice Days 21–40 original fictional authored case/transfer integration; 137 of 247 authored, 110 remaining; separate 20 existing case AI preflight | SOURCE AUTHORED; CI and independent human acceptance distinct |

**Footer:** Crown & Lantern Press · The Stock Market: From the Ground Up · Controlled QA record · Not a statement of legal compliance, trading profitability or formal educational accreditation.
