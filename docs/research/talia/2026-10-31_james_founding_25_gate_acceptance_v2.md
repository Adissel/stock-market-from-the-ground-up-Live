# James_Test — Twenty-Five-Gate Founder and Release Acceptance

| Document control | Value |
|---|---|
| Project | The Stock Market: From the Ground Up |
| Document ID | SMFGU-F600-JAMES-QA-029 |
| Filename | 2026-10-31_james_founding_25_gate_acceptance_v2.md |
| File type | Markdown (.md) |
| Version / date | 2.4 / October 31, 2026 |
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

**20 of 25 gates are verified complete = 80%** on an equal-gate, audit-evidence basis. This is not a labor-weighted estimate nor a percentage of the entire website, all 419 Labs or 274 Academy day records. All 25 gates are mandatory to mark this specific acceptance program 100%. A single failed mandatory release or security gate can still block launch regardless of numerical completion.

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
| 16 | Run genuine post-revocation reauthentication and logout acceptance | PASS | Real production Chromium [41236744222](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41236744222) success, 10/10 including re-login and logout |
| 17 | Prove paid Founders Commons stays inaccessible after noncommercial QA | PASS | Real production member RPC returns shared-access denial with all QA grants cancelled, confirmed in 10/10 rollback run |
| 18 | Isolate 14-Day Standard Chart Studio from unrelated Advanced pass | PENDING | 14-Day observed Advanced due independently active Crownlight Chart Studio pass; not attributable |
| 19 | Prove 30-Day Advanced Studio from eligible paid cycle or authorized chart QA source | PENDING | 30-Day observed Advanced, but reason was independent pass; no paid cycle exists |
| 20 | Prove 60-Day Professional Studio and premium-only features under correct entitlement | PENDING | 60-Day observed Advanced via independent pass; not Professional; do not mark passed |
| 21 | Verify genuine second-member RLS and private workspace isolation | PASS | Real two-distinct-GoTrue-account source and production read-only API acceptance, [Actions 41237915385](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41237915385): STANDARD/ADVANCED, forged selectors denied, no foreign workspace leak, private learning and Lumen scope, zero production writes. RLS policy codebase-wide remains separate Gate 22/security audit. |
| 22 | Verify revoked and expired grant denial, staff-role boundaries and member negative cases | PASS — scoped nonstaff/invalid-auth boundaries | [Real production Chromium rollback run 41237841739](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41237841739), job 124645258325, **13/13 PASS**: canceled/expired 14/30/60 QA grants yield no paid Founder membership; paid Commons denied; James_Test not treated as staff; anonymous and invalid-bearer Chart access denied; signed out cleanly. Two genuine member private isolation separately passed G21. Full authentic Owner/Admin/Moderator role matrix and registration/Book Key remain distinct LIVE release security requirements. |
| 23 | Verify genuine Founder-exclusive Commons/Design Council and signed Stripe TEST lifecycle | PENDING | Requires noncommercial approved entitlement simulation and signed TEST scenarios; no LIVE charges |
| 24 | Pass entire sitewide main-commit CI and exact production Cloudflare release match | PASS — verified baseline | At `03750b3f0b95260032b03b1560410163793cad1a`, all 27/27 GitHub Actions workflows completed successfully and Cloudflare Pages production deployed the **identical** SHA successfully. This accepts the bounded CI/deployment snapshot only, not a final release freeze or any remaining Release Gate 24 conditions. Documentation changes after this SHA require fresh postcommit CI/deployment verification. |
| 25 | Finish all required independent curriculum editorial and final release controls | PENDING | Four formal reviews remain PENDING, 419 Labs/Academy editorial population broader; single author cannot certify independent review |

## Verified production results and negative observations

- Founding 14-Day: [run 41233891757](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41233891757), **16/16 passed**, grant ID 13 revoked.
- Founding 30-Day: [run 41234159045](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41234159045), **16/16 passed**, grant ID 14 revoked.
- Founding 60-Day: [run 41236464299](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41236464299), **16/16 passed**, grant ID 15 revoked.
- Verified post-test Supabase aggregate: all three grants canceled, **zero active Founding QA plan grants**. The original free/member baseline is retained. Existing Chart Studio pass remains separate and must not be removed as part of this Founder QA cleanup.
- **Studio attribution issue:** 14-Day reported ADVANCED, 30-Day ADVANCED, 60-Day ADVANCED; all three attributed to `Active Crownlight Sparks Chart Studio pass`. This is **not** a paid-member tier verification, and Professional was not demonstrated.
- Rollback real-browser [run 41236636067](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41236636067) completed **FAILURE** only because Playwright lost the page execution context during automatic sign-out navigation. Nine substantive preceding read-only checks passed (including paid Commons denial). Test harness corrected in commit `4ca3abec7f50eb4ffd4d98a3393896bd403d53aa`; the corrected real-browser [run 41236744222](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41236744222) **SUCCEEDED, 10/10 checks**, closing Gates 16–17. Original failure was a browser redirect execution-context race, not an authorization bypass.
- All three successful QA sessions tested Tutor access and protected-instruction boundaries, not Founders Commons commercial privileges, Chart Professional membership, payment refund/renewal, grade publication or historical market data.

## Owner acceptance decisions

1. **ACCEPTED for bounded noncommercial QA:** sequential 14/30/60 source Tutor and session access; 48/48 checks passed in actual production Chromium.
2. **NOT ACCEPTED:** asserting that a temporary Founder plan grant confers paid Founder status, a paid 60-Day Professional chart entitlement, Design Council voting, 600-member cap consumption, or invoice/Stripe lifecycle.
3. **NOT ACCEPTED:** publishing assessment answer keys or representing curriculum as independently editorial-approved without completed reviewer evidence.
4. **APPROVED for execution:** deterministic negative tests, RLS/identity isolation, signed Stripe TEST lifecycle without a LIVE transaction, exact-main CI, and correction of actual regressions only. Avoid weakening security assertions to make CI pass.

## Next execution workstream

Complete negative-access and two-account isolation (Gates 21–22), attribute Chart tier correctly (Gates 18–20), test paid-only privileges and TEST payment lifecycle (Gate 23), obtain final exact-SHA GitHub/Cloudflare acceptance (Gate 24), and close independently reviewed instructional records (Gate 25).

## October 31 continuation: security, chart source, curriculum and CI

**Progress is now 20 of 25 gates = 80%.** The previous 17/25 baseline increased by genuine two-account Gate 21, scoped real negative-auth/revocation Gate 22, and bounded exact-SHA CI/deployment Gate 24. Five Beta gates remain (18, 19, 20, 23 and 25). Broader LIVE Release Gates 20 and 22–25 remain separate and open.

### Source and audit changes
- Chart source regression `tests/test_founder_chart_tier_paid_source_boundaries_v1.mjs`, connected to `.github/workflows/founding600-source-gate-v014172.yml`. Checks Founder 14/30/60 tiers, nonrevoked real paid cycles, refund reversal, bounded QA-only grants, James_Test restrictive ceiling and no paid Founder impersonation. It is a code/source guard, **not** a signed-in Professional paid-plan test.
- Production Supabase `pg_class` and `has_table_privilege` review: RLS enabled on `user_plan_grants`, `gu_founder_members_v014173`, `gu_founder_paid_cycles_v014173`, `crownlight_chart_qa_grants_v1`, `crownlight_chart_restrictive_qa_v1`. `anon` has no SELECT privilege and `authenticated` has no direct INSERT, UPDATE or DELETE privilege on each inspected table. This verifies table boundaries, not the entire RPC authorization chain.
- `tests/test_james_founder_rollback_real_browser_v1.mjs` expanded with unauthorized/invalid-bearer Chart API and nonstaff role-negative checks. The prior genuine rollback run 41236744222 passed 10/10; the expanded run must pass before considering additional security acceptance.
- Genuine distinct-member test workflow `Chart Studio Genuine Two-Account Isolation QA` [41237915385](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41237915385) triggered as a noncharging no-push-cancel isolated run. Outcome pending at this record; a missing second GoTrue login **is a blocker**, not a pass.
- Founding Membership Stripe TEST Signed Lifecycle V2 [41237946062](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41237946062) triggered as an isolated source/TEST-fixture workflow. Covers signed paid TEST, failure, cancellation, refund, signature rejection, replay and migrations without LIVE charges. Outcome pending at this record.
- An obsolete Founding page claim that Free accounts require a book purchase was corrected to match current public Free registration and separately verified book entitlements. Its regression test was corrected; commercial Founder enrollment and numbered seat reservation remain distinct.
- Three Academy CI assertions corrected for ongoing cumulative lesson authoring: source fields, frozen 22-day baseline, 247-row continuity and zero independent grade approvals remain controlling. Exact authoring totals are no longer incorrectly frozen to earlier batch sizes; affected CI reruns pending.

### First-party editorial decisions — protected publication not approved
`SMFGU-TALIA-REVIEW-030` at `docs/research/talia/2026-10-31_four_lesson_owner_technical_editorial_review_v1.md` records owner-delegated first-party technical review for four fictional ungraded Labs. Independently recomputed bid/ask spread and midpoint, spread-width/liquidity caveat, market-order execution uncertainty and limit-price/partial-fill constraints; confirmed official SEC general source pages and the 2026-updated order-type bulletin. All four **remain independently editorial PENDING** in controlling `SMFGU-TALIA-REVIEW-027A`. No answer keys, mastery or independent reviewer identity were invented.

### Next acceptance actions
1. Obtain completed, successful expanded James_Test negative-browser run before security signoff.
2. Obtain completed true two-distinct-account production privacy isolation test.
3. Obtain signed Stripe TEST-only lifecycle test success and inspect hidden lifecycle failures.
4. Verify Chart Standard, Advanced and Professional using entitled sources and separate existing Sparks passes without changing owned commercial pass balances. Current per-plan source remains unverified.
5. Finish whole-site CI on a single stable exact SHA; confirm matching Cloudflare production deployment.
6. Close owner-reviewed editorial quality while recording all independently unreviewed units, real historical evidence and protected assessment holds accurately.

## October 31 verified Owner acceptance addendum — v2.3

**G21 genuine two-account acceptance (PASS):** [workflow run 41237915385](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41237915385), job 124645476836, completed SUCCESS. Job log explicitly records two independently authenticated GoTrue actor sessions, STANDARD and ADVANCED server-sourced tiers, ignored forged foreign account selectors, no cross-member private Chart workspace leak, private learning progress and Lumen activity restricted to each actor, and **zero production writes**. The job's optional missing-credential fail-closed diagnostic was skipped because the credentialed positive path executed. The earlier v2.2 pending wording is superseded. This does not certify a 14/30/60 paid Founder cycle, genuine Professional paid entitlement, every RLS function, or Gate 22.

**G24 specific source/deployment acceptance (PASS for the versioned snapshot only):** GitHub `main` at `03750b3f0b95260032b03b1560410163793cad1a` had exactly **27/27 successful completed Actions workflows**, with no failure, cancellation or pending among that SHA's triggered workflows; Cloudflare Pages production returned **successful deployment of exactly the same SHA**. This closes the bounded James_Test CI/deployment milestone. **The broader final LIVE Release Gate 24 remains OPEN:** it additionally requires final frozen version, the authenticated full role/customer matrix, accessibility, guarded payment/grading, and production release signoff. This v2.3 document update is a subsequent new commit, and must itself pass its newly triggered checks before being treated as the current verified production version.

**Commerce distinction (source-only PASS, commercial renewal HOLD):** signed Stripe TEST lifecycle [run 41237946062](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41237946062) completed SUCCESS, including simulated signature rejection, paid/refund/cancel guards and fixture assertions. The connected TEST provider still had **9 active subscriptions, 0 with test clocks**, and a read-only invoice comparison found **21 invoices (19 paid), zero subscriptions with two paid invoices**. Therefore neither Gate 23 nor LIVE financial acceptance passes.

**Security disposition (partial):** four anonymous-executable `SECURITY DEFINER` SQL function definitions were inspected; their current bodies implement public digital-book catalog, availability, payment-route and signed-book quote reads and have explicit restricted `search_path`. The review uncovered no direct mutation or secret-return field in those four definitions; it does not clear the remaining authenticated callable privileged functions, password protection, CAPTCHA, Book Key positive redemption or Gate 22.

**Internal Owner/technical QA acceptance:** sign off only G21 and the bounded G24 exact-source deployment checkpoint based on reproducible primary system evidence. Do not sign off G18–G20, G22–G23, G25 or full LIVE Release Gates 20/22–25. No charges, account grant changes, assessment publication, source secrets, or database writes were made by this acceptance.

## October 31 additional real-browser authorization closure — v2.4

**G22 genuine signed-in negative authorization (PASS, scoped to the Beta program):** [GitHub Actions run 41237841739](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41237841739), job 124645258325, executed updated `tests/test_james_founder_rollback_real_browser_v1.mjs` on source SHA `c97c6ccdb5b8d35e57c2a560d92c5accafae6f15` and completed **13/13 real Chromium PASS**. The log verifies the authentic James_Test account reauthentication, three previously granted 14/30/60 terms canceled/expired with no effective Founder membership, private paid Commons denied, refusal to inherit staff Chart privileges, anonymous and invalid-bearer Chart endpoint denial, independent existing Studio-pass attribution and signed-out clean session. Combined with [independent two-user GoTrue isolation run 41237915385](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41237915385), this meets the narrower Beta Gate 22's revoked/expired, nonstaff and member-negative evidence requirement.

**Scope held:** This check does *not* establish legitimate password recovery/registration/CAPTCHA, live positive Book Key purchase redemption, actual OWNER/ADMIN/MODERATOR/Founder-paid role matrix, regulatory review, a comprehensive authenticated privileged-RPC audit, or FULL LIVE Security Release Gate 22. The entire release remains held for G18/G19/G20/G23/G25 (Beta), LIVE Gates 20 and 22–25, and all unrelated commercial/independent editorial acceptance.

## Document history

| Version | Date | Change |
|---|---|---|
| 1.0 predecessor | October 31, 2026 | `SMFGU-F600-JAMES-QA-028` original 16-step tracker, 14-Day pass, 30-Day staged |
| 2.0 | October 31, 2026 | 25 verified-evidence gates; all three Founding plans 16/16; grants revoked; separated Chart attribution, rollback, paid-only benefits and independent editorial work |
| 2.1 | October 31, 2026 | Real post-revocation production Chromium run 41236744222 passed 10/10 including paid Commons denial, restoring baseline and closing Gates 16–17; 17/25 (68%) |
| 2.2 | October 31, 2026 | Logged expanded negative-auth tests, isolated two-member and TEST payment workflows, RLS audit, Chart paid-vs-QA source regression, CI corrections and four first-party technical editorial dispositions; no false gate promotion |
| 2.3 | October 31, 2026 | Evidence-accepted real two-user isolation Gate 21 and verified 27/27 exact-main/Cloudflare deployment Gate 24; 19/25 (76%); retained financial, editorial, security and final LIVE holds |
| 2.4 | October 31, 2026 | Added genuine 13/13 revoked/expired/staff-denial/browser negative evidence for narrower Beta Gate 22; 20/25 (80%); broad LIVE security held |

**Footer — Controlled internal QA evidence:** This document is a product-owner acceptance register, not legal, tax or investment advice; it does not certify a commercial paying Founder or an independent editorial review.
