# Crownlight Scanner Wave 5 — historical source research and five-minute indicator batch

| Control | Value |
| --- | --- |
| Project | THE STOCK MARKET: FROM THE GROUND UP |
| Document ID | SMFGU-SCANNER-WAVE5-20261103 |
| Filename | docs/research/scanner/2026-11-03_SCANNER_WAVE5_HISTORY_INDICATORS.md |
| File type | Markdown |
| Version | 1.0 |
| Date | November 3, 2026 |
| Status | Source engineering, CI and authenticated OAT pending |
| GitHub repository | Adissel/stock-market-from-the-ground-up-Live |
| Google Drive location | Not created |
| Google Drive ID | Not assigned |
| Dependencies | Existing v150 OHLCV CSV importer, Chart Studio CrownlightIndicatorMath, v145 scanner math, nested rule engine, SEC and Watchlist security boundaries, protected SCANNER_BUILDER entitlement, ECharts loader |
| Purpose | Add no-lookahead offline research calculations without live feeds or duplicate educational engines |

## Technical delivery
Reuse the already-tested CSV importer, existing indicator calculations and existing entitlement gate. A five-minute candle must be complete at or before the requested timezone-explicit as-of time. Input must be regular-session 5-minute aligned bars in America/New_York, with no silent interpolation.

Five-minute change compares the last two contiguous completed closes. The source-only two-session metric compares the last completed close against the second preceding FULL observed session close, each requiring 78 continuous 5-minute bars for normal full sessions (09:30–15:55 ET). Missing sessions, early exchange closures, unadjusted corporate actions and provider coverage are NOT independently verified; this metric must not be advertised as certified two-trading-day performance.

Reuse SMA-seeded EMA 9, 20 and 200; Wilder RSI 14; Wilder True Range ATR 14 and HLC3 volume-weighted bar VWAP approximation. This HLC3 estimate is deliberately exposed as bar_vwap_proxy, not the already-existing provided vwap field. Zero-volume session VWAP and unprovided RVOL, float and spreads remain unknown. The existing tri-state rule engine exposes UNKNOWN rather than a fabricated match.

The viewer is mounted only within the existing entitled Scanner Builder. It accepts user-supplied authorized CSV with source note and cutoff, supports preceding/next completed bar inspection, original educational predicates and a chart constructed solely from completed visible observations. No market-data API, saved OHLCV archive, Stripe product or new database table is introduced.

## Independent references
- NYSE regular sessions: https://www.nyse.com/trade/hours-calendars
- StockCharts EMA and SMA seed: https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/moving-averages-simple-and-exponential
- StockCharts Wilder RSI: https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/relative-strength-index-rsi
- StockCharts True Range: https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/true-range
- StockCharts HLC3 intraday bar VWAP: https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/volume-weighted-average-price-vwap

These are research and formula references, not licenses for third-party data, code or chart redistribution.

## Acceptance and milestone controls
Run the original scanner/SEC/Watchlist CI, this wave's 50-cutoff no-lookahead tests, explicit malformed/gapped input checks, Python-vs-JavaScript arithmetic, same-origin build and private fixture exclusion. The existing 7/32 scanner scorecard is NOT changed by branch upload. A-03 still requires externally verified historic market data and trading session calendar. A-04 and A-06 require test evidence and independent acceptance before new milestone credit. Genuinely authenticated two-account privacy, screen-reader QA and an exact production Cloudflare SHA remain independent release gates.

No changes to membership prices, billing, Champion configurations, Academy grades, Founder privileges, purchased Lumens or sitewide LIVE authorization.

## Revision history
| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-03 | Research basis, original fixture, historical engine, viewer and cross-language QA |

Footer: Controlled technical research. No verified commercial exchange feed, investment signal, attorney-approved license or production signoff.
