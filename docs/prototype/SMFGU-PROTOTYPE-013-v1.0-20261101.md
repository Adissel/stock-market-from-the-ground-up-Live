# SMFGU-PROTOTYPE-013 — Chart-First Default View and Visible Product Redesign

**Document ID:** SMFGU-PROTOTYPE-013  
**Company:** Cyber Nexus / Crown & Lantern Press  
**Project:** The Stock Market: From the Ground Up / Crownlight Prototype Center  
**Filename / type:** `docs/prototype/SMFGU-PROTOTYPE-013-v1.0-20261101.md` / Markdown  
**Version / date:** 1.0 / 2026-11-01  
**Branch:** main  
**Status:** Source implemented; exact-SHA CI and Cloudflare deployment pending verification.  
**Google Drive location / document ID:** Not assigned / not created.  
**Purpose:** Correct unchanged prototype appearance and make the working chart visible on first load.  
**Dependencies:** AGENTS.md; V11 prototype; ECharts 6.1; staff roles; 419 Labs; 61 authored guides; 15 calculated preview studies.  
**New file required:** Yes.

## Root cause
The original `/prototype.html` URL continued displaying the legacy 23-workspace designer. The React A/B/C pages required an `experience` query parameter, and the working chart was below a large member preview and indicator area. Consequently, users could perceive no material improvement.

## Implementation
1. The authenticated default URL opens advanced Option A; `?view=classic` preserves the original builder, and `?experience=a|b|c` remains valid.
2. Move functional Chart Studio and Talia instruction above the prior membership/indicator/product design panels; add a simulated market quote bar with actual calculated fictional last-bar values, navigation links and high-contrast terminal treatment.
3. Hide legacy page furniture and the original source inspector when the advanced React experience is mounted; keep the dedicated classic inspector available on the explicit classic route.
4. Preserve read-only synthetic market boundaries, staff-only authorization, all original labs/bootcamps/indicators and no-LIVE financial writes.
5. Extend Chromium acceptance with root URL default, legacy shell exclusion, new navigation and first-viewport chart presence; adapt legacy browser tests to the intentional `?view=classic` route.

## Release notes and risks
The route change is deliberate but non-destructive; no SQL, Stripe or membership changes. The source release requires browser tests on authorized and unauthorized roles, full CSS responsiveness, and exact-SHA Cloudflare deployment before final sign-off. Independent user visual review remains open.

**Rollback:** revert this main commit; classic workbench remains independently accessible.

## Revision history
| Version | Date | Status |
| --- | --- | --- |
| 1.0 | 2026-11-01 | Implementation and tests added, CI awaiting verification |

**Footer:** SMFGU-PROTOTYPE-013 · Staff-only · Fictional/read-only · No production trading or payment claims.
