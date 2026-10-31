# Talia Mercer — Six Additional Canonical Lab Claim-Verifications

**Document ID:** SMFGU-TALIA-CLAIM-024
**Project:** The Stock Market: From the Ground Up
**Version:** 1.0
**Status:** Source claims checked, original ungraded teaching implemented and CI-tested; independent full-Lab editorial and authenticated production QA outstanding
**Author/owner:** Project Owner; implementation research by ChatGPT
**Date:** 2026-10-31
**File type:** Markdown
**GitHub location:** docs/research/talia/2026-10-31_six_exact_lab_research_expansion_v1.md
**Google Drive location:** Not created
**Dependencies:** data/tutor-lab-claim-evidence-v1.json; data/competency-lab-paths-v01499.json; functions/_lib/tutor-lab-context-v014149.js; existing market-tutor-v01492.js; independent evaluation tests.
**Purpose:** Deliver and verify original learning-objective-specific explanations for six further approved canonical public Lab identities without awarding grading or fictitious historical approval.

## Source verification and exact learning applications

1. **F1-C08-L02 — Market-Cap Classification — Small-Cap Example**
   - Primary source: SEC Investor.gov, https://www.investor.gov/introduction-investing/investing-basics/glossary/market-capitalization
   - Narrow claim: company market capitalization equals market price per share times outstanding share count.
   - Original worked arithmetic: 50 million × $4.00 = $200 million; fresh transfer 80 million × $7.50 = $600 million. A share's price alone does not classify issuer size; share count, period, and any vendor-specific category thresholds require separate evidence.
2. **DT-C04-L01 — Accounts, Buying Power, Settlement, and Day-Trading Restrictions — Margin accounts and the 2026 transition**
   - Primary rule explanation: FINRA, https://syndication.finra.org/content/understanding-new-intraday-margin-requirements
   - Effective-date note: new standards effective **2026-06-04**; broker transition can extend through **2027-10-20**. As of 2026-10-31, do not state that the previous $25,000 PDT requirement either universally still applies or universally ceased at every brokerage. Check institution's implementation and account type.
   - Original fictional counterexample contrasts two unnamed hypothetical brokers on different transition statuses. It is NOT an assertion about a real broker.
3. **DT-C22-L02 — Verifying Catalysts, Timestamps, and Source Quality — Acceptance Time and Filing Time**
   - Original SEC FAQ: https://www.sec.gov/about/webmaster-frequently-asked-questions
   - SEC says SEC.gov availability is often 1–3 minutes after EDGAR acceptance, can be longer, and has no guaranteed first-published timestamp. Do not infer availability to a trader from acceptance alone.
   - Original pause example: accepted 08:00:00, separately observed available 08:01:30, pause 08:00:45. The later record is not admissible as previous knowledge. No real filing or stock price is claimed.
4. **DT-C23-L01 — SEC Filings for Day Traders — EDGAR Is a Primary Research Tool**
   - Primary SEC investor guide: https://www.investor.gov/introduction-investing/getting-started/researching-investments/using-edgar-research-investments
   - 10-K annual, 10-Q quarterly, 8-K current/event distinctions; amendments and filing/issuer/time identity must be checked. EDGAR is a publicly accessible disclosure repository, not proof of SEC endorsement or of what caused a price movement.
5. **DT-C10-L03 — Liquidity, Spread, Slippage, and Execution Quality — Bid, Ask, Midpoint, and Spread**
   - SEC investor glossary: https://www.investor.gov/glossary-term-categories/stocks?page=3
   - Hypothetical bid $12.00, ask $12.12 gives $0.12 spread, $12.06 arithmetic midpoint and **0.9950% spread/midpoint**, not a guaranteed executable fill. Fresh transfer $8.00/$8.24 gives $0.24, $8.12, **2.9557%**. Spread denominator is declared, since alternative conventions exist.
6. **TAPE-C04-L01 — Read the Quote Before the Tape — The quote is a pair of invitations**
   - SEC original execution education: https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/executing-order
   - A reported trade and later displayed quote are different facts. Fictional time-and-sales at 09:30:59.900 precedes a 09:31:00.100 quote by 200 ms; neither order-book snapshot nor price print reveals participant identity or motives.

## Changed live source files
- `data/tutor-lab-claim-evidence-v1.json`: eight existing checked source records retained, six new exact canonical records appended, version 1.1, now **14** public, ungraded, fictionally worked, claim-specific records.
- `functions/_lib/tutor-lab-context-v014149.js`: existing public, strongly validated source asset contract updated to exactly 14 records. An original public Lab/competency title match, source URL allowlist, and reviewed-status field are still mandatory; a bad asset fails closed.
- `tests/test_tutor_lab_claim_evidence_v1.mjs`: 14 canonical IDs, no duplicates and same exact authoritative source guard.
- `tests/test_talia_20sources_claim_evaluation_v1.mjs`: 14 teaching and 14 protected Assess cases plus five independent adversarial/uncertainty/mode cases = **33** synthetic API cases.
- `tests/test_talia_independent_calculations_v1.mjs`: separately calculates price/share math, spread values, exact effective dates, EDGAR time bounds and simulated trade-versus-quote timestamp difference, and verifies safe source metadata for all 14.
- `.github/workflows/market-tutor-v014147.yml`: runs these tests in the official existing Tutor Trust pipeline, without adding a new Tutor or paid service.

## Acceptance
- Focused GitHub Actions **first-party-tutor-contract** passed at commit `5c5ace91fba1872c22eac7030d3a590cb9f06f44`: logged `PASS Talia evidence evaluation: 33 synthetic cases` and `PASS Talia independent calculations and chronology: 63 independent guards`.
- The same exact-commit source/build and curriculum-evidence checks passed. Sitewide Playwright was still in progress during this entry.
- The test uses synthetic session/entitlement fixtures: it is **not** real member-browser, cross-account database, licensed historical-market-data or live model acceptance.
- No protected question bank, answer key, real member data, historical tape, real fill, buy/sell recommendation, model-provider setting, payment or entitlement was changed.

## Editorial gate
Each record has an original worked example, a common error/counterexample, a transfer task, primary source URL, narrowly supported general claim, and `source_specific_general_claim_checked_ungraded_not_independently_approved` status. **No independent editorial approval is granted by this file**. For the 419-Lab plus 252-Academy register, all remaining candidate-to-claim research is still mandatory; family-topic matches are not substitutes for this verification.

## Change and revision history
- 2026-10-31 v1.0: six distinct source-verified general claim integrations; 14-unit Tutor registry, independent calculation evaluation, no private/paid system changes.
