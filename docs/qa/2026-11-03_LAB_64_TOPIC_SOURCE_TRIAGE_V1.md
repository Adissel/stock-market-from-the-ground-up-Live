# Canonical 419 Labs — Source-Triage Batch 001 (64 Records)

| Document control | Value |
|---|---|
| Project | THE STOCK MARKET: FROM THE GROUND UP |
| Document ID | SMFGU-LAB-SOURCE-064-20261103 |
| Repository | `Adissel/stock-market-from-the-ground-up-Live` |
| Google Drive location | Not created; GitHub is source of record |
| Filename | `docs/qa/2026-11-03_LAB_64_TOPIC_SOURCE_TRIAGE_V1.md` |
| File type / version | Markdown / 1.0 |
| Status | Research triage; **not** independent review or published rights acceptance |
| Compiled on | 2026-11-03 |
| Baseline commit | `423253664e73dcefb0544a90f7e52553f47790fd` |
| Dependencies | Original 419-Lab CSV candidate register, owner-approved authoring baseline, 30 competencies, Basic Learning v3.3 and Lab v3.2, premium release holds |
| Purpose | Identify relevant original educational methodology references for 64 canonical Labs without overwriting prior editorial decisions or implying licensing clearance |

## Evidence boundaries

- Exactly **64 distinct existing canonical IDs** (the first 64 rows of the 419-Lab source-candidate CSV) are crosswalked to **12 distinct official or technical reference pages**, grouped into **9 subject families**.
- These URLs have been checked as accessible topic-level reference pages, **not** individually validated for every Lab claim; each Lab still requires a fresh original scenario, factual/quantitative review, its own exact source support, real user acceptance where applicable, and separate rights review.
- The canonical 419-row source CSV currently marks all records as `not_accepted`; this batch deliberately does **not** change those statuses or the owner's separate editorial approval of authored lessons.
- Protect exact trade-print versus HLC3 proxy VWAP, no lookahead, no answer keys, no data redistribution, no entitlement changes, and no graded/Lumens awards.
- **Specific quality flag:** `F2-C10-L01` (1/3/5-minute chart compression) includes an `SEC_FILINGS` competency in the candidate CSV; route for editorial mapping correction, without silently changing frozen competencies.

## 64-Lab source topic crosswalk

| # | Canonical ID | Existing Lab title | Source family | Research pages | Review status |
|---:|---|---|---|---|---|
| 01 | F1-C02-L01 | Basic Historical Replay Setup | foundations_and_risk | CS_CHART + SEC_INVEST | Unreviewed claim |
| 02 | F1-C02-L02 | Independent Historical Replay Setup | foundations_and_risk | CS_CHART + SEC_INVEST | Unreviewed claim |
| 03 | F1-C04-L01 | A Public Company and Its Shares in the Secondary Market | foundations_and_risk | SEC_STOCKS + SEC_INVEST | Unreviewed claim |
| 04 | F1-C06-L01 | Participant Identity and Motive Cannot Be Read Directly From a Chart | foundations_and_risk | SEC_QUOTES + CS_TECH | Unreviewed claim |
| 05 | F1-C07-L01 | Identify a Common Stock | foundations_and_risk | SEC_STOCKS + SEC_INVEST | Unreviewed claim |
| 06 | F1-C07-L02 | ETF Versus Index | foundations_and_risk | SEC_ETPS + SEC_STOCKS | Unreviewed claim |
| 07 | F1-C08-L01 | Share Price Versus Company Size — Mega-Cap Example | foundations_and_risk | SEC_STOCKS + SEC_SIZE | Unreviewed claim |
| 08 | F1-C08-L02 | Market-Cap Classification — Small-Cap Example | foundations_and_risk | SEC_STOCKS + SEC_SIZE | Unreviewed claim |
| 09 | F1-C08-L03 | Very Small Capitalization and Sparse Trading Context | foundations_and_risk | SEC_STOCKS + SEC_SIZE | Unreviewed claim |
| 10 | F1-C09-L01 | Same Stock, Different Account Constraints | foundations_and_risk | SEC_STOCKS + SEC_INVEST | Unreviewed claim |
| 11 | F1-C10-L01 | Long vs. Short Directional Exposure | foundations_and_risk | SEC_ORDERS + SEC_INVEST | Unreviewed claim |
| 12 | F1-C10-L02 | Long vs. Short Directional Exposure | foundations_and_risk | SEC_ORDERS + SEC_INVEST | Unreviewed claim |
| 13 | F1-C12-L01 | One Stock, Three Different Decision Frames | foundations_and_risk | SEC_INVEST + CS_CHART | Unreviewed claim |
| 14 | F1-C13-L01 | Holding Horizon: Day Trade vs. Scalp vs. Swing | foundations_and_risk | SEC_INVEST + CS_CHART | Unreviewed claim |
| 15 | F1-C13-L02 | Style vs. Approach vs. Setup vs. Context | foundations_and_risk | SEC_INVEST + CS_CHART | Unreviewed claim |
| 16 | F2-C01-L01 | Identify premarket, the regular-market open, the regular-market close, and after-hours on one historical trading day | market_sessions | NYSE_SESSIONS + CS_CHART | Unreviewed claim |
| 17 | F2-C02-L01 | Compare the opening environment with a midday window on the same stock | market_sessions | NYSE_SESSIONS + CS_CHART | Unreviewed claim |
| 18 | F2-C02-L02 | Compare a midday window with a later-afternoon window | market_sessions | NYSE_SESSIONS + CS_CHART | Unreviewed claim |
| 19 | F2-C02-L03 | Observe the approach to the regular-market close | market_sessions | NYSE_SESSIONS + CS_CHART | Unreviewed claim |
| 20 | F2-C03-L01 | Regular Close → After-Hours Transition | market_sessions | NYSE_SESSIONS + CS_CHART | Unreviewed claim |
| 21 | F2-C03-L02 | Premarket Information Release and Repricing | market_sessions | NYSE_SESSIONS + CS_CHART | Unreviewed claim |
| 22 | F2-C04-L01 | Bid, Ask, Last, Spread, and Midpoint in a Frequently Updating Quote | quotes_and_volume | SEC_ORDERS + SEC_QUOTES | Unreviewed claim |
| 23 | F2-C04-L02 | Compare Quote Width Without Jumping Ahead to Liquidity Analysis | quotes_and_volume | SEC_ORDERS + SEC_QUOTES | Unreviewed claim |
| 24 | F2-C05-L01 | Raw 5-Minute Volume and Why the Timeframe Must Be Recorded | quotes_and_volume | SEC_QUOTES + SEC_SIZE | Unreviewed claim |
| 25 | F2-C05-L02 | Compare Lower Trading Activity With the Prior Exercise | quotes_and_volume | SEC_QUOTES + SEC_SIZE | Unreviewed claim |
| 26 | F2-C05-L03 | High Volume Still Requires Liquidity and Order-Size Context | quotes_and_volume | SEC_QUOTES + SEC_SIZE | Unreviewed claim |
| 27 | F2-C06-L01 | Axes and Chart Types — Same Historical Window, Different Representation | chart_construction | CS_CHART + CS_CANDLE | Unreviewed claim |
| 28 | F2-C06-L02 | Chart Type Versus Aggregation — Change One Variable at a Time | chart_construction | CS_CHART + CS_CANDLE | Unreviewed claim |
| 29 | F2-C07-L01 | Construct an Up / Bullish Candle | candlestick_ohlc | CS_CANDLE + CS_CHART | Unreviewed claim |
| 30 | F2-C07-L02 | Construct a Down / Bearish Candle | candlestick_ohlc | CS_CANDLE + CS_CHART | Unreviewed claim |
| 31 | F2-C07-L03 | Identify an Exact or Near Doji | candlestick_ohlc | CS_CANDLE + CS_CHART | Unreviewed claim |
| 32 | F2-C08-L01 | Large Up Body, Close Near High | candlestick_ohlc | CS_CANDLE + CS_CHART | Unreviewed claim |
| 33 | F2-C08-L02 | Large Down Body, Close Near Low | candlestick_ohlc | CS_CANDLE + CS_CHART | Unreviewed claim |
| 34 | F2-C08-L03 | Long Lower Wick, Recovery Into the Close | candlestick_ohlc | CS_CANDLE + CS_CHART | Unreviewed claim |
| 35 | F2-C08-L04 | Long Upper Wick, Close Back Near the Lower Area | candlestick_ohlc | CS_CANDLE + CS_CHART | Unreviewed claim |
| 36 | F2-C08-L05 | Small Body With Two-Sided Excursion | candlestick_ohlc | CS_CANDLE + CS_CHART | Unreviewed claim |
| 37 | F2-C08-L06 | Exact Doji With Unequal Wicks | candlestick_ohlc | CS_CANDLE + CS_CHART | Unreviewed claim |
| 38 | F2-C09-L01 | Upward Follow-Through With Contracting Ranges | candlestick_ohlc | CS_CANDLE + CS_CHART | Unreviewed claim |
| 39 | F2-C09-L02 | Downward Follow-Through | candlestick_ohlc | CS_CANDLE + CS_CHART | Unreviewed claim |
| 40 | F2-C09-L03 | Directional Follow-Through Interrupted by an Opposite Expansion | candlestick_ohlc | CS_CANDLE + CS_CHART | Unreviewed claim |
| 41 | F2-C09-L04 | Range Contraction Without One-Way Direction | candlestick_ohlc | CS_CANDLE + CS_CHART | Unreviewed claim |
| 42 | F2-C09-L05 | Mixed and Overlapping Sequence | candlestick_ohlc | CS_CANDLE + CS_CHART | Unreviewed claim |
| 43 | F2-C10-L01 | 1-Minute vs. 3-Minute vs. 5-Minute Compression | multi_timeframe | CS_CHART + CS_TREND | Check mismatch |
| 44 | F2-C10-L02 | Change History Without Changing Bar Size | multi_timeframe | CS_CHART + CS_TREND | Unreviewed claim |
| 45 | F2-C10-L03 | Many Intraday Bars Become One Daily View | multi_timeframe | CS_CHART + CS_TREND | Unreviewed claim |
| 46 | F2-C11-L01 | Agreement on Completed-Candle Direction | multi_timeframe | CS_CHART + CS_TREND | Unreviewed claim |
| 47 | F2-C11-L02 | Disagreement Across Scale | multi_timeframe | CS_CHART + CS_TREND | Unreviewed claim |
| 48 | F2-C11-L03 | The Opposite Disagreement | multi_timeframe | CS_CHART + CS_TREND | Unreviewed claim |
| 49 | F2-C11-L04 | Compression Hides Internal Sequence | multi_timeframe | CS_CHART + CS_TREND | Unreviewed claim |
| 50 | F2-C12-L01 | Classify a generally upward path | trend_swing_structure | CS_TECH + CS_TREND | Unreviewed claim |
| 51 | F2-C12-L02 | Classify a generally downward path | trend_swing_structure | CS_TECH + CS_TREND | Unreviewed claim |
| 52 | F2-C12-L03 | Classify a broadly non-directional window | trend_swing_structure | CS_TECH + CS_TREND | Unreviewed claim |
| 53 | F2-C12-L04 | A broader upward path can contain a short downward segment | trend_swing_structure | CS_TECH + CS_TREND | Unreviewed claim |
| 54 | F2-C13-L01 | Higher highs and higher lows | trend_swing_structure | CS_TECH + CS_TREND | Unreviewed claim |
| 55 | F2-C13-L02 | Lower high and lower low | trend_swing_structure | CS_TECH + CS_TREND | Unreviewed claim |
| 56 | F2-C13-L03 | Conflicting inward swing comparisons | trend_swing_structure | CS_TECH + CS_TREND | Unreviewed claim |
| 57 | F2-C13-L04 | Conflicting outward swing comparisons | trend_swing_structure | CS_TECH + CS_TREND | Unreviewed claim |
| 58 | F2-C14-L01 | Candidate Support From Repeated Lower Reactions | support_resistance | CS_LEVELS + CS_TECH | Unreviewed claim |
| 59 | F2-C14-L02 | Candidate Resistance From Repeated Upper Reactions | support_resistance | CS_LEVELS + CS_TECH | Unreviewed claim |
| 60 | F2-C14-L03 | Support Is Historical Evidence, Not a Guarantee | support_resistance | CS_LEVELS + CS_TECH | Unreviewed claim |
| 61 | F2-C14-L04 | Why a Zone Can Be Better Than One Exact Line | support_resistance | CS_LEVELS + CS_TECH | Unreviewed claim |
| 62 | F3-C01-L01 | Resistance Breakout and Follow-Through | breakout_retests | CS_LEVELS + CS_TECH | Unreviewed claim |
| 63 | F3-C01-L02 | Support Breakdown and Follow-Through | breakout_retests | CS_LEVELS + CS_TECH | Unreviewed claim |
| 64 | F3-C01-L03 | Upside Probe Versus Close-Based Breakout | breakout_retests | CS_LEVELS + CS_TECH | Unreviewed claim |

## Verified reference-page inventory

| ID | Source | Subject supported | Official page |
|---|---|---|---|
| SEC_STOCKS | SEC Investor.gov — Stocks | Common stocks, issuer ownership, market-cap categories | https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks |
| SEC_ETPS | SEC Investor.gov — Exchange-Traded Products | ETF versus ETP versus benchmark/index | https://www.investor.gov/introduction-investing/investing-basics/glossary/exchange-traded-products-etps |
| SEC_INVEST | SEC Investor.gov — Introduction to Investing | Investment horizons, risks, diversification and planning | https://www.investor.gov/introduction-investing |
| SEC_ORDERS | SEC Investor.gov — Types of Orders | Market and limit orders, last trade versus current quote | https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders |
| NYSE_SESSIONS | NYSE — Trading Hours and Sessions | Core regular session, preopening and extended-hours variation across venues | https://www.nyse.com/trade/trading-information |
| SEC_QUOTES | SEC — Market Activity Data Visualizations | Trades, quotes, order activity and volume distinct measures | https://www.sec.gov/securities-topics/market-structure-analytics/market-activity-data-visualizations |
| SEC_SIZE | SEC — Market Activity Report Methodology | Market capitalization, volume and quote definitions | https://www.sec.gov/featured-topics/market-structure-analytics/market-activity-report-methodology |
| CS_CHART | StockCharts ChartSchool — What Are Charts? | Time-series, price axes, chart types, compressed intervals | https://chartschool.stockcharts.com/table-of-contents/chart-analysis/what-are-charts |
| CS_CANDLE | StockCharts ChartSchool — Introduction to Candlesticks | Open/high/low/close, body, wicks, doji context | https://chartschool.stockcharts.com/table-of-contents/chart-analysis/candlestick-charts/introduction-to-candlesticks |
| CS_TECH | StockCharts ChartSchool — Technical Analysis | Trend observations, swing highs/lows, support/resistance, breakouts | https://chartschool.stockcharts.com/table-of-contents/overview/technical-analysis |
| CS_TREND | StockCharts ChartSchool — Trend Lines | Trend structure, varying scales and false breaks | https://chartschool.stockcharts.com/table-of-contents/chart-analysis/trend-lines |
| CS_LEVELS | StockCharts ChartSchool — Support & Resistance | Levels and zones as historical evidence, not guarantees | https://chartschool.stockcharts.com/table-of-contents/chart-analysis/support-and-resistance |

## Execution gates remaining

1. Independently verify each Lab's exact claims and distinguish topics with only a general background reference from precisely supported lesson statements.
2. Correct the candidate competency mismatch only after comparing canonical teaching and required archived/frozen competencies.
3. Review any planned third-party chart/asset/data use and obtain separate rights where needed; otherwise use fictional original materials.
4. Execute genuine signed-in two-account Learning/Lab pathways, keyboard/assistive technology and progress save/restore; maintain all premium and graded holds.
5. Record source evidence and release decision individually; do not infer 64/64 acceptance from 64/64 metadata checks.

## Completion reporting

Learning/Lab ledger: 16/64 fully integrated = **25.0%**; 58/64 source/prototype coverage = **90.6%**. Eight tier combinations retain Basic 100% integrated, Advanced/Professional/Enterprise 0% integrated. The whole site has no validated denominator. Research triage alone does not change these figures.

## Revision history

| Version | Date | Author / change | Approval |
|---|---|---|---|
| 1.0 | 2026-11-03 | Compiled 64 canonical Lab candidate-to-topic source mappings, rights holds, and regression gate | Research source registration only; independent editorial, accessibility and release acceptance still open |

**Footer:** SMFGU-LAB-SOURCE-064-20261103 · V1.0 · Research triage / NOT production acceptance · GitHub source of record.
