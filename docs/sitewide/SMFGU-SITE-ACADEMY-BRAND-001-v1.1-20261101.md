# SMFGU-SITE-ACADEMY-BRAND-001 — Website Display Identity
**Company:** Cyber Nexus / Crown & Lantern Press
**Project:** The Stock Market: From the Ground Up
**Document ID:** SMFGU-SITE-ACADEMY-BRAND-001
**Filename:** docs/sitewide/SMFGU-SITE-ACADEMY-BRAND-001-v1.1-20261101.md
**File type:** Markdown (.md)
**Version:** 1.1
**Decision/implementation date:** 2026-11-01
**Status:** Owner-directed terminology replacement implemented in GitHub source; CI and Cloudflare production acceptance separate
**Google Drive location:** Not created; GitHub main is the source of record
**Google Drive document ID:** Not assigned
**New file required:** Yes — separate v1.1 decision record preserving v1.0 history
**Repository/branch:** cybernexuspublishing/stock-market-from-the-ground-up — main
**Purpose:** Specify the main website title and owner-selected subtitle consistently across public, member and staff headers and SEO.

## Controlling website identity
- Main title (visible): **THE STOCK MARKET: FROM THE GROUND UP**
- Subtitle (visible): **Training Academy**
- Browser home title: **The Stock Market: From the Ground Up | Training Academy**
- Structured WebSite name: **The Stock Market: From the Ground Up — Training Academy**
- Existing Learning Academy presentation is superseded, including a previously branded build-output header.
- Published book-series title, author, press imprint, canonical URLs, pricing, entitlements, member records, server APIs and legal documents retain their prior identities.

## Implementation and validation
- `index.html`: source homepage header, hero subtitle and document title.
- `scripts/build-site-brand-academy-v1.mjs`: sitewide header branding and backwards-compatible subtitle migration; idempotent across consecutive builds.
- `scripts/build-public-seo.mjs`: SEO title, description, and WebSite structured-data identity.
- `tests/test_site_brand_academy_v1.mjs`: regression for unbranded, previously branded and non-SMFGU headers.
- `assets/css/site-brand-academy-v1.css`: existing responsive typography retained without additional dependency.

No database migration, paid infrastructure, checkout modification or release of protected lesson material. GitHub CI and exact-commit Cloudflare deployment must be checked independently.

## Revision history
| Version | Date | Description |
| --- | --- | --- |
| 1.0 | 2026-11-01 | Original website subtitle: Learning Academy |
| 1.1 | 2026-11-01 | Owner-selected replacement: Training Academy; same main title |

**Footer:** SMFGU-SITE-ACADEMY-BRAND-001 / v1.1 / website display only.
