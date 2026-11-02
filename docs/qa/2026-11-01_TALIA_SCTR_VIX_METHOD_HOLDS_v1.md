# Talia Indicator Methodology Exceptions — SCTR and Official VIX

| Control | Value |
|---|---|
| Document ID | SMFGU-TALIA-INDICATOR-METHOD-EXCEPTIONS-001 |
| Project | THE STOCK MARKET: FROM THE GROUND UP / Talia Market Tutor |
| Filename | `docs/qa/2026-11-01_TALIA_SCTR_VIX_METHOD_HOLDS_v1.md` |
| Type | Markdown |
| Version | 1.0 |
| Date | 2026-11-01 |
| Status | INTERNAL SOURCE RESEARCH; TWO METHOD HOLDS; NOT RELEASE ACCEPTED |
| Branch | main |
| Google Drive | Not created; document ID unassigned |
| Purpose | Prevent educational explanatory methods from being counted as independently reproduced official indicator values |
| Dependencies | AGENTS.md; PROJECT_SITEWIDE_RULES.md; original 73-guide registry; existing numerical QA; authorized reference-market-data and redistribution rights |

## SCTR — HOLD: exact official cross-sectional ranking not independently reproduced
StockCharts identifies SCTR as a rank relative to a defined peer universe using six technical measurements across multiple time horizons. A single instrument's OHLCV is insufficient to prove its official SCTR because ranks require the complete, date-aligned eligible universe, membership history, specific indicator calculations and aggregation/rank conventions. Publishing a made-up 0–99.9 number as StockCharts' SCTR is prohibited. A separate **fictional relative-rank educational example** can use transparent, independently authored scoring if labeled non-SCTR. Even where published weights can be researched, source-level reproducibility alone is not proof of full official cross-sectional ranking. Evidence to close hold: primary-source current methodology and rights assessment; legitimate complete eligible-universe price input and calculation timestamp; exact reference observations and tolerance comparison.
Sources: https://help.stockcharts.com/charts-and-tools/research-tools/stockcharts-technical-rank-sctr-reports ; https://help.stockcharts.com/scanning-and-alerts/scan-writing-resource-center/scanning-case-studies/scanning-for-sctrs

## Official VIX — HOLD: spot index not independently reproduced
Cboe's published method uses option bid/ask midquotes across eligible Friday-expiring SPX series with more than 23 and less than 37 days to expiration, selected strike ranges, forward level and K0, risk-free rates, two expiry-specific variance calculations and interpolation to a constant 30-day horizon. The spot calculation is different from the VIX derivative settlement SOQ. A simple annualized realized-volatility standard deviation from historical closes is **not VIX**. Without correctly timestamped authorized SPX/SPXW option chains including bids/asks, expiry selection, interest rates, strike eligibility and official reference calculation comparisons, exact numerical acceptance cannot be claimed. Cboe's methodology is published, but public availability of a methodology document does not itself grant quote-data redistribution or trademark rights. An educational formula example must carry a different label and not be counted toward official VIX reproduction.
Sources: https://www.cboe.com/tradable_products/vix/faqs ; https://cdn.cboe.com/api/global/us_indices/governance/VIX_Methodology.pdf

## Acceptance boundaries
- SCTR: RESTRICTED METHODOLOGY HOLD; 0 independently reproduced official ranking fixtures accepted in this record.
- Official VIX: REQUIRED INPUT DATA / OFFICIAL RECONSTRUCTION HOLD; 0 independently reproduced official spot index fixtures accepted in this record.
- Neither hold changes the source inventory of 73 research guides or upgrades any unverified 71-fixture baseline to independent cross-language acceptance.
- The official 30 competencies, 419 registered Labs, private answers, premium entitlements, payment configuration and production dataset rights are unchanged.
- No member-facing official result or protected grade may be inferred from this research document.

## Revision history
| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-01 | Initial primary-source methodology distinction, data prerequisites and unclosed release holds. |
