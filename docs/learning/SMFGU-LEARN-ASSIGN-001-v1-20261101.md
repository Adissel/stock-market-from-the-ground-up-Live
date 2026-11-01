# SMFGU-LEARN-ASSIGN-001 — Membership Learning, Lab & Tutor Version Assignment

**Project:** The Stock Market: From the Ground Up
**Company:** Cyber Nexus / Crown & Lantern Press
**Document ID:** SMFGU-LEARN-ASSIGN-001
**Filename:** docs/learning/SMFGU-LEARN-ASSIGN-001-v1-20261101.md
**File type:** Markdown
**Version:** 1.0
**Date:** November 1, 2026
**Status:** Source implementation; migration and exact production acceptance require separate evidence
**Google Drive location/document ID:** Not assigned / not created
**Dependencies:** Existing platform_plans, profiles, admin_user_roles, admin_user_flags, admin_audit_log, Supabase, Cloudflare Pages, owner source snapshot
**Purpose:** Owner-selectable instructional-engine presentation versions for every existing membership, with Free and Pick What You Want initialized to the frozen November 1 engine snapshot.

## Contract

- Admin Control Center > Products & Prices > Memberships includes a unified three-column version assignment editor for **all** plans, including archived plans.
- OWNER authority and optional MFA enforced at the Cloudflare API. Showcase and restricted accounts cannot write.
- Atomic, optimistic-concurrency SQL RPC saves three whitelisted versions and writes admin_audit_log; prevents partial updates.
- One existing platform_plans.metadata key `learning_engines_v1` stores the version configuration; no additional member entitlement, subscription, wallet, assessment or grading table.
- FREE and PICK_WHAT_YOU_WANT default to source-frozen LEARNING_V33_FREEZE_20261101 / LAB_V32_FREEZE_20261101 / TALIA_FREEZE_20261101. Other memberships keep deployed current engines unless Owner changes them.
- Existing authorized Lab access, private assessment, no-lookahead replay and source-data rights remain independently enforced. Version selection never grants entitlement.
- Copy: `assets/learning-versions/20261101-free-v33-v32/` contains 16 frozen public-facing source files copied by blob SHA; backend Tutor and protected grading are **not duplicated**.
- Rollback: revert page / Worker version routing and retain existing membership metadata and audit records; do not drop stored settings while member clients rely on them.
- No live payment, Stripe, paid AI inference, membership price, stage-ID migration or graded student state is changed.
## Acceptance

1. Exact source/hash snapshot manifest verified; live build includes frozen public assets.
2. Owner GET loads all existing membership records, authorized update handles conflicting revision and audit; non-Owner GET/POST denied.
3. Member learning runtime reads server-resolved config; Free/Pick uses frozen client modules, all others current by default. Member plan resolution not a grant and never overrides `/api/lab-content` or `/api/interactive-training`.
4. Real Free, Pick, Founding 14/30/60, Full, Lifetime, On-Demand and individually entitled tool-user tests required before claiming member acceptance.
5. Exact-commit CI plus production Cloudflare/Supabase postflight required.

**Revision history:** 2026-11-01 v1.0 — frozen source registry, audited version assignment API, admin editor.
