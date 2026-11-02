# Basic Learning / Lab Release — Executable Verification Evidence

**Project:** THE STOCK MARKET: FROM THE GROUND UP  
**Document ID:** SMFGU-BASIC-49-GATES-20261102  
**Version:** 1.0  
**Date:** 2026-11-02  
**Status:** Automated source acceptance passed; authenticated accessibility and independent security acceptance open  
**File:** docs/learning/SMFGU-BASIC-49-GATES-20261102.md  
**Purpose:** Exact-SHA record of the consolidated Basic mathematics and Academy tests.

## Verified Cloudflare production execution

- Production deployment repository SHA: **a89777de1aaa638f0e9c17471c28e8076aee583d**.
- Cloudflare deployment ID: **d40ad234-0a92-4d1d-ba1a-a6ca692bc9e2**.
- Build stage: **success**. Deployment stage: **success**.
- Regression suite `tests/basic-learning-49-executable-gates-v1.test.mjs`: **49 tests, 49 passed, 0 failed, 0 skipped**, as reported by the deployed build logs.
- The suite is included in `scripts/build-pages.sh`, along with the existing five-indicator, Academy restoration, and Basic engine acceptance regressions.

## Executed coverage

| Individual tests | Area | Verification |
|---|---|---|
| 1–8 | EMA | SMA seed, alpha recursion, no premature values, eight distinct fictional price sequences |
| 9–16 | RSI | Wilder smoothing, flat-price treatment and complete warmup, eight distinct sequences |
| 17–24 | MACD | Fast/slow EMA, independent signal warmup, histogram calculation, eight sequences |
| 25–32 | ATR | True range, preceding-close gaps, Wilder seed/smoothing, eight sequences |
| 33–40 | Bollinger | Rolling population standard deviation, upper/lower bands and warmup, eight sequences |
| 41–48 | Academy | Day restoration, first incomplete lesson, record shape/range/program identity, session isolation, account change, enrollment guard |
| 49 | Mapping | Every approved indicator maps back to its authored canonical Lab title |

## Additional functionality

- Member quantitative study charts provide an accessible complete numerical series table with explicit warmup cells and column/row headings, independent of ECharts canvas or hover color.
- Owner editorial approval is recorded separately in `docs/learning/SMFGU-BASIC-OWNER-APPROVAL-20261102.md`.
- No protected grades, member entitlements, LIVE payments, rights clearance claims or real quote ingestion were added.

## Outstanding release criteria

- Real authenticated browser tests of Free and Academy progress across course transitions, session expiry and account switching.
- Actual keyboard and assistive-technology testing for all five indicator workbenches.
- Complete applicable-Lab chart/topic parity; independently verified copyright and market-data licensing where required.
- Full GitHub Actions matrix evidence for the same release SHA, separate from Cloudflare build acceptance.

**Decision:** Pass the 49 automated checks. Preserve LE-BAS-06/07 and LA-BAS-07/08 remaining real-member acceptance status; do not equate source tests with authenticated browser certification.

## Revision history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-02 | Exact-SHA Cloudflare release and 49/49 independently executed regression tests recorded |

**Footer:** SMFGU-BASIC-49-GATES-20261102 · v1.0 · Engineering evidence · Real-member acceptance open.
