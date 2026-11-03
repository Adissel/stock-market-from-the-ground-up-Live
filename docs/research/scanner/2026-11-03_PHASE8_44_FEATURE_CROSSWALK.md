# Phase 8 feature-level crosswalk and tier engineering gates

Project: THE STOCK MARKET: FROM THE GROUND UP
Document ID: SMFGU-SCANNER-PHASE8-CROSSWALK-001
Version: 1.0
Status: RESEARCH MAP / technical source gate only
Date: 2026-11-03
Filename: docs/research/scanner/2026-11-03_PHASE8_44_FEATURE_CROSSWALK.md
File type: Markdown
GitHub: Adissel/stock-market-from-the-ground-up-Live
Google Drive: Not created
Document ID in Google Drive: Not assigned
Purpose: Identify every controlling Phase 8 feature by ID and name, without publishing private vendor formulas or claiming production-ready market data.
Dependencies: STK-P8-SR-0100-DATA, the controlling Phase 8 research report, v145 scanner, new nested rule engine.

Phase 8 has 44 feature identifiers. Eight have partial correspondence to the existing/new supplied snapshot engine. This is NOT eight independently validated market metrics. In particular, provided RVOL has not been established as same-time RVOL; supplied VWAP is not trade-print VWAP; price times supplied volume is only a proxy; float is source-dated but not independently confirmed. The other source topics require distinct data, definitions, or verification.

Phase 8 features 38 and 39 concern model scoring and cannot be marketed as validated probability or trade quality scores. Feature 40 is experimental. Features 41–44 are outcome/review fields and must not be used as future-information inputs in a contemporaneous live scan.

The machine-readable 44-row map contains Phase 8 owner-controlled IDs, feature names, family, conservative status, and optional scanner-field linkage. It does not reproduce proprietary thresholds, vendor code, or full original manuscripts.

Tier progress is an 8-gate source-engineering count per proposed tier, not evidence of live product release. The Basic, Plus, Advanced and Professional tier price proposals remain $0, $4.99, $9.99 and $19.99 per month respectively; no Stripe LIVE products or membership mapping are changed by this repository patch.

Revision history: v1.0 / 2026-11-03 / initial 44-feature source audit, 32-gate technical scorecard and UI operator remediation.
