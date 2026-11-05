# Talia Interactive Knowledge Lessons — Wave 1

**Document ID:** SMFGU-TALIA-KDB-INTERACTIVE-016-20261104
**Company:** Cyber Nexus Publishing / Crown & Lantern Press
**Project:** THE STOCK MARKET: FROM THE GROUND UP
**Version / date:** 1.0 / November 4, 2026
**Status:** Engineering candidate; independent editorial, member browser and release acceptance OPEN
**Google Drive location:** Not created; GitHub branch controls
**Drive document ID:** Unassigned
**Filename / type:** docs/learning/SMFGU-TALIA-KDB-INTERACTIVE-WAVE1-20261104.md / Markdown
**Purpose:** Convert existing authorized articles into complete, original interactive nine-stage guided lessons.
**Dependencies:** Existing Knowledge Library membership API, Supabase Authentication, existing original 30 competencies and shared Learning v3.3 / Lab v3.2. New file required: Yes.

## Teaching delivery
16 individually authored Knowledge subjects, 48 original fictional practice cases (42 numerical and six interpretive), with nine existing stages: Start, Learn, Experiment, Predict, Practice, Assess, Review, Transfer, Results. Each lesson contains a subject-specific definition, worked evidence, misconception, external source URL, limitations, numerical or decision inputs, correction, fresh practice, independent transfer and session-only results. The in-page Assess is an UNGRADED SELF-CHECK, never official grading.

Mounted only after successful existing server-side authorization of published article content via /api/knowledge-library?action=read. The JS files contain only fictional public cases; they do not expose protected answer keys, article bodies, other members' history, live market data or credentials. No paid inference, subscription mutation, Learning/Lab progress writes, Lumens awards, live trading or persistent grades.

## Sixteen subjects
1. Bid, Ask, Spread, Midpoint
2. Market Orders and Displayed Depth
3. Limit Order Price Conditions
4. Stop Order Trigger and Fill Risk
5. Simple Percent Change
6. Percent Loss Recovery
7. Shares Outstanding and Market Capitalization
8. Dollar-Cost Averaging
9. Net Trade Result After Costs
10. Exponential Moving Average
11. Trade-Print VWAP
12. True Range and ATR
13. Bollinger Bands
14. Relative Strength Index
15. Assets, Liabilities and Equity
16. Fractional Share Economic Exposure

## Independently consulted external references, 2026-11-04
- https://www.investor.gov/introduction-investing/investing-basics/glossary/ask-price
- https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-14
- https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders
- https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-15
- https://www.investor.gov/introduction-investing/investing-basics/glossary/market-capitalization
- https://www.investor.gov/introduction-investing/investing-basics/glossary/dollar-cost-averaging
- https://www.investor.gov/introduction-investing/getting-started/researching-investments/how-read-10-k
- https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/volume-weighted-average-price-vwap
- https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/moving-averages-simple-and-exponential
- https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/relative-strength-index-rsi
- https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/true-range
- https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/bollinger-bands
- https://www.fidelity.com/bin-public/060_www_fidelity_com/documents/AverageTrueRange.pdf

External source validation establishes narrow factual/calculation support, not independent approval for all member-facing lesson content, public rights to third-party graphics or vendor methods, or validated trading performance.

## Acceptance and release controls
Production build will run: node --test tests/talia-kdb-interactive-wave1.test.mjs and syntax checks for both new scripts. Real member sign-in/entitlement and mobile/screen-reader journeys, independent subject-matter review, exact-SHA CI and Cloudflare production parity remain required.

## Revision history
| Version | Date | Change | Status |
|---|---|---|---|
| 1.0 | 2026-11-04 | 16 interactive original subject lessons, 48 cases, article integration and test gate | Engineering candidate |

Footer: SMFGU-TALIA-KDB-INTERACTIVE-016 • v1.0 • No independent legal, editorial or investment certification.
