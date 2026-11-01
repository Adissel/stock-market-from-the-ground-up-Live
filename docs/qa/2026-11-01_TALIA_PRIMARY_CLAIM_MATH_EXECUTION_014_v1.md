# Talia Market Tutor — Targeted Primary Source and Numerical Evidence Review

| Document control | Value |
|---|---|
| Company / imprint | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | THE STOCK MARKET: FROM THE GROUND UP — Talia Market Tutor, Labs, Boot Camps, Chart Studio |
| Document ID | SMFGU-TALIA-CLAIM-MATH-EXECUTION-014 |
| GitHub location | `docs/qa/2026-11-01_TALIA_PRIMARY_CLAIM_MATH_EXECUTION_014_v1.md` on `main` |
| Google Drive | Not created; no Drive ID |
| File type | Markdown |
| Version and date | 1.0, 2026-11-01 |
| Status | Internal subject-specific source review and synthetic computation QA; independent publication/financial/legal/membership acceptance pending |
| Purpose | Correct broad citations, preserve source/rights decisions by individual claim, and prevent inferred Tutor release acceptance |
| Dependencies | Master Research Source Directory; SMFGU-TALIA-SOURCE-CLAIM-AUDIT-012; 240 Foundation supplemental topics; 73 indicator guides; shared Learning v3.3 / Lab v3.2; existing Talia source-only API |

## Actual implementation and progress

- **240 / 600 = 40.00% Foundation source-authored explanations**. No new explanations in this review; goal held constant.
- **140 / 140 = 100% itemized source-scope triage** for explanations 101–240, counted as a register, **0 / 140 finally publication-accepted**.
- **34/34 = 100% individually assigned primary-source scope dispositions** for 14 Rule 605-affected lessons (143, 144, 145, 146, 147, 150, 151, 152, 160, 161, 162, 176, 179, 180) and 20 listed-options lessons (201–220), in `data/talia-primary-claim-check-rule605-options-v1.json`. This is an evidence-scoping subset of the 140, **not publication signoff**.
- **73/73 = 100.00% indicator source-authoring upgrades**. Complete independent mathematical review of all 73 indicator formula variants, warmups, rights and full Chart Studio execution remains OPEN; 0/73 accepted for publication.
- **0/3 premium editions independently released**. Advanced, Professional and Enterprise source-research contracts remain non-released; no edition-engineering % is defensible without mapping feature requirements to live acceptance evidence.
- **2/10 source-deliverable gates complete = 20% of unweighted list**, not release readiness and not overall website completion.

## Exact primary-source check

### Rule 605

SEC April 1, 2026 staff FAQ, effective August 1, 2026:
https://www.sec.gov/rules-regulations/staff-guidance/trading-markets-frequently-asked-questions/frequently-asked-questions-rule-605-regulation-nms

This is a staff interpretation, not a binding new SEC rule. Confirmed eligible covered-order and execution-quality definitions and special cases. FAQ 19: crossed/locked NBBO handling for the covered reporting cases. FAQ 34–35: processor timestamps and millisecond quote changes. FAQ 37–39: spread, price improvement and quote benchmarks. FAQ 39 identifies November 1, 2026 as commencement for collecting best-available-displayed-price comparison statistics and a later publication date for November reports. The FAQ is **not** a primary source for identifying a trader's motive from a bid-side print, paint colors in our user interface, or how individual vendor feeds aggregate Time & Sales prints.

- 144 (bid-side trader motive): SEC Rule 605 does not verify trader intent; remains research and explanation HOLD.
- 151 (print count versus shares): math separately confirmed (three 100, 400, 25-share prints = three messages and 525 shares), but Rule 605 share-weighted statistics do not establish every data-feed aggregation convention. HOLD.
- 152 (tape colors): source is vendor UI conventions; SEC Rule 605 does not specify red/green/white interpretation; require self-owned classification specification. HOLD.
- 176 (annual stock-borrow fee): **corrected canonical reference** to SEC short-sales bulletin, https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-51 . Fictional 36% annualized, $5,000 for five days on explicitly elected 360-day convention = $25; broker actual day count and rates differ. HOLD.
- 179 (slippage): Rule 605 reference is a limited analogy to a benchmark, not complete proof of private order-level slippage calculations. HOLD.
- Scope-documented within the reporting framework: 145, 146, 147, 150, 161, 162 and 180, with express timing and depth caveats. All remain unpublished until independent rights/editorial QA.

### Options, 201–220

- **OCC Characteristics and Risks of Standardized Options**, June 2024 current primary disclosure: https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document . Read/verify the specific option series, multiplier, exercise/settlement status and material risks before real use.
- **Options Industry Council / Options Education** original strategy pages corroborated individual lessons without copying vendor charts or example text:
  - Long call: https://www.optionseducation.org/strategies/all-strategies/long-call
  - Long put: https://www.optionseducation.org/strategies/all-strategies/long-put
  - Naked short call: https://www.optionseducation.org/strategies/all-strategies/naked-call-uncovered-call-short-call
  - Bull call debit vertical: https://www.optionseducation.org/strategies/all-strategies/bull-call-spread-debit-call-spread
  - Bear put debit vertical: https://www.optionseducation.org/strategies/all-strategies/bear-put-spread
  - Long straddle: https://www.optionseducation.org/strategies/all-strategies/long-straddle
  - Assignment: https://www.optionseducation.org/referencelibrary/faq/options-assignment
- Replaced twelve overbroad canonical source links for 201, 202, 209–212 and 214–219 with their relevant original OIC instructional pages. Preserved a **single** approved-host candidate `sourceUrls` entry per guide, consistent with the existing source-only Tutor loader. Source rights and independent final editorial acceptance remain false.
- An uncovered short call has **theoretically unbounded potential losses**. A spread's theoretical defined max payoff is an expiration calculation on matching instruments and does not eliminate operational short-leg assignment risk. Long option breakeven equals strike + premium for calls and strike − premium for puts at expiration, before the example's omitted costs.
- The research directory says sophisticated options belong to specialized/advanced education. These twenty original supplemental lesson records remain **ADVANCED_SPECIALIST_HOLD**, regardless of their Foundation batch filename. Member-visible gating/entitlement has not been changed or accepted.

## Regression work and acceptance limits

- New `tests/talia-rule605-options-primary-evidence-v1.test.mjs` tests exact continuity with fourteen SEC-affected lessons and twenty options lessons, preserves independent editorial holds, independently calculates fictional payoffs (short call, debit spreads, long straddle, calls, puts, option quote spread), and compares several Rule 605-related synthetic spread/benchmark scenarios.
- The regression is registered in `scripts/build-pages.sh` and `.github/workflows/learning-tutor-v01492.yml`; build-and-deploy result and exact SHA must be verified independently from actual Cloudflare and GitHub Actions.
- Historical Source Rule: **a read-only research reference is not a data-ingestion or redistribution license.** No copied vendor charts, charts/quotes, active brokerage APIs, real payments, private member records or answer keys used in this batch.
- User-authenticated Tutor trial, staff/Owner sessions, RLS, screen readers, mobile touch and keyboard tests remain OPEN. Node tests and Pages build are not substitutes.
- Existing 419 Labs, 274 Boot Camp study days, 30 competencies, active Basic learning/lab engines, premium unreleased entitlements and private assessment data are unchanged.

## What is next, in execution order

1. Continue independent paragraph/claim corroboration for the remaining topics 101–240, including 605 exclusions and role-specific interpretations; sign or restrict each only with true evidence and rights review.
2. Audit 73 individual indicator formulas, source variants, initialization, zero denominators, reset conditions and independently recomputed output; do not confuse 73 guides with 73 enabled ECharts indicators.
3. Verify twenty specialist options cases with independent expense/assignment conventions and preserve appropriate advanced placement; assess original language, alternative scenarios and learner outcomes.
4. Run genuine signed-in member Free/Founding/Owner, account-switch and source-only Tutor privacy/accessibility acceptance.
5. On a stable final `main` SHA, verify the full GitHub Actions push-workflow matrix and matching successful Cloudflare production deploy; repair failures without deleting tests.
6. Bind Advanced prerequisite recommendations to server-verified summary and explicit member grants, retaining source-only no-cost boundaries.
7. Bind Professional ECharts/replay instruction to authenticated prefix-only data and recorded decision timestamps.
8. Require Enterprise source graph provenance, exact rights and server-side isolation before any member feature release.
9. Independently validate Lab/Boot Camp parity for protected stages, free tutoring, historical context and original identifiers.
10. Record each edition's genuine user, security, financial/legal/editorial, accessibility and rollback release evidence; **do not claim full approval on source-only tests**.

## Revision history

| Version | Date | Changes | Approval |
|---|---|---|---|
| 1.0 | 2026-11-01 | 14 Rule 605 plus 20 options reviewed and categorized, 13 subject-source updates, new synthetic math and CI wiring | Internal source review only; no regulatory, licensed-professional or release acceptance |

**Footer:** SMFGU-TALIA-CLAIM-MATH-EXECUTION-014 · Version 1.0 · GitHub `main` controlling · No commercial payment, provider inference or premium feature release.
