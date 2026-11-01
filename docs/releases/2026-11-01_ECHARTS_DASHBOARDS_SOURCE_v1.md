# SMFGU-VIS-DASH-001 — Apache ECharts Dashboard Integration, Source Batch 1

**Company / imprint:** Cyber Nexus Publishing / Crown & Lantern Press  
**Project:** The Stock Market: From the Ground Up  
**Document ID:** SMFGU-VIS-DASH-001  
**File / type:** `2026-11-01_ECHARTS_DASHBOARDS_SOURCE_v1.md` / Markdown  
**GitHub location:** `cybernexuspublishing/stock-market-from-the-ground-up`, branch `main`, `docs/releases/`  
**Google Drive location / ID:** Not created / unassigned; GitHub is controlling.  
**Version / date:** 1.0 / 2026-11-01  
**Status:** SOURCE IMPLEMENTED — exact-head CI, deployed SHA, genuine signed-in browser and accessibility acceptance OPEN  
**New document required:** Yes; this batch changes existing operational and learning visualizations and requires separate release acceptance.  
**Purpose:** Provide evidence for source changes, data provenance, scoped release acceptance, safety restrictions and rollback without claiming a live release.  
**Dependencies:** Shared Learning Engine v3.3, Shared Lab Engine v3.2, current Admin summary event and RBAC, five-day Free Foundations Auth-scoped API, existing local Apache ECharts 6.1.0 loader, Chart Studio and Pages build, Supabase Auth.

## Product decisions

- Retain Cloudflare Pages/Workers, Supabase, existing Auth/session contracts and ECharts 6.1.0 self-hosted bundle.
- **ECharts** provides charts, SVG/Canvas visuals and tooltip/zoom support. **React/TypeScript** stay in existing staff prototype and advanced Chart Studio UI; this batch does not replace the production HTML/JavaScript dashboard shell. **Python** remains an offline independent finance/math validation tool, not a new Cloudflare production runtime. **HTML5/CSS3** provide semantic labels, tables, responsive layout and high-contrast styling.
- Do not add an alternative chart engine, new persistent store, cloud service, premium charge or entitlement.
- Dashboard snapshots are **current record counts**; bars and doughnut charts do **not** prove trends, revenue, unique individuals or mutually exclusive groupings.
- Free Foundations charts are private member **ungraded saved reflections**, not assessed skill/mastery scores or historical market data.

## Changes delivered to GitHub main

1. `assets/js/crownlight-echarts-admin-v1.js`: existing authorized Admin summary data only; group filter (all/accounts/commerce/learning), colored ECharts graphics, formatted count labels, tooltips, reduced-motion support, ARIA descriptions and accurate native count-table fallback. Session-change disposal preserved.
2. `assets/css/crownlight-echarts-v1.css`: modernized responsive Admin analytics presentation, contrast and keyboard focus.
3. `assets/js/dashboard.js`: after validating the Free Foundations five-day member response and verifying session identity, emits an ungraded five-day progress event; errors explicitly clear the display.
4. `assets/js/free-foundations-echarts-v1.js`: new member-visible chart view switching between all five study days and four learning domains, sourced only from verified statuses; table fallback; no new API, PII, credential, score, paid service or database write.
5. `assets/css/free-foundations-echarts-v1.css`: responsive learning analytics styling and focus indicators.
6. `dashboard.html`: loads Free ECharts module and stylesheet after the existing locally hosted ECharts loader.
7. `tests/test_free_foundations_echarts_v1.mjs`: actual ECharts/Chromium contract tests at 390 and 1200 pixels, status grouping, invalid payload, account-switch clearing, accessible data and no fake scores.
8. `.github/workflows/crownlight-chart-studio-browser-v2.yml`: includes source triggers, syntax checks and new browser suite in existing no-payment CI.

## Source integrity and permissions

- **Data sources:** Existing Admin RBAC summary event; existing `/api/bootcamp-academy?program=free5` verified by `dashboard.js`. The chart modules do not query private tables themselves.
- **Review boundaries:** No new Supabase migration, RPC, Stripe mutation, market feed, uploaded datasets or real/synthetic price display.
- **Account changes:** Both chart controllers dispose instances and clear private snapshots on session change/revocation signals; Free module also rejects stale async chart initialization.
- **Learning integrity:** Saved reflection is only a practice event; zero official assessment scores or mastery are awarded.
- **Financial interpretation:** Admin record counts must not be summed into money or presented as one mutually exclusive population.

## Checks / acceptance register

| Gate | Current finding | Disposition |
|---|---|---|
| GitHub source files | Eight scoped files written to `main`; original engines remain | Implemented |
| JavaScript syntax | Changed browser JavaScript parsed successfully in independent V8 syntax check | Checked; not full CI |
| Local Apache ECharts use | Reuses already pinned 6.1.0 loader; no third-party CDN | Source verified |
| Free data and grouping browser | Test authored and wired to existing Chromium workflow | NOT YET EXECUTED / ACCEPTED |
| All existing chart regressions | Requires current SHA workflow results | OPEN |
| Genuine signed-in Free & privileged Admin browsers | Requires valid accounts, role checks and two-account clearing | OPEN |
| Keyboard, screen-reader, mobile visual and Cloudflare exact-SHA production | Requires independent actual-device/deployment evidence | OPEN |

**CI instruction:** Run `node --check` on changed JS, then `node tests/test_free_foundations_echarts_v1.mjs` alongside `node tests/test_crownlight_echarts_tv_adapter_browser_v1.mjs` with pinned ECharts 6.1.0 and Playwright Chromium installed. Do not declare pass from code review alone.

**Rollback:** Revert the eight scoped files together while preserving existing Admin summary endpoint, Supabase data, training progress, Chart Studio and live payment settings. If `dashboard.html` no longer loads the module, its event is inert; no database rollback is needed.

## Next execution order

1. Obtain one stable GitHub `main` SHA after concurrent pushes.
2. Complete new and existing Chromium ECharts browser tests and remedy failures without weakening assertions.
3. Check all required CI checks at the exact SHA; record passed/failed/skipped separately.
4. Compare exact GitHub SHA to Cloudflare production deployment state.
5. Verify actual Free and privileged Admin members, account switching, 390/768/1440 viewport, keyboard and screen-reader fallback.
6. Expand the same ECharts design system to authenticated Lab and Boot Camp teaching dashboards, then Journal and Chart Studio without a duplicate data engine.
7. Independently verify React/TypeScript prototype charts and Python/JavaScript indicator mathematics before accepting advanced trading visualization.
8. Complete final visual, permission, historical-data licensing and accessibility review.

## Revision history

| Version | Date | Description | Acceptance |
|---|---|---|---|
| 1.0 | 2026-11-01 | Admin analytics and Free Foundations ECharts source batch, test wiring and open acceptance gates | Source only |

**Footer:** SMFGU-VIS-DASH-001 · v1.0 · Crown & Lantern Press · No charge, private grading release or final production certification.
