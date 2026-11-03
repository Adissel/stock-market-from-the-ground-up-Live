# Crownlight Scanner Presets v2 — GitHub-wide source audit and picture-only Source policy

| Document control field | Value |
| --- | --- |
| Project | THE STOCK MARKET: FROM THE GROUND UP |
| Document ID | SMFGU-SCANNER-PRESET-LIBRARY-20261103 |
| Filename | docs/research/scanner/2026-11-03_SCANNER_PRESETS_SOURCE_AUDIT_V2.md |
| File type | Markdown |
| Version | 2.0 — development candidate |
| Date | November 3, 2026 |
| Status | SOURCE-ONLY DEVELOPMENT PR / CI, authenticated QA and production release pending |
| GitHub | Adissel/stock-market-from-the-ground-up-Live |
| Google Drive location | Not created |
| Google Drive document ID | Not assigned |
| Dependencies | Original Crownlight scanner rules v1, five existing templates, authenticated SCANNER_BUILDER, original private saved rules and snapshot provenance policy |
| Purpose | Provide source-traceable educational scanner presets while preserving market-data, legal, security and account release boundaries |

## Research and inventory completed
A complete recursive filename inventory was taken of the available GitHub main tree. The latest inventory identifies more than 4,300 tracked source files, 189 image assets across the repository and 192 filename-matched scanner/market/strategy candidates. This is an all-file PATH inventory, not a claim that every unrelated file was read line by line. Relevant source content reviewed includes the scanner rule engine, its five legacy templates, results editor, Phase 8 feature crosswalk, the 50 source-described strategy studies, 22 watchlist guides, Scanners10 curriculum calculations, SEC catalyst constraints and existing first-party indicator math.

The previous GitHub scanner research catalog lists 98 screenshot records, 83 byte-distinct and 15 exact duplicates. These are catalog metadata, NOT actual pictures inspected in this work. No GitHub folder named Source or Sources appeared in the recursively enumerated tree; the only attached Project source is the Master Research Source Directory document. Exactly ZERO pictures from an accessible Source folder were reviewed. Therefore the preset library does not reconstruct visual setups from screenshots, and no unrelated cover art, site illustrations or icons were used instead. When Source folder pictures become accessible, inspect only its actual image files, deduplicate them, record rights and provenance, and then consider independent picture-based research additions.

Machine-readable inventory: data/crownlight-scanner-presets-source-audit-v2.json.

## First usable source-only preset batch

The original five presets remain unchanged in assets/js/crownlight-scanner-templates-v1.js. The new additive file assets/js/crownlight-scanner-presets-v2.js validates 43 new research recipes against the existing original tri-state CrownlightScannerRulesV1 evaluator. The authenticated scanner displays 48 total selections through one category and search picker.

| Family | New recipes | Research basis |
| --- | ---: | --- |
| Foundations | 7 | Price bands, prior-close comparison, supplied high |
| Momentum | 10 | Daily, five-minute and two-session supplied change observations |
| Participation | 6 | Provided shares, RVOL, trade counts and price-times-volume proxy |
| Liquidity | 8 | Provided float, spread, market capitalization and gap |
| VWAP and levels | 5 | Provided VWAP side/proximity and proximity to supplied high |
| Combined | 7 | Original nested AND, OR and NOT criteria using supplied fields |
| Total additional | 43 | Original teaching rules, not profitable strategies |
| Legacy preserved | 5 | Five existing scanner templates, unchanged IDs and rules |
| Total selectable | 48 | Current source-only scanner research library |

These recipes use only fields accepted by the existing scanner's member-supplied CSV and current rule evaluator. A preset describes criteria, not an entry/exit strategy or market prediction. Each shows a required field list and code-source location and can be edited before running. Search works on name, source field, description and category. Existing authenticated rules-save, reload and JSON import/export remain the only storage mechanisms. No market observations, secrets or third-party feeds are added to private records.

Important limitations: RVOL may lack same-time reference; supplied VWAP may not reflect individual trades; price times reported volume does NOT prove actual traded dollar volume; float, gap and market cap may be stale or unadjusted. Missing fields fail closed as UNKNOWN rather than being guessed. Quotes, timestamps, corporate actions, listed universe and data rights require independent source checks.

## Fifty named strategy sources kept separate from selectable presets
The repository's data/tutor-strategy-study-v1.json describes 50 named educational workflows, including Red Candle Theory, Dip and Rip, opening-range and high breaks, 21 EMA pullback, VWAP bounce, reversal setups, scanner themes, options and vendor study titles. Their names alone do not supply rigorous before-the-fact OHLC state transitions, detection time, entry predicates or independently checked source rights. All 50 remain research-only in data/crownlight-scanner-preset-strategy-holds-v2.json. No closed-source vendor strategy is recreated, promoted or assigned a probability score.

Further gates for screenshot-specific patterns, MACD/RSI/EMA sequence scans, anchored VWAP, issuer filing timing, Level II, time-of-day RVOL, intraday breakout confirmation, and exchange-verified two-day history are separate. Wave 5 is an independent unfinished PR and its pending fields are not automatically activated by this preset release.

## QA and compliance hold
The dedicated workflow checks all 48 rule definitions, 43 new IDs, five legacy IDs, lookup/search, field source paths, missing evidence, nested NOT/OR logic, read-only UI code and original scanner contracts. It then runs the unchanged static Pages build with private data and test exclusions. A clean source build does not satisfy real authenticated two-account isolation, screen-reader/mobile acceptance, live market rights or exact-SHA production deployment signoff.

The feature does NOT alter Founder access, basic member entitlements, the proposed paid tier prices, Stripe, Supabase RLS, Champion Phase 8 configuration, protected Academy assessments, purchase Lumens, market-data source redistribution or regulated advice disclosures. No independent profitable trading edge is claimed.

## What is next, in execution order
1. Verify new preset unit/source CI, existing scanner tests, Pages build and sitewide matrix on the exact PR head; correct failures.
2. Merge only after required PR gates pass.
3. Verify exact merged main commit plus Cloudflare deployment and the genuine two-account authenticated scanner membership, save/restore and accessibility flows.
4. Inspect actual Source-folder picture files ONLY when they become accessible, with provenance and duplicate controls; do not infer a trigger from metadata alone.
5. Independently specify bar-sequence scanners and data-rights gates before deciding whether any of the 50 strategy studies can become a new executable educational preset.

## Revision history
| Version | Date | Changes |
| --- | --- | --- |
| 2.0 | 2026-11-03 | GitHub source inventory, source-folder image limitation, 43 additive source-only rules, search/category controls, 50 research holds and CI contract |

Footer: Crownlight Scanner v2 research development. Not a verified live data service, validated strategy, professional financial recommendation, licensing opinion or LIVE release signoff.
