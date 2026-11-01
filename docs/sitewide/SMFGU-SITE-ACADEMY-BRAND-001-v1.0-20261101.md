# SMFGU-SITE-ACADEMY-BRAND-001 — Website Display Identity
**Company:** Cyber Nexus / Crown & Lantern Press
**Project:** The Stock Market: From the Ground Up — Learning Academy website
**Document ID:** SMFGU-SITE-ACADEMY-BRAND-001
**Filename:** docs/sitewide/SMFGU-SITE-ACADEMY-BRAND-001-v1.0-20261101.md
**File type:** Markdown (.md)
**Version:** 1.0
**Decision/implementation date:** 2026-11-01
**Status:** Owner-directed website brand presentation committed; exact-commit CI and Cloudflare acceptance are separate
**Google Drive location / document ID:** Not created / not assigned
**New file required:** Yes — this GitHub-controlled implementation record
**Repository/branch:** cybernexuspublishing/stock-market-from-the-ground-up, main only
**Purpose:** Add the public website subtitle Learning Academy under the unchanged name THE STOCK MARKET: FROM THE GROUND UP.

## Controlling distinction
- Main website brand: **THE STOCK MARKET: FROM THE GROUND UP**.
- Subtitle directly beneath it: **Learning Academy**.
- Concise browser title: **The Stock Market: From the Ground Up | Learning Academy**.
- The existing book-series name, published book covers, author credits, Crown & Lantern Press imprint, domain, URLs, member plans, database identities, legal seller, security and private grading contracts remain unchanged.
- The public site and member-facing headers use authored HTML5 semantic text, not CSS-generated inaccessible text.
- Do not add an expensive React, AI, ECharts, Python or 3D runtime solely to render static branding.

## Source implementation
1. `index.html`: Homepage brand and visible hero subtitle; source page title.
2. `assets/css/site-brand-academy-v1.css`: Responsive text hierarchy, focus styling, reduced-motion compatibility.
3. `scripts/build-site-brand-academy-v1.mjs`: Idempotent transformation of existing static website brand links across public/member/staff HTML; preserves authenticated HTML and exact routes, and does not rewrite book/editorial content.
4. `scripts/build-pages.sh`: Applies the transformation to Cloudflare Pages output after accessibility enhancement, before SEO.
5. `scripts/build-public-seo.mjs`: Public homepage metadata and WebSite structured-data name; publisher Organization remains Crown & Lantern Press.
6. `tests/test_site_brand_academy_v1.mjs`: Semantic, responsive-source, no-duplicate and no-rename regression fixture.

## Scope and acceptance
No database migration, Supabase RLS change, payment operation, checkout configuration, unreviewed learning asset, and no paid infrastructure. Verify actual number of branded Pages outputs from CI logs and responsive browser behavior. Exact-commit CI plus Cloudflare production deployment and screen-reader inspection remain separate gates. Test case must not interpret visual title changes as individual 419-Lab or 274-Academy editorial approval.

## Revision history
| Version | Date | Change | Approval |
| --- | --- | --- | --- |
| 1.0 | 2026-11-01 | Website name retained, Learning Academy added as subordinate identity | Owner-directed product decision; deployment acceptance pending |

**Footer:** SMFGU-SITE-ACADEMY-BRAND-001 / v1.0 / website-only branding; no commercial, authentication or curriculum change.
