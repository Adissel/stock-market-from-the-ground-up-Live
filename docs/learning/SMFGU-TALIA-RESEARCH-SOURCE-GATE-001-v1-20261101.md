# Talia Tutor — Research Source, Formula Verification and Publication Gate

| Document control | Value |
|---|---|
| Company | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | The Stock Market: From the Ground Up — Talia Market Tutor |
| Document ID | SMFGU-TALIA-RESEARCH-SOURCE-GATE-001 |
| Filename | `docs/learning/SMFGU-TALIA-RESEARCH-SOURCE-GATE-001-v1-20261101.md` |
| File type | Markdown |
| Version / date | 1.0 / 2026-11-01 |
| Status | Owner-adopted source validation and publication framework; 100 supplemental Tutor explanation drafts not yet individually accepted |
| Google Drive location | Not created; GitHub `main` is controlling |
| Google Drive document ID | Unassigned |
| Dependencies | `AGENTS.md`; `SMFGU-TALIA-FOUNDATION-600-COVERAGE-001`; five `data/talia-foundation-explanations-batch0*-v1.json` assets; `scripts/talia-indicator-editorial-review-v1.mjs` |
| Purpose | Prevent unverified financial claims, look-ahead, unsupported licensing assumptions, inappropriate grading, and false published-lesson acceptance |

## Controlling source supplied by Owner

`Master Research Source Directory(3).odt` (20-page user-provided document, 2026-11-01) is the source-selection framework. The Owner states that its listed references are approved. **Interpret that as authorization to consult those references, not independent confirmation of every individual formula, current legal status, license, market-data right or published teaching record.**

The directory's nine priority levels are retained:

1. SEC Investor.gov, FINRA, Schwab/thinkorswim, investor fundamentals.
2. ChartSchool, Fidelity, thinkorswim, TradingView, TA-Lib, Pandas TA, QuantConnect for independently derived and cross-validated indicator mathematics.
3. SEC, FINRA, Nasdaq and NYSE specifications for trade/quote, market microstructure and clearing distinctions.
4. SEC EDGAR and NYU Stern Damodaran for financial statements and matched cash-flow/discount-rate methodology.
5. Options Industry Council, OCC, Cboe, CME and CFTC for derivatives and risks.
6. Federal Reserve, FRED/ALFRED, BLS and BEA for macro series, release timing, vintages and calculation conventions.
7. QuantConnect, SciPy/statsmodels, research literature for statistics, overfitting and out-of-sample validation.
8. SEC/approved member data and explicitly licensed replay; **no vendor redistribution by default**.
9. Existing ECharts, React/TypeScript where warranted, HTML5/CSS3, Cloudflare and Supabase.

## Mandatory three-way distinction

**Research/reference** — A source may be consulted for definitions and mathematical fact-checking. Link the exact relevant URL. Do not copy proprietary text, images, transcript, software or chart artwork.

**Independent numerical verification** — Source code uses separately authored pure functions, explicit sample periods, inputs, units, initialization/warmup, missing values and fictional fixtures. Independent formula agreement and test success are each documented. One source URL alone is not a numerical test.

**Redistribution/publication** — May require separate permission for purchased exchange feeds, charts, datasets, commercial material, software, or provider API output. The allowed alternative is original synthetic examples and member-authorized personal data under existing entitlements, subject to separate permitted-use review.

## Per-topic editorial record schema (one row per explanation)

- Canonical topic ID and source family, level 1–9; duplicate-content search.
- First-principles definition, input data, units and observation cutoff.
- Formula, declared variant, warm-up/seed, and denominator/invalid-input handling.
- Individually independently calculated fictional example with intermediate steps.
- Second independent transfer example and ungraded conceptual misconception correction.
- Explicit scope limits, possible errors and neither a trading edge nor personalized advice.
- Primary evidence URL and publication/access date; secondary independent confirmation or verified reference implementation.
- Reference rights and product/public display/third-party-data redistribution decision separately.
- Lab/Boot Camp references only when the source lesson and time-aligned prerequisites have been individually reviewed; do not change either engine.
- Review date, reviewer, exact revision, defect disposition and final status: `draft`, `in_review`, `accepted`, `restricted`, or `rejected`.

## Batch 05 accepted *source-selection* research references (not accepted lessons)

| Topic family | Verified reference pages used for independent original explanations | Rights treatment |
|---|---|---|
| Form 10-K reporting | https://www.investor.gov/introduction-investing/getting-started/researching-investments/how-read-10-k | Reference only; never replace a dated filing with guessed numbers |
| Equity/firm DCF, valuation assumptions and cost of capital | https://pages.stern.nyu.edu/~adamodar/New_Home_Page/lectures/approach.html and https://pages.stern.nyu.edu/~adamodar/New_Home_Page/definitions.html | Only independent fictional models; no spreadsheet or lecture reproduction |
| Mutual fund and ETF fee disclosures | https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/mutual-fund-and-etf-fees-and-expenses-investor-bulletin | Separate approximate expense math from actual fund NAV accrual |
| CPI percent changes | https://www.bls.gov/cpi/factsheets/calculating-percent-changes.htm | Declared matched series, base, interval and vintage; fictional values |
| FRED data versions | https://fred.stlouisfed.org/help/data/understanding-the-data/how-does-fred-update-its-database | Historical availability and data-series rights require separate verification |
| Long straddle and bull call debit spread | https://www.optionseducation.org/strategies/all-strategies/long-straddle and https://www.optionseducation.org/strategies/all-strategies/bull-call-spread-debit-call-spread | Fictional original arithmetic only; no proprietary options diagrams |
| EMV and Fisher | https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/ease-of-movement-emv and https://www.quantconnect.com/docs/v2/writing-algorithms/indicators/supported-indicators/fisher-transform | Explicit vendor scale, normalization and warmup differences; no code copied |
| Choppiness | https://www.quantconnect.com/docs/v2/writing-algorithms/indicators/supported-indicators/choppiness-index | Source-only original educational computation and no new chart overlay |

## Acceptance boundaries

- **Implementation:** 100 of 600 original supplemental Foundation explanations source-authored, including Batch 05 twenty. 14 Batch 05 pure financial/math lesson topics exist, each with two fictional teaching cases.
- **Numerical indicators:** Eight of twelve supplemental indicator briefs now have dedicated source-only numerical teaching *examples*, not eight approved Chart Studio overlays or eight validated live chart indicators.
- **Editorial:** Source link and internal test validation do not constitute sign-off by an independent financial subject-matter reviewer. The current 600-target item acceptance ledger remains 0 accepted until each row is individually reviewed.
- **QA:** Exact-source build and matching production SHA, push-triggered GitHub Actions, signed-in member behavior, WCAG/screen-reader and account permissions require separate evidence.
- **Costs:** No new database, subscription, live paid AI request, order-routing infrastructure, licensed exchange data, or cloud Python server is authorized by this source framework.

## Revision history

| Version | Date | Author / decision maker | Change | Status |
|---|---|---|---|---|
| 1.0 | 2026-11-01 | Acting project-owner/editorial architecture | Adopt uploaded nine-level research directory with independent fact, math and rights gates for Talia Tutor | Framework approved for development; individual publication acceptance pending |
