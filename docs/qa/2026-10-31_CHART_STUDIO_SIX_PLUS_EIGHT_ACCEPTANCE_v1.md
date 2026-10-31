# Crownlight Chart Studio — Six Priorities and Eight Follow-On Gates

**Document ID:** SMFGU-QA-CHART-ROADMAP-20261031-003  
**Project:** The Stock Market: From the Ground Up / Crownlight Chart Studio  
**Repository:** `cybernexuspublishing/stock-market-from-the-ground-up`  
**Google Drive location:** Not assigned; repository `main` is authoritative  
**Google Drive document ID:** Not assigned  
**Filename:** `docs/qa/2026-10-31_CHART_STUDIO_SIX_PLUS_EIGHT_ACCEPTANCE_v1.md`  
**File type:** Markdown (.md)  
**Version:** 1.0  
**Date:** October 31, 2026  
**Status:** ACTIVE EXECUTION; no global launch acceptance. Individual results only as explicitly evidenced.  
**Dependencies:** AGENTS.md; issues #154, #155, #156 and #158; Supabase Primary; Cloudflare Pages production; GitHub Actions; Stripe TEST.  
**Purpose:** Execute exactly the six owner-ordered Chart Studio release priorities plus eight related technical exit gates, without relabeling fixture runs as commercial or human-browser acceptance.  
**New file required:** Yes—separate execution register, not a replacement for previously accepted evidence.

## Frozen constraints

- `main` only; avoid duplicate entitlement, wallet, account or workspace systems.
- $0 incremental budget; no metered browser credits, LIVE payments, new paid feeds, QA purchase of a commercial membership or external paid audits.
- Historical datasets require separately approved source provenance, display rights and replay controls before member-wide release.
- Keep previously accepted James_Test Advanced Chart Studio and original Professional workspace intact. Do not manufacture real Founder paid subscriptions.
- All test cases must be classified: **REAL_AUTH_API**, **REAL_AUTH_BROWSER**, **FIXTURE_BROWSER**, **SOURCE_CONTRACT**, **PROVIDER_TEST**, **HUMAN_SIGNIN**, or **RELEASE_PARITY**.

## First six workstreams

| ID | Requirement | Current evidence | Exit still required |
|---|---|---|---|
| C01 | Standard and Professional visual browser acceptance | Three-tier Chromium fixtures PASS [41232073311](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41232073311); two genuine separate Standard/Professional GoTrue API users PASS [41233580742](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41233580742). | Run signed-in Chromium on *real separately entitled* Standard and Professional QA members. No mock labels. |
| C02 | Full permission matrix: Free, Founding 14/30/60, Owner, Admin, Moderator, expired, revoked, restricted and guest | Actual server unit/source tier matrix PASS [V7 run 41232073311](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41232073311); Advanced real member PASS. | Real authenticated role/plan negatives and expiry transitions with scoped temporary noncommercial QA only. No commercial benefit grants. |
| C03 | Complete workspace: two charts, layouts, drawing and studies, symbol/timeframe sync, two-tab revision CAS and account switch | V7 fixtures verify two-pane geometry, synchronized timeline and source-bound drawings; real isolated QA workspace save/readback; James_Test Advanced preservation PASS. | Real Professional Chromium persistence, simultaneous-tab 409 conflict/reload, fresh-login restoration and sign-out scrub. |
| C04 | Fictional/CSV/rights-approved historical data | `test_free_simulator_starter_v1`, `test_sellable_simulator_csv_integrity_v1`, `test_v014145_marketdata_byo_security`, `test_crownlight_chart_studio_v3_integrity` cover source handling in code. | Authenticated CSV UI plus each licensed historical case. No commercial publication of 87 draft cases or QA-only datasets without rights review. |
| C05 | Mobile, keyboard, accessibility and CAPTCHA UI | New mobile and keyboard assertions added to actual tier Chromium fixture and real Advanced QA: `9f6b89d` and `6fa9b8a`. | Their CI runs must pass; then Standard/Professional real phone and WCAG targeted screen reader, contrast, focus order and CAPTCHA-form flow. |
| C06 | Stripe TEST dispute/zero-cash, Lumen transition and final release | Genuine signed Stripe TEST refund and unpaid expiry previously accepted in #156; new V7 consolidates noncharging mock boundary tests at `73151cf`. Stripe TEST disputes list currently empty. | A provider-backed TEST dispute, exact signed webhook/entitlement audit; $0 TEST Lumen-only fulfillment and reversal; full release green exact-SHA Cloudflare parity. |

## Following eight acceptance gates

| ID | Gate | Existing coverage | Required next proof |
|---|---|---|---|
| C07 | Cross-user BOLA, query selector forgery and database private-table RLS | PASS: real 2-account GoTrue isolation and direct database denial [41233580742](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41233580742). | Expand beyond Chart workspace to wallet, order and replay datasets using authorized QA users. |
| C08 | Subscription, Lumen pass and staff-role expiration/revocation | Source + fixture and James_Test downgrade PASS. | Genuine protected role/grant expiry and token-refresh rechecks, with no phantom customer entitlements. |
| C09 | Optimistic concurrency, stale tab denial, crash/retry | Workspace RPC and fixture CAS PASS. | Two real authenticated browser tabs with concurrent changes and 409/reload resolution. |
| C10 | Session boundaries and stale asynchronous responses | Browser fixtures scrub tier, chart and previous member data on account change and sign-out. | Actual logout/new login, token refresh, back-navigation and cross-device cache tests. |
| C11 | Replay chronology and data licensing | Provider integrity and bounded replay source tests exist. | Evidence-based first decision, no future data in 1/3/5/15-minute views, independently reviewed source licenses. |
| C12 | Monitoring, failure recovery and user-facing error handling | Existing workflows and server errors partially cover paths. | Provider outage simulation, retry/idempotency event logs, operator runbook, no silent data corruption. |
| C13 | Security hardening and secret-exclusion build verification | V7 builds Pages public/ and denies backend function bundling; per-table RLS reviewed. | Full elevated-function privilege review and authenticated API matrix in #158. |
| C14 | Frozen release SHA, rollback and signoff | Accepted earlier SHAs, independent Cloudflare deploy checks and GitHub CI available. | Run required full workflows on the same final `main` SHA, verify Cloudflare exactly that SHA, smoke test, record rollback and owner-facing final acceptance. |

## Actions executed in this increment

- Added **real-browser Advanced 390px phone selector, keyboard focus, visible Professional lock and persistence assertions** to `tests/live-chart-studio-browser-readonly-qa-v1.mjs` (`6fa9b8a`).
- Added **390px fixture Studio keyboard, accessible selector/locked options and responsive multi-chart checks for all three tiers** to `tests/test_crownlight_chart_tiers_browser_v1.mjs` (`9f6b89d`).
- Consolidated free Simulator/CSV, chart-pass expiry, mixed Stripe TEST, cancellation, and signed webhook source contracts into the existing V7 source workflow (`73151cf`).
- These new checks are **NOT accepted until their newly triggered GitHub Actions jobs complete successfully**; previously verified runs remain controlling for their earlier exact SHAs.
- Stripe TEST currently has **zero disputes**. No provider-backed dispute was asserted and no TEST or LIVE charge was initiated in this batch.

## Exit decision

Do not mark all 14 gates completed merely because their source tests exist. Retain issue #154 open until C01–C05 and C07–C14 meet their stated evidence; coordinate the external data-rights and commercial-payment exceptions in #155 and #156. C06 has financial subgates that may remain on test-only hold independently of the free educational Studio.

## Revision history

| Version | Date | Revision | Status |
|---|---|---|---|
| 1.0 | 2026-10-31 | Formalize owner's six priorities, next eight QA gates, controlling evidence and new GitHub mobile/financial source coverage | Active execution |

**Footer:** SMFGU-QA-CHART-ROADMAP-20261031-003 · v1.0 · Internal engineering and QA · Not a commercial release certificate.
