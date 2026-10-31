# James_Test — Sequential Founding Membership QA and Remaining Acceptance

| Document control | Value |
|---|---|
| Project | The Stock Market: From the Ground Up |
| Document ID | SMFGU-F600-JAMES-QA-028 |
| Filename | 2026-10-31_james_sequential_founding_member_qa_v1.md |
| File type | Markdown |
| Version | 1.0 |
| Date | October 31, 2026 |
| Status | IN PROGRESS — 14-DAY PASSED; 30-DAY QA GRANTED AND CI QUEUED; 60-DAY PENDING |
| Controlling location | GitHub main, docs/research/talia |
| Google Drive location / ID | Not created / not assigned |
| Purpose | Controlled QA audit using the same existing James_Test identity sequentially with 14/30/60 noncommercial time-limited grants |
| Dependencies | Existing encrypted LAB_QA credentials; approved Supabase account, user_plan_grants and RLS; production Cloudflare; genuine Playwright; existing Founder/Chart policies; independent curriculum reviewer |

## Approved Owner decision

Use the pre-existing James_Test identity for Founding 14-, 30-, and 60-day testing, **one noncommercial grant at a time**, without new test accounts. This supersedes the earlier assumption that three separate login identities are necessary **for sequential access QA only**. It does not substitute for multi-user RLS isolation, genuine payment lifecycle acceptance, or paid Founder entitlement. No commercial Founder seat is granted; no Stripe subscription or charge is made.

## Baseline and implementation

James_Test is an existing email-verified, undeleted member with no active paid Founding subscriptions. Four old full/lifetime QA grants are canceled. The temporary QA grants are source-marked `qa_james_founding_sequential_20261031`, short-lived, and written only to `public.user_plan_grants`. No auth password, user role, Stripe object, protected assessment, model-provider configuration or commercial Founding seat changed.

GitHub main additions:
- `data/qa/james-founding-sequential-v1.json` — exact expected user and one active test plan per stage.
- `tests/test_james_sequential_founding_real_browser_v1.mjs` — real production login, expected JWT identity, RLS-owned current single grant, no paid subscription/Founder seat, authoritative Tutor, SEC source, no grading/history/paid AI, Chart Studio observation, member-facing Tutor UI, and sign-out.
- `.github/workflows/james-sequential-founding-member-qa-v1.yml` — uses existing encrypted `LAB_QA_EMAIL` and `LAB_QA_PASSWORD` only, manual or scoped push trigger, pinned free Chromium, no write credentials.

## Acceptance rounds

| Round | Supabase grant | Production Chromium | Closure |
|---|---|---|---|
| FOUNDING_14 | Grant ID 13, source-marked, 60-minute upper limit | **PASS: 16/16**, Actions [41233891757](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41233891757) | Grant ID 13 status changed to canceled; ended 19:25:17 UTC |
| FOUNDING_30 | Grant ID 14 active; automatic expiration 20:25:24 UTC | [41234159045](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41234159045) **QUEUED** at this record | Revoke after verified test; do not overlap 60 |
| FOUNDING_60 | Not provisioned | Not executed | Stage only after 30 acceptance and rollback |

**Critical 14-Day Chart Studio observation:** The actual production account returned `ADVANCED` tier while the Founding 14-Day commercial reference tier is `STANDARD`, due to an **independent temporary Crownlight Chart Studio pass** already held by James_Test. This test does not independently establish commercial 14-Day Chart Studio tier behavior. The API correctly labeled the independent pass as its reason. Preserve the distinction between actual effective account access and entitlement caused by a Founding subscription.

The member acceptance described here is noncommercial **authenticated QA grant access**, not paid customer lifecycle, permanent Founder benefits, or independently approved member outcomes.

## Explicit 16-milestone acceptance tracker

1. Verify original James_Test identity, account eligibility and baseline — DONE
2. Build secure reusable real-browser sequential QA harness, no credentials in source — DONE
3. Provision auditable temporary FOUNDING_14 QA grant — DONE
4. Pass genuine 14-Day authenticated browser QA — DONE, 16/16
5. Revoke 14-Day grant and verify closure — DONE
6. Provision temporary FOUNDING_30 QA grant — DONE
7. Pass genuine 30-Day authenticated browser QA — PENDING
8. Check 30-Day Advanced Chart Studio separately from independently purchased or QA passes — PENDING
9. Revoke 30-Day grant and verify closure — PENDING
10. Provision temporary FOUNDING_60 QA grant — PENDING
11. Pass genuine 60-Day authenticated browser QA — PENDING
12. Check Professional Chart Studio with original entitlement versus separate QA access — PENDING
13. Revoke 60-Day grant, verify expiration and restore James_Test baseline — PENDING
14. Verify cross-account isolation, expired-grant denial, role and private Founders Commons restrictions — PENDING
15. Complete full sitewide CI on a stable exact SHA and verify exact Cloudflare production deployment — PENDING
16. Obtain named independent curriculum editorial decisions and finalize release evidence — PENDING

**Progress metric: 6/16 = 37.5% (reported 38%) for this bounded acceptance continuation.** This is a milestone ratio, not the entire website's overall percentage. Milestones intentionally differ in effort, so it is not a labor-weighted forecast. A green CI contract or original fictional examples do not constitute independent lesson approval.

## Next execution order

Finish 30-Day browser; verify its independent Chart Studio entitlement source; revoke 30; stage 60; pass its browser; inspect Professional-tier source; revoke 60; verify Standard-tier masking caused by previous Chart Studio pass; check private Founder benefit isolation; verify negative and second-account RLS; pass final full sitewide; verify production commit and deployment; obtain individually named editorial approvals and record final acceptance. Preserve main-only commits and no paid charges.

## Revision history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-10-31 | Owner-requested sequential James_Test acceptance; original 14-Day 16-check production browser pass; 14-Day grant canceled; 30-Day grant staged; remaining gates retained |

**Footer — Control:** QA evidence only. No entitlement here certifies a paid Founding 600 lifecycle, Stripe status, exclusive Founder Commons benefit, investment outcome, or protected curriculum mastery.
