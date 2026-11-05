# Owner/Admin Saved Full-Page Knowledge Article Preview

Document ID: SMFGU-KDB-OWNER-PREVIEW-001
Project: THE STOCK MARKET: FROM THE GROUND UP
Filename: docs/qa/SMFGU-KDB-OWNER-ADMIN-PREVIEW-20261104.md
File type: Markdown. Version: 1.0. Date: 2026-11-04.
Status: Source integration; authenticated browser acceptance and exact SHA required.
Google Drive location/document ID: Not created / unassigned. GitHub authoritative.
Dependencies: Existing Cloudflare Pages Functions, Supabase session/Owner/Admin role validation, Article Manager, Knowledge article reader.
Purpose: Last-saved full-page preview of unpublished/in-review records under strict Owner/Admin role checks. New files: regression test and this record; five existing files modified.

## Procedure
Admin Control Center > Knowledge Article Manager > Save > Open saved full-page preview.
URL shape: /knowledge-article.html?article=STORED_UUID&preview=1 (this is a shareable link but not a bearer credential).
Server calls admin/preview only after verified session, profile, restriction and current Owner/Admin role. Service role secret never reaches browser. No-store response; source body excluded from public list.
Normal action=read remains published/visible and membership-entitled. Preview suppresses ungraded Talia runner. Current inline preview still displays unsaved edit text locally; full-page URL displays last saved revision only.
## Open risk
Existing content.manage editor permissions to administrative CRUD predate this change and remain unchanged. A separate approved role-policy reconciliation is required if all unpublished administrative interfaces must exclude non-Owner/Admin editors.
## Revision history
v1.0 / 2026-11-04 / Owner/Admin saved full-page draft preview and denial tests.
Footer: SMFGU-KDB-OWNER-PREVIEW-001 · Review URL is not public release.
