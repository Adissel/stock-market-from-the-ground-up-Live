# Talia Tutor — Research Source, Formula Verification and Publication Gate

| Document control | Value |
|---|---|
| Company | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | The Stock Market: From the Ground Up — Talia Market Tutor |
| Document ID | SMFGU-TALIA-RESEARCH-SOURCE-GATE-001 |
| Filename | `docs/learning/SMFGU-TALIA-RESEARCH-SOURCE-GATE-001-v1-20261101.md` |
| File type | Markdown |
| Version / date | 1.2 / 2026-11-01 |
| Status | Owner source directory (5) reconciled; 260/600 Foundation drafts and 73/73 upgraded guides inventoried; individual publication and authenticated acceptance still open |
| Google Drive location | Not created; GitHub `main` is controlling |
| Google Drive document ID | Unassigned |
| Dependencies | `AGENTS.md`; `SMFGU-TALIA-FOUNDATION-600-COVERAGE-001`; five `data/talia-foundation-explanations-batch0*-v1.json` assets; `scripts/talia-indicator-editorial-review-v1.mjs` |
| Purpose | Prevent unverified financial claims, look-ahead, unsupported licensing assumptions, inappropriate grading, and false published-lesson acceptance |

## Controlling source supplied by Owner

`Master Research Source Directory(5).odt` (20-page current user upload, 2026-11-01) is the latest provided source-selection reference; prior `(3).odt` is superseded for intake reconciliation, not for overriding separately approved curriculum, membership or security controls. The Owner states that its listed references are approved. **Interpret that as authorization to consult those references, not independent confirmation of every individual formula, current legal status, license, market-data right or published teaching record.**

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

## Version 1.1 — Current Owner Upload (5), Tutor-Only Intake Reconciliation

**Source:** `Master Research Source Directory(5).odt`, 20 pages, current owner upload reviewed on 2026-11-01.

**Actual link inventory from ODT package:** 98 embedded HTTP hyperlinks, 92 distinct canonical URLs after removing only `utm_*` tracking parameters, from 60 hostname labels. Every embedded URL contains `utm_source` tracking; strip tracking parameters when storing canonical source identity while retaining precise substantive URL path and query identifiers, source version and access date. These are *links discovered*, not 92 independently verified current claims or publication grants.

**Existing source infrastructure — preserve:** `docs/research/master/master-source-registry-v1.json` already holds 73 explicitly labeled research-source candidates in nine levels; individual source candidates are not necessarily one-for-one with exact embedded pages. Do not infer that 25 links are missing, add duplicates automatically, or replace the accepted master ID structure. Reconcile by canonical source domain + exact source page + subject/claim + use rather than raw link count.

### Tutor-specific research intake priorities

| Tutor edition | Primary directory levels | Distinct deliverable and acceptance |
|---|---|---|
| Basic / Foundation | 1, 2, selective 3, 9 | First-principles original definitions; 600 Foundation explanation authoring target; 73 indicator teaching guides; independently computed fictional numerical examples; 30 canonical competencies; no-lookahead and source-grounded charts |
| Advanced | 2, 3, 4, 5 (introductory prerequisites only), 6, 7 | Entitled adaptive prerequisites, misconceptions, market structure, statements and statistical interpretation; never expose detailed options payoffs to unprepared beginners merely because an unpublished source draft is tagged Foundation |
| Professional | 2, 3, 7, 8, 9 | Server-bounded completed-candle replay explanations, accurate trade vs quote and observed vs simulated data labels, multi-indicator ECharts teaching and statistical transfer cases |
| Enterprise | 4, 5, 6, 7, 8, 9 | Governed multi-source evidence synthesis and original quantitative research workflows; no implied rights to ingest a provider's protected data |

### Critical mathematical instructional controls from latest uploaded directory

1. Distinguish **exact individual trade-print VWAP** from explicitly approximate bar-based HLC3-volume VWAP, which depends on bar sampling and reset conventions.
2. Declare EMA period, smoothing factor, **initial seed method**, prior completed-bar warmup and first valid index; do not claim SMA-seeded examples exactly match a vendor's first-close seed.
3. Use the exact unit and data frequency for Sharpe, expectancy, risks, returns and position sizing. A fictional calculation does not validate trading profitability.
4. For Tape/microstructure tutoring, keep **trades**, **displayed quotes**, **depth**, **NBBO** and **order execution quality** as distinct observable streams. SEC Rule 605 is not a universal reference for Time & Sales color conventions, short borrowing or inferred buyer intent.
5. Reveal only completed bars at a real exercise decision boundary; no future candle, opening-time-only timestamp, historical correction or previously undisclosed value may be injected into Talia's evidence.
6. Use original fictional ECharts/React/TypeScript charts with accessible tabular text. Python is appropriate for **offline independent numerical verification**, not a new Cloudflare Python server. Preserve existing JavaScript Workers, Supabase authorization and protected learning records.
7. The **Level 8 member data BYO** suggestion applies to separately authorized personal *market-data* connections. It does **not** overturn the latest controlling owner decision in `SMFGU-TALIA-MEMBER-ACCESS-001`: Talia is **membership-only and needs no member-provided AI API key**.

### Current Tutor-specific evidence, not full-website progress

| Item | Verified existing source position | Acceptance boundary |
|---|---|---|
| Foundation supplemental explanation drafts | 260 / 600 = **43.33%** authored in source | 0/600 independently publication-accepted |
| Indicator teaching guides upgraded | 73 / 73 = **100.0%** authoring/upgrading | 0/73 fully independently publication-accepted; not 73 coded Chart Studio overlays |
| Claim-scope triage for 101–240 | 140/140 individually registered = **100% triage inventory** | Precise primary/secondary claim corroboration and final editorial release still open |
| Python/JS first-15 indicator study crosschecks | 20 study implementations inventoried in Batch 016 | Fictional-fixture agreement does not imply all periods/conventions accepted; exact current pipeline needed |
| Source registry | 73 research candidate entries | 98 uploaded reference links are not separately verified or formally cleared for every use |
| Premium Tutor editions | Basic baseline present; Advanced/Professional/Enterprise source prototypes present | No premium edition independently released; no defensible per-edition engineering percentage yet |

### Immediate Tutor execution order

1. Reconcile every uploaded reference page to the **existing** master source candidates; prioritize 92 distinct paths by Tutor subject and real claim support rather than creating a second database.
2. Verify exact current main-branch Tutor CI, membership-only privacy regressions and matching Cloudflare SHA; correct actual failures before claiming accepted deployment.
3. Finish independent first-15 indicator math and first-valid-warmup checks; increase coverage in bounded 15-study batches while preserving all 73 authored guides.
4. Complete item-level exact-primary-source claims, misconception/error corrections and scope decisions for 101–240, especially the 34 remaining directly unexamined primary claim URLs called out in Batch 016.
5. Confirm source-grounded responses and ECharts/candle evidence with real authenticated Basic members; require denial for anonymous, suspended and showcase accounts; no external AI key requirement.
6. Continue authoring the next 20 original Foundation explanations only after preserving existing review results and appropriate Beginner-vs-Advanced topic placement.
7. Move Advanced, Professional and Enterprise source prototypes toward authenticated feature acceptance in that order; keep unreleased entitlements disabled.
8. Record item-specific mathematical, editorial, provenance and accessibility acceptance rather than treating an entire directory or candidate registry as blanket publication approval.

**Rights scope:** Original facts, financial principles, original paraphrases, standard formulas and fictional examples are not subject to a blanket commercial licensing requirement. Apply precise third-party permissions only to reproducing protected text/artwork, proprietary code, provider data or services where relevant. This is not a claim of attorney approval.

**Revision control:** This v1.1 addendum updates only Talia Tutor source intake and validation scope. It must not change any Shared Learning/Shared Lab Engine, website commerce, member entitlements, market-data BYO architecture or paid inference flags.

## Revision history

| Version | Date | Author / decision maker | Change | Status |
|---|---|---|---|---|
| 1.0 | 2026-11-01 | Acting project-owner/editorial architecture | Adopt uploaded nine-level research directory with independent fact, math and rights gates for Talia Tutor | Framework approved for development; individual publication acceptance pending |
| 1.1 | 2026-11-01 | Tutor research-intake reconciliation | Reviewed current `(5).odt`: 98 hyperlinks / 92 canonical URLs, mapped to existing 73-candidate registry; preserved membership-only policy and 240/600, 73/73 source baselines | Source intake approved; individual claims and real-member release remain open |


## Tutor intake addendum v1.2

Upload (5): 92 distinct URLs reconciled against the 73-source master using 32 exact matches, 55 provider candidates, and 5 unmapped providers. Six Foundation 101–140 sources reviewed and qualified. Batch13 added 20 original fictional lessons, bringing authored coverage to 260/600 (43.33%), with 0/600 individually accepted. Python/JavaScript fictional-study crosschecks now cover 20/73 (27.40%) with no independent edition release claim. Existing membership-only policy and no-member-AI-key direction remain controlling. Full current CI and live member acceptance remain open.
