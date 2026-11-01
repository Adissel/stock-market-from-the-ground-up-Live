# SMFGU-PROTOTYPE-006 — Prototype Center Visible Experience Redesign

**Document ID:** SMFGU-PROTOTYPE-006  
**Project:** The Stock Market: From the Ground Up / Crownlight Prototype Center  
**Owner / publisher:** Crown & Lantern Press / Cyber Nexus  
**Filename:** SMFGU-PROTOTYPE-006-v1.0-20261031.md  
**File type:** Markdown  
**Version:** 1.0  
**Date:** 2026-10-31 (America/Chicago)  
**Status:** Source candidate; deployment, automated browser results and authenticated Owner acceptance must be verified independently  
**Google Drive location:** Not assigned or verified. New Google Drive file has not been created.  
**Authoritative repository:** cybernexuspublishing/stock-market-from-the-ground-up, main, docs/prototype/  
**New file required:** Yes  
**Purpose:** Replace the unchanged, extremely long Prototype Center opening view with a directly visible interactive workbench while retaining the 23 prototype workspaces and protected learning and design contracts.

## Problem verified from Owner screenshots
The prior V5 upgrade put Three.js/WebGL behind the separate 3D Experiments tab without changing the overall page. The opening classroom required extensive scrolling before reaching the ECharts price chart, while duplicate-looking rows and vertically stacked configuration controls displaced the substantive content. The screenshot demonstrates the problem; the previous statement that the Prototype page was upgraded was too broad.

## Implemented UX changes
1. **HTML5**: semantic command deck mount, clear experience, source-bound case and configuration regions; existing staff-gated application remains hidden until permission verification.
2. **CSS3**: new visual language in isolated CSS; six modular navigation shortcuts, compact sidebar, flexible two-column chart-and-case preview, responsive mobile breakpoints, reduced-motion and focus indicators.
3. **React + TypeScript**: an actual reusable navigation command deck visible immediately after authorized page load, type-checked and built into an ESM asset, using events to drive the existing workspace controller rather than a second application state authority.
4. **JavaScript**: existing ECharts/chart-inspector integration, authentication, 23 workspace navigation, case reveal limits and draft controls remain in their original modules; added lifecycle cleanup and event bridging.
5. **ECharts**: the existing 2D demonstration is now in the primary preview, ahead of lower-priority design controls, not several scroll pages below the teaching text.
6. **Three.js/WebGL**: the existing fictional 3D chart is accessible from the command deck and appears in the primary preview when selected.
7. **Server draft controls**: retain guarded Supabase API save/reload/restore functionality, but relocate the controls after the design editor. No persistence semantics are changed.

## Modified files
- prototype.html
- assets/js/prototype-center-v1.js
- assets/js/prototype-preset-sync-v1.js
- assets/css/prototype-center-v6.css (new)
- src/prototype/PrototypeWorkbenchDeck.tsx (new)
- scripts/build-pages.sh
- .github/workflows/prototype-center-v1.yml
- tests/prototype-center-v6-ui.test.mjs (new)
- tests/prototype-center-v2-browser.test.mjs
- docs/prototype/SMFGU-PROTOTYPE-006-v1.0-20261031.md (new)

## Governance
- Retains existing OWNER/ADMIN/TECH_ADMIN role verification plus control_panel.access, signed-in identity validation, protected case delivery and denial of SHOWCASE_VIEWER.
- No private graded answer keys, member progress, live securities data, Lumen ledger, Stripe, checkout, real trade orders, prices or entitlements are changed.
- Existing 8 membership layouts, 20 preset choices, 9 instructional stages, 8 Admin groups and 23 navigation workspaces remain intact.
- Existing server-backed design draft API remains draft-only and still independently authorizes requests.
- Public static JS never contains staff secrets; real data is still fetched only by authorized authenticated APIs.
- No SQL migration, security grant or schema change. Dependencies are the existing pinned React 19.1.1, TypeScript 5.9.3, Three.js 0.179.1, ECharts 6.1.0 and Cloudflare static Pages build.

## Release and verification
GitHub source contracts, strict TS compilation, full Cloudflare build, role-based synthetic Chromium tests and accessibility automation require successful execution on the exact commit. Verify Cloudflare's production deployment commit matches the accepted GitHub commit. Genuine authenticated Owner/Admin testing, cross-device appearance review, WebGL GPU verification, manual screen-reader checks, and rollout sign-off remain separate gates. Automated success is not equivalent to full production acceptance.

## Rollback
Revert the targeted V6 commit without reverting unrelated previous work; preserve the prior 3D experiment, authenticated page gate and other website systems. No SQL rollback.

## Revision history
| Version | Date | Change | Status |
|---|---|---|---|
| 1.0 | 2026-10-31 | First visible React-led Prototype command deck, chart-first/lesson-side-by-side layout, reorganization of editor and staff draft controls | Technical verification pending |
