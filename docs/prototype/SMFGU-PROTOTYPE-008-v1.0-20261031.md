# SMFGU-PROTOTYPE-008 — Three Advanced React/ECharts Experience Pages

**Document ID:** SMFGU-PROTOTYPE-008  
**Project:** The Stock Market: From the Ground Up / Crownlight Prototype Center  
**Owner / publisher:** Crown & Lantern Press / Cyber Nexus  
**Version:** 1.0  
**Date:** 2026-10-31 (America/Chicago)  
**Filename:** SMFGU-PROTOTYPE-008-v1.0-20261031.md  
**File type:** Markdown  
**Repository:** cybernexuspublishing/stock-market-from-the-ground-up  
**Branch:** main only  
**Google Drive location:** Not assigned or verified; no Drive file was created  
**Status:** Source implemented on main; strict build, Chromium interaction, accessibility, production deployment and authenticated member-ready acceptance require independent evidence.  
**Purpose:** Deliver three high-fidelity internal visual application prototypes with advanced simulated charting, guided teaching, and membership presentation comparison.  
**Dependencies:** Existing staff-only `/prototype.html` bootstrap and Owner/Admin API gate; React 19.1.1; TypeScript 5.9.3; esbuild 0.25.9; Apache ECharts 6.1.0; same-origin asset build; existing eight prototype membership identities.  
**New files required:** Yes (five: React TSX, CSS, bootloader, test and control record).

## Page inventory
| ID | Protected URL within existing Prototype Center | Distinct experience |
|---|---|---|
| P008-A | `/prototype.html?experience=a` | Six-design analytical workstation with variable panel order, candle replay, ECharts market/heat/equity/radar/volume charts, VWAP and candlestick learning |
| P008-B | `/prototype.html?experience=b` | Three different flagship application compositions: Quantum Command, Aurora Flow, Green/Black Terminal |
| P008-C | `/prototype.html?experience=c` | Side-by-side comparison of the eight existing membership-preview identities, with independent Chart Studio Standard / Advanced / Professional hypothetical selection |

The URLs are **presentation states of one existing staff-only protected document**, not three newly opened public static routes. There is no separate member login, pricing or permission implementation for these concepts.

## Design and interaction evidence
- Six A designs: Quantum, Neon Flux, Green/Black, Ember Forge, Aurora Flow, Onyx Prime. Each uses a unique dark palette and panel hierarchy, responsive CSS and a differentiated spatial composition.
- B flagship applications: Quantum (price with analysis), Aurora (instructor-first), Green/Black (high-contrast trader terminal).
- C membership selector: FREE, FOUNDING_14, FOUNDING_30, FOUNDING_60, FULL_MONTHLY, FULL_ANNUAL, LIFETIME, ONDEMAND_MONTHLY.
- Chart Studio tiers are **tool-preview selections**, not paid memberships or entitlement grants.
- Real interactive inputs: ECharts data zoom/hover/candle selection, stepwise replay reveal, volume/EMA/proxy toggles, drag/keyboard button reordering, candlestick OHLC inputs, volume-weighted trade calculations, ungraded answer checking, eight-membership comparisons and nine instructional stages.
- Synthetic OHLCV training streams use deterministic fictional candles. Bar-level proxy uses cumulative Σ(((H+L+C)/3) × bar volume) ÷ cumulative bar volume; accurately labeled **OHLCV VWAP proxy**. The independent three-transaction teaching problem demonstrates exact trade-print VWAP for invented transactions. No fabricated bid/ask, real security, live price or future unrevealed candle is represented.
- Original instructional quality, Talia explanations and retry access are equal for any legitimately accessible lesson. There is no private answer key or real assessment write.
- Server authority remains unchanged: all membership / plan entitlements, RLS, billing, account roles, enrollment and production learning records remain controlled by existing services.

## Files changed
- `src/prototype/PrototypeExperiences.tsx` — new TypeScript/React source, three modes, five ECharts visualizations, teaching interactions.
- `assets/css/prototype-experiences-v1.css` — isolated dark design systems and responsive composition.
- `assets/js/prototype-experiences-boot-v1.js` — browser JavaScript module bootstrap waits for authenticated Prototype Center to be unhidden.
- `prototype.html` — three links, protected host and local asset references.
- `scripts/build-pages.sh` — strict TypeScript no-emit check and bundled same-origin React module.
- `tests/prototype-experiences-v1.test.mjs` — source and governance assertions.
- `.github/workflows/prototype-center-v1.yml` — CI path triggers, test commands and build artifact check.
- This document.

## Acceptance boundaries
1. Source commit on main is **not equivalent** to successfully compiled or deployed production assets.
2. Strict TS build, local static/source contract checks, Chromium desktop/mobile interactions, actual Owner/Admin session, role-denial behavior, automated and manual accessibility, responsive chart resize, and Cloudflare deployment parity remain separately verifiable.
3. Neither actual membership entitlement allocation nor purchasability can be concluded from visual feature matrices.
4. No data migration, SQL, Stripe changes, refunds, charges, role grants, billing, Lumens ledger writes or public-content release.
5. Rollback is limited to reverting targeted source commits on `main`, keeping prior V7 Prototype Center intact.

## Revision history
| Version | Date | Change | Status |
|---|---|---|---|
| 1.0 | 2026-10-31 | Add A/B/C internal advanced experience pages, source tests and build pipeline | Source implemented; deployment acceptance pending |
