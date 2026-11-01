# Talia Instructional Parity — Authenticated Boot Camp Tutor Bridge
Document ID: SMFGU-TALIA-BOOTCAMP-PARITY-026 | Version: 1.0
Project: THE STOCK MARKET: FROM THE GROUND UP — Training Academy
Date: 2026-11-01 | Status: Source implementation; independent acceptance OPEN
Repository: cybernexuspublishing/stock-market-from-the-ground-up | Branch: main
Google Drive location and ID: Unassigned | File type: Markdown
Purpose: Control an incremental Boot Camp teaching integration without misreporting complete curriculum parity.

The existing ten-stage Academy guide now has an optional, user-initiated, authenticated Market Tutor link. The bridge sends only allowlisted general subject text to the existing /api/market-tutor service. A private answer, lesson, rubric, replay, grade, or identifier is never included. All existing local explanations and retries remain free. The server checks entitlement, model opt-in, quota, and source policy. In-flight responses are cancelled when the lesson or member session changes.

The thirty-day and other Academy routes pass verified member first-name context and the authenticated adapter into both the Academy guide and any existing authorized Lab bridge. No separate database, learning engine, canonical Lab ID, new grade, award, protected case or payment write is created.

**Remaining acceptance:** Free Foundations is still its separate nine-stage flow. The 274 study days do not all have individual mathematical cases, twelve authored formative questions, independently verified citations, or private assessment acceptance. Intermediate Academy steps remain local until a validated existing persistence contract is introduced. Genuine Free, Founding 14/30/60 and staff account tests, mobile/a11y and exact-head Cloudflare deployment evidence remain OPEN.

Dependencies: Existing Supabase Auth, /api/market-tutor, server-side entitlements, optional AI quotas, source-rights verification. SQL migration: none. Rollback: revert this commit, preserve all server data.

Revision history: 2026-11-01 v1.0 — Source parity bridge; editorial and production sign-off withheld.
