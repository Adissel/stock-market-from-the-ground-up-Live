# Professional Terminal — 42 Operational Acceptance Criteria and Evidence Crosswalk

**Company:** Cyber Nexus Publishing / Crown & Lantern Press  
**Project:** THE STOCK MARKET: FROM THE GROUND UP — Crownlight Chart Studio  
**Document ID:** SMFGU-CHART-PRO-42-TRACE-001  
**Filename / file type:** `docs/qa/2026-11-02_CROWNLIGHT_42_REQUIREMENT_EVIDENCE_CROSSWALK_v1.md` / Markdown  
**Version:** 1.0  
**Date / status:** 2026-11-02 / EVIDENCE RECONCILED — historical subcriteria accepted, latest-head technical release open  
**Repository / branch:** `cybernexuspublishing/stock-market-from-the-ground-up` / `main`  
**Google Drive folder / ID:** Not created / unassigned; GitHub is authoritative  
**Purpose:** Turn the four general 01–42 ranges in `SMFGU-CHART-PRO-TERMINAL-001` into individually trackable operational criteria without discarding historical accepted evidence.  
**Dependencies:** `SMFGU-QA-NOREPEAT-001` (no-repeat), v1.8 42-range source register, v1.3 14-gate accepted Chart Studio register, accepted GitHub Actions, current GitHub CI and Cloudflare deployments.  
**New file required:** Yes; this detailed operational crosswalk was absent from the four-range source register.

## Interpretation, acceptance policy and denominators

The Owner's existing 42 register provided **four ranges**, not 42 individually worded original Owner requirements. The following 42 numbered **operational acceptance criteria are an engineering decomposition** of those ranges; they are not quoted as verbatim Owner requirements. The original scope stays frozen. Do not silently replace other Owner-specific instructions. A narrow criterion may be `ACCEPTED_HISTORICAL` when genuine prior accepted member/browser evidence proves that exact behavior; newer materially changed source still requires a delta regression but does not erase that accepted historical test. `PARTIAL` means genuine source/fixture/Owner evidence exists but complete latest release acceptance is outstanding. `OPEN` means the specific end-to-end proof is absent.

**Evidence checkpoint:** 10/42 (23.8%) operational criteria historically accepted, 27 partial, 5 open. This is **not** a claim that the current unreleased commit has achieved full exact-SHA production certification. Controlling other denominator: distinct 14-gate Chart Studio scope remains 3/14 fully accepted (21.4%), ten partial, one open. No false 0%-built interpretation.

## 42-item acceptance map

| ID | Operational acceptance criterion | Disposition | Evidence | Only missing or changed-surface work |
| --- | --- | --- | --- | --- |
| 01 | Standard authenticated chart display | **ACCEPTED_HISTORICAL** | [real Standard/Professional Chromium run 41236465069](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41236465069) | Only new display regressions after accepted SHA |
| 02 | Advanced authenticated chart display | **ACCEPTED_HISTORICAL** | [real Advanced QA25 run 41237482584](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41237482584) | Only changes after accepted SHA |
| 03 | Professional authenticated two-chart display | **ACCEPTED_HISTORICAL** | [real Standard/Professional Chromium run 41236465069](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41236465069) | New grid/divider geometry must pass targeted regression |
| 04 | Completed-candle numeric precision and labels | **PARTIAL** | Current source tests; tooltip work on main | Latest Chromium hover / live numeric precision |
| 05 | Candlestick body/wick contrast and high/low distinction | **PARTIAL** | Current CSS/source visual checks | Changed visual-browser proof |
| 06 | Directional candles and doji treatment | **PARTIAL** | Directional CSS/asset code | Real color/contrast and doji acceptance |
| 07 | Volume bar correctness and contrast | **PARTIAL** | Earlier ECharts directional-volume source | Updated chart rendering regression |
| 08 | Crosshair and hover readout correctness | **PARTIAL** | New homepage/terminal browser suite source | Actual latest hover Chromium result |
| 09 | Desktop chart layout in authenticated Chromium | **ACCEPTED_HISTORICAL** | [real Standard/Professional Chromium run 41236465069](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41236465069) | Only changed grid/divider geometry |
| 10 | 390px/mobile and keyboard-accessible signed-in baseline | **ACCEPTED_HISTORICAL** | [real Standard/Professional Chromium run 41236465069](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41236465069) | Recent mobile markup regression |
| 11 | Mouse-held pan changes visible range | **PARTIAL** | Earlier browser test source, prior baseline | Changed actual held-drag browser proof |
| 12 | Mouse release stops chart drift | **PARTIAL** | Earlier Chromium pan test and kinetic-off source | Current revised input interaction browser proof |
| 13 | Wheel changes candle zoom spacing | **PARTIAL** | Real Chromium wheel-effect assertion in test source | Passing execution on current relevant chart revision |
| 14 | Zoom-anchor placement remains correct | **OPEN** | Source feature review only | Actual anchored wheel/trackpad test |
| 15 | Keyboard Earlier/Later navigation respects limits | **PARTIAL** | Existing keyboard tests; newer boundary fix | Latest keyboard navigation browser proof |
| 16 | Touch pan and pinch on mobile hardware | **OPEN** | Pointer/touch source only | Device/touch acceptance or equivalent validated emulator |
| 17 | Professional divider pointer drag resizes columns | **PARTIAL** | Current JS/CSS source and 20 targeted source assertions (2026-11-02); actual latest Chromium result OPEN | Actual changed divider Chromium geometry |
| 18 | Professional divider stops resizing at pointer release | **PARTIAL** | Current JS/CSS source and 20 targeted source assertions (2026-11-02); actual latest Chromium result OPEN | Actual changed release/stop Chromium proof |
| 19 | Professional divider keyboard/ARIA controls | **PARTIAL** | Current JS/CSS source and 20 targeted source assertions (2026-11-02); actual latest Chromium result OPEN | Current browser keyboard/focus and assistive technology checks |
| 20 | Long-replay remount retains valid viewport | **OPEN** | Source observer/lifecycle tests only | Actual long-replay browser restoration |
| 21 | Server authorizes actual Standard/Advanced/Professional tiers | **ACCEPTED_HISTORICAL** | [real Standard/Professional Chromium run 41236465069](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41236465069); [real Advanced QA25 run 41237482584](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41237482584) | Changed server tier logic only |
| 22 | Distinct authenticated members cannot access one another's workspace | **ACCEPTED_HISTORICAL** | [two-member isolation run 41233580742](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41233580742) | New API ownership changes only |
| 23 | Two-tab stale revision denied; last good save preserved | **ACCEPTED_HISTORICAL** | [real Standard/Professional Chromium run 41236465069](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41236465069) | New concurrency mutations only |
| 24 | Saved EMA/RSI and layout restored after signed-in reload | **ACCEPTED_HISTORICAL** | [real Standard/Professional Chromium run 41236465069](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41236465069); [real Advanced QA25 run 41237482584](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41237482584) | Additional drawing/preset variants separately |
| 25 | Expired Professional selection is safely projected to Advanced | **ACCEPTED_HISTORICAL** | [real Advanced QA25 run 41237482584](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41237482584) | Future entitlement changes separately |
| 26 | Linked two-chart time/crosshair sync honors revealed bars | **PARTIAL** | Owner accepted historical sync; browser/source tests | Current linked-chart split/resizing proof |
| 27 | Explicit unlink preserves independent chart navigation | **PARTIAL** | Source sync toggle and owner review | Independent view/unsync actual browser test |
| 28 | Three layout choices and 2:1 Price Focus geometry | **PARTIAL** | Current JS/CSS source and 20 targeted source assertions (2026-11-02); actual latest Chromium result OPEN | Latest exact-SHA Chromium test for changed grid |
| 29 | Resized panel ratios survive authorized workspace save/restore | **PARTIAL** | Pointer source; real prior CAS baseline | Targeted split-ratio save/restore with current browser |
| 30 | Drawing-set dataset context, annotation and cross-device restore | **OPEN** | Normalizer and security tests | Real distinct datasets across authenticated sessions |
| 31 | SMA mathematical seed, windows and no-lookahead | **PARTIAL** | Executed 20 first-party JS indicator fixtures; independent Python reference and earlier Section C tests; latest post-change Cloudflare parity OPEN | Latest CI + integration into released study UI |
| 32 | EMA9/20/200 warmup, recursive math and no-lookahead | **PARTIAL** | Executed 20 first-party JS indicator fixtures; independent Python reference and earlier Section C tests; latest post-change Cloudflare parity OPEN | Latest Python/JS CI + visible rendering |
| 33 | RSI14 Wilder formula and flat-price edge cases | **PARTIAL** | Executed 20 first-party JS indicator fixtures; independent Python reference and earlier Section C tests; latest post-change Cloudflare parity OPEN | Latest parity CI + complete parameters |
| 34 | ATR14 previous-close true ranges and warmup | **PARTIAL** | Executed 20 first-party JS indicator fixtures; independent Python reference and earlier Section C tests; latest post-change Cloudflare parity OPEN | Latest parity CI + display |
| 35 | Bollinger 20/2 population band calculation and warmup | **PARTIAL** | Executed 20 first-party JS indicator fixtures; independent Python reference and earlier Section C tests; latest post-change Cloudflare parity OPEN | Latest parity CI + band rendering |
| 36 | MACD 12/26/9 signal, histogram and null warmup | **PARTIAL** | Executed 20 first-party JS indicator fixtures; independent Python reference and earlier Section C tests; latest post-change Cloudflare parity OPEN | Latest parity CI + pane display |
| 37 | HLC3 volume-weighted proxy and session reset labeling | **PARTIAL** | Executed 20 first-party JS indicator fixtures; independent Python reference and earlier Section C tests; latest post-change Cloudflare parity OPEN | Verify no venue-exact VWAP claim and released labels |
| 38 | Observed HOD/LOD/PMH/PDH levels never use future candles | **PARTIAL** | Crownlight indicator math observedLevels and no-lookahead source checks | Production cross-day/trading-hours fixtures |
| 39 | Opening range withheld until actual completion | **PARTIAL** | Executed source fixture passed for two-minute gate | Complete session/holiday/timezone regression |
| 40 | Confirmed structure cannot appear before confirming bars | **PARTIAL** | Executed 20-test source fixture | Full replay context and chart marker timing |
| 41 | Completed 1/3/5 minute OHLCV aggregates do not reveal unfinished bars | **PARTIAL** | Python independent reference and Node cross-language contract | Current exact-SHA command outcome and final replay QA |
| 42 | Reconciled available production indicator inventory, preset/source rights | **OPEN** | 73 Tutor guides distinct from computed/prototyped overlays | Approved per-indicator listing, licensing, accessibility and release decision |

## Completed targeted delta-review work (2026-11-02)

- Verified 20/20 distinct JS/CSS/browser-contract assertions against current GitHub versions of `assets/js/crownlight-workspace-v2.js`, `assets/css/crownlight-chart-tiers-v1.css`, and `tests/test_crownlight_chart_tiers_browser_v1.mjs`: Pro entitlement check, three layout modes, 67/33 Price Focus default, 25–75 bounds, divider overlay not a grid column, narrow viewport stacked fallback, pointer ID tracking/capture/release, keyboard slider ARIA and actual geometry test definitions.
- These are **source checks**, not a substitute for the pending current-head Chromium workflow. An earlier authentic signed-in Standard/Advanced/Professional baseline remains accepted.
- The server-facing production Supabase `SECURITY DEFINER` chart workspace v3/v4 and mixed/cash-test RPCs were read-only audited: anonymous and authenticated roles have no direct EXECUTE; service_role grants exist. This does not prove no BOLA in every other product.
- Historical CI source-integrity run 41510919439 SUCCESS; earlier accepted authenticated browser 41236465069 / 41237482584 and two-account isolation 41233580742 SUCCESS.
- Latest inspected production deploy for `3f8d106c97a8081a95243d6d4f3737e1fb8da0fd` was BUILD ACTIVE; latest Chromium run queued/pending. Recent intermediate Cloudflare builds recorded failures: do not approve the final release before exact-head parity and failure diagnosis.

## Execution order — no duplicate manual acceptance

1. Wait for/inspect one latest exact-head source and browser workflow that actually completes and compare to Cloudflare published deployment; do not treat queued, cancelled or partial run as passing. Diagnose failed intermediate Cloudflare builds without relaxing tests.
2. Fix only changed-surface layout/pointer/keyboard/OHLCV defects identified by real Chromium; rerun target tests, not the already accepted old signed-in 25-case or full historical two-member sessions.
3. Complete specific still-open new features: sync/unlink geometry, ratio persistence, multi-dataset drawings, cross-device restore, touch and long replay, screen-reader where supported.
4. Inspect new paid-plan/staff/member-expiry lifecycle and provider outage/source-rights failures only within approved noncharging scope. Do not invent paying customers or grant elevated production access.
5. Close additional items when the evidence classification for **each exact criterion** is satisfied; maintain historical closures. Preserve current Labs, Boot Camps and educational records' Owner editorial approvals.

## Revision history
| Version | Date | Change | Status |
| --- | --- | --- | --- |
| 1.0 | 2026-11-02 | Created explicit 42-row engineering acceptance criteria; reconciled historical signed-in browser, two-member, prior mathematical/source evidence; recorded 20 current-source delta checks and open exact-head blockers | 10 historical accepted / 27 partial / 5 open |

**Footer:** SMFGU-CHART-PRO-42-TRACE-001 · v1.0 · Owner acceptance preserved; release parity and untested new features remain open; no money, entitlements, protected grading or member changes.
