# P0 Six-Workstream Execution Register — Source Batch 01

**Document ID:** SMFGU-P0-EXEC-001  
**Project:** The Stock Market: From the Ground Up / Website  
**Version:** 1.2  
**Date:** 2026-10-31 (America/Chicago)  
**Status:** ACCEPTANCE & QUALITY RELEASE — ALL SIX P0 ISSUES REMAIN OPEN (PARTIAL GATES VERIFIED)  
**Filename / type:** `docs/releases/2026-10-31_P0_SIX_WORKSTREAM_EXECUTION_v1.md` / Markdown  
**Google Drive location / ID:** Not assigned; GitHub main is the document of record. New Drive file not created.  
**Purpose:** Track source changes and distinguish live observations from release acceptance.

## Controlling scope
- P0-01 #153: All 419 Labs plus Boot Camps/Free Foundations, full Learn → Calculate → Experiment → Replay → Assess → Transfer journey, protected grades and equal teaching quality once entitled.
- P0-02 #154: Chart Studio tier, verified market-data boundaries, workspace revision/persistence, cross-account tests.
- P0-03 #155: Source-authorized historical data, provenance, no-lookahead and individual case acceptance.
- P0-04 #156: Real member wallet + Stripe TEST reservation, signed settlement, idempotent fulfillment, refund/dispute and zero-cash path.
- P0-05 #157: Original seven Boot Camps (247 days) plus three separately gated draft Boot Camps (27 days), per-day editorial approval, protected grading and standalone entitlement. Five Free Foundations days remain separate.
- P0-06 #158: Real-role security, RLS, signed webhook, Cloudflare deployed-head and final acceptance.

## Source changes (main only)
- `44ef9ee4`: Historical quote-readiness correction, later reconciled against the distinct existing TEST checkout route; do not misinterpret quote POST 503 as whole checkout outage.
- `7f423ddd`: Regression test for truthful mixed-checkout state.
- `9819b3c`: Small stand-alone contract test.
- `c1bb789`: Noncharging six-workstream source gate workflow; no member, Stripe, or database mutations.
- `8ce1a2f`: Obsolete KDP Select exclusivity flag set to false in manifest. Direct-book-sales switches remain untouched pending actual commercial release verification.

## Read-only production evidence (not certification)
- Supabase project `oxihglyfgzywsupnyicb` ACTIVE_HEALTHY at query time.
- Inspected sensitive service-only tables use RLS, with no anonymous/member direct SELECT grants. A zero-policy service-only table is not intrinsically an exposure.
- Ten examined Chart/Lumen privileged functions reject anon/authenticated EXECUTE and permit service role. Broader function exposure remains to be audited.
- Private replay-bars table count: 10,116. Source rights, feed identity, editorial status and case-level completeness must be evaluated independently.
- Cloudflare production deployment of `7f423ddd` reported success. Newer commits were in progress at last check. Exact latest deployment and GitHub Actions outcomes not yet confirmed.


## Acceptance and Quality reconciliation — 2026-10-31 (v1.1)
**Governance:** [#153](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/issues/153), [#154](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/issues/154), [#155](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/issues/155), [#156](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/issues/156), [#157](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/issues/157), [#158](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/issues/158) replaced outdated implementation evidence and remain OPEN. No release-gate closure was authorized.

**Canonical inventory without silently reopening the freeze:** 419 registered Labs + seven original Boot Camps (247 days) + five Free Foundations days = **671 previously controlled positions**. `tape10`, `indicators10`, and `filings7` add **27 separately gated draft days**, making 10 authored Academy programs / 274 Boot Camp days and **698 proposed total positions**. The 27 do **not** modify the original 671-unit review or grant themselves editorial approval, customer access, protected grades, or sales.

**Verified Stripe TEST / Lumen facts:** `docs/releases/2026-10-31_CHART_MIXED_TEST_SETTLEMENT_ACCEPTANCE.md` v1.1 accepts a genuine Professional mixed TEST purchase ($19.99 listed, 10 Lumens/$0.70 discount, $19.29 paid), signed paid and refund provider events, premium-access revocation and restoration of those 10 Lumens. A fresh read-only Supabase ledger check: four mixed paid/refunded orders and one separate expired/unpaid mixed order; four paid/four refund/one signed expired event, **14 Lumens debited and all 14 returned**. Provider-backed mixed TEST unpaid-session expiration and its one-Lumen restoration are now independently verified directly with Stripe and Supabase; this does not establish the member-facing cancellation button, actual Stripe dispute, genuine QA zero-cash browser flow, or authenticated downgrade/workspace acceptance. The existing `/api/chart-mixed-test-checkout` owns settlement; the quote POST is intentionally nonmutating.

**Boot Camp authoring status (later same-day v0.3 register):** 97 of 247 original days have individually authored instructional cases; 150 days (risk60 and practicum90) remain to author. No independently accepted day is recorded. The 27 three-course draft days remain separately gated.\n\n**Learning and grading facts:** `17dbb814` replaced 413 generic bridge explanations and added 419 ungraded transfer prompts; `929fcd9` renders and `e17d60a` source-tests them. Source changes do **not** certify content rigor or independent grades. Live `lab_training_sets_v014` holds 419 draft/unreviewed canonical sets and 20 separately reviewed/frozen B01 versions whose source status still says `individual_review_pending`; reconcile the contradiction before claiming B01 editorial sign-off. The ten-program guided flow is formative; secure graded completion remains open.

**Historical replay verified inventory:** live `market_datasets` contains 419 published original first-party fictional scenarios, two QA-only historical datasets (DIS 2024-05-07, GRML 2026-09-21), and 87 historical draft candidates explicitly unlicensed for member display. Published is **not** a synonym for broadly licensed history. 10,116 private replay bars is a storage count, not a rights release.

**Member acceptance and security:** authenticated Chart Studio Free/Founder/Owner/revoked account isolation and downgrade restore remain unaccepted; one private saved workspace exists. Current Supabase advisor snapshot: 204 informational service-only RLS-without-policy notices, 8 anon-executable and 91 authenticated-executable SECURITY DEFINER warnings, one leaked-password protection warning. Review each applicable permission; counts alone do not prove vulnerability. Member-facing wallet widget was added but private-ledger history, rewards and receipts require account-level checks. Main-branch source commits and a Cloudflare successful deploy are not proof of all GitHub Actions or authenticated end-to-end acceptance.

**Execution order:** (1) real-account Chart Studio downgrade/cross-member tests; (2) remaining TEST Stripe reversal/zero-cash provider QA; (3) B01 five-day quality/protected-grade reference; (4) 419 lesson + other 242 original days individual QA, then separate 27-draft review; (5) permissions/historical source rights/exact-main CI and final consolidated Owner acceptance. No new courses, unapproved Lumens rewards, gifting, paid feeds, LIVE payment writes, or fake grades.

**Repository audit limitation:** A GitHub issue or source scanner is not a human-reviewed, line-by-line sign-off of every tracked file. Preserve exact baseline SHA, complete full tracked-file inventory, source/static checks, triaged exceptions, and independent acceptance evidence before claiming comprehensive audit.

## Required acceptance
No P0 is marked complete merely for an issue, passing source test, code deployment or demo. Genuine authenticated tests, historical publication rights, Stripe TEST signed-provider settlement and individual editorial approvals remain explicit exit gates. No LIVE charging, customer refunds, production schema writes, or entitlement changes were performed in this batch.

## Revision history
- v1.1 — 2026-10-31 — Reconciled six issues, 10-program gating, Stripe TEST provider evidence, Lab/assessment records and verified replay source classifications. All final gates OPEN.
- v1.0 — 2026-10-31 — Created six-stream execution register, source fix and read-only evidence snapshot. Status: OPEN.

**Footer:** Crown & Lantern Press / Cyber Nexus • Controlled engineering record • Not production certification.
