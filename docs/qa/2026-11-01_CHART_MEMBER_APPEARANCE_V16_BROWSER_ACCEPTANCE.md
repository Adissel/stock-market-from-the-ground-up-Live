# SMFGU-CHART-MEMBER-APPEARANCE-V16 — Independent Browser Fixture Acceptance
**Document ID:** SMFGU-CHART-MEMBER-APPEARANCE-V16-BROWSER
**File and type:** `docs/qa/2026-11-01_CHART_MEMBER_APPEARANCE_V16_BROWSER_ACCEPTANCE.md` / Markdown (.md)
**Company:** Cyber Nexus Publishing / Crown & Lantern Press
**Project:** The Stock Market: From the Ground Up — Crownlight Chart Studio
**Version/date/status:** 1.0 / November 1, 2026 / Source test authored, CI evidence pending
**Google Drive location and document ID:** Not created; not assigned
**Dependency:** Existing Supabase member-owned /api/chart-workspace and authenticated chart workspace CAS; pinned Lightweight Charts v5.2.1 and Playwright v1.56.1; no new table or entitlement engine
**Purpose:** Verify newly delivered chart appearance and study preferences with actual Chromium chart rendering, isolated browser storage, protected mocked server sessions and no-lookahead history.

## Acceptance design
1. 225 originally fictional minute bars; only 25 completed bars shown at launch, 26 after one deliberate reveal.
2. Operate actual candlestick/volume plot, appearance dialog and EMA 200 line style controls in Chromium.
3. Save visual preferences through the existing workspace API mock; create an independent browser context with no shared localStorage and verify server restoration.
4. Create another member context and ensure no cross-account preference leakage; reject stale-tab 409 overwrite.
5. Preserve page error and browser artifact classification. A passing fixture test does **not** mean a production authenticated member or physical cross-device test passed.

## Source boundaries
No real Supabase user, member records, subscriptions, Lumens, orders, historical feeds or secrets accessed. No Python or additional services needed. This is deliberately a QA enhancement to the existing web architecture.

## Revision history
| Version | Date | Action | Status |
| --- | --- | --- | --- |
| 1.0 | 2026-11-01 | New independent Chromium chart preference fixture gate | Pending CI |

**Footer:** Internal QA · Fictional-only / no charge · Member-production acceptance open.
