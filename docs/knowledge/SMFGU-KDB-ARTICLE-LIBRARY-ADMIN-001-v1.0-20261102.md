# Knowledge Database V1 — Membership Article Library and Admin Manager

| Document control | Value |
|---|---|
| Company | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | THE STOCK MARKET: FROM THE GROUND UP — Learning Academy |
| Document ID | SMFGU-KDB-ARTICLE-LIBRARY-ADMIN-001 |
| Filename | docs/knowledge/SMFGU-KDB-ARTICLE-LIBRARY-ADMIN-001-v1.0-20261102.md |
| File type | Markdown (.md) |
| Version | 1.0 |
| Date | November 2, 2026 |
| Status | GitHub feature implemented; isolated live Supabase tables migrated; 145 hidden editorial drafts seeded; production publication acceptance OPEN |
| Google Drive location | Not created. GitHub is current source of record. |
| Google Drive document ID | Unassigned |
| New files required | Yes, new schema, private Cloudflare API, admin and member components, source crosswalk, workflows and tests |
| Purpose | Organize original educational articles by subject and experience, enforce membership entitlements, and provide audited editing without changing protected learning and payment records |
| Dependencies | Existing Supabase Auth, profiles, admin roles, memberships, founder beta policy, Cloudflare Pages and Knowledge Database V2 |

## Verified inventory

- Existing public Knowledge Database has 38 free original references (12 Foundations and 26 deep dives); unchanged and not paywalled.
- New private article database has 145 distinct, source-backed research-derived editorial drafts. All are DRAFT, NOT REVIEWED, HIDDEN. Zero new articles published.
- Drafts: 61 intermediate, 78 advanced, 6 professional. Sources: 61 core indicator research guides, 12 advanced indicator guides, 22 watchlist research guides, 50 strategy/workflow reasoning guides.
- The proposed 1,500-article master inventory remains an editorial TARGET, not a number of complete or validated articles.
- Some named STT approaches are unverified proprietary methodology. The studies do not demonstrate statistically profitable strategies, authenticate historical trade fills, or license third-party content.
- Crosswalk: data/knowledge-article-draft-source-crosswalk-v1.json.

## Organization and membership

Experience levels: beginner, intermediate, advanced, professional, institutional_quantitative.

Supported article access plans: FREE, FOUNDING_14, FOUNDING_30, FOUNDING_60, FULL_MONTHLY, FULL_ANNUAL, LIFETIME, ONDEMAND_MONTHLY and PICK_WHAT_YOU_WANT. Multiple plans can be selected independently on an article. Changing article access never creates an entitlement, billing event, grade or price.

The proposed 145-draft initial assignments (OWNER-REVIEWABLE, NOT FROZEN COMMERCIAL PACKAGING):
- Intermediate: Founding 14/30/60, Full Monthly/Annual and Lifetime.
- Advanced: Founding 30/60, Full Monthly/Annual and Lifetime.
- Professional: Founding 60, Full Monthly/Annual and Lifetime.
- Verified Founding educational beta users retain temporary all-learning coverage until the existing sitewide LIVE control changes. Active account restrictions still override access.
- Existing 38 free introductory articles are unaffected.

## Admin Article Manager

Open Admin Control Center > Knowledge Article Manager, or /admin-knowledge.html. A real OWNER or staff member holding content.manage authority is required for all private administration actions.

Implemented: create, edit title/slug, summary, subject/category, learning level, tags, ordering, source URLs, body Markdown, multiple membership tiers, visibility, draft/in-review/published workflow, local preview, JSON/CSV/Markdown/TXT import as HIDDEN DRAFTS (max 250/file, 4 MB), JSON export, keyword/status/level filtering, bulk tier assignment (max 100 articles per batch), revision listing, archive to trash and restore to draft.

Archive is a SOFT DELETE and immediately removes article access; permanent purge is not exposed in Version 1. Versions are checked for optimistic concurrency. Saves, archives and restores are database transactions with revision snapshots and central audit log entries.

Publication is blocked unless editorial state = accepted, article >=400 characters and sources contain at least one HTTPS reference. The separate visibility switch is required to show a published article. Research conversion does not constitute editorial acceptance.

## Security evidence

- Both new Supabase tables have RLS enabled and no direct anon/authenticated browser SELECT permissions. Their mutation function is executable only by service_role.
- Verified privilege audit: anon_read=false, user_read=false, anon_rpc=false, user_rpc=false.
- Cloudflare API validates a current Supabase bearer identity, active member account, account restrictions, SHOWCASE_VIEWER denial, real active plan-grant/subscription dates, Founder beta state, and each article's allowed plan codes; it returns body only upon successful check.
- Admin requires OWNER or active content.manage staff authority. The database RPC separately validates staff authority and records auditable mutations.
- The public catalog provides only published/visible metadata, never hidden article text or vendor materials. Content body read is no-store.
- Existing 419 Labs, Boot Camps, progress, data licensing, AI Tutor, Lumens, Stripe and other sales controls have not been changed by this feature.

## Outstanding production acceptance gates

1. Merge feature into current main without overwriting unrelated owner changes, and verify exact SHA CI.
2. Verify Cloudflare production serves that SHA; exercise actual public page, API, keyboard/mobile experience.
3. Genuine authenticated OWNER workflow: create, edit, upload, reassign tier, hide, archive, restore, revision/audit, stale edit denial.
4. Genuine two-account test: Free denies protected body; each eligible paid tier allowed; expired, restricted, showcase and anonymous denied. Verify Founding pre-LIVE behavior.
5. Independently review, verify source rights, validate numbers/regulatory currency, and sign off individual articles before publishing them.
6. Do not represent 145 drafts as 145 publication-approved or 1,500 finished articles.

## Revision history

| Version | Date | Revision | Status |
|---|---|---|---|
| 1.0 | November 2, 2026 | V1 article manager, source crosswalk and 145 draft records | Feature implemented, live database prepared; release acceptance open |

Footer: SMFGU-KDB-ARTICLE-LIBRARY-ADMIN-001 · v1.0 · Original educational work; not investment advice or permission to reproduce third-party STT content.
