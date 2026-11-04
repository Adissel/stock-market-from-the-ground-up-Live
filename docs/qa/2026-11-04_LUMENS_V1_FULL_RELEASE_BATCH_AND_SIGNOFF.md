# Crownlight Lumens V1 — Full Release Batch and Production Signoff Control

| Document control | Value |
| --- | --- |
| Document ID | SMFGU-LUMENS-V1-FULL-BATCH-20261104 |
| Project | THE STOCK MARKET: FROM THE GROUND UP / Crownlight Lumens |
| Google Drive location | Not created; final Drive location not assigned |
| Google Drive document ID | Not assigned |
| Filename | `docs/qa/2026-11-04_LUMENS_V1_FULL_RELEASE_BATCH_AND_SIGNOFF.md` |
| File type | Markdown |
| Version | 1.1 |
| Date | November 4, 2026 |
| Status | **FULL V1 RELEASE NO-GO — engineering batch integrated; independent acceptance outstanding** |
| Prerequisites | Owner-approved V1 scope; 429 approved learning reward definitions; independent academic case review; existing Supabase and Stripe TEST; James_Test plus a second genuine member; frozen main and Cloudflare exact SHA; applicable consumer/legal review |
| Purpose | Keep the 60 controls in one execution batch and prohibit unverified activation while tracking the final two V1 acceptance milestones |

## Governing decision

The owner-approved Lumens V1 definition is 11 milestones, with **9 accepted (81.8%)**. V2 gifting is explicitly out of scope. The sixty subchecks in `docs/qa/2026-11-04_LUMENS_V1_CONSOLIDATED_60_GATE_RELEASE_BATCH.md` are the controlling work breakdown, not 60 newly accepted milestone votes.

**Baseline register count:** 9 VERIFIED, 21 SOURCE, 30 OPEN. A SOURCE gate may have code and tests but lacks required live acceptance. A VERIFIED gate is bounded to the recorded evidence. The count and stage can change only on new attributable evidence; never convert a static fixture into an independent human approval.

## One consolidated execution batch

| Execution phase | Scope | Safe execution and completion evidence |
| --- | --- | --- |
| 01 — Baseline | Audit 429 reward rows, real release flags and wallet grants | Read-only Supabase script `supabase/qa/20261104_lumens_v1_full_release_read_only.sql`; never change a flag to make tests pass |
| 02 — Monetary accuracy | Internal $0.07/Lumen eligible discount; no cash or brokerage value; quote validation | Existing controlled offline unit tests and cross-provider TEST reconciliation |
| 03 — Wallet integrity | Included, purchased, earned and manual buckets; idempotency; refund restoration | Real test member `gu_lumen_member_wallet_integrity_v1`, no negative or unbalanced buckets, signed audit |
| 04 — Education | 419 Labs, 10 Boot Camps, independent review and exactly-once award issuance | Attributable human rubric/version/assessment mapping, true authenticated grade, verified credit and retry proof; **NOT COMPLETE** |
| 05 — Entitlements | Free, Founding 14/30/60, memberships, duplicate purchases and downgrade | Actual member identities and entitlement/ownership responses from backend, no synthetic permissions |
| 06 — Store | Eligible items, mixed TEST checkout, taxes, refunds, recoveries, webhook replay | Stripe TEST-only provider records, no user-facing LIVE charges until customer commerce is separately cleared |
| 07 — Genuine browser | James_Test wallet, history, logout/session, keyboard and second-account isolation | GitHub Actions secret-backed Chromium runs with `LAB_QA_EMAIL`, `LAB_QA_PASSWORD` and a second legitimate QA identity |
| 08 — Security | RLS, service-only issuer, restricted account, privilege and gifts-disabled | DB role grant audit, signed negative backend response and V2 policy/API/code hard stop |
| 09 — Exact SHA | Source test, public catalog, live no-auth privacy, immutable manifest and CI | Cloudflare Pages production `release-manifest.json.gitCommit` must equal the frozen main commit and all required Actions must pass |
| 10 — Signoff | Product, academic editorial, financial/legal, technical and release roles | Owner-delegated technical acceptance plus genuine independent external attestations where required; no fabricated reviewer, signatures or dated approvals |

## Accepted bounded technical evidence (not general release)

- Lumens 60-gate engineering batch integrated on the sole supported `main` branch in commit `cad9bf2dfa3339bd4b31e23183573323131bbfbf`.
- Consolidated source CI success for that commit. Later `808e7d17ee8d7b92d5760470159aa7d692c1f795` has passing engineering CI and a failed credential-dependent browser job.
- Cloudflare Pages production builds passed for commits `808e7d17ee8d7b92d5760470159aa7d692c1f795` and `2a229617e5b613c91c45c221a28f8d6ba2cd737c`; **not** proof of a frozen final SHA.
- Read-only Supabase James_Test wallet integrity returned `balanced=true` and 29 available credits. No independently approved protected cases or issued rewards. Separate TEST Stripe refund checks showed 13 Chart Studio Lumens and 1 expired Lumens reservation restored and all 5 specifically tagged TEST payments fully refunded.
- Authenticated Chromium was genuinely executed: the original run had missing `LAB_QA_*` values. A subsequent run passed the GitHub secret-presence preflight but failed during Supabase password authentication; Auth logs show a 400 `invalid_credentials` event in that window. No authenticated browser result is accepted. No email or password is exposed.
- `learning_rewards_enabled`, `member_gifts_enabled` and `mixed_checkout_enabled` stay **false** in production. Source policy keeps V2 gifting disabled even if an unrelated database operator toggles gift release flags.
- Historical draft reward budget is **1,483 Lumens at $0.07 each = $103.81** potential internal eligible discount per fully qualifying member, not an earned credit or payable cash promise.

## External blockers requiring real evidence

1. **Authentic member sign-in:** Verify that the existing GitHub Actions `LAB_QA_EMAIL` / `LAB_QA_PASSWORD` secrets match the actual confirmed James_Test user. The credentials are present but the password sign-in was rejected; safely rotate/reset the pair through Supabase Auth and GitHub Secrets only as an authorized operational action, never into a public issue, chat or file. A distinct second QA identity must also be configured using `LAB_QA_SECOND_EMAIL` / `LAB_QA_SECOND_PASSWORD`.
2. **Genuine independent academic approval:** Map each released protected case to an attributable independent reviewer, rubric, case version and approved revision; preserve official first graded result and do not mint credits by editing tables.
3. **Full Store and policy:** V1 included credits have an owner-approved 60-day rollover while purchased credits never expire. Existing general nonexpiry copy must be reconciled before release. Applicable licensed legal/consumer/tax review cannot be replaced by technical approvals.
4. **Payments/financial lifecycle:** Historical Chart Studio and bundle TEST refunds pass; generic checkout, renewal, failed-payment, replay/dispute and entitlement cases remain independently unaccepted.
5. **Immutable release cut:** Stop frequent main commits, obtain zero-failure required CI, confirm Cloudflare production exact SHA and real member browser results, then sign the OAT. An earlier green deploy does not sign off a later SHA.

## Hard-stop implementation and verification

- `tests/lumens-v1-consolidated-20261104.mjs`: noncharging reward, math and disabled-gifting contract.
- `tests/lumens-v1-batch-readiness-20261104.mjs`: validates the 60-gate register, 11-milestone baseline, live-gate presence, workflow wiring and independent HOLD status. It must **never** auto-approve release from source-only evidence.
- `tests/live-lumen-server-catalog-parity-v1.mjs`: reads production catalog, denied anonymous private endpoints, and (when `SMFGU_EXPECT_SHA` is set) the deployed release manifest exact commit.
- `tests/live-lumen-two-account-isolation-v1.mjs`: requires two genuine, distinct Supabase password sign-ins; tests wallet isolation and spoofed user IDs without changing balances, awards or Stripe records.
- `supabase/qa/20261104_lumens_v1_full_release_read_only.sql`: safe production data and RLS audit.
- `.github/workflows/lumens-v1-consolidated-batch-20261104.yml`: one CI batch, including existing protected-case, wallet, quote, TEST and webhook tests. Real browser job requires GitHub secrets and must fail closed.
- `scripts/build-pages.sh`: mandatory build-level Lumens release tests; no Cloudflare publication when offline contract checks fail.

## Executed full-batch CI evidence

At source SHA `7aadafd62f3aa7675ac82543699e557081f53409`, the new combined source/regression job **PASSED**, the separate live public noncharging catalog and anonymous privacy job **PASSED**, and Cloudflare Pages production deployment **SUCCEEDED**. This is a three-layer bounded engineering result. The complete workflow was still not successful because real member QA authentication did not complete. Follow-up commits `20e254ed64ae30764bac47ae62b7db7861ffb03b` and `d3f21958f6aa28c724555382cb135397686e54b1` add genuine two-account privacy and sanitized Auth diagnostics. All evidence is limited to the cited SHA and cannot automatically certify a newer main commit.

## November 4 repeat execution — verified outcome

- **Confirmed genuine James_Test authenticated browser PASS** on [Actions run 41924028007](https://github.com/Adissel/stock-market-from-the-ground-up-Live/actions/runs/41924028007): live Dashboard wallet and bucket display, balance reconciliation, private history, Lab/Boot Camp progress, navigation, disabled gifting, and denied anonymous private activity. A malformed digit-matching test expression caused earlier false-negative timeouts; fixed and regression-protected at source commit `15ef957af2e69c99f9cd4c65b1b743af68dbe02f`.
- **Second-member privacy remains BLOCKED, not PASSED:** the genuine second account's `LAB_QA_SECOND_EMAIL` / `LAB_QA_SECOND_PASSWORD` GitHub Actions secrets are not configured. No synthetic user or session was substituted.
- **CI policy correction:** separate `james-wallet-browser-live-smoke` and `two-member-wallet-isolation` jobs preserve the verified single-member result without waiving the independent two-member gate. The latter remains required by the manual immutable-SHA release job. This does not promote full V1 to GO.
- **Database reconfirmed:** 429 catalog scopes, zero published rewards, zero mapped independently reviewed protected assessments, zero earned awards, zero peer transfers and zero LIVE Lumen orders; learning issuance and P2P remain explicitly disabled.

## Signoff record

| Authority | Evidence and status | Acceptance |
| --- | --- | --- |
| Acting technical owner / engineering | Consolidated source, TEST refunds, disabled gates, selected Pages builds | Limited technical scope reviewed; NOT final release |
| Genuine independent assessment reviewer | No approved case-release rows | WITHHELD |
| Authenticated QA / privacy | James_Test authenticated Dashboard, wallet and history PASSED; second authenticated member privacy BLOCKED pending secrets | WITHHELD |
| Financial/legal licensed review | Outstanding included-credit, purchase/consumer obligations and general commerce lifecycle | WITHHELD |
| Final exact-SHA release authority | Moving main, no all-green matched production cut | WITHHELD |

**Decision:** The batch may deploy noncharging implementation; **full V1 release stays NO-GO**. The owner can delegate engineering decisions, but this cannot transform missing independent protected grades, credentials, legal clearance or actual payment evidence into approved results.

## Revision history

| Version | Date | Change |
| --- | --- | --- |
| 1.1 | 2026-11-04 | Reran genuine James_Test browser to PASS; isolated missing second-member secret gate from verified browser job; full release remains held |
| 1.0 | 2026-11-04 | Consolidated full V1 execution matrix, operational evidence, fail-closed scripts, external blockers and exact-SHA release requirements |

Footer: SMFGU-LUMENS-V1-FULL-BATCH-20261104 · Release control / internal OAT · Not a legal opinion or approval for customer charges, credits or assessed awards.
