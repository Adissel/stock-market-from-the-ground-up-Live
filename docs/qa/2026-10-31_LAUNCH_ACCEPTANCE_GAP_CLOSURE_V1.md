# SMFGU — Consolidated Launch Acceptance Gap Closure (Execution Register)

**Document ID:** SMFGU-QA-LAUNCH-GAPS-20261031-001  
**Project:** The Stock Market: From the Ground Up  
**Authoritative location:** GitHub `cybernexuspublishing/stock-market-from-the-ground-up`, `main`, `docs/qa/2026-10-31_LAUNCH_ACCEPTANCE_GAP_CLOSURE_V1.md`  
**Filename:** `2026-10-31_LAUNCH_ACCEPTANCE_GAP_CLOSURE_V1.md`  
**File type:** Markdown  
**Google Drive location:** Not assigned; no Google Drive duplicate created.  
**Google Drive document ID:** Not assigned.  
**Version:** 1.0  
**Status:** PARTIAL EXECUTION; noncharging provider/configuration checks completed, exact-commit browser and external provider/human/legal acceptance OPEN  
**Prepared / last verified:** 2026-10-31 (America/Chicago and UTC; evidence is timestamped by providers)  
**Purpose:** Do not repeat accepted tests. Preserve controlling approvals and list precisely what still prevents unrestricted paid-product acceptance.  
**Dependencies:** Existing Stripe TEST/LIVE, Supabase Primary `oxihglyfgzywsupnyicb`, Cloudflare production Pages, GitHub Actions, legal publication register, approved book edition inventory, named independent professional review.  
**New file required:** Yes. This versioned execution register is separate from historical commerce and legal records.

## Workstream 1 — Current CI and exact-commit browser evidence

**Previously completed and preserved:** First-22 targeted Academy source CI PASS, [run 41215137219](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41215137219). The prior book access test fixture was updated to mock the authoritative `platform_plans` query and reject missing plans; Free Foundations numeric assertion was corrected without changing the illustrated value. Do not repeat old fixes merely because their earlier runs failed.

**Execution during this batch:**
- Added `tests/test_launch_public_security_policy_v1.mjs` and `.github/workflows/launch-public-security-policy-v1.yml` directly to `main`. Anonymous, production HTTPS GETs to each of `INTERACTIVE_LEARNING`, `JOURNAL_ANALYTICS`, `MARKET_SIMULATOR`, `MARKET_TUTOR` returned HTTP **401** (confirmed in [run 41216565797](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41216565797)). No account, entitlement, money or Stripe event was altered.
- This first standalone CI run failed because public policy `*.html` URLs consistently returned HTTP **308** canonical redirects rather than direct HTTP 200. Updated test to follow redirects only when the final origin remains the official production origin and require final HTML 200 with the appropriate route. The corrected run [41216669897](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41216669897) was queued at evidence collection; do not mark it PASS before its terminal result.
- Triggered GitHub rerun of prior cancelled `Sitewide Playwright` browser job [124582214146](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41216565779) with existing GitHub Actions safeguards. It was QUEUED on last read. This rerun tests its fixed source SHA, **not necessarily the latest fast-moving main production commit**. Final exact-deployed-commit acceptance is still OPEN.
- Other workflows repeatedly show `cancelled` due rapid main branch commits. A canceled job is neither an application PASS nor application FAIL. Do not claim a full-green release gate based on incomplete runs.

**Decision:** Production four-tool anonymous security boundary PASS; full browser/regression on exact deployed commit OPEN.

## Workstream 2 — Digital book editorial/storefront reconciliation

**Read-only Supabase facts:**
- Five visible digital products have website checkout, download, and rights-attested flags enabled. The exclusive-until dates are all in the past as of 2026-10-31; do not substitute these DB flags for legal rights confirmation.
- `FOUNDATION_BOOK_1` and `READING_THE_TAPE` have `publication_status=published` and `sales_status=published`.
- `FOUNDATION_BOOK_2` and `FOUNDATION_BOOK_3` have `publication_status=publication_candidate` despite `sales_status=published` and website checkout enabled.
- `DAY_TRADING_BOOK_1` has `publication_status=in_development` despite `sales_status=published` and website checkout enabled.
- Existing historical approval of the Foundations customer Book I–III editions v1.14 is controlling, not a reason to alter an unknown exact downloadable file without a hash/edition crosswalk.
- Website direct book TEST Book I payment/refund and private EPUB access checks previously passed and are not being repeated.

**Decision:** Editorial metadata inconsistent for three enabled products. No customer edition or sale flag altered in this batch. Establish exact downloadable EPUB hash/version and licensed editorial acceptance before changing `publication_status`. Do not assert an independently accepted Day Trading customer edition absent that evidence.

## Workstream 3 — Founding Membership renewal/failure

**Existing provider acceptance:** Genuine Stripe TEST initial paid invoices, signed fulfillment into shadow records, full provider TEST refunds and cancellation were verified for **all three** Founding 14/30/60 plans: [provider record](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/blob/main/docs/qa/2026-10-30-founding-membership-stripe-test-provider-acceptance.md). No reason to charge them again.

**Provider capability check during this batch:** Connected Stripe TEST API operation search exposes test-clock **creation**, but not advance-time operations. Existing provider-created TEST renewals and failed-renewal/recovery remain unverified; synthetic invoice/event tests are a different test tier. Therefore **no new TEST subscription was created** without a way to advance its clock. No LIVE charge was initiated.

**Decision:** P0 proof remains for later provider-generated invoice renewal, payment-failure, retry/recovery and paid-access changes. Keep these OPEN until a supported provider workflow is available. Preserve seat accounting and idempotent payment safeguards.

## Workstream 4 — Four sale-ready tools, pricing and access

**Production facts:**
- `INTERACTIVE_LEARNING`, `JOURNAL_ANALYTICS`, `MARKET_SIMULATOR`, `MARKET_TUTOR` are currently `live`, active, public-visible and `checkout_enabled=true` with a database amount of **2999 cents** each.
- Independently fetched four mapped Stripe LIVE Prices: `price_1UR2syJL0O4GGVBHXn98cQqn`, `price_1UR2vHJL0O4GGVBHVlYlhZiL`, `price_1UR2y2JL0O4GGVBHJ5wKbWws`, `price_1UR30oJL0O4GGVBHkmHBrnkU`. Each is active, LIVE, USD 2999 cents, **recurring every month**, and is mapped to its separate expected Product.
- Real production `member-tool-access` rejects missing bearer for all four, HTTP 401 as measured from GitHub-hosted runner.
- Database `user_has_tool_access(uuid,text)` is `SECURITY DEFINER` but `EXECUTE` on the function is **not granted** to `anon` or `authenticated`, only `service_role`. The function verifies member status, restrictions, Showcase, active paid term and matching plan/tool access. Frontend display alone is not treated as a grant.
- Existing isolated staging SQL suite exercised all four tool entitlement transitions in disposable PostgreSQL; true authenticated provider-to-member LIVE fulfillment remains unverified. Current `gu58_live_checkout_intents` count was 0 during read-only check.

**Decision:** Product/Price matching and unauthorized boundary PASS. Four genuine paid-member entitlement issuance, renewal, expiry, cancellation and refund tests OPEN. Do not confuse Price configuration with paid fulfillment.

## Workstream 5 — Legal, tax, and human authentication

**Published controls:** Supabase contains **19 published legal documents**, beyond the older 14-document publication record. Current policy versions include Terms 2.7, Subscription 2.3, Refunds 2.2, Privacy 2.0.3, Founding 600 2.2, Lumens 2.6, Digital Books 2.0. Renewal, cancellation and refund terminology is present in applicable policies, which is a text-presence check, **not legal adequacy or completed consent evidence**.

**Current authoritative external law:**
- The FTC rescinded/reverted its 2024 expanded negative-option rule in February 2026 after the Eighth Circuit vacated it; do not claim the 2024 \"Click-to-Cancel\" final rule is currently operative as originally adopted. Primary reference: https://www.ftc.gov/policy/public-comments/revision-negative-option-rule-withdrawal-cars-rule-removal-non-compete-rule-conform-these-rules-0
- Missouri requires qualifying businesses operating under a name other than their true name to file a fictitious-name/DBA registration (unless their legal-name facts avoid that requirement): https://www.sos.mo.gov/business/corporations/fictitious_faq. The actual registered seller identity remains unverified.
- Missouri DOR Letter Ruling 8392 concerns electronic textbooks on specific applicant facts. It **does not** certify all digital books, memberships, tools, Lumens or multi-jurisdictional transactions as tax-exempt: https://dor.mo.gov/rulings/show/8392.

**Authentication evidence:** Cloudflare production has `ENFORCE_AUTH_TURNSTILE_V135=true`, a configured public site key and encrypted secret binding. Earlier genuine password authentication succeeded after test-only CAPTCHA relaxation. No current provider-side Supabase CAPTCHA toggle read, real human Turnstile completion, account recovery or two-member account switching was verified in this batch. Existing role/auth mock acceptance remains useful but cannot certify the human flow.

**Decision:** Publication and configuration PASS; legal entity/DBA, professional review, jurisdictional tax determination, actual pre-billing consent UX, provider-side CAPTCHA and human browser login/recovery/access isolation OPEN. No corporate filing, tax election, billing or paid service initiated.

## Acceptance decision and operational safeguards

**General website:** May remain online for already accepted public/Free features.

**Public-sale acceptance:** **PARTIAL / NOT FULLY ACCEPTED.** Checkout switches for Books, Founding 14/30/60 and four tools are already enabled; this register does not disable them or falsely describe them as off. The outstanding tests are concrete customer-protection risks for purchasers. Do not declare all 12 visible and sale-ready SKUs financially accepted solely because a button opens Stripe Checkout.

**Explicitly preserved accepted work:** Stripe LIVE signed transport (GU301); TEST Book I and 25-Lumen purchase/refund; service-only purchased-Lumen ledger and rollback, all three Founder initial TEST billing/refund/cancel; private EPUB read authorization; source-only/isolated staging tool lifecycle; 19 published legal policy records. Do not rerun these absent changed code or new defect evidence.

**Financial boundary:** No nonzero Stripe LIVE charges/refunds, real-member purchase grants, secret rotation, external paid browser services, or new Supabase projects. LIVE paid acceptance requires explicit authorization for the actual transaction.

**Next operation:** Receive terminal new public-smoke and isolated browser CI results; reconcile three book metadata/edition hashes; use supported Stripe TEST clock advancement if available without cost; perform authenticated paid-tool beta entitlement tests in approved noncommercial credentials; obtain human and licensed professional legal/tax review.

## Revision history

| Version | Date | Status | Change |
|---|---|---|---|
| 1.0 | 2026-10-31 | Partial execution / evidence controlled | Consolidated five workstreams, linked preexisting acceptance, performed no-charge live access checks and price verification, started isolated browser rerun, retained explicit provider/human/legal blockers. |

**Footer:** SMFGU-QA-LAUNCH-GAPS-20261031-001 • v1.0 • Controlled technical acceptance evidence • Not attorney or tax advice.
