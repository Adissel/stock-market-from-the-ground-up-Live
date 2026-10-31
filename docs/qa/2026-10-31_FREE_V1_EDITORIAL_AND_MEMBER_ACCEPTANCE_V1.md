# Free Membership V1 — Five-Lesson Editorial and Authenticated Member Acceptance

**Document ID:** SMFGU-FREE-EDITORIAL-QA-20261031-001  
**Company / imprint:** Cyber Nexus / Crown & Lantern Press  
**Project:** The Stock Market: From the Ground Up  
**Repository:** `cybernexuspublishing/stock-market-from-the-ground-up`, `main` only  
**File type / filename:** Markdown (.md), `docs/qa/2026-10-31_FREE_V1_EDITORIAL_AND_MEMBER_ACCEPTANCE_V1.md`  
**Google Drive location / Google Drive document ID:** Not assigned; GitHub main is the controlling location.  
**Version:** 1.1  
**Prepared:** 2026-10-31  
**Status:** PARTIAL OWNER ACCEPTANCE — five-day Free lessons, Talia preferences, Watchlist and fictional replay verified with one real QA member; isolated weekly quota integration and authenticated keyboard/ARIA smoke PASS; two-account privacy and exact-head final release HOLD.  
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

Estimated Free Membership V1 work maturity: **85%**, calculated as a provisional weighted project-management estimate, not 85% accepted binary gates. This estimate can be raised only for newly verified critical acceptance evidence. The five-day signed-in persistence scope itself is **5/5 days checked**; release acceptance is **NOT 100%**.

## 5. Signoff, limitations and revisions

**Owner-delegated editorial disposition:** APPROVED for five original fictional ungraded teaching lessons after the Day 4 technical terminology correction, subject to production build/regression release gates.  
**Application security disposition:** PARTIAL; direct-table and first-account account-binding checks PASS, entire cross-account test matrix OPEN.  
**Beta-tester disposition:** First-account five-day UI, Talia preferences, Watchlist and fictional replay lifecycle PASS. Two-account identity isolation and member Journal full-life-cycle remain OPEN.  
**Release manager disposition:** HOLD full release signoff pending exact-commit CI, matching Cloudflare deployment and consolidated member accessibility/entitlement verification.

This record does not purport to be certified by a separate human editor, security auditor, professional investment adviser, licensed attorney or accountant.

**Revision history:** v1.0 (2026-10-31) — Five per-lesson editorial determinations and original browser evidence. v1.1 (2026-10-31) — Real Free tool journeys, isolated quota concurrency/rollover evidence, scoped keyboard/ARIA checks and remaining release gates.

**Footer:** SMFGU-FREE-EDITORIAL-QA-20261031-001 · v1.1 · GitHub main · Original fictional educational content.


## 6. Version 1.1 execution addendum — 2026-10-31

**Controlling principle:** Source implementation, production configuration, disposable PostgreSQL testing, authenticated production-browser behavior and final release acceptance are different evidence categories. Scope-limited results cannot authorize the full platform release.

### Genuine one-member acceptance

- **GitHub production-browser workflow:** [41242089289](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41242089289) — authenticated Dashboard Talia preferences UI save/readback and five Free5 reflections confirmed. One Free preference row and one Free Watchlist row verified by read-only production Supabase queries.
- **GitHub production-browser workflow:** [41242466419](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41242466419) — authenticated fictional replay start, first bar only, lock NO_TRADE, reveal next bar, finish without Journal link. One finished fictional QA replay row confirmed in production. No actual market data/trade/grade was used.
- **GitHub production-browser workflow:** [41243741306](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41243741306) — **22 checks passed, zero failed assertions, one blocked gate**. Included Days 1–5, account-scoped preferences and Watchlist readback, synthetic replay completion, protected progress table, unsigned access denial, **390-pixel mobile keyboard traversal with programmatic labels and aria-live**, and **1440-pixel desktop control presence**. The workflow correctly exits nonzero because the separately authenticated second QA member remains unavailable.
- **Public site:** the same workflow's 15-page mobile/desktop public-browser job PASSED. This is scoped public QA, not WCAG 2.2 AA conformance or screen-reader certification.

### Free weekly quota and storage controls

- **Production, read only:** all **13/13** checks in `supabase/admin/v0.14.0.121_FREE_QUOTA_POSTFLIGHT_READ_ONLY.sql` passed. The private counter ledger and quota helper lack direct anon/member access, and the Journal trigger is enabled.
- **Production Journal row security:** `decision_journal` has RLS enabled and policies for SELECT/INSERT/UPDATE/DELETE explicitly restrict access to `auth.uid() = user_id`; it is different from the service-private Free5, preferences, Watchlist and replay tables.
- **Disposable PostgreSQL 16:** [Free Weekly Limits run 41243912671](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41243912671) had BOTH source and real-Postgres jobs succeed. Verified 15+1 Journal boundary, 10+1 simulator-save boundary, update bypass denial, delete/recreate no refund, paid tool-specific exemptions, UTC previous-week/new-week counter segregation, and two competing real database sessions producing one successful Journal save and one quota rejection under a one-slot cap.
- **Test fixture correction:** only the *disposable entitlement stub* was changed to return false, not NULL, when mock paid context settings are absent. This matches the existing production `user_has_tool_access` behavior; production entitlement logic was NOT modified. Previous failing isolated run 41243640666 was due to the test fixture mismatch and is superseded by successful 41243912671.
- **Production financial safeguards:** No Stripe mutation, paid transaction, live fixture insert or paid production resource was created as part of these checks.

### Two-member test readiness

The existing genuine-member script now includes second-account attempts to verify all five other-member reflections, forged ID selectors, Talia preferences, Watchlist read/update ownership, and Journal read isolation. **This full two-member acceptance is NOT EXECUTED** because the workflow lacks `LAB_QA_SECOND_EMAIL` and `LAB_QA_SECOND_PASSWORD` secrets; no bypass or generated token is allowed. A source-level RLS/role test is NOT a replacement for two genuine authenticated users.

### Outstanding release gates

1. Supply or provision a **separate explicitly authorized noncommercial QA identity**, complete its normal email-verification/CAPTCHA requirements, and configure the two existing workflow secrets through an authorized Owner workflow. Re-run genuine two-member tests; no real member data should be overwritten.
2. Run authenticated production Journal save/reopen and quota UI checks on dedicated disposable QA accounts, without filling or deleting unrelated member records. Isolated concurrency/limit implementation is already accepted.
3. Complete **independent actual screen-reader** and deeper WCAG 2.2 AA-targeted checks; the recorded keyboard/label checks are narrow automated smoke tests only.
4. Coordinate the intended `main` release candidate, get conclusive, uncancelled CI and identical SHA deployment in Cloudflare, and then conduct **one consolidated Owner Acceptance Test**. Continuous concurrent commits have previously caused sitewide CI cancellations.

**Owner/editor delegated outcome:** APPROVED for the recorded educational and verified one-member Free scope. **Security/release:** PARTIAL — no full production release signoff. **Estimated maturity:** 85% (weighted planning estimate; 15% not yet accepted). **Next decision:** treat second-account setup as an operational acceptance dependency, not as permission to weaken authentication.
