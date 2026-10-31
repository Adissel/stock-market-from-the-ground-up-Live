# Academy First 42 — Claim-Level Research and Protected Assessment Readiness

**Document ID:** SMFGU-ACADEMY-RESEARCH-42-003
**Company / Imprint:** Cyber Nexus / Crown & Lantern Press
**Project:** The Stock Market: From the Ground Up — Boot Camp Curriculum
**Version:** 1.1
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

## Next bounded acceptance work

1. Expand from the 42 selected claims to an **exhaustive claim inventory** for the 22 reference days, including exact source version, publication and effective dates and each calculation.
2. Obtain evidence of a genuinely separate editorial and private assessment reviewer. Record corrective decisions in the original registers; reconcile B01's mixed review metadata with its frozen product approval.
3. Build and test approved private assessment variants for the original programs without copying any answers or rubrics into public code; the existing 54 draft-camp variants cannot be reclassified for this purpose.
4. Exercise signed-in enrollment, save/resume, restricted-role denial, signed assessment grading, keyboard and mobile interaction, and exact-commit deployed behavior.
5. Complete the same detailed source/assessment review for the first 20 Foundations days before starting the remaining parent-derived 195 days; no catalog expansion is necessary.

## Revision history

| Version | Date | Change | Approval |
|---|---|---|---|
| 1.0 | 2026-10-31 | Selected source-claim crosswalk for 42 days; 22 non-secret protected assessment design requirements; read-only database metadata reconciliation | Research evidence only; no final editorial, independent case or production release approval |
| 1.1 | 2026-10-31 | Recorded passing source CI and B01 120-question private structural audit; flagged outstanding reviewer independence and per-claim gaps | Targeted technical evidence verified; full release and editorial acceptance open |

**Footer:** Crown & Lantern Press / Cyber Nexus. Controlled quality-assurance evidence, not individualized investment advice, an official qualification or a statement of regulatory compliance.
