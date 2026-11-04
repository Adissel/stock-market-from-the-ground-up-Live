# Crownlight Scanner V6 — Sparse Preset Input and Evidence Coverage

| Control | Record |
| --- | --- |
| Project | THE STOCK MARKET: FROM THE GROUND UP |
| Document ID | SMFGU-SCANNER-V6-GAP-20261104 |
| Filename | docs/research/scanner/2026-11-04_SCANNER_V6_SPARSE_PRESET_EVIDENCE.md |
| File type | Markdown |
| Version | 1.0 |
| Date | 2026-11-04 |
| Status | Source implementation; CI and independent release QA pending |
| GitHub | Adissel/stock-market-from-the-ground-up-Live |
| Google Drive location | Not created |
| Google Drive document ID | Not assigned |
| Dependencies | Original GroundUpScannerV014145.csv, CrownlightScannerRulesV1, 48 Crownlight Presets V2, SCANNER_BUILDER server entitlement and existing private workspace |
| Purpose | Make the original 48 scanner preset recipes usable on legitimately sparse member-supplied CSV without weakening the legacy Market Discovery screen |

## Source-verified defect and correction

The prior scanner importer always required symbol, price, change_pct, volume, rvol, float and spread_pct. The original visual scanner similarly invalidated a row when any of the seven fields was absent, even when an individual preset evaluated only price and shares. This contradicted the documented tri-state UNKNOWN distinction between unavailable supplemental evidence and invalid records.

V6 adds a narrowly scoped import mode: only SCANNER_BUILDER may opt into CSV columns **symbol, price, volume** with all other numerical research fields optional. The existing Market Discovery Lab retains its original seven-field validation, defaults and displayed filters. Shared source engine and member-record storage remain unchanged except for the opt-in parser and rule evaluation mode.

An omitted optional metric does not become 0; it remains UNKNOWN when needed by a predicate. A supplied but malformed numeric field invalidates that row. Mandatory symbol/price/volume and the 2 MB / 2,000-row bounds remain enforced. Nested AND, OR and NOT retain original three-valued logic.

## Practical education and UI

Show a read-only field-coverage table for the currently selected rules, including derived-field dependencies such as price × volume and proximity to supplied VWAP. The table counts populated/valid/absent records but does not independently verify market data, provenance, source licenses, observation time, exchange session, or completeness. It does not auto-download, save uploaded snapshots, or promise a trade signal. Existing member-private rule saving, loading and import/export stay under the original authenticated API.

## Regression coverage

Test minimal three-column imports, unchanged strict seven-column legacy parser, invalid mode rejection, missing-optional UNKNOWN and NOT semantics, OR with unavailable evidence, invalid supplied numbers, 48 preset compatibility, field dependency expansion, original scanner results and integration tests, syntax and static Pages build. These are technical source gates only, not independent browser acceptance.

## Holds and release order

Retain scorecard 7/32 (21.875%) until a named milestone is independently accepted. Live paid tier release remains 0%. Protected Founder plans, SEC Scanner, 98 Champion configurations, Talia answer keys, Lumens, Stripe and third-party redistribution rights are unchanged. Next: green dedicated CI, green sitewide CI, merge exact SHA, authenticated two-account and keyboard QA, verify deployed Cloudflare SHA.

## Revision history

| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-04 | Opt-in source-only sparse input, existing rule compatibility, evidence counts and release contract |

Footer: Technical implementation is not a licensed market-data feed, legal opinion, verified investment signal or completed LIVE launch.

## Existing sitewide CI drift repair — November 4
The source-acceptance workflow expected old homepage Member Status cache-version strings and the old visible LIVE DATA badge. Current main already loads `home-community.js?v=20261104-verified-live1` and `home-member-stats.css?v=20261104-live-compact1`, displays the compact LIVE label and retains a full accessible LIVE DATA source description. The updated test checks the exact implemented versions and accessible provenance, EXAMPLE and UNAVAILABLE handling; no member counts or homepage functionality are modified. This cross-workstream CI repair does not receive scanner milestone credit.
