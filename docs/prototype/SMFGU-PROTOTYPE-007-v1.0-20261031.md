# SMFGU-PROTOTYPE-007 — Crownlight Signature Terminal Visual Redesign

**Document ID:** SMFGU-PROTOTYPE-007  
**Project:** The Stock Market: From the Ground Up / Crownlight Prototype Center  
**Owner / publisher:** Crown & Lantern Press / Cyber Nexus  
**File:** docs/prototype/SMFGU-PROTOTYPE-007-v1.0-20261031.md  
**File type:** Markdown  
**Version:** 1.0  
**Date:** 2026-10-31 (America/Chicago)  
**Status:** Implementation source candidate; CI and deployment outcomes separately verified after commit  
**Google Drive location:** Not assigned or verified; no Google Drive file created  
**New file required:** Yes  
**Purpose:** Replace V6's generic cards and ordinary chart appearance with a coherent professional financial-analysis and instructional design studio.

## Original defect and owner directive
The Owner found the V6 Prototype page visually underdeveloped. The command deck was a row of basic tiles, ECharts was presented as a generic chart card, and the instructional content looked like vertically stacked default form panels. The V7 goal is a differentiated dark-financial-terminal UI, not a mockup, with genuinely working in-browser interactions.

## Controlling V7 scope and requirements
- PT-007-01: Compact Crownlight laboratory identity, carefully restrained colors and type scale, premium financial-workbench navigation.
- PT-007-02: Integrated financial-analysis canvas with visible, synthetic OHLCV data and a narrow role-protected lesson pane; coherent desktop/tablet/mobile responsive behavior.
- PT-007-03: Actual ECharts split price and volume panes, color-coded volume, ECharts zoom, hover/selection, axis linkage and optional cumulative typical-price weighted OHLCV proxy (never labeled true transaction VWAP).
- PT-007-04: JavaScript-driven functional toggles: volume, proxy line, gridlines, reset zoom; visible data-derived metrics (last close, change since first displayed open, visible range, candle count).
- PT-007-05: React/TypeScript functional view modes: Split, Chart Focus, Lesson Focus; independent existing JavaScript remains the single authority for rendering, staff role checks, fictional lesson data, and server drafts.
- PT-007-06: Keep existing 23 workspaces, 8 Admin groups, 9 teaching stages, 8 membership preview plans, 20 classroom presets, staff document protection, synthetic training source controls, never-expose private assessment keys, and no financial writes.
- PT-007-07: Verify source, TypeScript compilation, build, synthetic role matrix, Chromium interactions, automated accessibility, deployment commit parity; independent real-user acceptance remains open.

## Files
- prototype.html — refined semantic workbench and chart controls.
- assets/css/prototype-center-v7.css — new isolated terminal design and responsive states.
- assets/js/prototype-center-v1.js — enhanced ECharts plot and JavaScript event handlers; unchanged auth and draft APIs.
- src/prototype/PrototypeWorkbenchDeck.tsx — premium React shell, keyboard-operable workspace and layout modes.
- .github/workflows/prototype-center-v1.yml — V7 test hooks.
- tests/prototype-center-v7-terminal.test.mjs — static type and contract assertions.
- tests/prototype-center-v2-browser.test.mjs — browser interactions for preview toggles and view modes.
- docs/prototype/SMFGU-PROTOTYPE-007-v1.0-20261031.md — this control record.

## Boundaries
All displayed prices and volumes are invented for instruction, not actual securities or prices. A limited bar series must not reveal future data, and the typical-price weighted proxy must never be represented as market tape VWAP. The drawing layer has no trade execution, entitlement changes, wallet writes, Stripe endpoints, grade writes, or Supabase role escalation. The HTML and compiled React code are static presentation assets; the protected document gate and authenticated API checks stay in place.

**Dependencies:** Existing Cloudflare Pages, ECharts 6.1.0, React 19.1.1, TypeScript 5.9.3, Three.js 0.179.1, Supabase Auth and existing staff-only Prototype APIs.

**Database:** No schema changes, migration or SQL preflight/postflight required.  
**Authorization:** No changes to owner/admin/tech-admin access gates.  
**Payments:** No LIVE charges, Stripe updates or new paid services.  
**Rollback:** Revert this single main-branch source commit; previous V6 CSS/assets remain in repository.

## Acceptance ledger
Source contract, strict TS compilation, Cloudflare build, protected synthetic Chromium tests, keyboard layout test and deployment parity require evidence on this exact commit. Automated accessibility checks do not substitute for genuine screen-reader and manual usability review. Any failed test is a blocker to claiming V7 production acceptance.

## Revision history
| Version | Date | Scope | Status |
|---|---|---|---|
| 1.0 | 2026-10-31 | Signature terminal restyle, ECharts scientific visualization controls, React layout modes and tests | Source candidate |
