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
