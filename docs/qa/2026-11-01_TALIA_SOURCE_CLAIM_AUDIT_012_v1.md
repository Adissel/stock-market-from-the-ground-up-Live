# Talia Tutor — Research Directory Claim-Scope and Formula Audit, Batch 012

| Control | Value |
|---|---|
| Company / imprint | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | THE STOCK MARKET: FROM THE GROUND UP — Talia Market Tutor, Labs, Boot Camps, Chart Studio |
| Document ID | SMFGU-TALIA-SOURCE-CLAIM-AUDIT-012 |
| Filename | `docs/qa/2026-11-01_TALIA_SOURCE_CLAIM_AUDIT_012_v1.md` |
| File type | Markdown |
| Google Drive location | Not created; GitHub `main` controls this source-of-record |
| Google Drive file ID | Unassigned |
| Version / date | 1.0 / 2026-11-01 |
| Status | Claim-scope source triage COMPLETE for the defined 140-topic set; independent financial/editorial/rights acceptance HOLD |
| Dependencies | Master Research Source Directory; 600-topic Foundation target; batches 06–12; 73 indicator briefs; SMFGU-TALIA-NEXT-EXECUTION-011; shared Learning v3.3, Lab v3.2 and Talia backend |
| Purpose | Preserve audited research references, math constraints, precise acceptance denominators and follow-up execution without treating a research-site recommendation as a license or publication approval |

## Status and exact denominators

- The original 80-item source triage for explanations **101–180** is in `docs/qa/2026-11-01_TALIA_FOUNDATION_EXECUTION_010_v1.md`.
- A further 60 individually indexed, provisional source/rights/formula records for **181–240** now reside in `data/talia-claim-triage-181-240-and-indicators-v1.json`.
- Together, the two registers contain **140/140 = 100% itemized source-scope triage** for the named 101–240 review slice. **This does not mean 140 independently reviewed, verified, or publication-approved claims**; final acceptance is 0/140.
- Foundation authored explanations: **240/600 = 40.00%**. Additional progress requires new independent source checks and curriculum reviews.
- All **73/73 indicator guides = 100% source-authoring upgrades**; all 73 have their own formula, seeding, source, data-rights and publication HOLD fields in the same JSON register. **0/73 final independent publication acceptances**.
- Advanced, Professional, Enterprise have draft source-only contracts; **0/3 premium Tutor editions independently accepted**. Each edition's overall feature-completion percentage is unquantifiable until requirements are reconciled to test evidence.
- Ten source/release gates: source-definition Gate 2 (73/73) and Gate 3 (240/600 latest authoring batch) are the **2/10 completed source milestones**; other release gates are partial/open. This unweighted gate count does **not** equal overall website completion.

## Source verification performed (not a general license or certification)

1. **SEC Investor Bulletin, Stop, Stop-Limit and Trailing Stop Orders**, updated 2026-08-18: https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-15. SEC describes a stop price as a trigger, not a guaranteed market execution price; stop-limit orders can remain unexecuted. The canonical source links for ungraded lessons 222, 223 and 237 were narrowed accordingly. Source-only fictional arithmetic remains separate.
2. **SEC Types of Orders**: https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders. This addresses basic bid/ask and marketable order mechanics, but actual execution requires sufficient liquidity; topic 221 now cites this narrower primary page.
3. **SEC An Introduction to Options**, updated 2026-07-16: https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-63. This supports basic listed-options rights, premium, exercise and assignment terminology. Advanced spreads, uncovered calls and actual assignment/settlement must be corroborated against the current **OCC Characteristics and Risks of Standardized Options**: https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document . Options topics 201–220 are on **ADVANCED_SPECIALIST_PLACEMENT_REVIEW** rather than assumed introductory member publication; existing frozen membership rights have not been altered.
4. **SEC EDGAR Webmaster FAQ**: https://www.sec.gov/about/webmaster-frequently-asked-questions. SEC distinguishes the report-period end date, official EDGAR acceptance timestamp and actual public availability; the latter may lag acceptance. Lesson 197 now cites this guidance instead of a general filings search page.
5. **QuantConnect Backtesting Research Guide**: https://www.quantconnect.com/docs/v2/cloud-platform/backtesting/research-guide. Provides a concrete methodological reference for holdout testing, parameter selection and overfit warning; lessons 200 and 240 now use this rather than macro vintage or broad asset-allocation guidance.
6. **SEC fees bulletin**: https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/updated . Lesson 236 now uses a fee-impacts reference in place of a general stocks page. Specific dollars in the lesson remain original fictional arithmetic.
7. **FRED Real-Time Period API**: https://fred.stlouisfed.org/docs/api/fred/realtime_period.html. Supports separating observation and revision-vintage dates in lesson 196. **FRED Terms** (https://fred.stlouisfed.org/legal/terms/) restrict use of FRED content in software/AI/ML development/training and commercial redistribution of third-party content; any automated ingestion or LLM training requires separate permission review, not an implied website subscription.
8. **SEC Rule 605 FAQ effective for the 2026-08-01 amendments**: https://www.sec.gov/rules-regulations/staff-guidance/trading-markets-frequently-asked-questions/frequently-asked-questions-rule-605-regulation-nms . Its scope is covered-order execution-quality reporting, not universal evidence for tape colors, trade intent, share-borrow fees or participant-level depth. Keep the original 14 specific 143–180 records on HOLD until claims are individually remapped.
9. **StockCharts DPO**: https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/detrended-price-oscillator-dpo . A shifted, historical DPO display may incorporate later data than the timestamp where it is plotted: Professional replay must release the value only after its source lookback closes. An indicator name and correct historic plot must not bypass the no-lookahead guarantee.

## New source and QA engineering

- `data/talia-claim-triage-181-240-and-indicators-v1.json` records 60 independently indexed explanation claims (source, specific limitation, rights and release hold) plus 73 individually indexed indicator/formula/warmup/rights holds.
- `tests/talia-claim-triage-and-math-v1.test.mjs` checks the 60/73 records, the retained HOLD states, unchanged curricula and fresh fictional arithmetical risk calculations. It is wired into `scripts/build-pages.sh` and the existing Tutor CI workflow.
- Existing `original-competency-tutor-v014100.js` permits an explicit bounded QuantConnect HTTPS host for research citations only; it does **not** introduce network scraping, provider data access, paid model calls or unrestricted external domains.
- Topic JSON maintains **exactly one canonical candidate URL per topic** as required by the original Tutor loader. Superseded historical references are retained in `sourceScopeReview.supersededResearchReferences` and must not become duplicated `sourceUrls` entries. The earlier build failure caused by duplicate canonical URLs was remedied without weakening validation.
- All original Lab/Boot Camp IDs, private assessments, answer keys, grade histories, entitlement policies and source-only inference safeguards are unchanged.

## Research levels and exact application

| Source-directory level | Applied system boundary | Status |
|---|---|---|
| 1 — Beginner | SEC/FINRA claims and original first-principles examples for accessible lessons | Source research started, per-topic rights HOLD |
| 2 — Indicator mathematics | 73 original source guides, stated parameters, seeding, missing data and original calculations | 73/73 source upgraded; mathematical and rights publication HOLD |
| 3 — Microstructure | Rule 605 only within actual covered-order reporting scope; do not infer tape aggressor from color | 14 earlier claim remaps HOLD |
| 4 — Fundamentals | SEC EDGAR point-in-time filing/acceptance/effective dates | Source timing corrected; issuer filing data rights HOLD |
| 5 — Derivatives | SEC options intro and OCC ODD; future specialist curriculum | 201–220 placement HOLD |
| 6 — Macro | FRED/ALFRED vintage research; use restrictions | No automated AI/ML data reuse approved |
| 7 — Quant/statistics | QuantConnect research guide and original synthetic overfit lessons | Prototype source review, not live forecast |
| 8 — Historical data | Synthetic allowed; licensed data ingestion and feed distribution separate | No new licensed historical feed |
| 9 — ECharts/React/TypeScript | Preserve current chart and lab engines; independent authenticated visual/accessibility QA | Prototype only; production release HOLD |

## What is next, in execution order

1. Independently examine the source passages for each of the 140 claims in 101–240. Record version/date, exact claim, math, reader-facing text and publication rights; resolve or restrict each HOLD.
2. Independently validate each of the 73 indicator formulas, input units, warmup/seeding and synthetic numerical examples. Identify vendor-dependent or conceptual-only studies.
3. Complete individual learning-quality tests for 240 source-authored explanations: first-principles instruction, independent retries, deliberate misconception recovery and consistent assessment protection.
4. Perform actual signed-in Free and Founding tier sessions, account switching, RLS/private history, mobile/keyboard/screen-reader and ECharts no-lookahead evaluation.
5. Match every required GitHub Actions push workflow and successful Cloudflare production deployment to one final `main` commit. Repair actual failures before release approval.
6. Integrate Advanced prerequisites only through existing server-verified competency summaries and independent premium entitlements.
7. Integrate Professional ECharts/Chart Studio only with published-before-decision market data and tested replay stops.
8. Integrate Enterprise citation provenance only with independently approved rights, effective grant, audit and no-cost/no-implicit-provider conditions.
9. Review member curriculum placement, special options safety, Lab and Academy instructional quality against the existing shared engines.
10. Prepare independent edition-specific release evaluations. No admin, owner or model role label substitutes for professional rights, finance/legal or member acceptance evidence.

## Revision history

| Version | Date | Change and signoff |
|---|---|---|
| 1.0 | 2026-11-01 | Scoped 140 topic claims and 73 indicator topics; updated 8 canonical references; internal QA-triage signoff only. No independent final editorial, legal, rights or production acceptance. |

**Footer:** SMFGU-TALIA-SOURCE-CLAIM-AUDIT-012 · v1.0 · Internal QA only · No premium edition activation or paid-provider change.
