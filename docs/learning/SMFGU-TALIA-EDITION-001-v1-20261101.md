# SMFGU-TALIA-EDITION-001 — Member Tutor Edition Assignments and Add-On Direction

**Project:** The Stock Market: From the Ground Up
**Company:** Cyber Nexus / Crown & Lantern Press
**Document ID:** SMFGU-TALIA-EDITION-001
**Filename:** docs/learning/SMFGU-TALIA-EDITION-001-v1-20261101.md
**File type:** Markdown
**Google Drive location:** Not created / GitHub main is controlling
**Google Drive document ID:** Not assigned
**Version:** 1.0
**Date:** November 1, 2026
**Status:** Owner-approved policy; Tutor edition editor implementation; premium features and sales remain unreleased
**Dependencies:** Supabase platform_plans, Owner RBAC, current 20261101 frozen Free snapshot, market-tutor-v01492, original learning/assessment boundaries
**Purpose:** Persist per-membership Talia edition choices without changing protected teaching quality, paid AI quotas or entitlements.
**Current Basic product label:** Talia Market Tutor v0.14.0.149 (Basic). This is the owner-approved customer-facing name of the Foundation edition, based on the verified member-workspace source release. The separately versioned Tutor backend is not renamed, and Advanced/Professional/Enterprise editions have not thereby been released.


## Owner controlling assignment matrix
| Plan | Shared Learning Engine | Shared Lab Engine | Talia Market Tutor |
| --- | --- | --- | --- |
| FREE | v3.3 Basic frozen baseline | v3.2 Basic frozen baseline | Talia Market Tutor v0.14.0.149 (Basic) |
| FOUNDING_14 | v3.3 Basic frozen baseline | v3.2 Basic frozen baseline | Talia Market Tutor v0.14.0.149 (Basic) |
| PICK_WHAT_YOU_WANT | Basic plus independently entitled add-ons | Basic plus independently entitled add-ons | Talia Market Tutor v0.14.0.149 (Basic) plus independently entitled add-ons |
| ONDEMAND_MONTHLY | Based on verified purchased training product | Based on verified purchased training product | Based on verified purchased product |
| FOUNDING_30 | Next-best published edition when released | Next-best published edition when released | Advanced (target) |
| FOUNDING_60 | Best published edition when released | Best published edition when released | Professional (target) |
| FULL_MONTHLY | Best published edition when released | Best published edition when released | Professional (target) |
| LIFETIME | Best available / premium edition when released | Best available / premium edition when released | Enterprise (target) |
| FULL_ANNUAL, archived memberships | **Not newly assigned by this approval** | **Not newly assigned** | **Unassigned until terms are reconciled** |

## Tutor edition distinctions (not a claim of implemented capability)
- FOUNDATION / Talia Market Tutor v0.14.0.149 (Basic): original source-grounded explanations; first-principles lessons; no pay-per-explanation; universal Explain / Guided Example / Try Another / Teach Deeper.
- ADVANCED: future richer contextual learner diagnostics and advanced practice tools; no reduced Basic explanation quality.
- PROFESSIONAL: future advanced multi-context workflow, research/replay workbench integration, and larger analytical tooling; verified historical data boundaries remain mandatory.
- ENTERPRISE: future highest-capability research/workflow Tutor; no guaranteed paid inference, current-data feed, trading advice, or private grading.
- PRODUCT_DEPENDENT: an On-Demand entitlement must be independently verified before any edition above Foundation is provisioned. No tier is guessed from catalog copy.
- Basic is an ongoing member experience and **not** a paid add-on SKU.
- Additional Shared Learning Engine, Shared Lab Engine and Talia editions **may be offered as add-ons** after explicit product registry, price/Stripe TEST, fulfillment, entitlement, refunds, downgrade, abuse and rights approval. No paid checkout or provider products are created by these settings.

## Controls and security
- Admin Control Center > Products & Prices > Memberships: independent per-plan **Talia membership edition** selector and Save Tutor Edition action, in addition to three existing *source-version* selectors.
- Atomic SQL optimistic-concurrency RPC writes `platform_plans.metadata.talia_market_tutor_v1` (separate from `learning_engines_v1`, to prevent older engine saves from deleting Tutor edition) and `admin_audit_log`.
- Cloudflare verifies actual Owner member account, active OWNER role and account restrictions; Cloudflare service-role connection alone cannot grant an edition.
- Stored value describes contracted/policy-target edition, **not feature release**. Unreleased ADVANCED, PROFESSIONAL and ENTERPRISE features remain disabled until separately implemented, reviewed and authorized on the server.
- Tutor basic access remains source-only for eligible Free accounts; paid AI continues to require the separately verified Market Tutor tool entitlement, affirmative consent and quota.
- No grade, learning record, member wallet, paid subscription, book rights or checkout terms may change when editing a tier.
- No payment operations were authorized by this owner policy.

## Acceptance and unresolved conditions
- Test Owner authorized/unauthorized GET and write, duplicate revision, SQL audit and original engine version compatibility.
- Test all active plans, legacy preservation, On-Demand dependent behavior, and refunds/cancellations with private progress retained.
- Test Free source-only Tutor and denial of paid AI model calls; approved lessons remain equal quality.
- Authenticated real-member acceptance and exact-main deploy required.
- Do not claim Advanced/Professional/Enterprise operationally released solely because they appear as options.
- Full Annual and historical Founding editions: revisit only when approved product terms are reconciled.

**Revision history:** 2026-11-01 v1.0 — 4-tier Talia assignment matrix, independent admin selector, planned engine add-ons, nonpayment release constraints.
