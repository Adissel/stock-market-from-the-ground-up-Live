# Live Academy and Lab Page Layouts — Eight Prototype Designs
Document ID: SMFGU-MEMBER-LIVE-LAYOUTS-025
Project: The Stock Market: From the Ground Up
File: docs/learning/SMFGU-MEMBER-LIVE-LAYOUTS-025-v1.0-20261101.md
File type: Markdown; Version: 1.0; Date: 2026-11-01
Status: Source integration committed; CI and deployed acceptance separate.
Google Drive location / ID: Not created / unassigned.
Dependencies: GitHub main; existing authenticated Academy, 30-day course, Lab Engine v3.3, Cloudflare Pages, Supabase authorization and progress.
Purpose: Apply the eight approved staff-only prototype layout concepts to real member learning pages without duplicating instruction, billing, grades, source histories or persistence.

## Live route assignments
1. Foundations Classroom: Free Foundations, Truth5, Foundations30 and beginner Labs.
2. Indicator Analysis Lab: Charts45, Indicators10 and formula-focused Labs.
3. Historical Replay Practice: Practicum90 and replay-concept Labs.
4. Tape & Order-Flow Desk: Tape10 and market-microstructure Labs.
5. Scanner + Watchlist Workshop: Scanners10, Watchlist7 and screening Labs.
6. Risk & Execution Desk: Risk60 and risk-management Labs.
7. SEC Filings Research Room: Filings7 and company-disclosure Labs.
8. Boot Camp Mission Control: existing Academy catalog, linking to authentic course routes.

## Engineering
Presentation-only shared JS/CSS injects accessible course-specific headings and links and adapts existing lesson, source, decision, reflection and assessment panel layouts.
Academy renders only after its existing authorized workspace is exposed. Lab activation follows the existing entitlement check; account-change and denied-mode cleanup remove the layout.
All existing learning components, historical-source disclosures, source data, private assessment boundaries and stored student progress are retained unchanged.
No new database, paid service, checkout, private-answer injection or duplicate engine. All academy links are subject to real program permissions.

## Remaining acceptance
Exact-commit CI and Cloudflare deployment, authenticated role and course tests, real mobile/touch and screen-reader review and consolidated release signoff.
Rollback: revert source commit on main; no SQL rollback.

## Revision history
v1.0 / 2026-11-01 / Eight live member page compositions, source tests / CI pending.
Footer: SMFGU-MEMBER-LIVE-LAYOUTS-025 / v1.0 / Production pages with protected original learning engines.