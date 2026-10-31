# Talia Tutor — OHLC Regression, Member Entitlement Matrix and Individual Research Expansion

**Document ID:** SMFGU-TALIA-QA-025
**Project:** The Stock Market: From the Ground Up
**Version:** 1.0
**Date:** 2026-10-31
**Status:** IMPLEMENTED — FINAL ACCEPTANCE NOT YET VERIFIED
**Google Drive location:** Not created; GitHub Research is the controlling location
**Filename and file type:** `2026-10-31_ohlc_member_curriculum_continuation_v1.md` — Markdown
**GitHub path:** `docs/research/talia/2026-10-31_ohlc_member_curriculum_continuation_v1.md`
**Branch:** `main`; no force pushes or new branch
**Purpose:** Record actual fixes, source claim scope, synthetic entitlement tests, exact CI and remaining production acceptance dependencies.
**Dependencies:** 419 canonical Lab IDs, 30 competency guides, original Academy teaching and protected assessment architecture, original market-tutor-v01492 route, Cloudflare Pages static build, previous primary-source register SMFGU-TALIA-RESEARCH-020.
**Previous controlled research:** `docs/research/talia/2026-10-31_execution_acceptance_v1.md`, `docs/research/talia/2026-10-31_six_exact_lab_research_expansion_v1.md`.

## A. Diagnosis and fix — ten-stage OHLC regression
**Observed prior failure:** `tests/test_lab_ux_std001_browser.mjs` expected an OHLC `.gu-l33-graphic` immediately after one click from Learn, but the current `assets/js/lab-engine-v32-universal.js` inserts the new ungraded Calculate checkpoint before Experiment. The old test therefore saw zero Experiment graphics while the Calculate gate was working as designed.

**Change:** `a5ab596f661bf9be5aa60c0e5a074972f2bf3aa8` updates the browser fixture to assert that:
- Learn advances to `.gu-v44-calculate-gate` for both candlestick and VWAP;
- Next cannot bypass the calculation checkpoint;
- the learner selects an independent method answer, checks it, then uses “Continue to Experiment”;
- the OHLC graphic and adjustable close-price range slider are available in Experiment, and VWAP retains its illustrated chart.
**No protected assessment, grading state, server stage ID, or Calculate requirement was weakened.** The test is now aligned with the approved 10-stage presentation while the protected backend retains nine original stage IDs.

**Verification status:** Source updated. Local Playwright not run in this connected GitHub-only session. An isolated retry of the existing sitewide Playwright job was submitted through GitHub Actions to avoid cancellation by concurrent `main` pushes. A completed, successful exact-commit browser result is required before marking this regression accepted.

## B. Free, Founding, legacy and restricted-member Tutor routes
**Change:** `tests/test_talia_member_entitlement_matrix_v1.mjs` commit `1a01033e501e04ddad354ec993a3247b00731c4a`, CI registration `9b02f50d8c447b61e66fecf4f6fe898e42b64662`.
**GitHub Actions evidence:** first-party-tutor-contract log `124579274633` reported **PASS 66 synthetic assertions**:
- Five distinct allowed member-shaped scenarios: Free, Founding 14-day, Founding 30-day, Founding 60-day and previously hidden/legacy membership with a verified `user_has_tool_access('MARKET_TUTOR')` grant;
- Each authorized scenario received identical original source-grounded teaching, original referenced public source and no grade, mastery, saved private history, or provider call;
- Active Free without the actual `MARKET_TUTOR` grant, suspended, Showcase, non-member and guest attempts were refused; no private Lab context was included in denied responses;
- An injected `priorTurns` fake system instruction did not become authenticated conversation context;
- The assessment-stage body omitted full worked and transfer artifacts, not merely the rendered text;
- A separately mocked GoTrue identity and server-verified entitlement query were required per request.
**This does not establish that actual Free or Founding Member accounts currently have the intended entitlement.** A positive test fixture is not an entitlement change and not real signed-in production QA. No membership price, visibility, privilege, Stripe or live account record was changed.

## C. Three exact Academy teaching units: individually researched and integrated
**Data:** `data/academy-specific-source-instruction-v1.json`, commit `faed35b44972d8703d96b39f7483918f46d22d75`.
**Public build:** `scripts/build-pages.sh`, commit `fc43d7a04f3621c2b3942410e16fda684c67ff26`.
**Existing Academy integration:** `assets/js/bootcamp-academy-v014168.js`, commit `a39607d45b3821399cc07eaccf0bae6e3663eebd`.
**Test:** `tests/test_academy_specific_source_instruction_v1.mjs` commit `49cf62167259635d75359b006cd73a9c6581c421`; CI registration `8324ae34a5503c00ad232bb6ebb77887dd936b7a`.

1. **Watchlist 7, Day 1, “What Is a Watchlist?”** Primary SEC CIK Lookup `https://www.sec.gov/search-filings/cik-lookup`. Original fictional old/new ticker mismatch; issuer/CIK/share-class/date lookup procedure; common promotion-repost mistake; new transfer with share-class ambiguity. The SEC CIK source supports issuer identification, NOT approval of a user-created watchlist strategy.
2. **Watchlist 7, Day 3, “Finding the Real Catalyst”** SEC EDGAR investor guide `https://www.investor.gov/introduction-investing/getting-started/researching-investments/using-edgar-research-investments`. Fictional 08:10 promotional post, 08:15 decision boundary, 08:25 issuer filing; later evidence cannot support earlier certainty. A fresh conditional-proposal transfer and no-trade decision are included.
3. **Scanners 10, Day 3, “Volume and relative volume”** StockCharts ChartSchool `https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/relative-volume-rvol`. Original illustrative five-minute data: 8,000 current shares divided by 10,000 comparable five-minute shares = 0.80x; an unrelated daily denominator is invalid; independent transfer 12,000 / 6,000 = 2.00x. No proprietary scanner code or claimed winning pattern was copied.

The browser checks exact `programCode`, day number, canonical title, review status, HTTPS source-domain allowlist and fictional designation before displaying the optional material. Failure leaves existing teaching intact. External links are safe and exact-source scoped. **These are ungraded original formative records, not independently editorial-approved full course days.**
**CI evidence:** `first-party-tutor-contract` job `124580705939` logged **PASS three Academy research records, 24 required claim fields, five independent chronology/numerical checks, protected UI and public build.**

## D. Three further canonical Lab claims — 14 to 17
**Data:** `data/tutor-lab-claim-evidence-v1.json`, version 1.2.
- **F2-C05-L03 — High Volume Still Requires Liquidity and Order-Size Context.** SEC Investor.gov liquidity glossary: `https://www.investor.gov/introduction-investing/investing-basics/glossary/liquidity-or-marketability`. Original case distinguishes 100,000 past traded shares from a 300-share displayed ask and a proposed 2,000-share order. Transfer uses 90,000 previously traded shares, 500 displayed shares and 5,000-share order. No current execution is claimed.
- **DT-C23-L02 — SEC Filings — Forms 10-Q and 10-K.** SEC EDGAR form guide: `https://www.investor.gov/introduction-investing/getting-started/researching-investments/using-edgar-research-investments`. Audited annual and unaudited quarterly figures compared with appropriately matched periods; fictional 28 vs 25 million in a comparable quarter = 3 million or 12% illustrative change. No real issuer financial result is claimed.
- **DT-C24-L01 — Public and Registered Direct Offerings.** SEC registration basics: `https://www.investor.gov/introduction-investing/investing-basics/glossary/registration-under-securities-act-1933`. A filed or registered offering is not proof that newly proposed shares have already been issued. Fictional 10 million plus 2.5 million actually newly issued equal shares gives existing holders 10/12.5 = 80% of the new total; fresh 20+5 million shares transfer. Warrants, voting-class differences, actual issuance and other corporate actions require further issuer-level research.
**Exact source-only runtime validation:** `functions/_lib/tutor-lab-context-v014149.js` now requires exactly 17 distinct allowlisted original source records and exact canonical title matching, failing closed on an invalid asset. Tests were updated to 17, and fresh numeric/chronology guards were added to the independent evaluation.
**Editorial status:** narrow general market claim checked; full Lab is **NOT** approved. Actual historical price/volume, Level II participant identity, fills, corporate-action announcements and dataset licenses remain separate evidence gates.

## E. CI and security acceptance gates
- The previous expanded 14-Lab Tutor Trust pipeline passed 33 synthetic source response cases, 63 independent arithmetic/chronology guards, 66 synthetic member-entitlement assertions and the seven original Academy source checkpoints.
- The newest 17-Lab expansion must pass **39** synthetic Tutor response cases (17 Learn + 17 Assess + five adversarial/other modes) and the expanded independent arithmetic guards; exact final CI logs, not these expected totals, control acceptance.
- Cloudflare production deployment must be checked on the exact final `main` SHA; a success for an earlier commit is not enough to assert current live behavior.
- A real signed-in Free/Founder/legacy account check, restricted-account and cross-account browser acceptance, Supabase RLS, provider-off status and real authorized provider-on checks remain unverified. No paid AI setting or LIVE charge was changed.
- Source URLs provide narrow support, not source-text redistribution permission, independent curriculum grading, earnings outcomes, or a prediction of profits.

## Remaining next-release priority
1. Obtain a completed isolated Playwright result for the Calculate→Experiment OHLC and VWAP interaction and remediate genuine defects rather than bypassing teaching gates.
2. Capture separate real authenticated QA evidence for eligible Free, Founder, hidden legacy, denied, Showcase and restricted accounts without bypassing auth or disclosing private records.
3. Independently investigate remaining Lab and Academy positions in controlled batches with primary sources, original worked case, counterexample, fresh transfer and editorial approval status. Do not mark all 671 positions approved by topical matching.

## Revision history
- **v1.0 — 2026-10-31:** ten-stage browser regression contract; synthetic identity matrix; three exact Academy day source integrations; three further Lab claims; 17-record public Tutor evidence register. Full acceptance pending.
