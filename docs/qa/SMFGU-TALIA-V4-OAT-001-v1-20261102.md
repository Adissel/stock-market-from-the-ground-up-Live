# Crownlight V4 — Operational Acceptance and Release Decision
**Company:** Cyber Nexus Publishing / Crown & Lantern Press  
**Project:** The Stock Market: From the Ground Up  
**Document ID:** SMFGU-TALIA-V4-OAT-001  
**Filename:** `SMFGU-TALIA-V4-OAT-001-v1-20261102.md`  
**File type:** Markdown (.md)  
**GitHub controlling location:** `cybernexuspublishing/stock-market-from-the-ground-up/docs/qa/`, `main`  
**Google Drive location / document ID:** Not created; unassigned. A separate Drive file is not required to retain GitHub CI evidence.  
**Version:** 1.0  
**As-of date:** November 2, 2026  
**Status:** **RELEASE HOLD — production source deployed; full authenticated operational acceptance not established**  
**Purpose:** Reconcile V4 CI, authenticated browser tests, chart interactions, Tutor accessibility/privacy, exact source-to-production deployment, and final release decision.  
**Dependencies:** GitHub Actions, Cloudflare Pages, Supabase Auth/RLS, `src/tutor/TaliaClassroom.tsx`, existing `/api/member-tool-access`, `/api/market-tutor`, `/api/member-tutor-history`, ECharts 6.1, frozen Learning v3.3 and Lab v3.2.  
**New file:** Yes, this is the V4 operational acceptance record; does not replace the original source-release documentation.

## Controlling decision
Remain on **HOLD** for full V4 release acceptance. Preserve the existing learning engines, access controls, no-live-trading, ungraded Tutor mode and zero-new-spend policy. A completed source build does not prove pointer, mobile, staff, privacy, or genuinely interactive accessibility acceptance. A successful deployment on an old SHA does not certify another `main` SHA.

## Gate 1: controlled CI consolidation — ACCEPTED for original V4 source
- Original V4 release: `fec3dd62746c0164bd6bf10c4e19b6fe1e16d4c9`.
- GitHub 22 original checks: 15 success, 7 cancelled; all seven cancelled workflow jobs retried on **the exact same SHA**, attempt 2, and completed success. Effective evidence: **22/22 successful = 100%** for this selected source-release CI set; not a blanket sitewide green claim.
- Rerun workflow IDs: `41543415038`, `41543414859`, `41543414727`, `41543414685`, `41543415189`, `41543414805`, `41543414791`.
- Original SHA cloud deployment reported success.
- This accepted gate does **not** cover later route-fix commits or full sitewide release.

## Gate 2: genuine member and staff browser — PARTIAL / HOLD
- Added real encrypted-credential Playwright/Chromium acceptance: `.github/workflows/talia-v4-authenticated-release-qa.yml`, `tests/talia-v4-authenticated-release-qa.mjs`. Workflow uses the existing encrypted James_Test test secrets; no payment, entitlement purchase, graded answer submission or Tutor POST.
- On immutable original release, real James_Test login and matching Supabase-issued Auth identity **passed**; anonymous member gate and anonymous Admin API denial **passed**. Source/asset URLs returned HTTP 200.
- The test discovered that Cloudflare's canonical URL resolves to `/talia-classroom` without `.html`, while the React workspace had enabled enhanced controls only for `/talia-classroom.html`. Corrected both member and prototype canonical/HTML aliases, updated related tests and cache-busted the shared bundled UI.
- Route correction source commits: `bde5906dd07e8ae9e5d6b5e354cc7082555352c2` and `c7cf91dbd8e99e7c467088071dfddc766bea5bfd`. The latter's own Cloudflare deployment was skipped, **not** a successful deploy.
- A descendant commit `53e8073f755be7d301ce1f1cf210bcf73c7573ca` included the corrected source and reported **successful Cloudflare production deployment**: `https://ce574a77.stock-market-from-the-ground-up-d1r.pages.dev`. This demonstrates deployed code identity, not authenticated UI signoff.
- Earlier exact-asset browser run `41547121834` failed on a timing-sensitive guest sign-in presentation assertion. The stronger follow-up anonymous API-denial test `41547591769` confirmed guest Tutor API denial, no guest chart, anonymous Admin API denial and real James_Test website login; then encountered navigation-context teardown before chart acceptance.
- Browser execution `41548135472` targets the updated, fail-closed source-SHA verification and includes navigation retries; acceptance is **not claimed** until a successful full report and matching production manifest are available.
- A genuine staff-authorized prototype login and expiry/revocation cases remain unaccepted.

## Gate 3: chart interactions — SOURCE VERIFIED / BROWSER HOLD
- Source controls include synthetic 260-observation OHLC training fixture, EMA 9/20/200, synthetic volume VWAP proxy, 1/3/5-minute completed-bar aggregation, HH/HL/LH/LL swing labels, horizontal pan actions and pointer-release capture.
- Pure OHLC validation and source tests were exercised in the V4 source build; 200 one-minute bars enable a 200-observation EMA seed, while 3-minute and 5-minute displays at 200 base bars contain only 66 and 40 complete bars. No unfinished interval or future market observation may be shown.
- **Still pending live acceptance:** drag-release does not continue panning, mouse wheel zoom, right buffer, indicator multi-overlay, pointer click context, all timeframe counts, keyboard chart controls and mobile renders with actual authenticated ECharts.
- Never treat client-side fictional fixture as protected historical replay, actual trade prints, official assessment data or licensed live market feed.

## Gate 4: Talia, accessibility, privacy — SOURCE/DB VERIFIED / LIVE HOLD
- Supabase checked without writes: `crownlight_chart_workspaces_v1`, `gu_member_tutor_conversations_v014149`, `gu_member_tutor_exchanges_v014102` have RLS enabled and grant no direct SELECT privileges to `anon` or `authenticated`.
- Source API audits show member Tutor history and conversations are filtered by server-verified `auth.userId`. This does **not** replace a two-account attack test.
- `James_Test` and `QA_Secondary` are distinct existing email-verified active test identities; no credential, role or membership mutation performed. The new V4 cross-account query-isolation browser gate has not passed.
- Sitewide accessibility check `live-public-browser` in GitHub run `41546798959` failed with `('learn', 'skip link is not first keyboard stop')`; keep public accessibility acceptance open until investigated and rerun.
- Full screen-reader, keyboard-only, color/contrast, mobile and authenticated Talia candle-context synchronization remain pending.

## Gate 5: release decision — HOLD RECORDED
This is an evidence-based **hold signoff** under the delegated acting Owner/Administrator and technical QA role; it is **not** a claim of independent licensed legal, financial, educational or accessibility reviewer approval. No actual new payment or user entitlement was created, and no official grades or Lumen awards were issued by this release-acceptance activity.

### Metrics
| Measure | Observed | Interpretation |
| --- | --- | --- |
| Original scoped CI checks | 22/22 successful after rerun | Gate 1 accepted on exact original SHA |
| Accepted operational gate packages | 1/5 = 20% | Gates 2–4 and full-release signoff remain HOLD |
| Corrected route source | Implemented and successfully deployed in descendant `53e8073f` | Authenticated UI acceptance pending |
| Real browser login on original release | Pass for James_Test | Does not prove new route is operational |
| Chart pointer/multi-timeframe live tests | No verified successful full run | HOLD |
| Two-member Tutor privacy | Supabase source/RLS checked; live V4 two-account test not passed | HOLD |
| Final matching production SHA + all sitewide CI | Not accepted | HOLD |
| Whole Crownlight website completion | Not re-baselined | No fabricated overall percentage |

### Next execution, in order
1. Complete the in-progress exact-SHA Chromium runner; inspect redacted evidence artifact and fix any reproduced route/session or rendering defects, without bypassing CAPTCHA.
2. Obtain a successful authenticated chart and staff-prototype test against a matched deployed SHA; preserve exact versioned URLs and test account identity.
3. Verify pointer drag-release, EMA/VWAP warmup, 1/3/5-minute aggregated candles, keyboard navigation, mobile layout and reduced motion.
4. Run two genuine independent Auth sessions and confirm no cross-account Tutor history/privileged content leakage; complete screen-reader/keyboard audit.
5. Correct the `learn` keyboard skip-link finding and obtain all required non-cancelled workflows on the finally frozen `main` SHA, matching Cloudflare production.
6. Amend this acceptance document to ACCEPTED only after all release gates and artifacts are independently supported.

## Revision history
| Version | Date | Change | Disposition |
| --- | --- | --- | --- |
| 1.0 | 2026-11-02 | Reconciled successful original 22-job CI, exact-SHA deployed route fix, genuine member authentication, Browser QA blockers, Supabase RLS evidence and sitewide accessibility defect | Formal release HOLD |

**Footer:** SMFGU-TALIA-V4-OAT-001 · v1.0 · Internal noncommercial QA · Source completion is separate from authenticated operational acceptance.