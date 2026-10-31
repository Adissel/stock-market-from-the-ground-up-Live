# Free Membership V1 — Five-Lesson Editorial and Authenticated Member Acceptance

**Document ID:** SMFGU-FREE-EDITORIAL-QA-20261031-001  
**Company / imprint:** Cyber Nexus / Crown & Lantern Press  
**Project:** The Stock Market: From the Ground Up  
**Repository:** `cybernexuspublishing/stock-market-from-the-ground-up`, `main` only  
**File type / filename:** Markdown (.md), `docs/qa/2026-10-31_FREE_V1_EDITORIAL_AND_MEMBER_ACCEPTANCE_V1.md`  
**Google Drive location / Google Drive document ID:** Not assigned; GitHub main is the controlling location.  
**Version:** 1.0  
**Prepared:** 2026-10-31  
**Status:** OWNER-DELEGATED EDITORIAL REVIEW COMPLETE (five fictional Free lessons); signed-in five-day save/reload QA PASS; cross-account full-program gate and release-wide exact-head CI OPEN.  
**Purpose:** Record individual content decisions, separate actual browser checks from source tests, and preserve release blockers without waiving them.  
**Dependencies:** `functions/_lib/free-foundations-v1.js`, `data/free-foundations-evidence-v1.json`, existing `free5` Academy, existing account-private Supabase progress, GitHub production-browser workflow, authorized noncommercial QA credentials, Cloudflare Pages.

## 1. Owner-delegated editorial disposition

A source-level editorial review of the five original fictional lessons, documented examples, reasoning checkpoints, misconception corrections, no-trade limitations and transfer prompts was performed. All five are **approved for the existing ungraded Free Foundations beginner-teaching scope**, not as certified competency assessments, licensed historical trading lessons or investment recommendations. This is a delegated owner/editor content decision, **not an assertion that a separate human independent reviewer participated**.

| Day | Lesson | Mathematical / source check | Editorial disposition |
|---|---|---|---|
| 1 | What is a stock, and what does the market do? | 100 ÷ 1,000,000 = 0.01% share ownership; $10 × 1,000,000 = $10,000,000 simplified market capitalization; last trade ≠ next executable price | ACCEPTED — fictional beginner instruction |
| 2 | How to read a five-minute candlestick | OHLC 20/22/19/21.20 gives $1.20 body, $3.00 range, $0.80 upper and $1.00 lower wick, 40% body/range; zero denominator undefined | ACCEPTED — fictional beginner instruction |
| 3 | Claims, catalysts and what was actually known | 08:17 and 08:21 evidence is 5 and 9 minutes after 08:12 decision pause; SEC acceptance time is not independently proven first public availability | ACCEPTED — fictional chronology instruction |
| 4 | Make a watchlist, not a list of trade signals | Original research-source/fiction/unverified classification, not a performance claim. Corrected potentially misleading "thin spread" to "wide bid–ask spread or thin available liquidity" at commit `ce7fd03fbf35c858d10ad330aabf2b1f542a0748` | ACCEPTED — corrected fictional research instruction |
| 5 | Plan risk, choose NO TRADE and review your work | $10−$9.80=$0.20/share; $20 budget÷$0.20=100 whole shares; $1,000 exposure. $9.60 fill implies $40 price-only loss; $9.75 stop yields 80 whole shares | ACCEPTED — hypothetical risk arithmetic, no fill guarantee |

**Verified independent source references:**
- SEC Investor.gov order-types bulletin: https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-14
- SEC stop-order bulletin (updated 2026-08-18): https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-15
- SEC EDGAR webmaster FAQ (acceptance vs public site timing): https://www.sec.gov/about/webmaster-frequently-asked-questions
- StockCharts original OHLC/candlestick definitions, an educational publisher and not a regulatory authority: https://chartschool.stockcharts.com/table-of-contents/chart-analysis/candlestick-charts/introduction-to-candlesticks
- Existing per-day research evidence: `docs/research/stockstotrade/FREE5_VERIFIED_SOURCE_TO_INSTRUCTION_20261031.md` and `data/free-foundations-evidence-v1.json`.

## 2. Genuine authenticated production evidence

**Workflow:** https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41236748112  
**Source commit:** `5ebed92026aa0b302b0a41a727cef78b846fd623`  
**Production browser:** real Chromium with existing authorized password-authenticated noncommercial QA identity; no human CAPTCHA bypass, payment or protected answer key.  
**Result from decoded GitHub Actions job log:** 16 passed checks, 0 failing assertions, 1 deliberately blocked cross-account gate; the overall job exited 2 and is **NOT a completed passing workflow**.

Specific results:
1. Real Free QA account sign-in and account-bound token PASS.
2. Free5 Day 1 existing fictional reflection PASS through reload and private API readback.
3. Free5 Days 2, 3, 4 and 5 each PASS authentic UI save, full reload and authorized API readback; no unrelated member note overwritten.
4. Unsigned Academy read blocked; forged caller account selectors ineffective; direct browser `SELECT` on service-private progress table rejected.
5. A second separately authenticated QA account was not available in this workflow's encrypted `LAB_QA_SECOND_EMAIL` / `LAB_QA_SECOND_PASSWORD` settings. This gate is BLOCKED, not accepted.
6. Existing distinct Owner/James_Test Day 1 isolation acceptance is preserved as previously recorded in `docs/releases/2026-10-29_PUBLIC_ACQUISITION_AND_CONVERSION_V1.md`; it is **not** a five-day two-QA-account test.

**Read-only production database postflight, 2026-10-31:** one `free5` progress row for each of days 1, 2, 3, 4 and 5. No private reflections or identifiers were retrieved for this report.

## 3. Next accepted and open work

- **Editorial source decision:** ACCEPTED for the five Free lessons' described ungraded beginner scope. The new Day 4 wording must pass subsequent exact-commit source/build regression before its *release* acceptance.
- **Genuine first-account five-day persistence:** PASS at the recorded source and deployed production behavior.
- **Genuine second-account five-day privacy:** BLOCKED (second authorized identity unavailable to the workflow).
- **Free Talia preferences and watchlist UI persistence:** additional authentic test committed separately; outcome OPEN until job log and database postflight verify results.
- **Free Journal and saved simulator weekly ceilings:** source/schema tests are useful but real QA quota exhaustion, isolation and reset remain OPEN.
- **Release exact-head CI and matching Cloudflare SHA:** OPEN on fast-changing main; old CI passes cannot be represented as exact-head release acceptance.
- **Full accessibility:** separate keyboard, screen-reader and responsive checks beyond the already accepted scoped public-page browser tests remain OPEN.
- **Financial policy:** no LIVE charges, provider modifications or independent professional legal signoff are authorized by this document.

## 4. Completion reporting

Estimated Free Membership V1 work maturity: **70%**, calculated as a provisional weighted project-management estimate, not 70% accepted binary gates. This estimate can be raised only for newly verified critical acceptance evidence. The five-day signed-in persistence scope itself is **5/5 days checked**; release acceptance is **NOT 100%**.

## 5. Signoff, limitations and revisions

**Owner-delegated editorial disposition:** APPROVED for five original fictional ungraded teaching lessons after the Day 4 technical terminology correction, subject to production build/regression release gates.  
**Application security disposition:** PARTIAL; direct-table and first-account account-binding checks PASS, entire cross-account test matrix OPEN.  
**Beta-tester disposition:** First-account five-day UI persistence PASS; remaining Free tool workflows OPEN.  
**Release manager disposition:** HOLD full release signoff pending exact-commit CI, matching Cloudflare deployment and consolidated member accessibility/entitlement verification.

This record does not purport to be certified by a separate human editor, security auditor, professional investment adviser, licensed attorney or accountant.

**Revision history:** v1.0 (2026-10-31) — Five per-lesson delegated editorial determinations, real 16-check browser results, source correction, privacy boundary and remaining gates.

**Footer:** SMFGU-FREE-EDITORIAL-QA-20261031-001 · v1.0 · GitHub main · Original fictional educational content.
