# Crownlight Prototype Center — Gate G08–G12 Execution and Acceptance Record

**Document ID:** SMFGU-PROTOTYPE-003  
**Project:** The Stock Market: From the Ground Up / Crownlight Platform  
**Filename:** SMFGU-PROTOTYPE-003-v1.0-20261031.md  
**File Type:** Markdown  
**Version:** 1.0  
**Date:** 2026-10-31  
**Status:** INTERNAL PROTOTYPE / PARTIAL ACCEPTANCE — NOT FULL MEMBER RELEASE  
**Authoritative Repository:** `cybernexuspublishing/stock-market-from-the-ground-up`, `main`, `docs/prototype/`  
**Google Drive Location:** Not verified/connected; GitHub is the authoritative development location for this record.  
**New file required:** Yes; this register records a distinct acceptance batch without changing V1/V2 historic approval artifacts.  
**Purpose:** Evidence-based sign-off and release risk record for gates G08–G12.  
**Dependencies:** SMFGU-PROTOTYPE-001 and -002, Cloudflare Pages/Functions, existing Supabase Auth/admin role tables, pinned local ECharts 6.1.0.

## Executed work
1. Added `functions/_middleware.js` interception of `/prototype` and `/prototype.html`. Anonymous HTTP now receives a minimal, cache-disabled bootstrap with no `pt-app`, `pt-nav`, internal classroom HTML or answer keys.
2. Added `assets/js/prototype-bootstrap-v3.js`. Existing verified Supabase sessions request the protected HTML using an HTTPS Bearer header. No token appears in URL query parameters, local drafts, or cookies.
3. Added `GET /api/prototype-document`; it verifies a genuine Supabase identity, active OWNER/ADMIN/TECH_ADMIN role, valid account and `control_panel.access` from current server database role grants before returning static HTML from Pages ASSETS.
4. Existing `/api/prototype-training-cases` shares the same role authorization. Both endpoints inherit optional sitewide staff MFA when enabled. Protected HTML is exempt from generic page rewriting so added scripts cannot weaken its CSP.
5. Added anonymous live privacy testing, fake-role Chromium tests, keyboard navigation, axe-core WCAG 2.2 checks, focus-based revocation and reduced-motion evidence. Genuinely signed-in existing QA member tested against both protected APIs with preexisting GitHub Secrets and no paid charge.
6. Editorial review corrected the distinction between OHLCV typical-price weighted VWAP **proxy** and actual trade-print VWAP, replaced breakout-proxy question with the high-to-close rejection-distance calculation, and separated risk/reward calculations from unrelated VWAP displays. The accidentally expanded JS file produced during a replacement was restored from the prior verified commit before reapplying changes with safe callback replacements. Final corrected editorial test remained pending at record creation.

## Gate disposition
| Gate | Requirement | Status | Evidence |
|---|---|---|---|
| G08 | Real authenticated OWNER and ADMIN sessions, page entry, module access and isolation | OPEN | No authorized real Owner/Admin browser sessions supplied or verified |
| G09 | Real Moderator/Free/Showcase/signed-out denial and direct API | PARTIAL | Real, non-admin Supabase QA member denied both protected APIs: GitHub Actions 41253501664 SUCCESS. Additional real Moderator and Showcase identities not verified. Simulated role matrix passed earlier |
| G10 | Keyboard, screen reader, focus, touch, contrast and reduced motion | PARTIAL | Axe-core Chromium + keyboard and reduced-motion tests passed at 41253434516. Manual screen-reader and independent WCAG 2.2 review remain open |
| G11 | Live HTTP full-page confidentiality, no-store and role-API denial | CLOSED FOR ANONYMOUS HTTP | Anonymous live workflow 41253403077 SUCCESS. No protected app shell served to guests; both protected APIs return 401 without credentials. Cloudflare active deployment confirmed |
| G12 | Independent editorial/security review and consolidated Owner sign-off | HOLD | Technical/editorial checks recorded; complete independent and role-specific production acceptance pending |

## Security assessment
- Full Prototype HTML is now sent only after fresh server-side authorization. The minimal public bootstrap is intentionally HTTP 200; users cannot receive or operate the full workbench without staff approval.
- GitHub source and JavaScript assets are public; **no credentials, private graded answer keys, personally identifying member information, or commercial secrets may be embedded in them**. HTTP authorization restricts rendered document delivery, not repository source disclosure.
- The existing role ACL is checked against live service tables, not untrusted client role metadata. Token and internal role-permission database calls stay server-side.
- No signed-in Owner or Admin live browser journey has been accepted; the successful synthetic Chromium tests are not equivalent.
- No Stripe writes, live charges, wallet or entitlement mutations, database migrations, or paid Work mode were used.

## Known remaining blockers
- Genuine Owner and Admin role sessions for G08 and authenticated Moderator and Showcase negative accounts for G09.
- Independent screen-reader, keyboard-without-pointer and responsive touch audit for G10.
- Independent security review for protected API and Pages middleware, including real authenticated HTTP service behavior.
- Real curriculum-engine source binding, protected grading integration, and final sign-off across all substantive prototypes.
- Exact final editorial source commit requires its subsequent CI and Cloudflare result; do not cite older successful runs as acceptance of later edits.

## Progress definitions
Controlling initial baseline was 8/30 overall (27%) and 8/12 foundational milestones (67%) at prior V1 report; Batch 2 reached 11/30 overall (37%) and 7/12 additional acceptance gates (58%). The current additive acceptance tally, after closing anonymous G11, is **12/30 overall = 40%**, and **8/12 Batch 2/G08–G12 milestone gates = 67%**. G09/G10 are partial but not counted as closed. These are bounded milestone counts, not estimates of all Crownlight website development or completed feature coverage.

## Governance
**Accepted:** Internal product-owner design direction, prototype implementation, role-denial source/synthetic tests, anonymous HTTP privacy, non-admin real member denial, baseline automated accessibility.  
**Not accepted:** Production-ready, fully secure, independently accessible, attorney-approved or member-facing release status; real Owner/Admin authentication and overall consolidated Owner Acceptance Test remain outstanding.

## Dependencies, rollback and next operations
- Dependencies: shared Lab Engine v3.3, existing public-only fictional teaching catalog, current Cloudflare/Supabase role authorization, pinned ECharts.
- Rollback method: on main, revert the targeted Prototype privacy/document and editorial changes without reverting unrelated concurrent repository commits; preserve the previous source gate. Do not delete the validated authorization middleware wholesale.
- Next execution: real Owner/Admin and Moderator/Showcase authorized noncharging tests; independent accessibility review; final exact-commit CI and Cloudflare parity; integrate approved real Lab/Boot Camp instructional structures, without exposing private assessment sources.

## Revision history
| Version | Date | Changes | Approval |
|---|---|---|---|
| 1.0 | 2026-10-31 | Source privacy gate, live anonymous test, genuine non-staff denial, accessibility, editorial correction and gate review | Partial technical/editorial acceptance; final Owner release hold |
