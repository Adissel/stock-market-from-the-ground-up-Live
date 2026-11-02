# Crownlight Lumens — V1 Scope Rebase and V2 Gifting Backlog

| Document control | Value |
| --- | --- |
| Document ID | SMFGU-LUMENS-SCOPE-20261102 |
| Project | THE STOCK MARKET: FROM THE GROUND UP / Crownlight Lumens |
| Filename | `docs/qa/2026-11-02_LUMENS_V1_SCOPE_REBASE_V2_BACKLOG.md` |
| Type | Markdown |
| Version | 1.0 |
| Status | Owner-approved V1 scope amendment; product release still blocked |
| Decision date | November 2, 2026 |
| Google Drive location / Drive document ID | Not created / not assigned |
| GitHub location | `cybernexuspublishing/stock-market-from-the-ground-up`, `main`, `docs/qa/` |
| Dependencies | Previous 2026-10-31 four-gate register v1.5; Supabase reward release; membership entitlement; wallet audit; independent grading; exact-SHA CI and Cloudflare |

## 1. Owner-approved V1 scope

Crownlight Lumens are closed-platform, noncash credits, not a withdrawal or currency-exchange product. The internal redemption schedule remains $0.07 per Lumen for eligible platform discounts or purchases, subject to applicable terms and economic approvals. Do not advertise the planned learning-earning schedule as active.

**V1 retains:** one controlled wallet, the already accepted Stripe TEST refund/reconciliation work, nonexpiring purchased credits, approved learning-earning architecture (not yet published), eligible in-platform credit redemption, ledger idempotency and refund consistency, source controls, and reliable member-account isolation.

**V1 excludes:** member-to-member Lumen gifting, member-to-member transfers, recipient discovery/opt-in, transfers of purchased or earned credits to third parties, cash redemption, resale and bank payouts. Transfer code may remain deployed but must stay disabled at the policy, API and database release-gate layers. No gift transfer or credit activation is authorized.

This scope amendment is not a determination that purchased in-platform credits are exempt from financial-services, tax, consumer-protection, gift-card or prepaid-access rules. Any regulatory assessment relevant to the retained V1 offering is a separate applicable launch obligation, not a representation of legal approval.

## 2. Milestone rebase

| Acceptance measure | Accepted | Total | Completion |
| --- | ---: | ---: | ---: |
| Historical 2026-10-31 V1 scope, including gifting | 9 | 12 | 75.0% |
| **Owner-approved amended V1 scope, excluding gifting** | **9** | **11** | **81.8%** |

One unaccepted gifting milestone is **removed from the V1 denominator and transferred to V2**. It is **not accepted, passed or marked complete**. The 9 previously accepted technical/product milestones retain their historic evidence; no other acceptance was granted by this revision. This is the Crownlight Lumens work-package percentage, not an estimate for the entire website.

**Amended V1 remaining acceptance:**
1. **Protected official learning awards:** independent attributable case/rubric editorial approvals; genuine authenticated qualifying grade; precisely one nonexpiring wallet credit with duplicate/retry and denial testing; matched ledger audit. Grading and earning remain disabled until accepted.
2. **Exact-SHA release acceptance:** all required GitHub Actions green for one frozen main commit, production Cloudflare success on that *same SHA*, authenticated negative/positive access evidence, and release signoff. Any pending or failed job blocks completion.

## 3. V2 backlog — member-to-member gifting (unreleased)

Prepare a separate future project with recipient opt-in/identity, fraud prevention, velocity and transaction caps, earned/purchased bucket restrictions, immutable audit, dispute/reversal and duplicate replay handling, abuse account restrictions, accessibility and disclosures, and state/federal counsel review. The earlier owner-approved security and legal hold persists in full. The technical V2 prototype must not activate member transfers or be described as legally approved.

V2 activation requires a new explicit owner scope decision and independently verified regulatory, security and QA acceptance. Do not link V2 gifting clearance to the V1 Lumens completion denominator.

## 4. Evidence and implementation controls

- Runtime policy: `functions/_lib/lumen-member-gifting-policy-v1.js` keeps `enabled:false` and marks `releasePhase:'V2_DEFERRED'`.
- CI regression: `tests/test_lumen_learning_gifts_and_academy_progress_v1.mjs` asserts the V2 deferral.
- Database release flags `member_gifts_enabled`, `legal_gifting_clearance`, `security_gifting_clearance` remain false; never enable for V1.
- Original 2026-10-31 register v1.5 is retained as historical evidence; its 9/12 acceptance is a superseded **scope baseline**, not an incorrectly reported grade.
- Reviewer fields and assessment approvals cannot be synthesized by an AI operator. Zero actual independently approved case mappings is not completion.

## 5. Revision history

| Version | Date | Revision | Acceptance |
| --- | --- | --- | --- |
| 1.0 | 2026-11-02 | Owner transferred member gifting from Lumens V1 into V2; recalculated the acceptance denominator, locked transfer policy and retained grading/CI blocks | V1 scope approved; 9/11 accepted; launch still blocked |

**Footer:** SMFGU-LUMENS-SCOPE-20261102 · v1.0 · Internal product/QA governance. Not licensed legal advice or permission to launch earning, gifting or live money movement.
