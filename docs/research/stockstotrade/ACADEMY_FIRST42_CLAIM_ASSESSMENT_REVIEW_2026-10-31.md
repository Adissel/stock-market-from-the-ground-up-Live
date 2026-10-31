# Academy First 42 — Claim-Level Research and Protected Assessment Readiness

**Document ID:** SMFGU-ACADEMY-RESEARCH-42-003
**Company / Imprint:** Cyber Nexus / Crown & Lantern Press
**Project:** The Stock Market: From the Ground Up — Boot Camp Curriculum
**Version:** 1.8
**Review date:** 2026-10-31
**Status:** SELECTED NARROW FACTUAL REVIEW RECORDED; INDEPENDENT PROTECTED ASSESSMENT REVIEW AND EDITORIAL ACCEPTANCE INCOMPLETE
**Repository:** cybernexuspublishing/stock-market-from-the-ground-up
**Branch:** main only
**File/type:** docs/research/stockstotrade/ACADEMY_FIRST42_CLAIM_ASSESSMENT_REVIEW_2026-10-31.md / Markdown
**Google Drive:** No file created; designated location and Drive document ID unassigned
**Dependencies:** 252_instruction_source_field_QA_v2.csv; MASTER_671_ROW_EVIDENCE_AND_ACCEPTANCE_v1.csv; original 30-day Foundations curriculum; first-22 authored lessons; B01 controlled beta decision; private lab training sets and competency scoring service.
**Purpose:** Trace selected claims and unanswered assessment requirements to each of the first 42 study days without falsely granting individual lesson or protected grading approval.

## Controlling inventory and explicit scope

The original seven Boot Camps total 247 study days. Five Truth Behind the Ticker, seven Watchlist, and ten Scanners days form the original 22-day editorial reference group. The 30 original Trading Foundations days have now been authored separately; the first 20 are included in this source review. The 27 additional Draft Boot Camp days are excluded from this 247-day acceptance program.

The source work is recorded in `ACADEMY_FIRST42_NARROW_CLAIM_EVIDENCE_2026-10-31.csv` (42 individually identified selected claims):
- **29** claims matched to narrowly relevant SEC/FINRA/NYSE material.
- **7** claims matched to technical OHLC explanations from StockCharts ChartSchool; this is educational technical reference, not a regulatory authority or a license to copy chart imagery.
- **6** claims are course-designed mathematical definitions or procedural requirements, not facts that can truthfully be characterized as externally regulator-verified.
- **0** historical trade fills or authenticated market-replay datasets are certified by this source investigation.
- **0** day-level independent editorial acceptance decisions were issued.

**Meaning of the 42-row coverage:** one selected factual or methodological claim was evaluated against a relevant source or explicit rule for each day. This does **not** mean every material sentence, counterexample, worked number, transfer prompt, and source publication timestamp has been independently verified. The required *complete claim-by-claim audit* is still open beyond these selected statements.

## Controlling record reconciliation

1. `252_instruction_source_field_QA_v2.csv` is still authoritative for individual day instructional and editorial status. Its 42 scoped rows now distinguish selected primary-source support (29), selected technical-source support (7), and six internally defined procedures. The `independent_case_review`, `protected_assessment_review`, and `editorial_status` values remain **NOT_REVIEWED / NOT_REVIEWED / NOT_ACCEPTED**.
2. `MASTER_671_ROW_EVIDENCE_AND_ACCEPTANCE_v1.csv` remains authoritative for the larger 419 Labs plus 252 Academy/Free positions. It has **not** been rewritten or silently reconciled to accepted: its unit-level source, assessment, transfer, and editorial gates remain open for these 42 days.
3. `ACADEMY_FIRST22_PROTECTED_ASSESSMENT_REVIEW_SPEC_2026-10-31.csv` is a design-review worksheet only, not a competing approval register and not an actual private scored assessment bank. Each of its 22 rows specifies a different unseen-case domain, essential competency dimensions and critical misconception; it contains **no answer keys**.
4. The previously accepted B01 ungraded beta product scope remains locked, and the 20 B01 private Lab identifiers remain separate from the five Academy day positions.

## Live database evidence — read-only metadata query, 2026-10-31

- `lab_training_sets_v014`, version 97: **20 rows have review_state=reviewed**, reviewer attribution and frozen timestamps. However, all 20 records carry the same `reviewed_at` timestamp and `source_status=original_hypothetical_b01_individual_review_pending_v01497`. Reconciling this inconsistency requires reviewing the actual individually attributable editorial log; one batch timestamp is not proof of 20 separately performed reviews.
- Version 96 has 419 draft rows in the queried snapshot, none reviewer-attributed. Do not confuse the broader Lab draft corpus with accepted B01 instruction.
- `competency_cases_v135`: **54** cases, none active and none reviewer-attributed. `gu_academy_protected_cases_v1`: **54** routes, none approved. These are for the separately feature-flagged tape10/indicators10/filings7 courses, **not the original 22**.
- No live data changed in this review. No confidential assessment content or member information was retrieved. This query does not establish authenticated member testing or assess question-answer correctness.

## Post-write verified test and protected B01 structural evidence

The targeted [Academy First-42 Claim Review Boundaries CI run](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41216677030) completed **successfully**. It verified:
- 42 selected claim records and 22 distinct *unapproved* assessment-review specifications matched to the canonical day keys.
- 252-row and 671-row controlling register lengths and unchanged unit-level editorial/assessment denials.
- 19 arithmetic expressions checked for the 17 newer Watchlist/Scanners authored days; 17 arithmetic expressions checked for the first 20 Foundations days. These tests do not certify every freeform worked answer, transfer or regulatory assertion.
- Separate targeted [Foundations Days 1–20 CI](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41216057618) passed its source and canonical curriculum checks after twenty formative questions were individualized.

Additional **read-only** private B01 v97 assessment structure queries verified:
- 20 sets, six questions each, totaling 120 question prompts, all structurally present and prompt-unique (by digest, without exporting text).
- 100 choice-type questions with three options each, and 20 number-type questions.
- 120 question identifiers have corresponding private answer-key entries; zero absent stems or short explanations under the tested minimum.
- All twenty sets are reviewer-attributed and frozen, **but** same review timestamp and `source_status` indicating pending individual review remain unresolved. Correct answers, arithmetic tolerances, distractor validity, reviewer independence and permissioned live member acceptance have **not** been audited here.

**Implementation commits:** `1d026e8ac10ae3d9a0715330acb8ec136d28c546` added first-20 individualized formative questions; `f1f0e4d1f7e0695bfc12613ab66dd4585afbc4ed` created selected-claim annex; `416db67adf36fb554235a471a2a324137dd34189` created private assessment design specification; `f873b496f204897e2272c60df8ac718615f4fbca` reconciled 42 rows in the 252 QA register; `5b6a7320f6dc4a9231fcfc7d4229f8c07ccba0ee` added successful CI entry point.

## Subject-specific source issues that still need independent review

- **Truth Behind the Ticker:** Verify precise issuer identity, accession and source availability; EDGAR acceptance timestamp alone is not the first-publication timestamp. Avoid importing later price bars as decision-time evidence.
- **Watchlist:** Independently reproduce every example's arithmetic and quote-denominator convention. A high ranking cannot override a spread, stale quote, or primary-source veto.
- **Scanners:** Verify universe exclusions, reference period, zero denominator behavior, quoted spread, session boundaries and corporate-action adjusted input series. Simulator thresholds are author-defined—not exchange rules.
- **Foundations Days 1–20:** Recompute separately authored fictional arithmetic and transfer examples, and audit all claims concerning T+1 settlement, market mechanics, short-sale restrictions, share structure, indicator interpretation, and no-lookahead decisions. The new 20 day-specific formative checks are teaching, not protected tests.
- **Historical material:** No market-data-rights verification or synchronized quote/replay records were supplied for these fictional scenarios. Historical assertions must wait for licensed evidence and a documented observation cutoff.

## Protected independent assessment review gate (22 original days)

The intended assessment standard is an unseen case distinct from the published explanation, worked numbers, and ungraded transfer prompt; each case must address knowledge, recognition, decision, and process. The reviewer must verify the question stems, unique variants, correct options, nontrivial distractors, numerical units, critical-risk errors, documented no-trade rationale and alternative valid interpretations.

**None of those 22 design rows is marked as a reviewed private case.** An approved assessment requires actual non-public question content and rubric stored in the existing protected service, reviewer identification and review date, correct server-only grading, unauthorized-access denials, and an end-to-end grade/persistence test. It cannot be approved by a source-link count or this worksheet. No graded assessment was enabled.

## Specific externally verified reference scope

- SEC, **Using EDGAR to Research Investments**: https://www.investor.gov/introduction-investing/getting-started/researching-investments/using-edgar-research-investments
- SEC, **EDGAR dissemination FAQ**: https://www.sec.gov/about/webmaster-frequently-asked-questions
- SEC, **Types of Orders** and **Executing an Order**: https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders ; https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/executing-order
- SEC, **Performance Claims**: https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-47
- SEC, **Reverse Stock Splits**: https://www.investor.gov/introduction-investing/investing-basics/glossary/reverse-stock-splits
- NYSE, **Trading Hours and Calendar**: https://www.nyse.com/trade/hours-calendars
- SEC, **Regulation SHO**: https://www.sec.gov/investor/pubs/regsho.htm
- FINRA, **Short Interest — What It Is, What It Is Not**: https://syndication.finra.org/content/short-interest-what-it-what-it-not
- StockCharts, **Candlestick Construction and Intrabar Limits**: https://chartschool.stockcharts.com/table-of-contents/chart-analysis/candlestick-charts/introduction-to-candlesticks

The reference statements were checked against those accessible sources on October 31, 2026. Their availability does not establish date-specific compliance advice or endorsement of market trading. Where third-party chart text is used for a concept, independently authored fictional illustrations remain the deliverable.

## Complete sentence-level inventory control — execution evidence pending

A source-driven enumerator, `scripts/academy-first42-claim-inventory-v1.mjs` (commit `05cef4702636219eda9f99ba95b206d9fb7d6fe1`), and [Academy First-42 Sentence-Level Evidence Inventory workflow](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41216936931) (workflow commit `0bc52a4dbca3d435cc66f633d5bfa36b81ac849f`) were added. The program iterates all 42 day bodies, collects explanation, fictional worked examples, common errors, correction guides, independent transfer instructions, source-reported caveats, and instructional procedure steps into an evidence review CSV.

The [sentence-level workflow](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41216936931) **passed**, with the artifact `academy-first42-complete-sentence-claim-queue`. Its build log reported **940 sentence-level review items across 42 days**. The generated CSV is explicitly a **review queue**: each item is marked `PENDING_SENTENCE_LEVEL_AUTHORITY_AND_ARITHMETIC_CHECK`. It does not assign research verification, editorial approval, score, grade, market-data authenticity or rights permission. Its execution and artifact creation are now verified by the cited completed workflow, but **940/940 have not been independently source-verified**.

## Preliminary substantive private B01 v97 assessment audit and severity findings

**Scope of direct read-only review:** `public.lab_training_sets_v014`, 20 frozen version-97 B01 Lab sets. The reviewer inspected all 20 numerical prompts, their private expected values and explanatory feedback, and all 100 multiple-choice stems, answer options, and leading feedback rationale. No raw confidential answer options, private expected values, personal details or full rubrics are copied into the repository.

| Check | Observation | Disposition |
|---|---|---|
| Case identity and completeness | 20 sets × 6 = 120 unique prompts: 100 three-option choice questions and 20 numeric questions | Structural PASS |
| Numeric substantive check | Independently recomputed the 20 fictional arithmetic cases from the stated numbers, units and requested rounding | Preliminary arithmetic PASS, **not signed editorial approval** |
| Numeric tolerance | All 20 numeric questions have explicit zero-tolerance values, including a case explicitly requesting a two-decimal result | Check intended input-format handling separately; exact equality must not be confused with universally suitable tolerances |
| Choice key linkage | Every choice key matched exactly one authored option | Structural PASS |
| Private raw choice order | All 100 stored correct choices were at index 1 (first position) | **Important validity risk**. Source order alone must never reveal a protected answer |
| Choice content and feedback | Initial reading found direct and generally coherent first-principles responses but several near-paraphrases within the same six-question set | Requires separately attributable pedagogical review, stronger discrimination and independent new case evidence |
| Review metadata | All 20 sets marked reviewed/frozen, one common review timestamp, while source-status still says individual review pending | **Unreconciled**; do not infer independent editorial acceptance |
| Live member records | Read-only count found no B01 v97 training attempts in the queried snapshot | No live attempt modified; still requires authenticated member acceptance |

**Server-grade access-control correction.** The shared training route previously checked `review_state=reviewed` and did not independently prevent a B01 `source_status` still explicitly pending individual acceptance from entering assessment mode. Commit `982b94a1a07f3fd469fd08c8627f47a481d82883` added fail-closed 409 denial for *assessment* start, resume and answer on the pending B01 source status. Authorized guided, practice and blind learning are preserved. Existing training RPC functions were independently verified as restricted to the service role, not directly executable by the anonymous/authenticated database roles. No private answer key or member record was modified.

**Answer-order correction.** The prior client-visible question/attempt identifiers made the former deterministic source-order shuffle reconstructible by anyone who knew the source algorithm; this was especially material because all 100 private source keys were stored first. Commit `51333c6ebd08150a9f4305972a6ddc93fedf23ec` replaced that reversible algorithm with a server-only, domain-separated HMAC permutation. A dedicated option shuffle secret can be configured, while the existing server-only Supabase secret is the fallback. Client JSON does not disclose the key. An attempt's options remain stable across refreshes; frozen source material is not reordered. HMAC key rotation can change option order on a future resume and should be operationally coordinated, but grade answers are compared by stored text, not display position.

**CI verification:** [B01 Pending Editorial Grade Guard — run 41217875021](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41217875021) **PASSED** on `0dca56b260522afae27c1062aeabcd95d8cde1df`. The workflow executed the private HMAC choice-order test, pending-review assessment start/resume/answer denial test, withdrawn-review test, and safe user-facing feedback/error test. It demonstrates synthetic-route behavior only, not a deployed customer member session.

**Publication decision remains CLOSED.** The code mitigation protects the existing beta contract; it does not establish individual human editorial reviews or approve the 20 B01 sets for official grading. No other original Boot Camp day gained protected assessment access.

### Corrective feedback depth — private B01 v97 review finding

A separate read-only field-level query found **120/120** questions have an `explanation` field and all 120 are distinct, but **0/100** multiple-choice questions store an explicitly structured per-distractor explanation field under the inspected option-feedback field names. The actual review sampled every multiple-choice stem and its choices, and considered the general explanations, but a single generalized rationale is **not demonstrated evidence that each incorrect selection receives an individually diagnostic explanation**. This is a material deficiency relative to the approved correction-and-retry standard.

**Recommended remediation for the next privately reviewed question version:** maintain a confidential wrong-answer misconception mapping keyed by case/question/selected option, require a reviewer to check each distractor's rationale, and project only the selected answer's appropriate correction after an authorized submitted attempt. Keep the key and unrevealed alternatives server-side and prevent answer reconstruction through pre-submission feedback. Treat preexisting frozen version 97 as historical/controlled ungraded practice until a distinct reviewed revision is approved. This is a design/acceptance recommendation; no private question data or database schema was changed.

## Next bounded acceptance work

1. Expand from the 42 selected claims to an **exhaustive claim inventory** for the 22 reference days, including exact source version, publication and effective dates and each calculation.
2. Obtain evidence of a genuinely separate editorial and private assessment reviewer. Record corrective decisions in the original registers; reconcile B01's mixed review metadata with its frozen product approval.
3. Build and test approved private assessment variants for the original programs without copying any answers or rubrics into public code; the existing 54 draft-camp variants cannot be reclassified for this purpose.
4. Exercise signed-in enrollment, save/resume, restricted-role denial, signed assessment grading, keyboard and mobile interaction, and exact-commit deployed behavior.
5. Complete the same detailed source/assessment review for the first 20 Foundations days before starting the remaining parent-derived 195 days; no catalog expansion is necessary.

## October 31 execution — full sentence-triage, private feedback and genuine member tests

**Document control:** Updated in-place rather than creating an alternate editorial register. Source audit workbook and CI artifacts supplement, never replace, the 252-row and 671-row authoritative acceptance records. Report status remains **TECHNICAL / PRELIMINARY SOURCE REVIEW ONLY; INDEPENDENT HUMAN EDITORIAL AND GRADED ASSESSMENT APPROVAL OPEN**.

### Full 940-sentence materiality triage

[CI 41227889226](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41227889226) verified that exactly 940 source-current statements and instructional steps, distributed over 42 original study days, were individually given an audit ID, materiality category, review priority, nearest relevant day-family source and an explicit next-verification instruction. Artifact: `academy-first42-940-sentence-reviewed-triage`. Source family allocations are **not** individual source attestations. Categories: source-evidence assertion 118, fictional/math/market case 255, general teaching/concept 153, instructional method or prompt 371, publisher secondary content 33, regulatory/current rule 4, and data provenance/execution 6. **940 automatically triaged; 0 human independently signed; 0 fully source-cleared individual Academy days.** Computational labels must not be misrepresented as source truth. The earlier 42 selected narrow source links are still the controlling *supplemental selected-claim* crosswalk, not universal 940 verification.

[Separate arithmetic CI 41228632294](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41228632294) passed a separately coded set of fictional formula recalculations without touching protected answer keys or member records. This verifies only tested arithmetic and cannot establish 255 entire fictional case reviews or historical trading evidence.

### Private B01 v98 remediation drafts in production data storage

On this date the versioned migration `supabase/migrations/20261031_b01_private_feedback_v98_draft_only.sql` was applied to the connected stock-site Supabase project. This is a **real database change** and must be distinguished from the prior report's read-only B01 review. Version 97's 20 frozen sets, private answers and reviewer attribution were not altered; **20 new version-98 Draft copies** were created with **200 distinct, selected-wrong-option corrective-feedback drafts** across 100 three-option questions. The 20 numeric questions were copied with a correction-policy note; a reviewer must still inspect rounding and numeric error feedback.

Read-only post-migration SQL verified 20 v98 sets, 100 private choice questions, 200 unique feedback entries, all 200 status `DRAFT_PENDING_SEPARATE_PEDAGOGICAL_APPROVAL`, and **0** v98 question-set reviewer attributes / frozen reviews / official assessments. The content is **preliminary assisted authoring**, not a separately attributable pedagogy or answer review. It cannot be promoted automatically. The existing V97 source-status inconsistency (marked `reviewed` while individual source review pending) remains under controlled release denial.

The server `functions/api/interactive-training.js` now rejects any official B01 assessment with the pending v97 or v98 source status, including start, resume and grade submission. After a successful authorized scored response only, the route can look up a *separately reviewed* wrong-choice correction in a pinned private set and disclose only the chosen feedback. Unapproved draft entries are withheld and error paths fall back to existing safe generic explanations. The [B01 private grading/feedback test](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41228124805) **PASSED**. No independently approved v98 correction is currently available.

### Real authentication, research inventory and routes

[Real-member read-only Academy API run 41229053907](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41229053907) **PASSED** using the existing James_Test QA credentials from GitHub secret storage. The noncommercial QA training tool-pass was granted for 30 minutes with an administrative audit record and no Stripe charge. It must be canceled when tests conclude. The workflow observed four canonical course paths, truth5/watchlist7/scanners10 full day counts and a foundations30 read route, read-only private progress, ungraded/no-mastery flags, unauthenticated guest denial, attempted forged identity selector containment, foreign-origin POST denial and authentic Supabase token-refresh continuity.

**Source defect corrected:** `functions/api/bootcamp-academy.js` previously excluded `foundations30` in `allowed()`, even though it contained dedicated read and enrollment branches for that program. This created an unreachable legitimate route; main was corrected without routing original 30-day progress writes through the new Academy ledger. Genuine production pass proves the corrected path responded at test time. Separate screen-level Chromium acceptance is not certified by this API pass.

[Real signed-in browser testing](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41229091636) is distinct and was still under diagnostic retest at this revision; earlier runs obtained real credentials but did not retain a browser Supabase session before day navigation. Do not treat a scripted mock browser as real-member acceptance or conclude all 22 day interfaces passed.

### Final verification and closure of temporary QA access

**GitHub source vs production:** The connected Cloudflare production Pages project `stock-market-from-the-ground-up` was inspected directly on October 31; production deployments included commit `a310684485f9ba2a7f9a93653b4ab37b0326ea64` (successful), followed by later active commits including the Academy browser diagnostic update. This establishes that the live production endpoint served a deployment containing the `foundations30` read-route correction; it does **not** retroactively establish exact latest-head equality for every site workflow.

**Read-only signed-member API:** [Run 41229053907](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41229053907) PASSED with authentic James_Test Supabase credentials. It verified the live source read of original truth5, watchlist7, scanners10, foundations30, fail-closed guest checks, spoofed member selector rejection, cross-origin write rejection, genuine token refresh and no unwanted progress changes.

**Full browser did not pass:** [Run 41229248443](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41229248443) FAILED before 22-day navigation. The legitimate QA password grant succeeded and the member token was genuine, but browser `supabase.auth.setSession/getUser` failed to maintain a retrievable browser identity (`Failed to fetch`). The diagnostic attempted forwarding the actual browser token to the real GoTrue identity endpoint via a QA-only transport bridge; it still did not pass. **0/22 completed live authenticated Chromium day-level acceptance screens.** No CAPTCHA UI, real member view, mobile/screen reader, independent private examination or second-member isolation was certified. This is an operational blocker, not a source acceptance denial.

**QA grant revocation:** The one-time 30-minute noncommercial `ONDEMAND_TRAINING` tool pass was granted to the existing James_Test QA identity, used only for the read-only acceptance calls, and **explicitly canceled** after the final browser diagnostic. Separate administrative audit entries document issuance and revocation; database post-check returned `post_revocation_entitled=false` and `qa_passes_left_active=0`. The QA member's earlier canceled grants and all production customer purchase/grade records were unchanged.

**Additional permanent regression:** `tests/test_v014168_academy_family.mjs` now rejects a future return of `code!=='foundations30'` in the Academy code eligibility function, while preserving the canonical original 30-day progress controller.

**Final gate:** Current approvals **0/42** day-level editorial, **0/20** newly drafted v98 private sets, **0/200** new feedback entries. The initial 940 items were assigned audit tasks but not cleared by source-validating independent reviewers. Do not enable protected grading, certificates or public curriculum completion on this evidence.

### Individually attributable approval decisions

**0 decisions issued**. None of the 940 preliminary triage rows or 200 private Draft corrections has an independent editor's signed day/case decision. Required reviewer: distinct attributable human or suitably independent editorial process with reviewed source record, field-level mathematical answer audit, actual counterexamples, materiality severity, source effective dates, private grading rubric and answer-option feedback, and final acceptance/rejection *in the existing controlling registers*. Existing B01 product beta approval of **ungraded instruction only** stays frozen; never conflate draft creation with published assessment.

**Risks / dependencies:** production Cloudflare exact-source parity, read-only authenticated browser QA and separately authorized member write/save QA, second-member RLS isolation, accessibility, private grade version acceptance, regulatory/source effective-date checks, historically licensed data, and no-hindsight replay authenticity. New monetary/entitlement purchases are expressly out of scope.

## Subsequent beta gate execution — factual source correction, member browser and remaining approval workload

**Status on October 31, 2026:** **CONTROLLED UNGRADED BETA TECHNICAL ACCEPTANCE SUPPORTED; FORMAL INDEPENDENT FACTUAL AND ASSESSMENT ACCEPTANCE NOT GRANTED.** No new editorial approval has been issued; the 252-row and 671-row registers retain their previous decisions.

### Authenticated member-browser defect and acceptance boundary

[GitHub Actions run 41231054861](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41231054861) **PASSED**, opening all **22 of 22** original Truth5 / Watchlist7 / Scanners10 study-day screens in actual Playwright Chromium with a genuine Supabase-issued noncommercial QA member token and the standard ten-stage instructor (5 + 7 + 10 screens). The browser tests performed no reflection save, course grade, purchase or member progress mutation.

**Cause of initial runner failure:** The QA-only `tests/live-academy-first22-auth-browser-v1.mjs` bearer-token matcher had a doubled escaped character class, so the diagnostic proxy never handled the genuine cross-origin GoTrue identity fetch. This was repaired on `main`. The test also initially checked a deliberately collapsed objective paragraph for *visible* text before opening its `<details>` briefing; the accessibility-aware test now opens the briefing first. The test's approved network bridge sends the real browser-issued bearer to the real Supabase `/auth/v1/user` endpoint using Node networking and relays the authentic response; it **does not fake the identity, create an entitlement or replace server permission checks**.

**Still not established:** Native browser-to-Supabase cross-origin fetch without the test bridge, visual CAPTCHA login, a second distinct member's actual RLS isolation, and mobile/screen reader flows. Do not claim the production sign-in stack itself was fixed: the root issue was demonstrably in the test harness / runner's cross-origin path, and a separate native browser acceptance test remains necessary.

A second audited, short-lived noncommercial `James_Test` QA training pass was issued for this diagnostic and **explicitly revoked** after passing the 22-day test. Supabase postcheck: `entitled_after_revocation=false`, `active_qa_grants=0`.

### Primary-source substantive curriculum correction: Foundations Day 20

The 940-line review led to a specific material issue in `functions/_lib/academy-foundations-batch02-v1.js` for **Trading Foundations Day 20**. A vendor-reported short-sale volume numerator and an all-venue consolidated daily volume denominator are **not necessarily comparable**. FINRA's daily short-sale volume file covers reported off-exchange activity, whereas consolidated volume includes other execution venues; the crude quotient is arithmetically defined but must not be presented as an inferred full-market short-sale activity percentage or live short interest.

**Action implemented:** Strengthened the original day explanation, worked numerical example, interpretative review guidance, independent challenge and relevant source link. The example retains `1.2m / 3m = 40%` as an *explicitly fictional raw ratio only*, pending original data coverage, venue/time alignment and meaningful comparable denominator. FINRA primary reference: https://syndication.finra.org/content/short-interest-what-it-what-it-not. This also avoids interpreting short-sale volume as outstanding short interest or proof of forced covering.

[Foundations batch CI 41231181781](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41231181781) **PASSED**. The new specific Day20 test checks the FINRA source, venue-comparable denominator, fictional arithmetic and pending editorial status. The related canonical curriculum/learning engine tests still pass. This correction addresses **one substantive flagged source issue**, **not** 940 completed independent source attestations.

### Private v98 actual-content preliminary review

Private Supabase assessment data was inspected **read-only** after v98 Draft generation. The 20 numeric questions specify 19 integer/unit outcomes and one after-hours price percentage explicitly requested **to two decimals**; all have exact zero numeric tolerance and no partial-credit tolerance. Their sample arithmetic had already passed preliminary checking, but final tolerance policy, alternative numeric formatting, partial credit expectations and independently graded corrective feedback remain subject to separate-case review. These exact-answer thresholds should not be treated as a signed grading rubric solely because the values compute.

All **100** choice questions in v98 have exactly two corresponding wrong-option correction entries (200 total), none maps to the correct option, and no private answer key was exported. The entries were generated as assisted **Drafts** with a repeated explanation pattern that quotes the chosen option and a domain correction. Thus distinct record text does not by itself demonstrate genuinely **misconception-specific, independent pedagogical** review. A separate reviewer must examine every option to ensure its feedback actually diagnoses *that* error; the v98 content remains `review_state=draft` with **no reviewer identity, review timestamp or sign-off**. Frozen v97 question content remains unchanged.

### Remaining quantitative gates before official graded or generally accepted beta

| Control | Verified completion | Remaining independently approved work |
|---|---|---|
| 940 individual factual and instructional review items | 940 indexed/materiality-triaged; independent topical source corrections begun | Independent, attributable source/meaning/disclosure decision for every applicable item; verify historical vendor provenance and individual fictional transfers |
| Original 42 study-day packages | Authored and queued for acceptance | 42 independently attributable editorial acceptance/rejection decisions, recorded **only in the existing 252/671 registers** |
| B01 private assessment questions | 20 private v98 Draft sets, 100 choice + 20 numeric questions | Inspect, correct and individually sign each question/answer/rubric, with reviewer evidence; **0 v98 sets approved** |
| Wrong-choice diagnostic responses | 200 private Draft corrections with structural integrity | 200 option-level misconception checks and resulting revised responses/approval |
| Authenticated member QA | 42-day production API PASS; 22-day real-token Chromium PASS via QA-only bridge | Native browser user fetch/login/CAPTCHA, multi-member privacy and approved final release verification |
| Production / commerce | Cloudflare production deploy source included corrected day; no paid QA transactions | Verify final promoted commit and public beta UX; payment testing not required to prove ungraded curriculum quality |

**Availability distinction:** Eligible beta testers can use the existing controlled **ungraded** B01 teaching access. The current 22-day classroom browser evidence supports this restricted scope, not release of official protected examinations, competence/mastery awards or certified curriculum. A calendar completion date is not reliable without actual independent reviewers and remaining source receipts.

## Owner-delegated second review — current 945 claims, 42 preliminary decisions and 200 revised private corrections

**Date:** 2026-10-31  
**Reviewer identity:** GPT-6, owner-delegated AI-assisted editorial preflight. **This reviewer is not a separately authenticated, independently contracted human editor**.  
**Independent human editorial signatures:** ZERO.

**Source-current arithmetic and risk control:** Revision to the Foundations Day 20 short-volume denominator instruction increased the first-42 generator from **940** to **945** sentence/step locations. [CI 41232420934](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41232420934) **PASS** generated 945 record-level risk controls, rechecked 36 embedded lesson math fixtures, categorized the exact source-current text, and produced 42 day-level control reports. The risks may overlap; classification is neither legal source certification nor 945 independent editorial approvals. Independent date-specific and securities-data-source verification is still required. The 42 primary/secondary selected narrow-claim crosswalk supplies only **14 distinct reference URLs**; all URLs were opened and examined at page-family level (SEC Investor.gov, SEC, NYSE, FINRA and a technical education provider). A topical source URL is not evidence for every individual assertion.

**Individual AI-preliminary editorial dispositions:** New companion `docs/research/stockstotrade/ACADEMY_FIRST42_ATTRIBUTABLE_PRELIMINARY_EDITORIAL_DISPOSITIONS_2026-10-31.csv` records **42 separate, case-specific REWORK_OR_VERIFY_BEFORE_APPROVAL findings** and the transparent AI authoring identity. Each links a particular day to a distinct falsifiability, numerical, teaching or source risk. The file does **not** assign human signoff; 42/42 final independent editorial decisions remain unissued, and **the 252-day and 671-row controlling files remain unchanged**.

**Private assessment reauthoring:** Directly in the connected service-role-only Supabase project, the 200 version-98 incorrect-choice explanations were rewritten as **200 distinct, wrong-alternative-specific drafts**, rather than the earlier repeated "Why this choice is incorrect / Correction" template. They remain explicitly marked `AI_REVISED_DRAFT_PENDING_INDEPENDENT_EDITORIAL_APPROVAL`, with authored-by AI attribution. Postflight SQL: 200 entries, 200 distinct nonblank texts (56–115 characters); **0** separately approved explanations; **20** of 20 version-98 sets still Draft, with null reviewer fields; **0** version-98 learner attempts. Two admin audit records document these private drafts and the numeric/replay changes, without storing confidential answers publicly. The frozen version-97 assessment content and previous grades were not changed.

**Accuracy and numerical input fixes in private version-98 drafts:** A time-bound replay evidence question was revised to explicitly require a finalized, provider-delivered last completed bar before a 09:45:02 ET decision. The 20 numerical questions now clarify numeric-only input (no units or symbols). The one fictional after-hours change question explicitly requesting two-decimal precision has a proposed tolerance of **0.0049 percentage points** to permit a mathematically consistent higher-precision answer rather than only the display-rounded value. All remaining 19 numeric cases retain zero tolerance. These corrections and numeric policies remain **unapproved Drafts** and require a separate reviewer to verify correct keys, units, question wording and grading effects.

**Independent-review security gate:** `functions/api/interactive-training.js` now requires recorded reviewed-set attribution and, for any additional selected wrong-option coaching, `independentReview` metadata naming an actual human editor role, unique reviewer user UUID, decision date, evidence reference, and affirmative individual review of the question and feedback. The status string alone is insufficient. Drafts and mechanical templated corrections continue to fall back to existing safe generic feedback. Related `tests/test_b01_private_option_feedback_v98_v1.mjs` now verifies that unreviewed or status-only edits are insufficient. **Targeted regression CI newly queued** as of this revision; do not call it passed without its completed status.

**Confidential handoff:** `docs/research/stockstotrade/ACADEMY_B01_PRIVATE_INDEPENDENT_EDITORIAL_REVIEW_HANDOFF_2026-10-31.md` lists all **20** case identities and distinct review risks without printing any of the private 120 question prompts or answer keys. Required actual independent review: 100 choice prompts, 20 numeric prompts, 200 answer-specific feedback entries, 42 day-level decisions, and 945 individual source-current audit entries. The submitted exercise is **NOT complete as an independently accepted curriculum**, and no official protected grading, certification or mastery is enabled by these preflights.

**Beta decision:** Controlled **ungraded** B01 instruction for entitled testers may continue on previously accepted scope, with the [22-day genuine member token Chromium test](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41231054861) and [production read-only API test](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41229053907) as evidence. Native user-facing sign-in/CAPTCHA and full independent private grading acceptance are still separate and open. A definite completion date or an approved-grade release would be unjustified without distinct reviewer action.

## Revision history

| Version | Date | Change | Approval |
|---|---|---|---|
| 1.0 | 2026-10-31 | Selected source-claim crosswalk for 42 days; 22 non-secret protected assessment design requirements; read-only database metadata reconciliation | Research evidence only; no final editorial, independent case or production release approval |
| 1.1 | 2026-10-31 | Recorded passing source CI and B01 120-question private structural audit; flagged outstanding reviewer independence and per-claim gaps | Targeted technical evidence verified; full release and editorial acceptance open |
| 1.2 | 2026-10-31 | Added source-driven sentence-level audit generation protocol; CI run queued | Review queue code committed; generated artifact unverified |
| 1.3 | 2026-10-31 | Verified 940-claim inventory, performed preliminary private B01 content/math checks, corrected pending-grade and reversible answer-order defects with passing CI | Technical safeguards verified; 42-day claims and independent editorial/assessment acceptance OPEN |
| 1.4 | 2026-10-31 | Recorded missing structured per-option remediation in frozen B01 private set, with appropriate next-version instructions | Editorial correction-and-retry gate OPEN; private set unchanged |
| 1.5 | 2026-10-31 | 940 individual triage records, separate numeric checks, 20 private v98 Draft remediation sets with 200 corrections, protected grader regression and real-member API acceptance | Technical evidence verified; 0 human editorial approvals, browser release OPEN |
| 1.6 | 2026-10-31 | Recorded Cloudflare deploy, passed real member API, failed browser identity transport, controlled QA pass issuance/revocation and zero protected editorial acceptance | API gate PASSED; authentic browser and independent editorial gates BLOCKED |
| 1.7 | 2026-10-31 | Verified genuine-token 22/22 browser classroom with QA transport boundary, corrected FINRA venue-scope Day20 lesson, checked private v98 option/numeric structure and revoked QA grant | Ungraded beta classroom technical PASS; 940 factual decisions, independent rubric approvals and native login OPEN |
| 1.8 | 2026-10-31 | Generated source-current 945-item risk/arithmetics CI; 42 AI-attributed day rework dispositions; privately rewrote all 200 misconception feedback Drafts, corrected numeric/time detail and imposed attributed reviewer gate | No human editorial signoffs; controlled ungraded beta continues, protected grading held |

**Footer:** Crown & Lantern Press / Cyber Nexus. Controlled quality-assurance evidence, not individualized investment advice, an official qualification or a statement of regulatory compliance.
