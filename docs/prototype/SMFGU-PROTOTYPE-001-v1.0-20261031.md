# SMFGU-PROTOTYPE-001 — Crownlight Prototype Center
**Project:** The Stock Market: From the Ground Up / Crownlight Platform  
**Owner:** Crown & Lantern Press / Cyber Nexus (project-owned software)  
**Document ID:** SMFGU-PROTOTYPE-001  
**Version:** 1.0  
**Date:** 2026-10-31  
**Status:** Implemented in source; deployment and authenticated beta acceptance pending  
**Filename:** SMFGU-PROTOTYPE-001-v1.0-20261031.md  
**Type:** Markdown project release record  
**Google Drive location:** Not configured; authoritative copy resides in GitHub repository `docs/prototype/`  
**Page:** `/prototype.html`  
**Branch:** `main` (no feature branch)  
**Purpose:** Secure-by-design, isolated engineering workbench for Lab/Boot Camp classroom and ECharts evaluation.

## Deliverables
1. `prototype.html`: internal application shell, noindex, staff gate, initial hidden application.
2. `assets/css/prototype-center-v1.css`: responsive workspace and 3 preview widths, keyboard focus and reduced-motion support.
3. `assets/js/prototype-center-v1.js`: 23 workspaces (18 application capability tabs; Overview, Classroom Builder, Component Library, Test & Acceptance, Release Manager), nine-stage Lab/Boot Camp preview with Balanced / Reading-first / Chart-first layout presets, Comfortable / Compact density and Talia right/bottom placement, Admin group comparison, synthetic ECharts experiments, fictional candle replay, design-specific controls, local save/restore and evidence export.
4. `assets/js/prototype-admin-link-v1.js`: role-checked shortcut on existing `admin.html`.
5. `assets/js/route-policy.js`: prototype classified as staff route, shared with Cloudflare middleware and service worker.
6. `_headers`: private/no-store/noindex for prototype document.
7. `tests/prototype-center-v1-contract.test.mjs`, `tests/prototype-center-v1-auth.test.mjs` and `.github/workflows/prototype-center-v1.yml`: source, syntax, nonpayment and automated role-denial checks.

## Existing system dependencies
- Supabase Auth through `/assets/js/supabase-client.js`.
- Existing server-verified `GET /api/admin?action=context` (not user-editable JWT metadata), requiring OWNER, ADMIN or TECH_ADMIN plus `control_panel.access`. `SHOWCASE_VIEWER` is denied.
- Local Apache ECharts 6.1.0 loader and vendor bundle.
- Existing Cloudflare Pages/Workers and route-policy middleware.
- Existing main-branch GitHub Actions for acceptance evidence.

## Security limitations and release risk
The HTML/JS are static source assets. The rendered application is hidden until the existing server API checks access, but the static source is not itself confidential. This is acceptable only because prototypes include deterministic fictional data, no private instructor grading material, no member profiles and no secret API or mutation controls. Future privileged prototype backend operations require independent OWNER/ADMIN server authorization and Supabase RLS; do not mistake a browser gate for a full protected API.

The Prototype Center does not implement real trading features, actual 3D functionality, private assessment grading, backend-synchronized designs, or production feature promotion. Buttons do not initiate any live commerce, entitlement, role, payment or learning write. Local drafts live only in the authorized browser's local storage; users must not put secret or customer information into them.

## Acceptance matrix
- A. Source files exist on `main`: require GitHub fetch.
- B. CI source contracts pass: require exact workflow run success.
- C. Cloudflare serves exact source commit: require deployment evidence.
- D. Owner browser load and ECharts renderer: requires authenticated test.
- E. Admin browser load: requires authenticated test.
- F. Moderator/SHOWCASE/Free/signed-out deny: requires authenticated test matrix.
- G. Keyboard, mobile, screen reader, contrast and reduced-motion QA: requires browser accessibility review.
- H. Local saved draft / export / reset / replay test: requires browser test.
- I. Sensitive API/RLS no-write audit: requires independent QA.
- J. Owner single consolidated acceptance: requires gates A–I.

## Progress calculation methodology
Distinguish `source-delivered`, `CI-confirmed`, `production-deployed`, and `authenticated-accepted`. Report a score only for a defined denominator; never present the count of 23 navigable prototype workspaces as 23 accepted ECharts implementations. Website-wide overall progress is not measurable from this artifact alone.

## Rollback
Revert the repository commits adding the Prototype Center and restore `admin.html`, `assets/js/route-policy.js` and `_headers` without reverting unrelated concurrent main commits. No database migration, paid API or Stripe change was introduced.

## Revision history
| Version | Date | Description | Status |
|---|---|---|---|
| 1.0 | 2026-10-31 | Initial protected design shell, 23 workspaces, local ECharts experiments, role-gated Admin entry, acceptance contracts | Source implemented; verification pending |

## Execution evidence 2026-10-31
- GitHub initial Prototype Center CI run 41244315304: **SUCCESS** (syntax and source-contract job).
- Subsequent role-denial suite and classroom layout update: CI rerun 41244545339 queued at last check; not accepted as passed until completed.
- Cloudflare LIVE v1.0 project reported active deployment at commit `82016aa96a48444f17e3d4a2ea30be43bf52a551`, verified one descendant commit after the layout-style commit `e4f947608ce53d167c86f21566783cf49abe38d7`.
- Authenticated browser Owner/Admin and denial-role testing remains **NOT VERIFIED**; no fabricated beta sign-off.
