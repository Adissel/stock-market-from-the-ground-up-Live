# SMFGU-PROTOTYPE-012 — Actual Member Teaching Source Parity

**Document ID:** SMFGU-PROTOTYPE-012  
**Company:** Cyber Nexus / Crown & Lantern Press  
**Project:** The Stock Market: From the Ground Up / Crownlight Prototype Center  
**File / type:** `docs/prototype/SMFGU-PROTOTYPE-012-v1.0-20261101.md` / Markdown  
**Version / date:** 1.0 / November 1, 2026  
**Status:** SOURCE IMPLEMENTED, CI AND ACTUAL OWNER ROLE ACCEPTANCE NOT AUTOMATICALLY GRANTED  
**GitHub authoritative location:** `cybernexuspublishing/stock-market-from-the-ground-up`, `main`, `docs/prototype/`  
**Google Drive location / document ID:** Unassigned / not created  
**New file needed:** Yes. SMFGU-PROTOTYPE-011 already documents the separate chart pan correction, so this distinct source-parity enhancement does not alter its controlling decisions.  
**Purpose:** Give the existing Owner/Admin-only prototype the *actual publicly available member curriculum index* and accurate distinctions between authored instruction and calculated chart indicators.  
**Dependencies:** AGENTS.md; Prototype V1–V11 controls; member Lab Engine v3.3; 419 public Lab paths; 30 public competencies; 61 public indicator briefs; 15 calculation-ready studies; /api/bootcamp-academy?action=catalog; source authorization; Cloudflare.

## Verified source inventory

- **419** canonical Lab IDs from `data/competency-lab-paths-v01499.json` and **30** authored public competency guides from `data/competency-study-guides-v01499.json`.
- Shared v3.3 Lab Engine: original nine persisted stages and ten displayed instructional steps (an ungraded Calculate substage was added). Separate private assessment, data provenance and entitlement rules still apply. The `data/labs.json` Foundations excerpt is **94** entries, not the 419-master source.
- The canonical Academy service presents ten program definitions plus Free Foundations with release filters. The prototype fetches the actual presently exposed `GET /api/bootcamp-academy?action=catalog`, rather than manufacturing paid entitlements or inventing unpublished courses.
- `data/tutor-indicator-study-v1.json` contains **61 authored, original source-informed research briefs**; `assets/js/prototype-indicator-workbench-v2.js` contains exactly **15 calculation-ready chart study entries**. Do not represent the other 46 guides as calculable overlays. Session OHLCV proxy is not trade-print VWAP.
- The advanced protected A/B/C pages already include ECharts simulated chart/replay, six design themes, eight membership previews, stage-aware deterministic Talia, chart pan/zoom, and a compact indicator workbench. None proves a live market feed or official grading.

## Implementation — existing staff-only prototype

1. `assets/js/prototype-curriculum-parity-v1.js`: read-only, staff-app lifecycle-controlled real source-catalog validation, searchable title/ID list, source-level per-Lab procedure and common mistake, Academy metadata, all indicator briefs, 15 calculation sources.
2. `assets/css/prototype-curriculum-parity-v1.css`: compact, collapsed-by-default premium teaching reference, responsive two-column inspector, keyboard-focusable controls.
3. `prototype.html`: adds parity inspector to the existing protected document, including the A/B/C three advanced prototype page context, without publishing a separate public standalone page.
4. `tests/prototype-curriculum-parity-v1.test.mjs`, `tests/prototype-center-v2-browser.test.mjs`, and `.github/workflows/prototype-center-v1.yml`: exact-source count, security, build and synthetic role/interaction checks.
5. Existing private assessments, original source rights, RLS, member progress, Studio entitlements, Stripe, Supabase schema and protected chart data are UNCHANGED.

## Ten acceptance gates

| Gate | Exact acceptance | Before conclusive latest CI |
|---|---|---|
| P12-01 | 419 unique canonical Lab source entries, no inferred official grades | Source implemented |
| P12-02 | 30 original competency guides properly mapped to Labs | Source implemented |
| P12-03 | 61 original indicator guides with genuine titles, formulas and limitations | Source implemented |
| P12-04 | 15 completed-bar calculated overlays, not 61 computed studies | Source implemented |
| P12-05 | Academy records reflect currently exposed public server catalog / flags | Source implemented; live request acceptance open |
| P12-06 | Protected staff application boundary and sign-out clear, no private writes | Source implemented; browser role tests required |
| P12-07 | Genuine filter/search and individual source detail interaction | Source implemented; Chromium required |
| P12-08 | Mobile/desktop keyboard access without burying chart beneath a large editor | Source implemented; Chromium and manual review required |
| P12-09 | Exact-source syntax, build, local Chromium, security and no-private-keys CI | Open until successful run |
| P12-10 | Matching SHA in Cloudflare and genuine Owner design/accessibility sign-off | Open until same-SHA successful deployment and authorized user inspection |

**Release decisions:** Authored/source-implemented is not verified/accepted. Do not treat older successful workflows, synthetic role mocks, public instructional counts, or Cloudflare build success as proof of genuine authenticated Owner access, independent editorial approval, screen-reader compliance, real market data, verified historical chart provenance or protected grading readiness.

## Next actions and safeguards

Resolve CI failures in source and browser contracts; test full-width mobile page and keyboard states; obtain exact final `main` SHA and Cloudflare production deployment; complete authorized Owner/Admin visual/accessibility review; reconcile any missing real teaching features with server-authorized member Lab/Boot Camp services rather than duplicating engines. No paid Work mode, third-party paid runtime, live payment, brokerage order, private quiz key, user progress edit, new ledger or database migration was authorized for this parity change.

## Revision history

| Version | Date | Decision |
|---|---|---|
| v1.0 | 2026-11-01 | New curriculum parity acceptance register, ten distinct gates; staged source checks, production release withheld |

**Footer:** SMFGU-PROTOTYPE-012 · v1.0 · main only · Staff-only simulated product design · No grading, payment or historical data authenticity claim.
