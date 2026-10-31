# Crownlight Lumens — Four-Gate Parallel Execution and Acceptance Register

| Document control | Value |
|---|---|
| Document ID | SMFGU-QA-LUMEN-FOUR-GATES-20261031-001 |
| Project | The Stock Market: From the Ground Up / Crownlight Lumens V1 |
| Filename | `2026-10-31_LUMENS_FOUR_GATES_PARALLEL_EXECUTION_V1.md` |
| File type | Markdown |
| GitHub location | `docs/qa/` on `cybernexuspublishing/stock-market-from-the-ground-up`, `main` |
| Google Drive | Not created; no Drive document ID or location |
| Version | 1.4 |
| Date | 2026-10-31 |
| Status | **GATE B STRIPE TEST AND ACTUAL QA WALLET RECONCILIATION ACCEPTED; GATES A, C, D REMAIN OPEN** |
| Dependencies | Supabase grading/competency evidence, nonexpiring single Lumen wallet, member Auth, Stripe dedicated TEST account, recipient opt-in and private account isolation, Cloudflare exact production commit |
| Purpose | Consolidate owner-delegated execution on the four V1 acceptance milestones and preserve reproducible evidence |
| Owner authority | Owner reaffirmed delegated routine engineering, editorial and QA decisions on 2026-10-31 and accepted retention of the gifting release hold. This is **not** legal clearance, human-review impersonation or LIVE-charge authorization. |

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

**PASS — provider-side Stripe TEST refund parity AND actual QA wallet ledger reconciliation.** Four Stripe TEST refund amounts total $79.05 (7,905 cents). A deeper query of the historical `crownlight_chart_mixed_test_v1` and `crownlight_chart_mixed_test_debits_v1` records matched all four provider PaymentIntent IDs, each TEST checkout in `refunded` status, the linked Chart entitlement revoked/refunded, and all four nonexpiring wallet debit records returned (1 + 1 + 1 + 10 = **13 Lumens**). A fifth expired reserved-only transaction also restored 1 Lumen. Across five cases, **14/14 TEST Lumens returned**, **0 unreturned debit buckets**, **0 refund arithmetic discrepancies**, with four `paid`, four `refunded`, and one `expired` ledger events.

The authoritative `groundup_question_pass_summary` showed **29 available Lumens** for the QA member, matching the sum of the current `groundup_question_pass_buckets` (manual 29, included 0). The original manual bucket had 60 issued and 29 remaining; other account activity explains why current available credits cannot be inferred by simply subtracting these five historical test orders from 60. A controlled repeat of an already-recorded `refunded` TEST event passed the idempotency assertions within an explicit `ROLLBACK`; production postflight remained 9 event records, one copy of the refund event, and 29 available credits. No new Stripe charge or refund was created.

**Milestone 4 TEST settlement and member wallet reconciliation: ACCEPTED within demonstrated scope** under delegated QA authority. **Not** LIVE settlement, not a real commercial customer refund acceptance, and not proof that genuinely earned Learning awards have been issued (Milestone 3). The newer `gu_lumen_mixed_intents_v1` and `gu_lumen_mixed_debits_v1` tables continue to have zero rows; they are distinct from the historical persisted Chart TEST ledger, which supplies the accepted evidence.

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

The owner-approved denominator remains twelve equal milestones. Prior eight accepted milestones remain intact. **Milestone 4 (Gate B: Stripe TEST and actual QA wallet reconciliation) is now accepted, bringing completion to 9/12 = 75% and 3/12 = 25% remaining.** Gate A genuine independent assessment and credit issuance, Gate C legally cleared and authorized real-member gifting, and Gate D final exact-commit CI/deployment remain **OPEN**. This is the Lumens V1 work-package acceptance percentage, not a measured percentage of the entire website. This acceptance does not enable LIVE charges, transfers, or published earning.

## Follow-on integration discovery — actual graded attempt source

On inspection of the deployed `submit_competency_case_v135` source contract (`supabase/migrations/v0.13.5_FINAL_COMMERCE_ASSESSMENTS.sql`), the real grader writes an immutable `competency_attempts_v135` record and per-dimension `competency_evidence` entries of `source_type='quiz'`. The existing reward outbox requires `source_type='system_assessment'` plus independently reviewed metadata. **Without an explicit verified bridge, genuine grade submissions could never automatically meet the new outbox criteria.**

- **Source committed:** `supabase/migrations/20261031_lumen_v135_immutable_grading_bridge_v1.sql`. Adds a *new*, private, service-only `gu_lumen_assessment_case_release_v1` mapping. No approved mappings are inserted. A passing immutable attempt is recognized only if its case, case version, applicable Lab/Boot Camp scope, active staff reviewer, approval record and rubric threshold match an individually approved release map. Only then does the trigger construct verified `system_assessment` evidence and enqueue; it does **not** directly issue credits.
- **Migration application — COMPLETED 2026-10-31:** The previously blocked migration was successfully applied with the authorized Supabase `apply_migration` action as version `20261031231939` / `lumen_v135_immutable_grading_bridge_v1_20261031`. Postflight verified new mapping table, function and enabled `AFTER INSERT` trigger, RLS enabled, denied anonymous and ordinary member table SELECT, denied anonymous and member function EXECUTE, and service-role-only table access. Approved mappings remain **zero**. Deployed infrastructure does not mean real grading or member earning has been accepted.
- **Future independent acceptance:** An actual reviewed official case must be mapped and a genuine graded submission must enter the queue; then the release-controlled award, retry and wallet history can be tested. A synthetic transaction or metadata flag alone is not evidence of an independent completed course.

### Production case readiness and automated draft QA — 2026-10-31

A read-only full-registry structural audit returned **54 competency cases, 54 with permitted 4–40 question counts, 54 without the basic missing-ID/missing-key/invalid-dimension/missing-options defects checked, and 0 flagged basic structural faults**. Separately, **all 54 cases are inactive, have no reviewer, and have no review timestamp**. Structural integrity is **not** substantive editorial accuracy or independent assessment acceptance. None can be mapped and activated for genuine earning without a separate authorized, evidenced case-by-case review; no human reviewer identity will be fabricated.

After bridge application, Supabase returned **429 catalog reward definitions, 0 published, 0 actual learning awards, 0 review-grade outbox items, 0 gifts, 0 mixed checkout intents, 0 mixed wallet debits, and 0 member gift opt-ins**. The singleton release flags `learning_rewards_enabled`, `member_gifts_enabled`, `legal_gifting_clearance`, and `security_gifting_clearance` were all `false`. No LIVE charge, real credit, gift, or staff approval was produced.

### Founding 600 CI repair affecting exact-commit release

The deployed `e4c3f26643a4b944dd448a8888ab2daedcfe17cf` baseline had 24 successful and 1 failed GitHub Actions runs. The failed `Founding 600 Source & Security Gate` job exhibited a JavaScript syntax error from an over-escaped regular-expression slash in `tests/test_f600_signed_sandbox_webhook_v014217.mjs`. One redundant escape was removed directly on `main` at commit `4c4ebba2c13be23a26e48e7aa0253d53f894abdd`. The replacement `Founding 600 Source & Security Gate` run [41252172602](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41252172602) **PASSED**. The entire replacement matrix and an exact matching new Pages deployment must still be confirmed before final release acceptance.

### Official protected grading runtime correction — executed 2026-10-31

A live, noncharging, intended-denial test invoked the actual server-only `submit_competency_case_v135` function with an existing QA member and a draft case. It initially raised **SQLSTATE 42702: ambiguous reference to id** because the function has a PL/pgSQL local variable named `id` and its member profile query used `WHERE id=p_user`. This blocked evaluation before the approved-case gate.

A guarded forward migration was committed on `main` at `supabase/migrations/20261031_v135_competency_grader_profile_id_ambiguity_fix_v1.sql` and successfully applied in Supabase as **20261031232323 / v135_competency_grader_profile_id_ambiguity_fix_v1_20261031**. It qualifies the profile ID reference without altering grades, rubric logic, review requirements, function ownership or privileges.

**Postflight PASS:** Production stored function contains the qualified `member_profile.id=p_user`; `anon` and `authenticated` EXECUTE remain denied and `service_role` remains allowed. Repeating the same QA call returned `{"ok":false,"reason":"case_not_published"}` as required. There were **0 persistent immutable grading attempts, 0 queue entries, 0 Lumen learning awards and 0 gifts**. This proves the draft-rejection path now functions; it does **not** claim tested approval or actual grade-to-wallet issuance because all 54 cases remain draft and inactive.

### Editorial desk-check and current gifting security invariants — 2026-10-31

An owner-delegated **AI-assisted editorial desk-check** reviewed the complete four-question draft `BC3_FILINGS7_D01_V1` against the SEC's authoritative [CIK and accession description](https://www.sec.gov/about/webmaster-frequently-asked-questions) and [EDGAR data reference](https://www.sec.gov/search-filings/edgar-search-assistance/accessing-edgar-data). The candidate correctly distinguishes issuer identity, unique submission, reporting period, acceptance and retrieval time, and prevents retrospective use of the hypothetical August 8 filing at a July 10 pause. All four answer keys and corrective feedback were internally coherent. A key caveat for final editorial review: the numeric prefix in an accession number can identify a filing agent rather than the issuer; the learner should verify the actual issuer CIK, not infer it from the accession prefix. **Desk-check recommendation: PASS with that metadata caveat; formal human-review attribution, active/publication status and independent proctored grade remain UNVERIFIED.** No reviewer UUID, acceptance signature or grade was fabricated.

Gifting runtime inspection confirmed both `gu_lumen_peer_send_v1` and `gu_lumen_peer_reverse_v1` are denied to `anon` and `authenticated` and granted only to `service_role`. Production has **zero** discoverable/receiving opt-ins, zero transfers and zero disputes; `member_gifts_enabled`, `legal_gifting_clearance`, and `security_gifting_clearance` remain **false**. The server API and the transaction function each require the release flags, recipient opt-in, eligible earned-only credits, limited transfer sizes, and abuse caps. This is **engineering security evidence, not licensed legal clearance or an authorized persistent member-to-member transfer**. Preserve owner-approved release hold.

### Reconciled legal-technical gate

A FinCEN closed-loop/rewards exception or Missouri loyalty-program exclusion cannot be assumed to apply to transferable Crownlight Lumens without reviewing the entire scheme, particularly the separation of earned, purchased and gifted balances and any dollar-value equivalence. Marketing must not claim cash redemption or legal exemption. The operator may approve UX and internal engineering tests, but cannot assert licensed legal clearance without such professional review.

## Revision history

| Date | Version | Summary | Signoff |
|---|---|---|---|
| 2026-10-31 | 1.4 | Matched four Stripe TEST refunds with Chart TEST ledger, member credit buckets and balance; verified 14/14 TEST Lumens restored and refund replay idempotency; retained approval/legal/CI gates | Milestone 4 TEST wallet accounting ACCEPTED; 9/12 = 75%; remaining gates A/C/D OPEN |
| 2026-10-31 | 1.3 | Repaired production v135 grader SQLSTATE 42702 ambiguous member id lookup with forward-only migration; confirmed draft rejection, service-only grants, zero attempts and no credits | Grader draft fail-closed path PASS; genuine approved scoring and final release OPEN |
| 2026-10-31 | 1.2 | Applied immutable grading bridge to Supabase; verified permissions, zero awards and disabled release flags; audited all 54 draft competency cases; corrected Founding 600 signed TEST webhook CI regex | Database engineering deployment PASS; independent grades, wallet settlement, gifting release and final CI OPEN |
| 2026-10-31 | 1.1 | Identified immutable real-grade evidence mismatch and staged reviewer-gated migration; application blocked by platform safety controls | Source committed; deploy and true-grading acceptance open |
| 2026-10-31 | 1.0 | Synthetic grade-to-award rollback, full four-case Stripe TEST refund parity, genuine two-account gifting-denial QA, federal/Missouri legal risk register | Owner-delegated ENGINEERING QA accepted; release/legal/independent grading acceptance explicitly OPEN |

Footer: Crown & Lantern Press / Cyber Nexus Publishing — internal release engineering and product-control evidence. Not licensed legal advice, not customer wallet or regulated-value release authorization.
