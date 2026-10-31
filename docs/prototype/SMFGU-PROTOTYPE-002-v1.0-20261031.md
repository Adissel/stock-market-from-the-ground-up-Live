# Crownlight Prototype Center — Batch 2 Implementation and Acceptance Register

**Document ID:** SMFGU-PROTOTYPE-002  
**Project:** The Stock Market: From the Ground Up · Crownlight Platform  
**Filename:** SMFGU-PROTOTYPE-002-v1.0-20261031.md  
**File type:** Markdown (.md)  
**Version:** 1.0  
**Date:** October 31, 2026  
**Status:** SOURCE, DEDICATED CI AND EXACT CLOUDFLARE DEPLOYMENT VERIFIED — LIVE ROLE/ACCESSIBILITY ACCEPTANCE ON HOLD  
**Authoritative location:** GitHub `cybernexuspublishing/stock-market-from-the-ground-up/docs/prototype/` on `main`  
**Google Drive:** No connected repository location verified; do not claim a Google Drive file exists.  
**New file required:** Yes; retains approved V1 record without overwriting history.  
**Purpose:** Trace source work, tests, release gates and unresolved risks for authenticated instructional prototyping.  
**Dependencies:** V1 `prototype.html`, Supabase Auth, `GET /api/admin?action=context`, Cloudflare Pages/Functions, self-hosted ECharts 6.1.0.

## Completed implementation scope
- A new Cloudflare Pages Function, `/api/prototype-training-cases`, validates Supabase token identity and authoritative profile/account status, active role grants and `control_panel.access` before returning case data. It denies SHOWCASE_VIEWER, restricted accounts, missing permissions, expired roles and unauthenticated calls.
- Three deterministic FICTIONAL classroom cases: cumulative VWAP, failed breakout and per-share risk; no market-data vendor or actual security referenced.
- Reusable teaching module mounted from one source in Classroom Builder, Labs, Boot Camps, Chart Studio, Replay, Talia and Admin editorial preview, instead of forked lesson engines.
- Case picker, explicit provenance, numeric worked examples, bounded reveal, responsive scrollable OHLC/VWAP table, unguided? **No** — guided and ungraded calculation check, retry explanation, instructional caution, no assessment key or member grade.
- Context is rechecked on focus and visibility; revocation hides the workbench and clears in-memory teaching case state.
- Added Node API negative-permission contracts, source contracts, synthetic Chromium Owner/Admin/denied-role responsive checks, and exact Cloudflare Pages build assertions.

## Defined gates for current batch
| ID | Gate | Evidence type | Current disposition |
|---|---|---|---|
| PT2-G01 | Private teaching API deny/allow authorization matrix | Node isolated execution | Passed on first corrected CI run 41246471868 |
| PT2-G02 | Instructor numeric case validity and provenance | Automated case contract | Passed on first corrected CI run 41246471868 |
| PT2-G03 | Role revocation on focus and unauthorized hidden rendering | Chromium synthetic role switch | PASS — Chromium synthetic role revocation, CI run 41246810867 |
| PT2-G04 | Desktop/tablet/mobile (1280/768/390px) and keyboard table containment | Chromium built output | PASS — desktop/tablet/mobile Chromium after mobile table fix, CI run 41246810867 |
| PT2-G05 | Published Pages output contains HTML, vendor bundle and JS without private source | Exact Pages build step | PASS — exact Pages build and private-source exclusion, CI run 41246810867 |
| PT2-G06 | Classroom/Lab/Boot Camp shared fictional worked examples | Source integration | PASS — synthetic Chromium interface/role-gated API integration, run 41246810867 |
| PT2-G07 | Chart Studio/Replay/Talia/Admin shared prototype use | Source integration | Implemented; browser acceptance pending |
| PT2-G08 | Owner and Admin live authenticated sessions | Real member browser | NOT VERIFIED |
| PT2-G09 | Moderator, SHOWCASE, Free and signed-out live denial, including direct API URL | Real account role matrix | NOT VERIFIED |
| PT2-G10 | WCAG 2.2 AA and assistive technology acceptance | Independent browser review | NOT VERIFIED |
| PT2-G11 | Production Cloudflare exact commit and HTTP behavior | Cloudflare deployment and live response | Cloudflare deployed commit 3a66e04221ad95e204f05f69483433eaaa2eb678 successfully; direct public HTTP denial not yet independently verified |
| PT2-G12 | Independent editorial acceptance, risk review, recorded Owner sign-off | Evidence-backed governance | HOLD |

## Test/defect history
- V1 syntax and source CI run 41244315304 PASSED.
- V1 expanded roles CI run 41244545339 PASSED.
- V2 API testing first failed due a mistaken assertion counting short-circuited authorization requests, corrected in the tests and passed at 41246471868.
- V2 synthetic Chromium test caught horizontal overflow at 390px despite passing Owner 1280px/Admin 768px. The computation table was wrapped with keyboard-scrollable containment. Do not consider the fix accepted until rerun passes.
- Browser sessions in this CI use synthetic users and intercepted API responses; these are not authenticated production identities.
- Final six-workspace Chromium run **41246810867 SUCCESS**, including desktop/tablet/mobile, all six learning/admin prototypes, role revocation, real ECharts, rendered mathematical cases and replay boundary.
- Cloudflare LIVE v1.0 reports **SUCCESS** for exact source commit `3a66e04221ad95e204f05f69483433eaaa2eb678`. A direct unauthenticated production HTTP request and real sign-ins remain unverified.

## Review and release principles
- Product-owner architecture and source editorial alignment: ACCEPTED FOR PROTOTYPE ITERATION.
- Release of internal synthetic visualization: allowed after CI and deploy evidence.
- Public member-facing learning behavior, protected grading or independent production acceptance: HOLD.
- No paid testing, Work mode, Stripe charges, Supabase migration or commerce configuration changes.
- Rollback: revert Batch 2 feature commits on main without reverting unrelated concurrent commits; V1 page can remain active with independent access rules.

## Measurement definitions
Existing controlling dashboard baseline: V1 was 8/12 foundational milestones (67%); project overall was 8/30 (27%). Subsequent percentage increases must be recorded only when each distinct acceptance milestone has verifiable evidence. Do not confuse number of tabs with accepted working product features.

## Revision history
| Revision | Date | Change | Status |
|---|---|---|---|
| 1.0 | 2026-10-31 | New V2 private-case workbench, shared integration, tests, mobile defect history and next acceptance gates | In progress |

## Measured progress at the Batch 2 CI acceptance point
- Current Batch 2: **7 of 12 gates closed (58.3%)**. G01–G07 are source/automated/synthetic acceptance. G08–G10 and G12 remain open. G11 is partial because live origin HTTP denial is unverified.
- Overall defined Prototype Center program: **11 of 30 milestones (36.7%)**. This preserves the prior 8/30 baseline and credits three new distinct deliverables: role-gated instructional API with numerical evidence, repeatable cross-device/permission CI, and six shared working synthetic prototype views. Remaining 19 milestones include full functional integration across the 18 capability categories, human-accessibility review and true-role acceptance.
- Percentage accounting is not an assertion that all existing website projects are 36.7% complete; denominator is only the approved 30-milestone Prototype Center scope.
- Final Owner acceptance stays **ON HOLD** until independently verified live authentication, authorization, accessibility and production integration.
