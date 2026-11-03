# Learning/Lab — Seven-Method Indicator Research and Verification Register

| Document control | Value |
|---|---|
| Document ID | `SMFGU-LELA-RESEARCH-007-20261103` |
| Project | THE STOCK MARKET: FROM THE GROUND UP (Crownlight) |
| Version | 1.0 |
| Status | Research compiled; numerical CI pending; NOT independently accepted or released |
| Date / last accessed | 2026-11-03 |
| Google Drive | Not assigned; GitHub repository is the authoritative storage location |
| Filename / file type | `docs/qa/2026-11-03_LEARNING_LAB_7_INDICATOR_METHODOLOGY_RESEARCH_V1.md` / Markdown |
| Machine-readable file | `data/learning-lab-indicator-methods-research-v1.json` / JSON |
| Test file | `tests/learning-lab-indicator-source-methods-v1.test.mjs` / Node.js ESM |
| Dependencies | Shared Learning Engine v3.3; Shared Lab Engine v3.2; 419 canonical Labs; 64-item source ledger; original fictional examples |
| Purpose | Verify subject-specific methodology sources, configuration, worked examples, and rights boundaries without implying production readiness |

## Scope and methodology

Seven research records represent five existing executable indicator implementations (EMA, RSI, MACD, ATR, Bollinger Bands) and two deliberately distinct VWAP methodologies (individual transaction prints and HLC3 OHLCV-bar proxy). The cases are independently authored and use fictional values. **No licensed market feed is accessed, copied, or republished.** This is not a claim that all 419 Labs or higher editions are fully accepted.

| Method | Declared mathematical convention | Initialization, warmup or reset | Source-method reference |
|---|---|---|---|
| EMA | close EMA, alpha=2/(period+1), seed=SMA(first period closes) | first value at index period-1; no earlier EMA | [StockCharts ChartSchool](https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/moving-averages-simple-and-exponential) |
| RSI | Wilder RSI, initial average gain/loss from first period price changes, then recursively smooth | first RSI at index period; both zero averages map to project-defined 50 | [StockCharts ChartSchool](https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/relative-strength-index-rsi) |
| MACD | fast EMA minus slow EMA; signal EMA of valid MACD values; histogram=MACD-signal | SMA-seed both component EMAs and subsequent MACD signal; no premature lines | [StockCharts ChartSchool](https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/macd-moving-average-convergence-divergence-oscillator) |
| ATR | True range=max(high-low,abs(high-priorClose),abs(low-priorClose)); Wilder smoothed ATR in project implementation | first TR=high-low, first ATR=SMA(period true ranges), then Wilder recursive smoothing | [StockCharts ChartSchool True Range](https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/true-range) |
| BOLLINGER | middle=SMA(period closes); upper/lower=middle ± multiplier × population standard deviation | first bands at index period-1; project explicitly uses population divisor period | [StockCharts ChartSchool](https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/bollinger-bands) |
| VWAP-TRADE | exact transaction VWAP=sum(tradePrice × tradeVolume)/sum(tradeVolume) over chosen reset interval | requires positive cumulative traded volume; reset at stated session/anchor | [Official thinkorswim VWAP study reference](https://toslc.thinkorswim.com/center/reference/Tech-Indicators/studies-library/V-Z/VWAP) |
| VWAP-HLC3 | bar proxy=sum(((high+low+close)/3) × barVolume)/sum(barVolume) over stated reset interval | requires positive cumulative bar volume; proxy remains approximate from bar-level aggregates | [TradingView VWAP calculation guide](https://www.tradingview.com/support/solutions/43000502018-volume-weighted-average-price-vwap/) |

## Independent numerical cross-checks

| Method | Fictional evidence | Expected result |
|---|---|---|
| EMA | Close 10, 11, 13, 12; 3-period initial SMA seed | Final EMA = 35/3 = 11.666667 |
| RSI | Close 10, 11, 12, 11, 13, 14; Wilder period 3 | Final RSI = 87.878788 |
| MACD | Close 10, 11, 12, 11, 13, 14, 15, 14; periods 3/5/3 | MACD = 74/135; signal = 19/30; histogram = -23/270 |
| ATR | H/L/C (11/9/10), (12/10/11), (13/10/12), (14/11/13), (15/12/14); period 3 | Final ATR = 73/27 = 2.703704 |
| Bollinger Bands | Close 10, 11, 12, 13, 12, 14; 3-period, k=2, population sigma | Final middle = 13; upper = 13 + 2√(2/3) |
| Trade-print VWAP | Trades 10 × 100 shares and 12 × 300 shares | Exact transaction VWAP = 11.50 |
| Bar-HLC3 VWAP | Same two trades aggregate to high=12, low=10, close=12, volume=400 | HLC3 proxy = 34/3 ≈ 11.333333 |

### Critical counterexample: exact VWAP versus an OHLCV proxy

Two trades at 10 (100 shares) and 12 (300 shares) yield an exact size-weighted transaction VWAP of **11.50**. Their aggregate bar has H=12, L=10, C=12, V=400; substituting HLC3 yields **11.333333**. Both methods are valid for their declared input types, but the second cannot be presented as an exact reconstruction of the first. See the official <https://toslc.thinkorswim.com/center/reference/Tech-Indicators/studies-library/V-Z/VWAP> and <https://www.tradingview.com/support/solutions/43000502018-volume-weighted-average-price-vwap/> references.

### Controls for source-authoring and future Labs

1. Declare price source, volume source, timestamps, timezone, reset anchor, period, seeding, missing data, and incomplete-bar behavior for each indicator.
2. Use original fictional scenarios for teaching and the independent example change; never reveal protected official answer keys in the formative pathway.
3. Preserve source-level rights gate: citations to methodologies do not imply permission to copy provider graphics, source code, proprietary data, training text, or chart screenshots.
4. Preserve Advanced/Professional/Enterprise entitlement, owner edition mapping, independent authenticated two-account security, real accessibility review, and release holds.
5. CI checks numerical mathematics and evidence-file integrity, not provider rights, editorial independence, learner accessibility or production acceptance.

## Approval and outstanding gates

Owner approval for currently authored Labs and Boot Camps remains effective. Independent grading, rights, genuine user journeys, screen readers, premium entitlements and exact-SHA live release remain **OPEN**. The 64-feature register remains the source of truth for completion counts: **16/64 integrated (25.0%)**, **58/64 source/prototype coverage (90.6%)**, whole-site completion unverified.

## Revision history

| Version | Date | Change | Decision |
|---|---|---|---|
| 1.0 | 2026-11-03 | Created seven subject-specific source references, fictional numerical cross-checks, and explicit VWAP method divergence | Research source review; no independent release signoff |

**Footer:** SMFGU-LELA-RESEARCH-007-20261103 · v1.0 · Method research only · Release and data-rights holds remain active.
