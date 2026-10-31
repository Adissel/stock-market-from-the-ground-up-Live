# Academy First 22 — Instructional Evidence Review Batch 002
**Document ID:** SMFGU-ACADEMY-EDU-22-QA-002
**Project:** The Stock Market: From the Ground Up
**Version:** 1.1
**Date:** 2026-10-31
**Status:** TARGETED SOURCE QA PASSED; BROADER REGRESSION AND MEMBER ACCEPTANCE OPEN; INDEPENDENT EDITORIAL ACCEPTANCE OPEN
**Repository:** cybernexuspublishing/stock-market-from-the-ground-up, main only
**Filename/type:** docs/research/stockstotrade/ACADEMY_FIRST22_EDUCATIONAL_REVIEW_2026-10-31.md (Markdown)
**Google Drive:** No copy created; folder and Drive document ID not assigned
**Purpose:** Document source-side evidence strengthening for the original five truth5, seven watchlist7 and ten scanners10 study days without opening protected grade/mastery or altering the 247-day controlling inventory.
**Dependencies:** `functions/_lib/bootcamp-academy-v014168.js`, `functions/_lib/academy-first22-teaching-v1.js`, `252_instruction_source_field_QA_v2.csv`, `MASTER_671_ROW_EVIDENCE_AND_ACCEPTANCE_v1.csv`, authenticated API and browser QA.

## Controlling decisions
- Original seven Boot Camps = 247 study days; the additional three feature-flagged drafts = 27 days, separate from this acceptance.
- Preserve truth5's five frozen source lessons and its limited **ungraded** beta product approval. No authoring edits were made to those five lessons in this batch.
- Existing 17 day-specific fictional teaching cases for watchlist7/scanners10 are the source of truth. Do not replace with generic parent-course prose.
- Formative questions and public review guides are **not independent protected assessments**. Passing a source test cannot award mastery or constitute independent editorial approval.
- The 252-row QA register and 671-row evidence register remain the controlling decision records: all 22 first-batch rows remain NOT_ACCEPTED.

## Implementation in this batch
- Replaced the reused formative self-check on each of the 17 watchlist7/scanners10 days with a distinct, objective-specific fictional question. These cover issuer identity, comparable volume, primary catalysts, OHLC arithmetic, quoted spreads, versioned rankings, scanner universe, split adjustments, stale feeds, session gates and independent no-trade decisions.
- Retained the 17 separately authored explanations, worked fictional examples, fresh transfer prompts, corrective review guides, source procedures and source links. No answer keys, outcome returns or historical trade evidence were added.
- Introduced deterministic Node.js assertions for the 247+27 inventory boundary, 22-row register identity, 5-day B01 freeze, 17 distinct checks, formula operations/units, and ungraded statuses. The dedicated CI workflow is triggered on source and test changes.
- No membership, Supabase migration, production data, payment, Lumen ledger or grade-service changes. No live checkout testing.

## Evidence standards and independently checked authority
The references below support narrow factual teaching points, not full day-level claim verification:
1. **SEC Investor.gov, Types of Orders** — https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders — last-sale and quoted prices are not guaranteed market-order execution prices; a stop becomes a market order on activation.
2. **SEC Investor.gov, Executing an Order** — https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/executing-order — broker execution can differ from visible quotes; no blanket fill assertion follows from a displayed price.
3. **SEC, Webmaster Frequently Asked Questions** — https://www.sec.gov/about/webmaster-frequently-asked-questions — EDGAR acceptance timestamp can precede public web availability; lag is variable and not guaranteed.
4. **NYSE, Holidays & Trading Hours** — https://www.nyse.com/trade/hours-calendars — NYSE core equity trading hours generally 09:30–16:00 ET; exchange-specific and holiday exceptions require dated verification.

**Evidence date:** URLs reviewed on 2026-10-31. Exact article version/effective-date and every day-level factual claim require separate reviewer signoff. Fictional figures are not historical observations.

## Verified implementation and test record (2026-10-31)
- `bd80026ec1de6f80cbd3a8030117096ff6a29f01` implemented 17 distinct checks, the numeric test and this register. The first source CI attempt correctly exposed an overwritten source-status field.
- `e2600c9b72f27bec75b48dd702834ebd79807890` corrected that status. **PASS**, targeted [Academy First-22 Educational Evidence](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41215137219). This establishes source-level structural and calculation checks only.
- `1d0dd576bd2b1060309efa20dae90db8149e7ca2` updated the existing book-access fixture for the separate authoritative plan-definition query and added a fail-closed missing-plan case; its prior suite run was failing.
- `99766394478577750c8e38f318eeeabaca0f9e4f` corrected a floating-point exact-equality assertion in Free Foundations fictional gap-loss QA; the expected illustrated loss and production code were not changed.
- Broader [Free Foundations and Research Watchlist Security CI](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41215374024) was queued at this record update. Its final result and other sitewide workflow conclusions must be checked separately; no full-green CI or deployment claim is made.
- All 22 lesson editorial decisions remain **NOT_ACCEPTED**. Nothing here grants protected mastery, certificates, paid access, or production release.

## Day-level disposition
| Program | Day(s) | Source case | This batch | Independent assessment | Editorial decision |
|---|---|---|---|---|---|
| truth5 | 1–5 | Original B01 frozen authored lessons and approved supplements | Source unchanged; ungraded restriction checked by automated contract | Protected B01 review OPEN | NOT_ACCEPTED |
| watchlist7 | 1–7 | Seven original fictional cases | Seven unique day-specific formative questions added; arithmetic asserted where present | OPEN | NOT_ACCEPTED |
| scanners10 | 1–10 | Ten original fictional cases | Ten unique day-specific formative questions added; arithmetic asserted where present | OPEN | NOT_ACCEPTED |

### Required separate reviewers and verification
1. Read each complete lesson in its actual authenticated workstation, including diagrams, feedback, mobile and keyboard flow.
2. Independently evaluate claims against primary sources with document/version/as-of information; the above references alone do not certify 22 units.
3. Independently recompute each quantitative example and every fresh transfer problem; automated formula checks are a first gate, not the final review.
4. Create protected, independently authored assessment cases and grading rubrics, review them without releasing answers in client bundles.
5. Test authenticated save/resume, role isolation, expiry and server-verified progress and grading, with exact-commit CI and Cloudflare deployment evidence.
6. Record a separate named reviewer, source hash, defects, corrections and decision for each of the 22 rows in the existing controlling registers.

## Revision history
| Version | Date | Change | Decision |
|---|---|---|---|
| 1.0 | 2026-10-31 | First-22 formative differentiation, arithmetic regression and restricted evidence record | Source improvement; no editorial approval |
| 1.1 | 2026-10-31 | Linked targeted successful CI, recorded source-status correction and separate regression blockers | Targeted source QA passed; editorial/release gates open |

**Footer:** Crown & Lantern Press / Cyber Nexus — Educational quality-control evidence; not a certification or trading recommendation.
