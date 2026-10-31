# Founding Members — Three-Plan TEST Ledger Reconciliation

**Document ID:** SMFGU-F600-QA-LEDGER-017  
**Project:** The Stock Market: From the Ground Up / Founding Members commerce  
**Author / reviewer:** GPT-6, Owner-delegated financial QA controller  
**File type / name:** Markdown / 2026-10-31_FOUNDER_TEST_THREE_PLAN_LEDGER_RECONCILIATION_V1.md  
**Location:** GitHub cybernexuspublishing/stock-market-from-the-ground-up/docs/qa/ (main); Google Drive not created, Drive document ID unassigned  
**Version / date / status:** v1.0 / 2026-10-31 / TEST-ONLY READ-ONLY LEDGER RECONCILIATION ACCEPTED; WHOLE GATE 23 HOLD  
**Dependencies:** Founding QA webhook gu39, isolated public.gu_f600_sandbox_*_v014215 tables, Stripe TEST account, approved 14/30/60 plan terms, #154 and #158, final exact-SHA release.

## Method and limits

Read-only independent grouped queries in live Supabase against three already-existing QA-only tables: gu_f600_sandbox_intents_v014215, gu_f600_sandbox_cycles_v014215 and gu_f600_sandbox_events_v014215. Cross-joined each recorded event to its matching intent by UUID and counted DISTINCT stored Stripe event IDs; no customer email, card number, claimant UUID, webhook signing secret, source private keys or real customer credentials was read. Also independently inspected the connected Stripe account **TEST mode**, not LIVE: nine subscriptions existed, including QA-only 14/30/60 plan records. This audit did **not** create, capture, refund, cancel or renew any provider transaction. The database event ledger is historical processor-handler evidence; this read-only review does not repeat signature validation of each recorded historical provider event.

## Plan-by-plan recorded QA events

| QA plan | Paid invoice events | Full refund events | Subscription deleted | Subscription updated | Failed invoice | QA paid-cycle rows | Cycles still unreversed |
|---|---:|---:|---:|---:|---:|---:|---:|
| 14-Day / $22.99 | 3 | 3 | 3 | 2 | 0 | 3 | 0 |
| 30-Day / $49.99 | 4 | 2 | 1 | 7 | 1 | 4 | 2 |
| 60-Day / $59.99 | 4 | 4 | 1 | 1 | 0 | 4 | 0 |
| **TOTAL** | **11** | **9** | **5** | **10** | **1** | **11** | **2** |

**36 distinct recorded event IDs across all three plans**, with 16 QA intents (3/8/5, respectively). Historical lifecycle statuses contain scheduled cancellations, cancellations, refunds, past-due and prepared records. Two unreversed isolated 30-Day TEST cycles retain a combined ten *legacy-column-named* included reward credits. This is **not** a commercial customer balance or proof of a renewal. The canonical customer currency is **Crownlight Lumens**; the legacy table column name does not create a second wallet.

No actual production Founder paid-cycle or Founder subscription rows were found in the separate commercial tables at this audit. Do not invent a paid 60-Day membership from these QA cycles.

## Owner disposition and remaining decisive evidence

**ACCEPT this specific aggregate TEST ledger accounting/inventory review for all three plans.** Existing QA entries demonstrate persisted paid/refund/cancellation event categories, including a failed-invoice category for 30-Day. Distinct event keys are present. This review does not establish the order of all provider lifecycle steps, the correct monetary idempotency of every event, first-party UI checkout, genuine provider-delivered automatic renewal, failed-payment/recovery across all three plans, actual charged-card cancellation UX, entitlement revocation in a genuine paid member's browser, real Founder seat allocation or production commerce readiness.

**Gate 23 remains PARTIAL / HOLD.** Required next: same-test-customer full actual TEST checkout → first paid invoice → automatic term renewal (Test Clock if supported) → failed invoice and recovery → cancel at period end or immediately → full refund → signed event replay → exact isolated entitlement/wallet reconciliation for each 14/30/60 plan. Do not reverse the two remaining QA credits or trigger TEST monetary writes merely to make aggregate counts look clean. Keep all LIVE checkout gated.

## Revision history

| Version | Date | Change |
|---|---|---|
| v1.0 | 2026-10-31 | Reconciled 16 existing QA intents, 11 cycles, 36 distinct recorded event IDs, three plan-specific states without money or entitlement writes. |

**Footer:** Crown & Lantern Press — internal accounting QA only; not an audit opinion, payment-compliance certification, or authorization to turn on LIVE checkout.
