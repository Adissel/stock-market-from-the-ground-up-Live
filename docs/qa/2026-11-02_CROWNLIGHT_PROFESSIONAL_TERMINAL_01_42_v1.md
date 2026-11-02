# Crownlight Professional Chart Terminal — Requirements 01–42
**Document ID:** SMFGU-CHART-PRO-TERMINAL-001
**Project:** The Stock Market: From the Ground Up / Crownlight Chart Studio
**Company:** Cyber Nexus Publishing / Crown & Lantern Press
**Filename / file type:** `docs/qa/2026-11-02_CROWNLIGHT_PROFESSIONAL_TERMINAL_01_42_v1.md` / Markdown
**Version / date:** 1.0 / 2026-11-02
**Status:** PARTIAL SOURCE IMPLEMENTATION — CI, exact-deployment and real-browser acceptance OPEN
**Authoritative location:** GitHub `cybernexuspublishing/stock-market-from-the-ground-up`, `main`
**Google Drive location / document ID:** Not created / unassigned
**New file required:** Yes — retain this source QA register alongside existing releases
**Purpose:** Prevent duplicate Chart Studio work and track the Owner's first 42 requirements through independent verification.

## Verified pre-existing engineering
- Standard chart: `assets/js/crownlight-chart-studio-v2.js` uses Lightweight Charts, signed-in charting and completed-bar safeguards. Mouse kinetic inertia was disabled and sparse-candle density already corrected in a prior source change.
- Enhanced Advanced / Professional: `assets/js/crownlight-chart-tiers-v1.js` uses KLineChart 10.1, separate volume/oscillator panes, defined overlays, 2-chart Professional mode, adjustable studies and verified server entitlements.
- Synchronized views / member-private save: `assets/js/crownlight-workspace-v2.js`, `functions/api/chart-workspace.js`, existing Supabase RLS/CAS. Existing layouts are SIDE_BY_SIDE, STACKED, PRICE_FOCUS.
- Chart appearance: existing member appearance and indicator line style settings, originally tracked in `docs/qa/2026-11-01_CHART_MEMBER_APPEARANCE_WORKSPACE_V16.md`.
- Study research and prototypes do not themselves constitute fully released production indicators.

## Changes in this execution batch
1. Maintain a bounded 3–24 pixel Professional candle-density slider in the actual enhanced member chart toolbar; apply width to all mounted enhanced instances.
2. Preserve the density selection across enhanced chart remounts during the same authenticated session. Reset the in-session value upon account change or invalidated authorization. **Not yet a cross-device saved preference**.
3. Provide compact, responsive, high-contrast styling and visible keyboard focus on the slider.
4. Add no-cost static regression test `tests/test_crownlight_professional_density_v1.mjs` and include it in existing `.github/workflows/crownlight-chart-studio-browser-v2.yml`.

## Remaining acceptance for Owner requirements 1–42
- 01–10 rendering: independent graphical QA, precision, doji/volume presentation, CPU/GPU and responsive measurements; existing appearance must be verified against saved preferences.
- 11–20 interaction: real held-button pan, release-to-stop, wheel/anchor zoom, right buffer, touch and keyboard; long replay resets must preserve viewport.
- 21–30 linked workstation: genuine two-chart sync/unlink, pane dragging, resizing, independent chart view, layout/collection and cross-device preset behavior.
- 31–42 indicators: inventory reconciliation (production versus calculation-ready versus source-only), individual formula approval, warmup/session resets, user parameters, overlays, pane management, persisted presets, and Python independent comparisons.
- All requirements remain OPEN for *independent full production release acceptance* unless separately evidenced. Source existence must not be represented as finished UX.

## Security, compatibility, and rollback
- No schema, API, migrations, private answer-key, payment, membership, provider data, or entitlement changes in this batch.
- Use revealed-only validated candle events, no future bars, no new data requests from density control.
- Retain KLineChart + Lightweight Charts as installed, not a competing renderer.
- Regression and access checks must pass on the same final `main` commit and Cloudflare production SHA. Current pass status is unverified.
- Rollback: revert the chart-tier JS, CSS, regression test, and workflow changes together on main. No SQL rollback.

## Revision history
| Version | Date | Description | Status |
| --- | --- | --- | --- |
| 1.0 | 2026-11-02 | Audited existing first-42 scope; added Professional density, lifecycle reset, accessible styling, regression and CI wiring | Source committed, CI and browser acceptance open |

**Footer:** SMFGU-CHART-PRO-TERMINAL-001 · v1.0 · Internal engineering register · No financial execution or licensed-data claims.


## November 2, 2026 — subsequent execution / layout reflow
- **Prior source head:** `badec24a7e7e16d2ca514ebac30dc34df2c5f05b`; the GitHub connector's commit workflow retrieval is PR-only, therefore an empty response cannot prove a push CI result.
- **Enhancement:** Professional and Advanced KLineChart panels now register a bounded requestAnimationFrame-scheduled ResizeObserver on the chart frame; resize after CSS layout/sidebar changes even when the window does not resize. On Stop, disconnect observer and cancel pending frame to avoid stale references or multi-mount callbacks.
- **Source files:** `assets/js/crownlight-chart-tiers-v1.js` and `tests/test_crownlight_professional_density_v1.mjs`.
- **Source implementation commit:** `ed562263273fe9b48fd23effa676874e38b31010`; regression source commit `d4604d737a8519432e28e230bb7f5421ec12903b`.
- **Acceptance:** Source committed, browser proof **OPEN**. No authenticated window resize, keyboard, member-context, cross-device or Cloudflare deployed-SHA sign-off should be inferred.
- **Dependencies:** No new packages, DB migration, API, entitlements, billing, historical provider rights, or engine replacement.

| Version | Date | Description | Status |
| --- | --- | --- | --- |
| 1.1 | 2026-11-02 | Enhanced workspace panel responsive resize observer and regression checks | Source committed; CI/browser acceptance open |

**Footer:** SMFGU-CHART-PRO-TERMINAL-001 · v1.1 · Source evidence only.


## November 2 — extended execution: pointer correctness, release contracts, visual hierarchy
- Real Professional member chart divider now filters touch/pointer events by pointer ID, responds to lost pointer capture, clamps 25–75%, supplies accessible slider orientation, and checks current server-verified permission before accepting movement. This is *source implementation*, not confirmed cross-browser behavior.
- Existing private chart-workspace normalizer has additional executable Node assertions for 25, 50, 75, invalid fractional/string/null/out-of-range panel ratios and downgraded Standard/Advanced projections.
- CSS chart shell, OHLCV data blocks, enhanced toolbar, accessible focus styles and responsive presentation improved without touching chart prices or protected progress.
- Static regression suite checks pointer lifecycle and chart visual styling.
- Latest source commit in this sub-batch `ec9f5e1c7403334538a97dda71e1703e4330dba3`.
- **CI status:** GitHub combined commit statuses returned no statuses and the connected GitHub workflow-run endpoint filters to pull-request events. Therefore *push Actions execution and production match remain unverified*, not successful.
- **Remaining blockers:** Actual workflow run evidence, browser drag/release/zoom tests, genuine authenticated Professional member visual acceptance, indicator mathematical review across all 61 source guides and production deployed SHA comparison.
- **Database:** No migration. Existing `chart-workspace` JSONB normalizer accepts panelRatio without altering table definition.
- **Financial:** No payment, live brokerage operation, entitlement grant, licensed-feed redistribution, or paid provider service activated.

| Version | Date | Description | Status |
| --- | --- | --- | --- |
| 1.2 | 2026-11-02 | Pointer capture hardening, tested server normalization cases and Professional visual refinement | Committed; integrated CI/browser acceptance OPEN |

**Footer:** SMFGU-CHART-PRO-TERMINAL-001 · v1.2 · This is source-only evidence, not deployed release certification.


## November 2 — first-ten reconciliation and ECharts volume contrast
**Scope:** Owner-directed first batch of ten quality and acceptance requirements; existing Standard/Advanced/Professional/ECharts implementations remain in place.

| Gate | Source assessment | Acceptance |
| --- | --- | --- |
| 1. Reconcile chart engines | Standard Lightweight Charts; Advanced/Professional KLineChart; ECharts alternate study surface | Source reviewed; production parity OPEN |
| 2. Mouse drag / release | Standard `kineticScroll.mouse=false`; prototype pointer release fixes present | Authenticated browser drag/release OPEN |
| 3. Zoom, crosshair and density | Existing wheel/zoom controls, linked ECharts axes, Professional 3–24 spacing | Browser precision and input devices OPEN |
| 4. Candle / volume graphics | ECharts candles already distinguish up/down. ECharts volume bars changed from uniform blue to green/up, red/down and neutral/doji, using ONLY revealed bar open/close/volume | SOURCE CHANGE COMMITTED; visual acceptance OPEN |
| 5. Professional synchronization | Two-chart event synchronization and ResizeObserver source exist | Actual viewport/panel alignment browser QA OPEN |
| 6. Authentication / persistence | Existing server entitlement and `/api/chart-workspace` member-private persistence unchanged | Real authenticated / RLS QA OPEN |
| 7. Regression and CI | Existing Node/Playwright chart workflow contains chart regression gates | Exact final SHA CI OPEN |
| 8. Production deployment | Cloudflare deployed commit was not independently retrieved | Deployed SHA comparison OPEN |
| 9. QA traceability | This register updated with code evidence and outstanding gates | Register source COMMITTED; release not accepted |
| 10. Next batch | Deferred until the first batch's browser, CI and deployment gates succeed | NOT STARTED |

**Source change:** `assets/js/crownlight-echarts-studio-v1.js` commit `c2e213365731f64159b76b993cc393439f9b9c14`. Bar-value data remain unchanged. This is not an indicator formula or price-data change and does not introduce market feeds or dependencies.

**Verification limits:** GitHub connector source read/write is not equivalent to executing the site's Chromium suite. No browser, CI, production or accessibility sign-off is claimed here. No SQL migration, payment action, membership change, private grading or third-party data entitlement change.

**Rollback:** Revert ECharts chart source commit `c2e213365731f64159b76b993cc393439f9b9c14` if the changed volume color semantics cause regression. The historical volume remains untouched.

| Version | Date | Description | Status |
| --- | --- | --- | --- |
| 1.3 | 2026-11-02 | Reconcile first ten gates; ECharts directional volume visual correction; acceptance blockers recorded | Partial source implementation; release acceptance OPEN |

**Footer:** SMFGU-CHART-PRO-TERMINAL-001 · v1.3 · Source-only evidence, pending exact-head release acceptance.


## November 2 — Gate 1 browser acceptance execution attempt (v1.4)
- Gate: held-button drag pans, release immediately stops horizontal movement, and mouse-wheel zoom alters the actual rendered candle spacing.
- Existing real Chromium suite: `tests/test_crownlight_chart_browser_v2.mjs`; already checks desktop mouse-down/move/up, release-to-stop and keyboard panning. New wheel-effect assertion compares real `CrownlightStudio.getStatus().spacing` before/after `page.mouse.wheel(0,-210)`.
- Source test change commit: `3c6c0b401a06f90b7b1ae48e93a868b401fe61f8` on `main`. Existing `.github/workflows/crownlight-chart-studio-browser-v2.yml` lists this test and triggers on edits to it.
- CI verification: GitHub connector returned no commit status contexts and no pull-request workflow runs; the latter endpoint excludes ordinary push runs. The public workflow page could not be fetched. **No passing real-browser execution was observed in this turn.** Gate 1 therefore remains **OPEN / NOT RELEASE-ACCEPTED**.
- No production JS, DB, auth, entitlement, payment or replay-content changes in this Gate 1 test-only execution.
- Rollback: revert commit `3c6c0b401a06f90b7b1ae48e93a868b401fe61f8` if the new test check proves unstable; never disable drag/release safety checks to force green CI.

| Version | Date | Description | Status |
| --- | --- | --- | --- |
| 1.4 | 2026-11-02 | Gate 1 actual Chromium wheel-zoom acceptance assertion committed; CI results inaccessible | SOURCE TEST COMMITTED; RELEASE GATE OPEN |

**Footer:** SMFGU-CHART-PRO-TERMINAL-001 · v1.4 · No unsupported production acceptance claim.


## November 2 — Next 40 gates: batch release integrity checkpoint
**Scope interpretation:** The requested next 40 gates are acceptance/release checkpoints, not proof that 40 independent completed features exist. The existing requirement buckets 01–10 rendering, 11–20 interaction, 21–30 workstation and 31–42 indicators remain the controlling functional inventory. Do not silently equate these 42 requirements to the separate first-ten workflow gates.

**Engineering action:** Existing ECharts Chromium integration test had a stale numeric volume payload assertion after production source changed volume bars to item-specific up/down/neutral color objects. Updated `tests/test_crownlight_echarts_studio_browser_v1.mjs` to assert the actual ECharts bar-object data with unchanged observed values; source commit `d54c12092988cd65bf4a481954e35f5b3d99b261` on `main`.

**Release blockers:** A source test correction does not constitute a passing test run. GitHub's combined commit status endpoint returned no status contexts for that commit. Direct authenticated Chromium, exact-head GitHub Actions push result, and Cloudflare deployed-head confirmation remain unverified. Forty gates must NOT be marked released without their individual passing evidence. No further changes to chart engine, authentication, RLS, replay or payment were performed.

**Next execution order:** 1. Obtain actual failing/passing Actions run log for latest `main`; 2. Repair real Chromium regressions (especially ECharts volume payload); 3. Confirm mouse drag/release and wheel-zoom acceptance; 4. Verify authenticated saved workspaces and two-chart synchronization; 5. Verify indicator math and 42 requirements one by one; 6. Match production Cloudflare SHA; 7. Approve only independently accepted gates.

| Version | Date | Change | Status |
| --- | --- | --- | --- |
| 1.5 | 2026-11-02 | Align ECharts Chromium regression with directional volume rendering; record next 40 acceptance boundaries | Source correction committed; 40-gate release NOT ACCEPTED |

**Footer:** SMFGU-CHART-PRO-TERMINAL-001 · v1.5 · No unverified CI, browser, member, or deployment sign-off.
