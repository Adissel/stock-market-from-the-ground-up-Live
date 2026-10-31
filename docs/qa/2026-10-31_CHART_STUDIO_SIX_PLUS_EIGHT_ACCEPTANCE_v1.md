# Crownlight Chart Studio — Six Priorities and Eight Follow-On Gates

**Document ID:** SMFGU-QA-CHART-ROADMAP-20261031-003  
**Project:** The Stock Market: From the Ground Up / Crownlight Chart Studio  
**Repository:** `cybernexuspublishing/stock-market-from-the-ground-up`  
**Google Drive location:** Not assigned; repository `main` is authoritative  
**Google Drive document ID:** Not assigned  
**Filename:** `docs/qa/2026-10-31_CHART_STUDIO_SIX_PLUS_EIGHT_ACCEPTANCE_v1.md`  
**File type:** Markdown (.md)  
**Version:** 1.1  
**Date:** October 31, 2026  
**Status:** ACTIVE EXECUTION — 3/14 strict full gates accepted, 9 partial, 2 open; full release NOT certified.  
**Dependencies:** AGENTS.md; issues #154, #155, #156 and #158; Supabase Primary; Cloudflare Pages production; GitHub Actions; Stripe TEST.  
**Purpose:** Execute exactly the six owner-ordered Chart Studio release priorities plus eight related technical exit gates, without relabeling fixture runs as commercial or human-browser acceptance.  
**New file required:** Yes—separate execution register, not a replacement for previously accepted evidence.

## Version 1.1 controlling owner/engineering acceptance update (October 31, 2026)

**Authorized internal sign-off:** Crownlight product-owner, QA, technical documentation and editorial scope decisions are approved for the specific verified requirements below. This does **not** assert paid-customer evidence, external legal review, third-party terms compliance, a human CAPTCHA completion or a final production-wide release. The former 50% statement based on "7 of 14 gates passed" was internally inconsistent with the listed open/partial rows; it is superseded.

**Strict complete acceptance:** **3 / 14 = 21.4%** fully closed gates.  
**Planning-progress estimate:** **53.6%**, calculated transparently as (3 fully passed × 1 + 9 partially tested × 0.5 + 2 open × 0) / 14. This is an equal-gate heuristic, **not an engineering-hours estimate or claim that 53.6% is production-certified**.  
**Test coverage advances:** Genuine Standard/Professional Chromium and two-tab CAS passed after the older v1.0 baseline; all three current Studio tiers have now been tested using real GoTrue sessions, but Founding billing rows and staff roles were not used to manufacture subscription acceptance.

| Gate | v1.1 strict disposition | Supported scope and remaining work |
| --- | --- | --- |
| **C01** Real Standard/Professional Chromium | **ACCEPTED** | [GitHub Actions 41236465069](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41236465069) PASS: independent actual GoTrue Standard and separately scoped Professional member; correct layout/locked options, desktop + phone, keyboard and persisted studies. QA-only grant, not purchased Founding 60. Earlier real Advanced [41235291824](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41235291824) remains passed. |
| **C02** Full role and plan matrix | **PARTIAL** | Free/Founding14/30/60 and OWNER/ADMIN/MODERATOR plus expired/reversed/restricted/suspended fixture server contracts PASS (latest source CI [41236500803](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41236500803)). Real paid-plan/role lifecycle still separate; no forged commercial entitlement. |
| **C03** Complete Professional workspace | **PARTIAL** | Actual Professional layout, EMA/RSI and sync persisted through authenticated reload; real two-tab CAS PASSED; two-pane drawing and symbol collections in fixture. Real Pro drawing + multi-chart UI save/restore not individually certified end-to-end. |
| **C04** Fictional/CSV/member BYO | **PARTIAL** | Owner scope decision: private member-connected **Tiingo/Alpaca BYO API key data is an accepted supported source class**, not a publisher-licensed historical library. Existing fictional/CSV parsing, BYO source integrity source tests and Owner-confirmed Tiingo ingestion are retained. Provider terms, secure handling and distribution limitations remain; any packaged official replay datasets need separate provenance. |
| **C05** Accessibility and configured CAPTCHA | **PARTIAL** | Real Advanced, Standard and Professional mobile keyboard checks passed; full screen reader, contrast, focus-order and error recovery audit open. CAPTCHA is **intentionally disabled for Owner QA**, so an active CAPTCHA challenge is NOT a prerequisite for this QA window; before enabling it again, run a separate form-specific release check. |
| **C06** Stripe TEST / Lumens settlement | **PARTIAL** | Genuine Stripe TEST paid Professional mixed checkout, signed refund, restoring Lumens and revoking Pro, plus signed unpaid expiration are ACCEPTED (commerce register v1.2). Original wallet remains 29 Lumens. **Provider-backed charge.dispute.created and actual fully-Lumen $0 cash order/reversal remain OPEN**; transaction-rollback proofs do not substitute for these. |
| **C07** Two-account workspace isolation | **ACCEPTED** | Two distinct real GoTrue accounts, denied cross-account reads, direct table inaccessible, QA cleanup [41233580742](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41233580742); additional real account-owned workspaces in [41236465069](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41236465069). Wallet and broader system BOLA separately tracked. |
| **C08** Expiry and revocation | **PARTIAL** | Real Advanced effective-tier refund downgrade previously passed, fixture QA pass/cash expiry, staff role expiry, restricted and suspended denial. Actual paid full lifecycle / in-browser revocation for all real roles remains. |
| **C09** Two-tab concurrency and CAS recovery | **ACCEPTED for Chart Studio workspace** | Same-auth-user two actual Chromium tabs, older revision denied HTTP 409 WORKSPACE_CHANGED, winner's data and revision preserved, verified for Standard and Professional; [41236465069](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41236465069). Other products not covered. |
| **C10** Sign-out / account-switch | **PARTIAL** | Actual earlier James_Test sign-out/re-login and privacy, plus fixture signed-out/account switch state clearing. Current separate Standard/Pro run preserved own records; live cross-user back-navigation/sign-out matrix still open. |
| **C11** Replay chronology and rights | **PARTIAL** | BYO ungraded personal chart paths may proceed with provider terms and provenance labels, not as an official redistributable replay product. Source checks protect against future bars and mislabeling; real 1/3/5-minute multi-timeframe no-lookahead/graded replay certification remains. |
| **C12** Provider outage/recovery operations | **OPEN** | Source-level fallback exists. Need authenticated provider-outage simulation, UI recovery, runbook and monitoring evidence. |
| **C13** Security audit | **PARTIAL** | Supabase SQL verified Chart Studio private workspace, QA grant, cash upgrade, mixed order and Lumen-pass tables: RLS enabled and no direct anon/authenticated grants. Five elevated RPCs checked: anon/member EXECUTE false; service_role true. Broader security advisor / API and staff privilege review #158 still open. |
| **C14** Final exact-head release certification | **OPEN** | Targeted SHA test/deploy accepted, but concurrent main commits mean no frozen full-release SHA and all required workflows + Cloudflare parity + rollback have been accepted together. |

**Temporary test account safeguards:** Real browser acceptance returned `CLEANUP {ok:true, deleted:2, failed:0}`. Separate postflight SQL returned **0 temporary Auth users, 0 QA grants, 0 temporary profiles, 1 original saved workspace, James_Test 29 Lumens and 0 active paid upgrades**. The OIDC QA Edge function was retired to unconditional HTTP **410** with `verify_jwt=true` (v2); its workflow automatic push trigger was disabled. No permanent privileged browser-testing endpoint exists.

**Financial source verification nuance:** Stripe TEST charge disputes were zero when checked, and the accepted historical register explicitly names only **rollback** dispute/zero-cash simulations. An owner/editor signature cannot convert either into an actual provider event.

**Next execution sequence:** (1) targeted genuine Founding14/30/60 and staff authorized role expiry/revocation matrix using signed disposable QA roles without commercial purchase claims; (2) real Pro drawings/two synchronized datasets and cross-login privacy; (3) provider outage/mobile accessibility audits; (4) Stripe TEST genuine dispute and Lumen-only provider-free order, if safely attainable at $0; (5) full head SHA freeze, CI/Cloudflare parity and rollback. CAPTCHA-off remains a documented owner-controlled configuration decision.

---

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
| 1.0 | 2026-10-31 | Formalize owner's six priorities, next eight QA gates, controlling evidence and new GitHub mobile/financial source coverage | Superseded baseline |
| 1.1 | 2026-10-31 | Signed-in Standard/Professional Chromium and real 2-tab CAS, owner BYO/CAPTCHA scope, precise percentages and financial exception | Internal owner/engineering scoped acceptance |

**Footer:** SMFGU-QA-CHART-ROADMAP-20261031-003 · v1.1 · Internal engineering and QA · Not a commercial release certificate.
