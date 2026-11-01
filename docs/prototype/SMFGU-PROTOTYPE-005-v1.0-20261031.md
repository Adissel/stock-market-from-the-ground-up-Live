# SMFGU-PROTOTYPE-005 — React / TypeScript / Three.js Prototype Upgrade

**Document ID:** SMFGU-PROTOTYPE-005
**Project:** The Stock Market: From the Ground Up — Crownlight Prototype Center
**Owner / publisher:** Crown & Lantern Press / Cyber Nexus
**Filename:** SMFGU-PROTOTYPE-005-v1.0-20261031.md
**File type:** Markdown (.md)
**Version:** 1.0
**Created:** 2026-10-31
**Status:** Source candidate; CI, production deployment, and authenticated acceptance are not yet verified
**Repository:** cybernexuspublishing/stock-market-from-the-ground-up, main, docs/prototype/
**Google Drive location:** Not assigned or verified; no Drive document created
**New file required:** Yes
**Purpose:** Add a real interactive WebGL demo in the existing staff-only Prototype Center without changing production data.

## Scope and preserved decisions
- Preserve all 23 workspaces, nine classroom stages, eight Admin groups, eight membership preview codes and twenty classroom presets.
- Retain ECharts 6.1.0 for 2D charts and the existing Supabase/Auth staff access gate. No duplicate teaching, payment, or wallet services.
- Introduce React and TypeScript only in the existing 3D Experiments workspace, compiled at build time into a lazily loaded same-origin module.
- Provide sixteen clearly labeled fictional OHLCV bars, Three.js candle/volume rendering, orbit-and-zoom camera controls, two projections, candle-count control, camera reset, WebGL-unavailable fallback and an accessible values table.
- No account data, live market feed, trading operations, private grading, entitlement changes or real-money actions.
- Preserve the static Cloudflare Pages release workflow and main-only branch policy.

## Files and dependencies
- src/prototype/PrototypeThreeLab.tsx: original React + TypeScript + Three.js demonstration.
- assets/css/prototype-three-lab-v1.css: responsive design and reduced-motion handling.
- prototype.html: includes prototype-specific stylesheet.
- assets/js/prototype-center-v1.js: lazy-load and cleanup for 3D pane on navigation/sign-out/revocation/pagehide.
- scripts/build-pages.sh: pinned React, React DOM, Three.js, TypeScript, esbuild; strict typecheck; compiled ESM; dependency licenses.
- .github/workflows/prototype-center-v1.yml: updated source and build tests.
- tests/prototype-three-lab-v1.test.mjs and tests/prototype-center-v2-browser.test.mjs: static contracts and browser interactions.
- No new database migration, API route, RLS policy, secret, or paid service.

## Security and verification
The static compiled 3D asset is public and intentionally contains only fictional data. The complete Prototype document still uses the existing server-side staff authorization. Preview controls never mutate Supabase, Stripe, Lumens, membership entitlements, protected assessment answers or student progress.

**Acceptance gates:** source syntax, TypeScript compilation and CI browser tests — PENDING. Exact production deploy parity — PENDING. Genuine Owner/Admin sessions and role-denial acceptance — OPEN. Independent screen-reader/touch/accessibility and performance reviews — OPEN. This is not a claim of full WCAG conformance or production feature release.

**Rollback:** revert the targeted main commit; no SQL or financial rollback required.

## Revision history
| Version | Date | Change | Status |
|---|---|---|---|
| 1.0 | 2026-10-31 | First 3D lab with React/TypeScript and Three.js | Source candidate, technical acceptance pending |
