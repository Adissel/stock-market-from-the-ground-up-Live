# Crownlight V4 — Operational Acceptance and Release Decision
**Company:** Cyber Nexus Publishing / Crown & Lantern Press  
**Project:** The Stock Market: From the Ground Up  
**Document ID:** SMFGU-TALIA-V4-OAT-001  
**Filename:** `SMFGU-TALIA-V4-OAT-001-v1-20261102.md`  
**File type:** Markdown (.md)  
**GitHub controlling location:** `cybernexuspublishing/stock-market-from-the-ground-up/docs/qa/`, `main`  
**Google Drive location / document ID:** Not created; unassigned. A separate Drive file is not required to retain GitHub CI evidence.  
**Version:** 1.2 (controlling file retains the original v1 filename)  
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

### V4 final pinned-deployment browser evidence — 2026-11-02
- Browser run: [GitHub Actions 41551125843](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41551125843).
- **Test execution source SHA:** `a025b769bffa01797bbdc67d8004033a3e864df6` (GitHub QA automation revision).
- **Immutable tested Pages deployment SHA:** `8118a7789b51d3f0232fdf7c7be3f261aa2ab064`. Published fixed URL: `https://befe582b.stock-market-from-the-ground-up-d1r.pages.dev`.
- Manifest verified before and after browser actions, no drift. This is **pinned-build acceptance**, *not* a claim that the moving canonical production URL matched the workflow's execution SHA.
- **Result: 20 PASS / 1 BLOCKED** (20/21 = 95.2% of discrete checks). Workflow conclusion intentionally **failure** because one required positive staff identity was unavailable. Treat no browser feature as failed merely because full release conclusion was HOLD.
- Real James_Test password sign-in and server-verified `MARKET_TUTOR` entitlement: PASS. No CAPTCHA bypass, test purchase, wallet debit or official grade.
- Guest Tutor API denial, guest chart absence, guest Admin API denial: PASS. Authenticated ordinary James_Test member was denied the staff-only Talia prototype: PASS.
- ECharts initial seven-bar display and 200-candle demonstration: PASS. Simultaneous EMA 9/20/200 and synthetic volume VWAP-proxy series: PASS.
- Timeframes: 1 minute **200**, 3 minute **66**, 5 minute **40** fully completed candle groups. EMA 200 did not display when 3-minute/5-minute lookbacks were insufficient. Right-buffer three positions remained unpopulated with market data: PASS.
- Chart pan-left and pan-right, actual wheel zoom, pointer-drag release without sticky continued panning, keyboard Enter/focus, 390px mobile viewport, reduced-motion presentation, aria-label and accessible 200-row historical candle ledger: PASS.
- Chart-to-Talia ungraded instruction received the 200-revealed-candle context without requiring future candle information: PASS.
- **Genuine two-member private Tutor-history test: PASS.** Real independent Supabase-issued James_Test and QA_Secondary identities were authenticated; the forged `user_id` query did not redirect private history.
- **Positive Owner/Admin browser: BLOCKED.** Neither designated QA account currently holds an active staff role, and no genuine independently authorized staff browser credentials are configured. No roles were granted, passwords changed or permissions bypassed to force this check.
- **Full screen-reader and sitewide accessibility: HOLD.** The earlier public `learn` skip-link-first-keyboard-stop failure remains unresolved; semantic and keyboard assertions for the V4 classroom do not substitute for assistive-technology acceptance.

### Revised acceptance metrics
| Gate | Evidence | Decision |
| --- | --- | --- |
| 1. Original V4 CI consolidation | 22/22 selected checks successful after seven exact-SHA reruns | **ACCEPTED** for source `fec3dd62` |
| 2. Authenticated classroom and prototype | Real member rendered; nonstaff prototype correctly denied; positive Owner/Admin unavailable | **PARTIAL / HOLD** |
| 3. Chart interaction and indicator acceptance | Actual Chromium 1/3/5m, EMA/VWAP proxy, pan, wheel, drag-release, mobile and keyboard checks passed against pinned source `8118a778` | **ACCEPTED** on pinned build |
| 4. Talia, accessibility and privacy | Correct Talia chart prompt and two-account history isolation passed; 18/18 built-static keyboard-first skip-link checks now pass; independent screen-reader acceptance remains open | **PARTIAL / HOLD** |
| 5. Full release signoff | Pinned build evidence exists; current production exact-SHA full-suite/positive staff acceptance not established | **HOLD** |
| Original functional browser checks | 20 PASS / 1 BLOCKED = **95.2%** | Member-scope evidence only, not launch readiness |
| Fully accepted gate packages | **2/5 = 40%** | Separate from 95.2% browser-check completion |
| Overall Crownlight website | Not independently re-baselined | No fabricated sitewide completion percentage |

### What is next — execution order
1. Obtain a **genuine authorized Owner/Admin** browser test identity via an existing protected credential workflow or authorized interactive sign-in, without granting broad staff roles to James_Test or bypassing authentication; verify prototype access, expiration and revocation.
2. Preserve the 18/18 built-static first-Tab-stop regression evidence, run deployed-route keyboard/screen-reader verification, and resolve the independent sign-in layout failure without weakening dimensions.
3. Freeze a single intended production `main` SHA; prevent unrelated changes from cancelling required workflow checks.
4. Run all required main CI workflows to a final non-cancelled conclusion, then verify Cloudflare canonical production `release-manifest.json` equals the same SHA before and after authenticated browser acceptance.
5. Publish the final release **ACCEPTED** decision only if all gates pass. Otherwise retain this HOLD, with owner-visible defect accounting.

### Continued execution — November 2, 2026, local
**Status remains RELEASE HOLD.** The following reflects tests and deployments, not a claim of final accessibility certification.

- **First keyboard stop — corrected and verified in built-static Chromium:** commit `9e590e46b05518e4c0c3c7162d9e9f3817208a08` moved the existing `.gu-skip-link` to the first body element on navigation mutations. It did not duplicate links or change entitlements. The earlier regression `('learn', 'skip link is not first keyboard stop')` has since passed all **18/18** offline browser configurations (six routes × desktop/tablet/mobile) in workflow [41557898146](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41557898146), and again in subsequent Premium runs.
- **Premium Actions cancellation handling:** `.github/workflows/premium-live-browser-qa.yml` now isolates manual/rerun attempts while allowing routine pushes to supersede stale runs. A cancelled historical run was restarted on its original `bd118406` commit, not silently counted as passing.
- **Dashboard QA synchronization:** commit `6995a2de` corrected the source test to respect the owner-approved permanent desktop sidebar and the mobile-only member toggle. The live dashboard source and membership permissions were not altered.
- **Sign-in layout verification remains OPEN:** later Premium runs reached the sign-in page and uncovered a test that incorrectly called absent promotional rails an overlap. Commit `bd118406` now tests only rendered rails and independently validates the compact centered sign-in form. The test then correctly identified an insufficient desktop form width in source `11e422b0976c4c829aa4946cdfb23011e29b7132`: **334 px at a 1,440-px fixture viewport** (test minimum 345 px). Full Premium workflow [41560172837](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41560172837) concluded **failure**. Do not treat the wider Premium QA as passed.
- **Cloudflare deployment:** commit `11e422b0976c4c829aa4946cdfb23011e29b7132` was reported successfully deployed by Cloudflare, including a scoped sign-in layout CSS adjustment. Production deploy success is not browser-layout acceptance. The exact source of the 334-pixel result requires correction or evidence-based alignment with approved responsive design.
- **Other sitewide checks:** the earlier `04f6e1a8` snapshot had 26/26 reported workflows successful. It is a historical baseline; newer commits cannot inherit green conclusions without corresponding CI and deployed-source verification.
- **Staff-positive / full manual accessibility:** no confirmed Owner/Admin QA credential or actual screen-reader certification. Preserve both holds and deny elevation of ordinary test accounts solely to manufacture acceptance.
- **Overall V4 package gates unchanged:** **2/5 accepted = 40%**; pinned V4 member and two-account browser checks remain 20 PASS / 1 BLOCKED, with the staff-positive item outstanding. Whole-site completion is not being estimated from this narrow gate count.

## Revision history
| Version | Date | Change | Disposition |
| --- | --- | --- | --- |
| 1.0 | 2026-11-02 | Reconciled 22-job CI, initial routes, live member authentication, source and RLS findings | Formal release HOLD |
| 1.1 | 2026-11-02 | Added real 20/21 pinned-build QA evidence, two-account isolation, chart gesture and indicator verification, accepted chart gate and separated staff-positive / accessibility holds | **Release HOLD maintained** |
| 1.2 | 2026-11-02 | Verified 18/18 keyboard bypass regressions, isolated Actions reruns and desktop-sidebar QA; documented unresolved sign-in form-width gate and latest deployed CSS | **Release HOLD maintained** |

**Footer:** SMFGU-TALIA-V4-OAT-001 · v1.2 · Internal noncommercial QA · Pinned-deployment feature acceptance is not full production, regulatory, financial, legal or independent accessibility signoff.
