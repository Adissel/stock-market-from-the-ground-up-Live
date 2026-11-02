# SMFGU-VIS-INT-005 — ECharts Five-Chat Dashboard Integration Source Release

| Document control | Value |
|---|---|
| Company | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | The Stock Market: From the Ground Up — Website |
| Document ID | SMFGU-VIS-INT-005 |
| Filename / type | `2026-11-01_ECHARTS_FIVE_CHAT_INTEGRATION_SOURCE_v1.md` / Markdown |
| GitHub location | `cybernexuspublishing/stock-market-from-the-ground-up` / `main` / `docs/releases/` |
| Google Drive location / document ID | Not created / not assigned; GitHub main is source of record |
| Version / date | 1.0 / 2026-11-01 (America/Chicago) |
| Status | SOURCE INTEGRATED; full GitHub Actions, real-browser, matching Cloudflare and authenticated Owner/member acceptance OPEN |
| Purpose | Record the five-chat coordination, visualization interfaces, Lab/Boot Camp/Admin adoption, tests and remaining acceptance with no unsupported whole-site percentage |
| Dependencies | `AGENTS.md`, `PROJECT_SITEWIDE_RULES.md`, SMFGU-COORD-005, SMFGU-VIS-CONTRACT-001, shared Basic Learning v3.3 and Lab v3.2, local ECharts 6.1.0, actual signed-in APIs, existing Admin event and frozen lesson IDs |

## Owner execution batch — exact six gates

1. **Five-chat coordination** recorded in `docs/sitewide/SMFGU-FIVE-CHAT-COORDINATION-REGISTER-v1.md`. Exact chats: Indicator Implementation; Branch · Learning And Lab Engines; Tutor Training; Build Interactive Tutor Website; ECharts Dashboard Implementation. This register is advisory; other-chat acknowledgement was not independently verified.
2. **Indicator responsibility** defined: Indicator Implementation owns mathematics, warm-up, no-lookahead and source rights; ECharts owns authorized rendering only, not new formulas or grading.
3. **Shared contract** recorded in `docs/engineering/SMFGU-VISUALIZATION-DATA-CONTRACT-v1.md`. Standalone `assets/js/crownlight-visual-kit-v1.js` v1.1.0 exposes `barOptions`, `indicatorSeries`, `stageJourneyOptions` with fail-closed input validation.
4. **Dashboard testing** expanded: deterministic Node contract tests, existing Free Foundations actual ECharts/Chromium tests and expanded Lab/Academy browser regression. Direct JS/V8 preflight checked representative inputs, null warmups, invalid stage indices, zero-record values and future-bar filtering. GitHub Actions and full Chromium suite acceptance NOT YET VERIFIED.
5. **Shared chart components** connected to Free Foundations (five ungraded saved reflections); Lab Player and Boot Camp Academy (ten-stage instructional navigation); Admin (authorized record count bar comparison and existing pie choice). The same-origin ECharts 6.1.0 loader and fallback still operate. Future Indicator Implementation/Interactive Tutor overlay consumers remain OPEN. No new endpoints, Supabase tables, external feeds, paid charge or client-granted entitlement.
6. **Consolidated release** remains OPEN: five concurrent chat workstreams keep publishing to `main`, Cloudflare skips superseded deploys and CI runs are not complete for a final frozen SHA. One earlier Cloudflare build succeeded on another SHA, but that does not certify this integration batch.

## Changed code and committed evidence

| Subsystem | Source / tests | Recorded commit (source, not released sign-off) |
|---|---|---|
| Five-chat coordination | `docs/sitewide/SMFGU-FIVE-CHAT-COORDINATION-REGISTER-v1.md` | `2a164f53` |
| Visualization contract | `docs/engineering/SMFGU-VISUALIZATION-DATA-CONTRACT-v1.md` | `ec3d0a65` latest update |
| Shared chart factories | `assets/js/crownlight-visual-kit-v1.js` | `b841ea3b` stage-options update |
| Unit contract | `tests/crownlight-visual-kit-v1.test.mjs` | `324c91ce` stage test update |
| Free dashboard | `assets/js/free-foundations-echarts-v1.js`, `dashboard.html`, browser test | `224e3c90` shared-kit browser-test update |
| Lab / Academy ECharts | `assets/js/learning-progress-echarts-v1.js`, `lab-player.html`, `bootcamp-academy.html` | `2cd3c2d0`, `5aae8349`, `be146202` |
| Lab / Academy browser regression | `tests/test_learning_progress_echarts_v1.mjs` | `5c4f92b0` |
| Admin authorized ECharts bars | `assets/js/crownlight-echarts-admin-v1.js`, `admin.html` | `f6320461`, `5036ffbf` |
| Admin actual ECharts browser test | `tests/test_crownlight_admin_shared_analytics_browser_v1.mjs` | `5eb145ca` |
| Browser CI wiring | `.github/workflows/crownlight-chart-studio-browser-v2.yml` | `5c04d2c5` |
| No-charge targeted visual unit gate | `.github/workflows/crownlight-visual-kit-contract-v1.yml` | `e03aa01d` |

A single eight-file git-tree commit was created twice but could not be moved onto `main` because of concurrent commits and a GitHub reference API error. The equivalent changes were **successfully published individually** using current blob SHA checks and verified from current `main`. The orphaned tree commits (`64b7adb5`, `50507a33`) are **not** release commits and must not be treated as deployed.

## Independent checks versus release acceptance

| Evidence | Result / limit |
|---|---|
| Direct source/V8 checks | Shared-chart source test preflight passed 11/11 Lab/Academy and 7/7 Admin checks. These are representative preflight assertions, **not** complete CI or actual Chromium execution. |
| Browser coverage authored | Free Foundations 390/1200; Lab/Academy ten-stage lifecycle; Admin 390/1200 with real ECharts vendor, zero records, filter, distribution switch and session clearing. Actual CI results pending. |
| GitHub Actions | `Crownlight Shared ECharts Visual Contracts` and `Learning Picker and ECharts Progress V1` were queued; later `Crownlight Chart Studio Real Chromium (Free, Offline)` in progress at commit `5c04d2c5`. New pushes can cancel/restart. |
| Cloudflare | Source commits verified in GitHub; full matching stable production SHA not independently established. Some deployments were queued/skipped due concurrent pushes. |
| Authentication / privacy | Reused existing authorized data events and client session disposal; no real signed-in Owner, Admin, Free member and second-account browser acceptance yet. |
| Mathematical/editorial safeguards | Pure indicator series excludes indices beyond `visibleThroughBar`, keeps null warmups, and does not calculate indicators. Source rights, formula provenance and actual historical replay still depend on their owners. |
| Accessibility | Semantic exact-count fallbacks exist. Independent screen reader, keyboard/mobile production and WCAG audit still open. |
| Payment and operations | No paid checkout, Stripe mutation, entitlement grant, SQL migration, new Python runtime or market-provider API. |

## Progress and execution order

**Six-gate batch:** 3/6 whole gates achieved in **source** (coordination, ownership, shared data contract), 2/6 partially implemented/tested, 1/6 pending integrated release. This is a **50% strict gate-closure baseline**, not a percentage of all required labor or the overall site.

**Requested group adoption:** Of five named shared-component target groups — Lab, Boot Camp, Indicator overlay consumer, Interactive Tutor, Admin — 3/5 have source-side adapter integration, 2/5 remain open. Additional Free Foundations source integration is outside that five-group denominator.

1. Diagnose targeted Node/real ECharts Chromium outcomes on the exact run; repair failed assertions without weakening checks.
2. Consume only editorially verified numerical indicator output from Indicator Implementation; finish actual replay no-lookahead tests.
3. Connect Interactive Tutor member presentation through a separately approved, authenticated and versioned handoff (no Tutor logic rewrite in this chat).
4. Run representative Lab/Academy/Free/Admin signed-in member, two-account, keyboard, touch and screen-reader cases.
5. Reconcile GitHub workflow matrices after all five chat batches settle; record actual pass/fail/cancelled counts against frozen exact SHA.
6. Confirm matching Cloudflare production SHA; complete one consolidated Owner acceptance only when independently ready.

## Revision history

| Version | Date | Description |
|---|---|---|
| 1.0 | 2026-11-01 | Recorded six-gate execution, shared kit rollout, no-charge source tests and open release boundaries |

**Footer:** SMFGU-VIS-INT-005 · v1.0 · Source release evidence, not production certification.


## v1.1 — Chart-to-Talia revealed-candle integration (2026-11-01)

**Document control:** SMFGU-VIS-INT-005, version 1.1. GitHub main remains the only source of record. No new Google Drive file/ID, Supabase SQL migration, charged API, premium edition, or entitlement has been introduced.

**New source:** `assets/js/crownlight-talia-echarts-bridge-v1.js` (initial commit `90747fcb`, session/retry fixes `5556fa14`, `030e990a`), `assets/css/crownlight-talia-echarts-bridge-v1.css` (`d42e8f51`). Mounted on `verified-replay.html` (`1bd54abc`) and `simulator.html` (`608d0eaa`).

**Data path:** Existing member-restricted chart controller emits `crownlight:revealed-bars` containing only *currently revealed, completed OHLCV observations*. The bridge rejects missing, null, nonfinite, negative, non-monotonic or inconsistent observations and any event containing more than 2,500 bars; it does not fetch/extend scenario data or derive hidden bars. A signed-in Supabase `auth.getUser` check is required before rendering; the verified-user lookup is briefly cached and sign-out/member changes immediately dispose the visualization. Authentication alone does not grant replay entitlement; the existing chart controller and protected server must enforce those rights.

**Formula ownership:** Existing `CrownlightIndicatorMath.ema` and `vwapProxy` supply original EMA 9/EMA 20 and HLC3-volume VWAP estimate. New ECharts adapter `CrownlightVisualKitV1.indicatorSeries` renders only indices up to `visibleThroughBar=history.length-1`, retaining null warm-ups. Existing `CrownlightChartTutor.analyze` supplies deterministic interpretation and an ungraded practice question, not a new AI/Tutor engine, official answer or trade recommendation. The exact-value native table remains available when ECharts fails. The source/symbol declaration is sanitized and not represented as a licensed/historical provenance determination.

**Focused tests:** `tests/test_crownlight_talia_echarts_bridge_v1.mjs` (`c3dac9f5`) checks strict prefixes, EMA warmup, malformed events, sign-out and account switch with canonical math and a controlled chart engine. `tests/test_crownlight_talia_echarts_bridge_browser_v1.mjs` (`845b6dd1`; assertion correction `b836672f`) exercises genuine pinned ECharts SVG at 390px/1200px, tooltip/series boundaries, exact table and sign-out using **mock** auth. Both are wired to the focused visualization CI (`f5330ccc`). Direct in-session V8 source execution additionally confirmed five-bar and 25-bar render paths with three series, strict 24-index cutoff, missing initial EMA and account-clearing behavior. **GitHub Node/Chromium run and live signed-in member acceptance remain pending.**

**Group adoption:** Of the five originally requested component groups—Lab, Boot Camp, indicator overlay consumer, Interactive Tutor website, Admin—**4/5 source-integrated** (Lab, Boot Camp, indicator chart teaching adapter, Admin). The fifth, actual independently authenticated **Interactive Tutor Website** conversation/UI integration, remains OPEN and owned by `Build Interactive Tutor Website`. The Simulator's deterministic Talia panel is not a substitute for the member's protected interactive chat product.

**Unresolved release gates:** Exact-head targeted test success, full mandatory CI, latest Cloudflare matching SHA, genuine multi-account permissions, phone/touch and screen-reader audits, source/licensing/editorial sign-off, and release acceptance. Continuous cross-chat commits may cancel older runs. No truthful overall website completion percentage is established.

**Revision history:** 1.1 / November 1, 2026 / replay-to-Talia chart visualization, source validation and test wiring / SOURCE ONLY, ACCEPTANCE OPEN.

**Footer:** SMFGU-VIS-INT-005 · v1.1 · Read-only ungraded visualization · No protected grading or live trade authorization.


## v1.2 — Real CI defect and correction (2026-11-01)

**Document control:** SMFGU-VIS-INT-005, version 1.2, same GitHub main filename, no Google Drive document ID created.

- GitHub Actions focused workflow run [41365272911](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41365272911) at source SHA `0ef65736` finished **FAILURE**. Its independent `visual-data-contract` Node job was **SUCCESS**, and its browser job **FAILURE**.
- Raw job log recorded **PASS** for the real ECharts Free Foundations 390/1200 browser test and the compact Lab/Academy ten-stage browser test. The Admin browser fixture then raised `TypeError: Cannot read properties of undefined (reading 'description')` because it expected `getOption().aria[0].description` to be present in ECharts 6.1.0.
- The production Admin DOM already supplies an exact `aria-label` to the chart and a visible synthetic-showcase warning. Corrected browser test `tests/test_crownlight_admin_shared_analytics_browser_v1.mjs` at commit `a1013112` now checks these **actual accessible DOM outputs**, while preserving zero-count, filter, data-table, pie choice and account-disposal assertions. This is a compatibility correction, not an authorization/security bypass or a disabled test.
- The newly authored Talia/indicator Chromium suite used the same unsupported ECharts option lookup; corrected at `ce873d26` to inspect its real chart element's accessible label, preventing the same failure.
- Direct in-tool V8 runtime with original `CrownlightIndicatorMath`, original `CrownlightChartTutor`, source visual kit and mocked DOM/verified session passed 5- and 25-revealed-bar computations, three visible-only overlays, null EMA warmup, malformed-event rejection and sign-out disposal. Its first mock omitted native `getAttribute`; after correcting the **mock**, real code exercised the rendering path. The bridge also now disposes a failed chart initialization (`030e990a`).
- Replacement run [41367024097](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41367024097) was **PENDING** at the last check on `ce873d26`. **Do not mark the new Chromium gate passed until its actual results are available.**
- The shared visualization effort now source-integrates Lab, Academy, Admin and indicator/Talia chart context, while the separate interactive Tutor conversation website and genuine multi-account browser integration remain separate acceptance tasks.

**Revision history:** v1.2 / 2026-11-01 / real CI failure, code/test correction and pending clean rerun; source only.

**Footer:** SMFGU-VIS-INT-005 · v1.2 · No payment, live trading, new Supabase writes or independent production approval.


## v1.3 — Chart-to-Tutor account-mismatch Chromium correction (2026-11-01)

**Base:** `main` at `011bf12996d90e512d41c3d309c4a8d01b485919`; clean before this batch. The reported Actions run `41371524815` was not accessible from the local GitHub CLI (not installed), so its historical hosted log was not independently re-read. The reported mismatch scenario was reproduced locally against the current source and failed at the same browser wait.

**Confirmed cause:** The browser fixture captured `location.pathname` while the popup was still its inherited initial `about:blank` document. It therefore permanently assigned the source account (`MemberA`) to the Tutor popup even in the `MemberB` case. The production account comparison was not receiving a different account ID, so the test waited for a rejection that its fixture could never produce.

**Changes:**

- `tests/test_crownlight_tutor_chart_handoff_browser_v1.mjs` resolves its mock identity when Auth is queried after navigation, and includes state diagnostics if the mismatch rejection regresses.
- `assets/js/crownlight-tutor-chart-handoff-v1.js` repeats the nonce-bound readiness message briefly to tolerate the real `window.open()`/popup-load ordering window. The sender serializes readiness checks, explicitly rejects a receiver with a different or unverified account, and the receiver stops retrying after rejection or acceptance. Origin, exact popup source, nonce, fresh sender Auth identity, receiver Auth identity, entitlement recheck, 450-character bound, user edit, and no-auto-submit controls remain in force.
- `tests/test_crownlight_tutor_chart_handoff_v1.mjs` pumps the async Auth/message path through an event-loop turn and supplies `clearTimeout` to its VM browser context.

**Contract and impact:** Existing `SMFGU-VIS-INT-005` one-time postMessage event remains v1 with the same payload fields and data boundaries. No database/API contract, entitlement, membership, protected assessment, grading, indicator math, historical-data cutoff, or payment behavior changed. No Supabase migration is required. Rollback is a revert of the three scoped source/test files; there is no persisted state to restore.

**Local evidence:** PASS `node --check` for the handoff source and browser test; PASS the handoff Node contract; PASS all five focused ECharts Chromium suites (Free Foundations, Learning Progress, Admin Analytics, chart-linked Talia bridge, and chart-to-Tutor handoff). The browser suite uses mocked identities and entitlement responses; it is not authenticated member acceptance. The workflow's two GitHub jobs, complete Actions matrix, deployed Cloudflare SHA, keyboard/screen-reader review, and signed-in two-account acceptance remain OPEN pending the resulting pushed SHA and genuine account access.

**Completion boundary:** The specific reproduced browser defect is corrected and locally verified. Interactive Tutor conversation history, source-grounded multi-turn dialogue, actual member progress persistence, assessment privacy, and real Free/Founding/Owner acceptance were not implemented or certified by this defect correction. Preserve the v1.2 and roadmap completion denominators; do not assign whole-site or full Tutor integration completion from these tests.

**Revision history:** v1.3 / 2026-11-01 / Corrected popup identity fixture and hardened same-origin readiness ordering; local 5/5 Chromium suites pass; hosted exact-SHA CI/deployment/auth acceptance open.

**Footer:** SMFGU-VIS-INT-005 · v1.3 · Local source/test acceptance only; no production certification.
