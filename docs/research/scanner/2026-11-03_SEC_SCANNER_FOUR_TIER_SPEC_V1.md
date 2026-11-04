# Crownlight SEC Filing Scanner & Research — Four-Tier V1 Source Development

| Document control | Value |
| --- | --- |
| Project | THE STOCK MARKET: FROM THE GROUND UP |
| Document ID | SMFGU-SEC-SCANNER-TIERS-001 |
| Filename | docs/research/scanner/2026-11-03_SEC_SCANNER_FOUR_TIER_SPEC_V1.md |
| File type | Markdown (.md) |
| Version | 1.0 |
| Date | November 3, 2026 |
| Status | Development candidate; member-tier release NOT approved |
| GitHub | Adissel/stock-market-from-the-ground-up-Live |
| Google Drive location | Not created |
| Google Drive document ID | Not assigned |
| Dependencies | Existing issuer-only SEC EDGAR endpoint, SEC normalizer, 24/72 hour evidence evaluator, Watchlist Workbench entitlement, global SEC budget, ECharts, approved Crownlight membership controls |
| Purpose | Specify and technically verify independently tiered SEC research without misclassifying stock-scanner presets or prematurely activating subscriptions |

## Owner classification and approved architectural constraints
The screenshot-associated presets discussed by the owner are STOCK scanner presets, not SEC filing presets. The SEC Filing Scanner is a distinct product/workstream. It currently reads official SEC records for a **single uniquely verified ticker/CIK**, only after the existing authenticated WATCHLIST_WORKBENCH tool entitlement passes. This does NOT establish an all-market continuously monitored filing feed. Do not reuse stock rule definitions, Champion signatures or Phase 8 strategy models to construct SEC-specific conditions.

## Proposed SEC scanner tiers — capabilities, not activated member entitlements

| SEC tier | Functional scope | Source state | Release state |
| --- | --- | --- | --- |
| **Basic** | Verified ticker → CIK and company identity; recent official 8-K/10-Q/10-K and other allowlisted filing links; filing date and exact time when supplied; accessible issuer history | Existing protected SEC issuer backend and Watchlist | Dedicated Basic grant and Free access not yet approved |
| **Plus** | Basic plus original retrospective 24h/72h filing acceptance windows, form-specific review, chronological evidence and explicit missing/future filing exclusions | Read-only evaluator exists; form selector added in this development branch | Dedicated Plus authorization, browser QA and CI pending |
| **Advanced** | Plus plus seven supported reported SEC XBRL metrics, reporting-period context, original ECharts plots with accessible numerical table | Existing SEC companyfacts normalization and protected Watchlist UI | Controlled Advanced grant, comparable period/restatement review and QA pending |
| **Professional** | Proposed multi-issuer comparative research, original source-linked reports and governed optional monitoring | Not implemented: no licensed/live all-market feed or multi-issuer scan service | On hold pending source, architecture, resource budgets, rights and member entitlement decisions |

The current **WATCHLIST_WORKBENCH** entitlement protects the working endpoint. There is no dedicated SEC tier grant on the server. Front-end display, query parameters or membership labels must never be trusted as proof of tier rights. Accordingly, the current source capabilities are NOT equivalent to separate Basic/Plus/Advanced/Professional member offerings. No prices, Stripe products, Free access, Founder benefits, account roles, or LIVE subscriptions are changed here.

## Functional improvement in this wave
The existing read-only SEC brief now offers one **filing form** selector alongside its 24-hour/72-hour selector. It filters an already-authorized issuer response, without making a second SEC request. Selection uses the original SEC form allowlist and preserves UTC acceptance-time rules, exact issuer/CIK provenance, missing time exclusions and source-archive link checks.

Default "All common forms" retains the existing 8-K, 8-K/A, 10-Q, 10-K behavior. Additional individual form choices include registration, amendments, ownership and proxy records. The selector is educational evidence filtering; it does not convert filing acceptance into first public dissemination time or an investment recommendation.

## Source engineering scorecard
The versioned machine-readable source scorecard is in `data/crownlight-sec-scanner-tiers-v1.json`. There are eight named milestones per SEC tier. A milestone marked source-present means a related implementation exists in the repository; it is NOT proof of passing the new CI, authenticated release, or entitlement acceptance. Source engineering coverage: Basic 4/8, Plus 2/8, Advanced 2/8, Professional 0/8, total 8/32 (25%). **Release acceptance remains 0%** for SEC tier products.

## SEC primary source and fair-use access
- https://www.sec.gov/search-filings/edgar-application-programming-interfaces — official submissions and XBRL companyfacts APIs; no API key for these public interfaces.
- https://www.sec.gov/about/webmaster-frequently-asked-questions — currently published 10 requests/sec fair-access maximum, declared User-Agent and uncertain dissemination delays.
- https://www.sec.gov/search-filings — official filing search and latest-filing tools.

Preserve the existing database-backed global SEC request budget and source identity checks. Company-reported metrics are not estimates and cannot be compared across incompatible duration, taxonomy, accounting periods or revisions without separately accepted methodology. No historical backtest may infer decision-time public availability from EDGAR acceptance alone.

## Gates in next execution order
1. Complete source CI and existing SEC issuer, budget, scanner and builder regressions on the PR head.
2. Implement server-side, audited SEC tier assignments using existing membership entitlements, with secure plan/role mapping; do not grant higher tiers through UI state.
3. Extend the backend to apply tier-specific response permissions while preserving already contracted Watchlist access and Founder beta rights.
4. Verify two genuine authenticated members: access/denial, 24h/72h, forms, XBRL, account changes, audit and quotas.
5. Pass keyboard, screen-reader and mobile browser checks; confirm proper labeling and table fallback.
6. Verify Cloudflare deployment at the exact merged main SHA, the SEC global budget and source audit.
7. Keep multi-issuer Professional scanning and continuous alerts disabled until performance, data rights, SEC fair access and security reviews succeed.
8. Approve separately any billing changes, Free tier expansion, pricing, and paid plan grant lifecycle.

## Revision history
| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-03 | Separate SEC versus stock presets; define SEC four-tier source matrix and 32 technical gates; add single-issuer filing form filtering and source tests |

**Footer:** Crownlight SEC research, source-development candidate only. No attorney opinion, investment advice, verified market timing, trading signal, paid-tier launch or LIVE signoff.
