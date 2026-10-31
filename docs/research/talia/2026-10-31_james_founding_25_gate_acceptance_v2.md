# James_Test — Twenty-Five-Gate Founder and Release Acceptance

| Document control | Value |
|---|---|
| Project | The Stock Market: From the Ground Up |
| Document ID | SMFGU-F600-JAMES-QA-029 |
| Filename | 2026-10-31_james_founding_25_gate_acceptance_v2.md |
| File type | Markdown (.md) |
| Version / date | 2.0 / October 31, 2026 |
| Status | CONDITIONAL, PARTIALLY ACCEPTED — NOT FULL RELEASE APPROVAL |
| Owner | Owner-delegated product administration and QA |
| GitHub location | `docs/research/talia/`, `main` |
| Google Drive location / document ID | Not created / not assigned |
| Dependencies | Verified James_Test member; user-plan-grant source and RLS; real Chromium; SEC source-only Tutor; paid Founder verification rules; final stable CI; independent curriculum decision register |
| Purpose | Replace prior 16-milestone provisional tracker with 25 independently checkable gates for the bounded Founder QA plus sitewide/editorial acceptance continuation |

## Scope and approved working decisions

Use James_Test sequentially for FOUNDING_14, FOUNDING_30 and FOUNDING_60, one active `user_plan_grants` record at a time, with source `qa_james_founding_sequential_20261031`, short fixed expiration, audit trail and explicit noncommercial metadata. No payment, paid plan cycle, verified commercial Founder seat, protected assessment/mastery, or third-party AI is ever implied by this source marker.

The Owner delegates day-to-day product, administration, authoring and QA decisions to the assistant. **Role labels are not evidence of different reviewers**. Owner/technical-editor approval may accept reproducible engineering tests and original instruction; an independent curriculum review requiring a separate reviewer or payment-derived benefits requiring signed actual evidence cannot be silently self-certified.

## Current denominator and completion percentage

**15 of 25 gates are verified complete = 60%** on an equal-gate, audit-evidence basis. This is not a labor-weighted estimate nor a percentage of the entire website, all 419 Labs or 274 Academy day records. All 25 gates are mandatory to mark this specific acceptance program 100%. A single failed mandatory release or security gate can still block launch regardless of numerical completion.

## Twenty-five acceptance gates

| Gate | Required owner/admin/editor/beta-tester action | Status | Evidence or outstanding dependency |
|---|---|---|---|
| 01 | Verify James_Test real identity, verified member status and clean baseline | PASS | Production Supabase verified user, nondeleted member, no paid Founder subscriptions |
| 02 | Implement genuine session QA using existing encrypted LAB_QA credentials | PASS | tests/test_james_sequential_founding_real_browser_v1.mjs; no embedded credentials |
| 03 | Protect testing from paid charges, Founder seat creation and protected assessments | PASS | Noncommercial marked grants, no Stripe changes, source-only Tutor, no graded writes |
| 04 | Provision one temporary Founding 14-Day grant | PASS | user_plan_grants ID 13, source qa_james_founding_sequential_20261031 |
| 05 | Run genuine Founding 14-Day browser QA | PASS | Actions 41233891757 success: 16/16 checks |
| 06 | Revoke Founding 14-Day and verify closure before next round | PASS | Grant 13 canceled, ended 19:25:17Z |
| 07 | Provision isolated temporary Founding 30-Day grant | PASS | Grant 14, no overlapping active Founder grants |
| 08 | Run genuine Founding 30-Day browser QA | PASS | Actions 41234159045 success: 16/16 checks |
| 09 | Revoke Founding 30-Day and verify closure before next round | PASS | Grant 14 canceled, ended 19:55:11Z |
| 10 | Provision isolated temporary Founding 60-Day grant | PASS | Grant 15, no overlapping active Founder grants |
| 11 | Run genuine Founding 60-Day browser QA | PASS | Actions 41236464299 success: 16/16 checks |
| 12 | Revoke Founding 60-Day and preserve audit history | PASS | Grant 15 canceled, ended 19:56:29Z |
| 13 | Restore original James_Test plan-grant baseline | PASS | Production Supabase audit shows exactly three canceled QA grants and zero effective ones |
| 14 | Confirm all rounds had no paid subscription, charge or Founding seat | PASS | All 48 test assertions include no paid subscription/seat; none staged |
| 15 | Confirm source-only Tutor, SEC citations, protected Assess boundary and signout in all three rounds | PASS | 3 production Chromium runs, 48/48 total assertions; no paid AI or mastery |
| 16 | Run genuine post-revocation reauthentication and logout acceptance | PENDING | Rollback test first nine checks passed; sign-out navigation race corrected; rerun pending |
| 17 | Prove paid Founders Commons stays inaccessible after noncommercial QA | PENDING | Read-only production RPC negative confirmed in first rollback run; full rerun signoff pending |
| 18 | Isolate 14-Day Standard Chart Studio from unrelated Advanced pass | PENDING | 14-Day observed Advanced due independently active Crownlight Chart Studio pass; not attributable |
| 19 | Prove 30-Day Advanced Studio from eligible paid cycle or authorized chart QA source | PENDING | 30-Day observed Advanced, but reason was independent pass; no paid cycle exists |
| 20 | Prove 60-Day Professional Studio and premium-only features under correct entitlement | PENDING | 60-Day observed Advanced via independent pass; not Professional; do not mark passed |
| 21 | Verify genuine second-member RLS and private workspace isolation | PENDING | Separate genuine two-account workflow required; synthetic claims do not qualify |
| 22 | Verify revoked and expired grant denial, staff-role boundaries and member negative cases | PENDING | Add authenticated negative checks and preserve audit evidence |
| 23 | Verify genuine Founder-exclusive Commons/Design Council and signed Stripe TEST lifecycle | PENDING | Requires noncommercial approved entitlement simulation and signed TEST scenarios; no LIVE charges |
| 24 | Pass entire sitewide main-commit CI and exact production Cloudflare release match | PENDING | Concurrent pushes cancel sitewide runs; no stable final exact-SHA acceptance |
| 25 | Finish all required independent curriculum editorial and final release controls | PENDING | Four formal reviews remain PENDING, 419 Labs/Academy editorial population broader; single author cannot certify independent review |

## Verified production results and negative observations

- Founding 14-Day: [run 41233891757](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41233891757), **16/16 passed**, grant ID 13 revoked.
- Founding 30-Day: [run 41234159045](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41234159045), **16/16 passed**, grant ID 14 revoked.
- Founding 60-Day: [run 41236464299](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41236464299), **16/16 passed**, grant ID 15 revoked.
- Verified post-test Supabase aggregate: all three grants canceled, **zero active Founding QA plan grants**. The original free/member baseline is retained. Existing Chart Studio pass remains separate and must not be removed as part of this Founder QA cleanup.
- **Studio attribution issue:** 14-Day reported ADVANCED, 30-Day ADVANCED, 60-Day ADVANCED; all three attributed to `Active Crownlight Sparks Chart Studio pass`. This is **not** a paid-member tier verification, and Professional was not demonstrated.
- Rollback real-browser [run 41236636067](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41236636067) completed **FAILURE** only because Playwright lost the page execution context during automatic sign-out navigation. Nine substantive preceding read-only checks passed (including paid Commons denial). Test harness corrected in commit `4ca3abec7f50eb4ffd4d98a3393896bd403d53aa`; final rerun must pass before Gates 16–17 are accepted.
- All three successful QA sessions tested Tutor access and protected-instruction boundaries, not Founders Commons commercial privileges, Chart Professional membership, payment refund/renewal, grade publication or historical market data.

## Owner acceptance decisions

1. **ACCEPTED for bounded noncommercial QA:** sequential 14/30/60 source Tutor and session access; 48/48 checks passed in actual production Chromium.
2. **NOT ACCEPTED:** asserting that a temporary Founder plan grant confers paid Founder status, a paid 60-Day Professional chart entitlement, Design Council voting, 600-member cap consumption, or invoice/Stripe lifecycle.
3. **NOT ACCEPTED:** publishing assessment answer keys or representing curriculum as independently editorial-approved without completed reviewer evidence.
4. **APPROVED for execution:** deterministic negative tests, RLS/identity isolation, signed Stripe TEST lifecycle without a LIVE transaction, exact-main CI, and correction of actual regressions only. Avoid weakening security assertions to make CI pass.

## Next execution workstream

Complete Gates 16–17 rollback rerun, then negative-access and two-account isolation (Gates 21–22), attribute Chart tier correctly (Gates 18–20), test paid-only privileges and TEST payment lifecycle (Gate 23), obtain final exact-SHA GitHub/Cloudflare acceptance (Gate 24), and close independently reviewed instructional records (Gate 25).

## Document history

| Version | Date | Change |
|---|---|---|
| 1.0 predecessor | October 31, 2026 | `SMFGU-F600-JAMES-QA-028` original 16-step tracker, 14-Day pass, 30-Day staged |
| 2.0 | October 31, 2026 | 25 verified-evidence gates; all three Founding plans 16/16; grants revoked; separated Chart attribution, rollback, paid-only benefits and independent editorial work |

**Footer — Controlled internal QA evidence:** This document is a product-owner acceptance register, not legal, tax or investment advice; it does not certify a commercial paying Founder or an independent editorial review.
