# Crownlight Lumens — Four-Gate Parallel Execution and Acceptance Register

| Document control | Value |
|---|---|
| Document ID | SMFGU-QA-LUMEN-FOUR-GATES-20261031-001 |
| Project | The Stock Market: From the Ground Up / Crownlight Lumens V1 |
| Filename | `2026-10-31_LUMENS_FOUR_GATES_PARALLEL_EXECUTION_V1.md` |
| File type | Markdown |
| GitHub location | `docs/qa/` on `cybernexuspublishing/stock-market-from-the-ground-up`, `main` |
| Google Drive | Not created; no Drive document ID or location |
| Version | 1.1 |
| Date | 2026-10-31 |
| Status | **TECHNICAL EVIDENCE UPDATED; GENUINE REWARD, LUMEN SETTLEMENT AND GIFTING LEGAL GATES OPEN** |
| Dependencies | Supabase grading/competency evidence, nonexpiring single Lumen wallet, member Auth, Stripe dedicated TEST account, recipient opt-in and private account isolation, Cloudflare exact production commit |
| Purpose | Consolidate owner-delegated execution on the four V1 acceptance milestones and preserve reproducible evidence |
| Owner authority | Routine technical QA, draft product/economics decisions and editorial review delegated. Legal licensure, independent human beta and real commercial-payment authorization are **not** assumed. |

## Milestone 3 — Protected reward technical integration

**PASS — transaction-level end-to-end synthetic acceptance, with automatic ROLLBACK.** In the connected production Supabase project, a single SQL transaction temporarily set a draft canonical Lab `DT-C01-L01` award to 25 Lumens and raised the guarded switch, inserted a clearly labeled synthetic protected-grade QA record using James_Test, then invoked the real protected-grade queue processor. Assertions confirmed:

- Only qualifying approved-looking `system_assessment` entered the outbox, never ordinary ungraded reflections.
- The processor wrote **one** award and **one** nonexpiring existing-wallet credit bucket.
- The authoritative wallet summary increased by exactly 25 synthetic Lumens **inside** the transaction.
- Repeated processor invocation issued **zero additional** awards.
- `ROLLBACK` reverted the grade, approval, flag, award and credit. No customer record was issued.

This is an **engineering** signoff for queue-to-ledger integrity. It is **not** an independently accepted real grade, no real awarded Lumens are authorized, and no switch may be activated merely because synthetic data passed.

## Milestone 4 — Stripe TEST provider refunds and member ledger

Read-only Stripe plugin selected `stock-market-from-the-ground-up-Test Mode` (not LIVE and not MommaBee). Its complete available TEST PaymentIntent and Refund list showed four `CHART_PROFESSIONAL_30D` mixed-checkout PaymentIntents whose refunds matched exactly:

| TEST PaymentIntent | Amount received (USD cents) | Successful refund total (cents) | Result |
|---|---:|---:|---|
| `pi_3UWe6mJY9FI7byHB0EJvLW7S` | 1992 | 1992 | PASS |
| `pi_3UWYxVJY9FI7byHB06cp7d5U` | 1992 | 1992 | PASS |
| `pi_3UWYpbJY9FI7byHB02uoft83` | 1992 | 1992 | PASS |
| `pi_3UWXxLJY9FI7byHB06FIrFOv` | 1929 | 1929 | PASS |

**PASS — provider-side TEST refund parity.** No new payment or refund was created. This provider evidence must **not** be misrepresented as actual Lumen debit restoration or member account history parity. The earlier SQL snapshot had no persisted mixed-intent/debit rows to pair with these provider TEST refunds; complete cross-system reconciliation remains OPEN.

### Product-owner amount approval

The 419-Lab/10-Boot-Camp earning schedule is retained as a **draft economic/UX specification**, not a customer-facing promise. Independent grading, actual redeemable value exposure, redemption eligibility, and projected reward liabilities require signoff. All 429 rows remain `published=false` and earning stays disabled unless separately verified. Customer site must continue marking figures *not yet earnable*.

## Milestone 5 — Genuine two-member gifting security and legal issue register

**PASS — noncharging genuine two-identity denial and account isolation.** GitHub [Actions run 41243627925](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41243627925) authenticated James_Test (Advanced) and QA_Secondary (Standard) through separate Supabase Auth tokens. For both users, the genuine deployed production endpoints rejected member gifting lookup, transfer submission and consent activation while unpublished. A before/after authenticated authoritative ledger-integrity read showed **identical balances**, and anonymous access was denied. Zero payment/wallet/entitlement writes occurred.

Existing prior controlled transaction-level tests demonstrated atomic gift+retry+reversal and spent-credit dispute, but **a complete authorized, actual, persistent two-member transfer is NOT accepted** and gifting remains off.

### Legal and consumer protection review — open

Official reference sources read October 31, 2026:
- [Missouri Money Transmission Modernization Act licensing](https://finance.mo.gov/consumer-credit-licensing/money-ordermoney-transmitter)
- [Missouri Revised Statutes § 361.906](https://www.revisor.mo.gov/main/OneSection.aspx?bid=54880&section=361.906)
- [FinCEN prepaid-access rule explanation](https://www.fincen.gov/resources/statutes-regulations/guidance/final-rule-definitions-and-other-regulations-relating)
- [Federal Regulation E § 205.20](https://www.federalreserve.gov/frrs/regulations/section-20520-requirements-for-gift-cards-and-gift-certificates.htm)

Open counsel questions:
1. Classification of **earned**, **purchased**, **promotional** and **person-to-person gifted** Lumen credits under Missouri's stored-value/money-transmission exclusions and applicable federal prepaid access rules. Missouri's law distinguishes closed-loop and non-sold loyalty/rewards/promotional value, but that text alone does not establish the platform is exempt when member-to-member transfers are enabled.
2. Whether P2P movement of earned value changes closed-loop or rewards-program regulatory treatment, and what geographic restrictions, dollar-value caps, disclosures or record retention are required.
3. Explicit recipient opt-in, sender authorization, fraud/dispute process, finality and reversal disclosures, age eligibility, account suspension, noncash/no cash-out and nonexpiration policy.
4. Whether published discount economics or mixes of purchased/promotional/earned rewards create consumer gift-card or prepaid obligations; analyze relevant Reg E provisions and multi-state exposure.

**Decision: do not certify legal compliance or activate gifting.** This is an internal risk register prepared without paid outside counsel and not a legal opinion.

## Milestone 6 — Exact-commit release acceptance

Continue requiring full pass from all required GitHub workflows and a successful Cloudflare production deployment of the **same approved SHA**. No rolling, concurrently changing `main` commit is frozen by this register. Check the final SHA after completing changes. Prior 27/27 CI acceptance remains valuable but does not automatically accept later commits.

## Overall completion methodology

The owner-approved denominator remains twelve equal milestones. Previously accepted eight remain intact: **8/12 = 66.7%**, reported **67% complete**, **33% remaining**. This batch establishes strong technical and noncharging TEST evidence across all four open gates, but does not inflate complete milestones without genuine independent grading, authoritative real-account earning, legally approved gifting, or final exact-commit release.

## Follow-on integration discovery — actual graded attempt source

On inspection of the deployed `submit_competency_case_v135` source contract (`supabase/migrations/v0.13.5_FINAL_COMMERCE_ASSESSMENTS.sql`), the real grader writes an immutable `competency_attempts_v135` record and per-dimension `competency_evidence` entries of `source_type='quiz'`. The existing reward outbox requires `source_type='system_assessment'` plus independently reviewed metadata. **Without an explicit verified bridge, genuine grade submissions could never automatically meet the new outbox criteria.**

- **Source committed:** `supabase/migrations/20261031_lumen_v135_immutable_grading_bridge_v1.sql`. Adds a *new*, private, service-only `gu_lumen_assessment_case_release_v1` mapping. No approved mappings are inserted. A passing immutable attempt is recognized only if its case, case version, applicable Lab/Boot Camp scope, active staff reviewer, approval record and rubric threshold match an individually approved release map. Only then does the trigger construct verified `system_assessment` evidence and enqueue; it does **not** directly issue credits.
- **Migration application:** Connected Supabase migration action was rejected by platform safety checks. **Not deployed; no live acceptance claimed.** A separate source regression test was committed to verify the mapping and no-direct-award guards. Its CI result must pass before source contract acceptance.
- **Future independent acceptance:** An actual reviewed official case must be mapped and a genuine graded submission must enter the queue; then the release-controlled award, retry and wallet history can be tested. A synthetic transaction or metadata flag alone is not evidence of an independent completed course.

### Reconciled legal-technical gate

A FinCEN closed-loop/rewards exception or Missouri loyalty-program exclusion cannot be assumed to apply to transferable Crownlight Lumens without reviewing the entire scheme, particularly the separation of earned, purchased and gifted balances and any dollar-value equivalence. Marketing must not claim cash redemption or legal exemption. The operator may approve UX and internal engineering tests, but cannot assert licensed legal clearance without such professional review.

## Revision history

| Date | Version | Summary | Signoff |
|---|---|---|---|
| 2026-10-31 | 1.1 | Identified immutable real-grade evidence mismatch and staged reviewer-gated migration; application blocked by platform safety controls | Source committed; deploy and true-grading acceptance open |
| 2026-10-31 | 1.0 | Synthetic grade-to-award rollback, full four-case Stripe TEST refund parity, genuine two-account gifting-denial QA, federal/Missouri legal risk register | Owner-delegated ENGINEERING QA accepted; release/legal/independent grading acceptance explicitly OPEN |

Footer: Crown & Lantern Press / Cyber Nexus Publishing — internal release engineering and product-control evidence. Not licensed legal advice, not customer wallet or regulated-value release authorization.
