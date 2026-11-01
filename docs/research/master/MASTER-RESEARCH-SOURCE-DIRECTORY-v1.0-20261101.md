# Master Research Source Directory — Source Rights and Editorial Evidence V1

| Document control | Value |
| --- | --- |
| Project | THE STOCK MARKET: FROM THE GROUND UP — Learning Academy |
| Company / imprint | Cyber Nexus Publishing / Crown & Lantern Press |
| Document ID | SMFGU-MASTER-RESEARCH-SOURCE-001 |
| Filename | `docs/research/master/MASTER-RESEARCH-SOURCE-DIRECTORY-v1.0-20261101.md` |
| File type | Markdown (.md) |
| Version | 1.0 |
| Created and updated | November 1, 2026 |
| Status | Candidate source registry and source-only CI integration; NOT licensed market-data feed, editorial signoff, or authenticated learning acceptance |
| Authoritative location | GitHub `cybernexuspublishing/stock-market-from-the-ground-up`, `main` |
| Google Drive location | Not created; GitHub is the source of record until owner-controlled synchronization |
| Google Drive document ID | Not assigned |
| New files required | Yes: machine-readable source candidate registry, offline audit and GitHub Actions workflow |
| Purpose | Keep original teaching grounded in identifiable sources without falsely granting rights to copy, ingest, resell, train AI on, or publish third-party materials |
| Dependencies | `AGENTS.md`, `PROJECT_SITEWIDE_RULES.md`, the 419-Lab register, Academy's ten canonical programs, 73 Tutor indicator guides, existing STT research crosswalk, existing Cloudflare/Supabase data and security controls |

## Controlled source organization

The adjacent `master-source-registry-v1.json` contains 71 research candidate records in nine subject tiers. These are research pointers, not 71 individually verified claims, data licenses, editorially approved lessons, or approved commercial integrations.

| Tier | Domain | Sources included | Subject use |
| ---: | --- | ---: | --- |
| 1 | foundations | 8 | Foundations books, five Free Foundations days and introductory lessons |
| 2 | technical | 12 | Mathematical formula, seeded/warm-up studies, ECharts and independent numeric checking |
| 3 | microstructure | 9 | Reading the Tape, Level II, trades versus quotes, venue rules and settlement |
| 4 | fundamentals | 6 | SEC filing/valuation lessons and Fundamentals Academy |
| 5 | derivatives | 7 | Future authorized options/derivatives concepts |
| 6 | macro | 8 | Macroeconomic explanations with license-specific data restrictions |
| 7 | quant | 9 | Python research validation, model risk and backtest controls |
| 8 | market data | 6 | Historical replay feed/data provenance and redistribution gate |
| 9 | engineering | 6 | Existing React/TypeScript, ECharts, Cloudflare Pages and Supabase design |

## Minimum source-validation record for each Lab, Academy day, Tutor explanation or indicator

1. Canonical educational ID, version, owner, source dates and applicable course/Lab.
2. Original plain-language definition, precise distinct concept, current validity and beginner prerequisites.
3. Formula variant, declared inputs, timestamps, exchange/session, price/volume units, denominator and corporate action adjustment.
4. Seeding, warmup, missing-value treatment, rounding, first valid bar and no future/revised values.
5. Independently recomputed fictitious case with intermediate values and known limitations, plus at least one independent reference implementation where practical.
6. Original ECharts or existing licensed chart visualization with accessible alternative, source/time provenance, any synthetic label and no profit guarantees.
7. Correct/incorrect interpretation, common trading mistake, and a genuinely new ungraded transfer exercise.
8. Private assessment/rubric reference kept server-only, separate authenticated grade and source/rights audit.
9. Evidence for precise author and claim, primary regulatory reference for regulatory statements, a source URL/access date and source-version if published.
10. Licensing decision **per proposed action**: research/fact-check, paraphrase, quotation, screenshot, data ingestion, client display, caching, AI processing, external redistribution and member BYO token use.
11. Explicit editorial reviewer decision and source hash; source tag or AI editorial preflight is never independent signoff.

### Verification-critical corrections

- Trade-print VWAP uses the recorded individual trade prices and sizes; HLC3-bar VWAP is a **proxy**, not exact trade-print reconstruction.
- The exponential moving average's smoothing coefficient does not identify its seed convention; early bars can differ between SMA-seeded and first-price-seeded implementations.
- Bars cannot reveal intrabar event ordering or actual counterparty intention. Unrevealed historical replay bars cannot inform an exercise decision.
- Quotation, order-book depth, transaction prints, NBBO and exchange-specific depth are distinct feed types and must never be treated as interchangeable.
- Sharpe ratio, trading expectancy and position sizing require exact units, return frequency, estimation method and risk constraints; no mathematical study alone establishes an investment recommendation.

## Explicit external-source rights boundaries

**StocksToTrade**: Existing `docs/research/stockstotrade` records remain the sole detailed STT research intake. Its terms (reviewed November 1, 2026; https://stockstotrade.com/terms-service-use-agreement/) restrict copying, storing, commercial exploitation and derivative works of protected materials without permission. Use as a research pointer for independently authored educational concepts; do not ingest complete videos, transcripts, proprietary guides or paid course content, and cross-check execution/regulatory claims with official sources.

**FRED**: https://fred.stlouisfed.org/legal/terms/ expressly restricts certain AI and machine-learning uses, third-party commercial redistribution and caching under its full terms. Do not add FRED into a public training database, LLM context or automated ingestion through this register. Obtain specific written clearance and series-level legal review if a commercial integration is later requested.

**SEC EDGAR**: Official data.sec.gov endpoints can support authorized, policy-compliant filings research, but API fair-access, attribution and any specific filing rights must be reviewed. Do not equate public availability with blanket unbounded scraping; use permitted rate limits and provenance.

**Market data**: Alpaca/Tiingo/NYSE/Massive/LOBSTER each require provider-specific review for the exact feed, account, storage, caching, member access and redistribution rights. Synthetic price cases remain the default zero-cost instructional source.

**Code**: TA-Lib, ECharts, React, QuantLib and other software sources have independent versioned license obligations; read actual license files for every deployed dependency instead of treating link access as authorization.

These descriptions are research controls, not licensed legal opinions or an attorney's conclusion.

## Existing systems preserved and gap reconciliation

- The existing STT candidate crosswalk has 419 Lab rows and a legacy 252-position original-Academy+Free mapping. The currently approved Academy has **274 study-day positions across ten Boot Camps** and **five separate Free Foundations days**; the old 252-position STT crosswalk is therefore incomplete for the three newer 27-day beta programs. Do not silently change canonical course IDs or infer 279 direct verified mappings.
- The 73 authored indicator-guide source records are teaching references. **Only 16 studies are currently computed in the existing Chart Studio**; never label 73 guides as implemented chart indicators.
- The four initial methods in the registry (EMA, exact VWAP, bar-proxy VWAP and SMA) remain `REFERENCES_IDENTIFIED_NUMERICAL_ACCEPTANCE_PENDING`. They do not count as independently accepted math or approved lessons.
- Source-only audit `node scripts/master-research-source-audit-v1.mjs` verifies source integrity, rights barriers and canonical counts; it writes `artifacts/master-research-source-audit-v1.json`, which the matching CI workflow archives.
- This control does not create a new Supabase database, public market feed, Talia knowledge store, Python web service, second ECharts engine, new membership, or payment action.

## What is next in execution order

1. Close current main branch CI and inspect actual failing jobs, including the noncharging and Premium responsive QA gates.
2. Run the new nine-tier research-source audit; correct schema or source-reference failures, retaining evidence, **without** granting rights or lesson acceptance.
3. Verify the 419 candidate source-ID mappings against the precise original Lab topics and repair misleading weak candidates, prioritizing the 399 repetitive-content review candidates.
4. Extend the old 252-position STT crosswalk with the three new beta programs and their 27 specific lessons without changing canonical IDs; retain five Free days separately.
5. Independently validate and document the first ten numerical-method cases, starting with EMA, SMA, exact print VWAP, proxy VWAP, RSI, MACD, ATR, Bollinger Bands, expectancy and risk sizing.
6. Replace generic explanations with distinct first-principles evidence cases, original ECharts visuals and fresh transfer questions in existing shared Lab/Academy engines.
7. Validate Free Foundations signed-in instruction, server progress, secure account isolation and Talia correction quality; only then count accepted learner milestones.
8. Complete Chart Studio data-source licensing and no-lookahead tests; do not buy a market feed without an accepted rights case.
9. Verify external competitive learner outcomes through lawful nonpayment/approved account access.
10. Require exact-commit CI and real deployment evidence, permissions, accessible behavior, source hashes, publication rights and independent editorial acceptance.

## Revision and signoff

| Version | Date | Change | Disposition |
| --- | --- | --- | --- |
| 1.0 | 2026-11-01 | Added nine-tier metadata registry, four numerical-method review pilots and a read-only CI rights gate | Owner-approved research architecture; editorial/license/deployment acceptance separate |

**Document footer:** SMFGU-MASTER-RESEARCH-SOURCE-001 · v1.0 · Original learning content and rights controls · No third-party endorsement, educational accreditation or investment recommendation.
