# Eleven-Method Formula Verification — Owner Uploaded Research Directory V1

| Document control | Value |
|---|---|
| Company | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | THE STOCK MARKET: FROM THE GROUND UP — Learning Academy |
| Document ID | SMFGU-RESEARCH-TEN-FORMULA-001 |
| Filename | `docs/research/master/TEN-FORMULA-VERIFICATION-v1.0-20261101.md` |
| File type | Markdown |
| Version / Created / Updated | 1.1 / November 1, 2026 |
| Status | Original ten numerical source fixtures and independent two-language computation implemented; editorial acceptance and rights not implied |
| Google Drive path / document ID | Not created / not assigned |
| New file required | Yes — this GitHub-controlled quality record and fixture/test source files |
| GitHub location | `cybernexuspublishing/stock-market-from-the-ground-up`, `main` |
| Dependencies | Uploaded `Master Research Source Directory(4).odt` (20 pages); `master-source-registry-v1.json`; existing Chart Studio `assets/js/crownlight-indicator-math-v2.js`; Talia `functions/_lib/talia-foundation-quant-v1.js`; rights/CI and protected assessment rules |

## Result and acceptance separation

These eleven source QA cases comprise the uploaded directory's formula list, plus gap-aware ATR. They are **original fictional mathematical fixtures**, not copies of third-party charts or data. Each case has an explicit worked method, source-linked teaching guide, units and a limitation or failure boundary in `formula-verification-fixtures-v1.json`. JavaScript tests exercise existing shared indicators and Talia math; an independent Python standard-library verifier recomputes values without pulling data, without hosting Python and without exposing private answers. Exact-commit CI is a separate gate.

| Method | Formula / convention | Fictional result | Acceptance boundary |
|---|---|---|---|
| SMA | 3 completed closes | $14.00 | First valid window index 2 |
| EMA | 3-period SMA-seeded | $14.00 | alpha = 0.5; seed $12.00 |
| Transaction VWAP | Executed price*shares / shares | $11.50 | Real prints only; no quotes |
| HLC3 bar VWAP proxy | Volume-weighted HLC3 bars | $12.25 | Not an exact print VWAP |
| RSI | Wilder 3-change seed/smoothing | 66.6667 | Three changes require four closes |
| MACD | Toy 2/3/2 SMA-seeded EMAs | Line≈0.87963, histogram≈0.16975 | Default 12/26/9 requires longer warmup |
| ATR | Wilder TR; 3-period initial average | $2.44444 | Includes prior-close gap |
| Bollinger Bands | 3 periods; k=2; population sigma | Lower≈8.73401, upper≈15.26599 | Sample sigma yields different bands |
| Expectancy | Two outcomes less cost | +$50/fictional attempt | No empirical profitability claim |
| Position sizing | Cash-limited long, whole shares | 25 shares, planned $50 risk | Slippage and gaps may exceed planned risk |
| Sharpe ratio | 4 fictional monthly returns; sample n−1 SD | Unannualized 1.549193 | Same-frequency risk-free reference, zero-variance rejection and serial-dependence caveat |

External explanation sources for method verification include [StockCharts RSI](https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/relative-strength-index-rsi), [StockCharts MACD](https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/macd-moving-average-convergence-divergence-oscillator), [StockCharts True Range](https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/true-range), official thinkorswim indicator references and the existing master registry. A research reference alone does not provide a commercial license or independent formula signoff.

## Evidence and next gates

- Fixture has eleven unique canonical subject IDs, eleven worked cases and source/limitations fields.
- `node tests/test_master_formula_cases_v1.mjs` validates shared Chart Studio indicator values and the existing Talia expectancy helper.
- `python3 tests/test_master_formula_cases_v1.py` independently recomputes the same ten expected outputs.
- `node scripts/master-research-source-audit-v1.mjs` preserves 419/73/274 identities and confirms eleven reference candidates are not approved data ingestion or independent editorial review.
- Review beyond these cases: varying warmup/seed conventions, zero denominators and missing bars, 14-period Wilder samples, 12/26/9 MACD, population vs sample sigma, full session/DST reset, transaction feed rights.
- No change to official 30 competencies, 419 IDs, ten Boot Camps/274 study days, private answer keys, protected grades, RLS, member histories, ECharts engine, payments, or commercial market feeds.

## Revision history
| Version | Date | Change | Approval |
|---|---|---|---|
| 1.0 | 2026-11-01 | Ten original methods, fixed scenarios, two independent languages, shared-first-party API regression | Source QA ready for automated CI; final editorial and production acceptance pending |

**Footer:** SMFGU-RESEARCH-TEN-FORMULA-001 / 1.1 / synthetic arithmetic, not investment advice, endorsements, live prices or independent academic accreditation.


## Addendum — version 1.1, November 1, 2026

Sharpe ratio is an eleventh distinct fixed fictional method, validated in both existing JS and independent Python; the existing Talia topic `TALIA_TOPIC_SHARPE_SAMPLING_UNITS` now exposes a full sample-SD calculation, no new competency, answer key or topic is created. CFA Institute Lo (2002) and CFI are reference candidates, not reuse licenses. The example is **unannualized**; naive annualization is prohibited. Individual editorial and real-member acceptance remain open.
