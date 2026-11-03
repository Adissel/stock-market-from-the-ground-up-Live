# Crownlight Scanner — Research reconciliation and first implementation wave

Project: THE STOCK MARKET: FROM THE GROUND UP
Document ID: SMFGU-SCANNER-RECON-20261103
Filename: docs/research/scanner/2026-11-03_SCANNER_WAVE1_RECONCILIATION.md
File type: Markdown (.md)
Version: 1.0
Status: Technical beta, not authenticated acceptance
Date: 2026-11-03
GitHub: Adissel/stock-market-from-the-ground-up-Live
Google Drive location: Not created
Google Drive ID: Not assigned
Purpose: Use locked research without recreating proprietary scanners.
Dependencies: Phase 3–8 research, 419 Labs, 252 Academy/Free slots, v145 research scanner, source registry, current access controls.

## Sources and scope
- 98 owner-supplied scanner screenshots, five batches (83 byte-distinct; 15 exact duplicates).
- Original Phase 8 design STK-P8-SR-0100-DATA: 44 audited features, 50 strategy routes, 9 direct discovery specifications, 16 research-only Challengers, 98 preserved Champion configurations.
- 98 screenshots are NOT the 98 Champion scan files. The original proprietary .stts configuration content has not been independently recovered.
- Master Source Directory: 73 candidate source records; these are not market-data licenses.
- Current GitHub docs/research/stockstotrade: 82 records; older 671-unit mappings are provisional, not editorial acceptance.
- Phase 7: zero statistically validated strategies; no success probability or trading edge may be advertised.

## Canonical controls
1. Scanner discovery does not authorize a trade or change candidate state without separately verified evidence.
2. Preserve Champion configurations and source identifiers; no Challenger production promotions.
3. No proprietary vendor artwork, paid transcripts, .stts scans, copyrighted source full text or licensed market data will enter public asset bundles.
4. Exact signed session time, source rights, exchange coverage and data freshness must be verified before live or historical claims.
5. VWAP supplied in a snapshot is not verified trade-print VWAP. Price × reported volume is a research proxy, not tape turnover.
6. Unknown metrics fail closed under AND, OR and NOT; range boundaries are inclusive.
7. Existing CSV defaults, Watchlists, Talia/Labs, founder rights, pricing, Stripe LIVE and grading are unchanged.

## Wave 1 implemented technical surface
- Independent original numeric condition evaluator with GT/GTE/LT/LTE/EQ/NE, inclusive BETWEEN, nested AND/OR/NOT, and numeric field-to-field comparisons.
- Hard bounds: 40 leaf conditions, four levels of nesting, maximum 2,000 rows, maximum 100 result rows.
- Required existing CSV data fields remain price, change_pct, volume, rvol, float, spread_pct. Optional supplied fields include intraday changes and trades.
- Missing metric is UNKNOWN, never false-by-assumption and never true after NOT.
- Local deterministic sorting and explicit rejection counts.
- The module makes no network requests and claims neither validated data nor statistical edge.

## Proposed commercial levels (not activated)
Basic $0; Plus $4.99/month; Advanced $9.99/month; Professional $19.99/month. Premium sources require license verification and separate acceptance. Existing memberships retain their approved allocations, and founders retain sitewide beta access.

## Acceptance gates
Source registry compatibility; deterministic tests; existing scanner regression; private storage and two-account isolation; accessibility and input import/export; exact commit CI; verified Cloudflare SHA. Green unit tests alone do not constitute production acceptance.

Revision history: v1.0, November 3 2026, initial source reconciliation and v1 rule-engine beta.
