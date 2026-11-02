# Protected SEC Filings Case — Independent Editorial Review Packet

| Document control | Value |
| --- | --- |
| Document ID | SMFGU-ACADEMY-FILINGS7-CASE-REVIEW-20261102 |
| Project | THE STOCK MARKET: FROM THE GROUND UP / Crownlight Lumens V1 |
| Filename | `docs/qa/2026-11-02_FILINGS7_D01_PROTECTED_CASE_REVIEW_PACKET.md` |
| File type | Markdown |
| Version | 1.0 |
| Date | 2026-11-02 |
| Status | **TECHNICAL DRAFT CHECK COMPLETE — INDEPENDENT HUMAN REVIEW OPEN** |
| GitHub location | `cybernexuspublishing/stock-market-from-the-ground-up`, `main`, `docs/qa/` |
| Google Drive location / document ID | Not created / not assigned |
| Purpose | Equip an authenticated independent reviewer to accept or reject the exact protected case without disclosing the answer key |
| Dependencies | Supabase `competency_cases_v135`, protected grading, independent review attribution, review record, release map, single-wallet accounting, exact-SHA QA |

## Scope and disposition

Protected draft case: `BC3_FILINGS7_D01_V1`. The identifier is unchanged for continuity; **the content version is 2**, after an issuer-CIK clarification. Title: Understanding SEC Filings and Primary Sources — Candidate 1. Competency: `SEC_FILINGS`. Four questions and four assessment dimensions: knowledge, recognition, decision and process. The case is still **inactive**, with **no attributable reviewer, no reviewed timestamp, no protected approved release mapping, and no graded attempts**.

GitHub migration: `supabase/migrations/20261102_filings7_d01_issuer_cik_draft_correction_v1.sql`; applied to production Supabase on November 2, 2026. The migration verifies draft state and zero attempts, revises only one rubric/explanatory feedback, increments content version, and verifies that the protected answer-key hash has not changed. No answer key is provided in this review packet.

## Verified reference points

1. The SEC explains that the first ten digits of an accession number can reflect the CIK of the entity that submits the filing, **including a third-party filing agent**. Separately verify the issuer's identity and CIK. [SEC Webmaster FAQ](https://www.sec.gov/about/webmaster-frequently-asked-questions).
2. EDGAR acceptance means the submitted filing has passed procedural acceptance review; an accession number alone does **not necessarily establish acceptance**. [SEC EDGAR Glossary](https://www.sec.gov/submit-filings/filer-support-resources/edgar-glossary).
3. The reporting period, filing date, acceptance timestamp, and a researcher's retrieval or information-availability cutoff are distinct concepts. The SEC notes that no separate site-publication timestamp is generally provided for filing content. [SEC filing metadata FAQ](https://www.sec.gov/about/webmaster-frequently-asked-questions).
4. SEC APIs expose filer submissions and financial facts with ongoing updates; a historical classroom replay must not introduce later data into an earlier cutoff. [EDGAR APIs](https://www.sec.gov/search-filings/edgar-application-programming-interfaces).

## Reviewer acceptance matrix

| Assessment dimension | Review evidence needed | Remaining risk to assess |
| --- | --- | --- |
| Knowledge (Question 1) | Verify that learner distinguishes the actual issuer's CIK from an accession's submission-agent CIK and understands form/filing identity | Reject any implication that the accession prefix necessarily identifies the issuer; verify revised rubric and explanation |
| Recognition (Question 2) | Verify legal issuer, CIK, accession, form type, reporting period, acceptance time, source URL and retrieval time are individually identifiable | Do not claim an exact public release instant based only on EDGAR acceptance |
| Decision (Question 3) | Verify the fictional July 10 pause cannot use a filing first shown August 8; distinguish period-end from knowledge time | Verify source timeline explicitly states the filing became available only later, with no lookahead |
| Process (Question 4) | Confirm staged evidence, frozen first decision and delayed later commentary | Ensure no answer-key leakage, hindsight regrading or mutable initial submission |

## Secure review execution

- [ ] An independent, qualified **human** reviewer authenticates through an approved staff/reviewer path. Do not create a reviewer identity, approval or timestamp merely because the Owner delegated AI editorial work.
- [ ] Reviewer reads the current **private version 2** questions, alternative answers, protected key, feedback and rubric in an access-controlled environment; do not copy protected keys into public GitHub files or issue comments.
- [ ] Reviewer evaluates all four questions for objective accuracy, substantive ambiguity, single correct response, difficulty, absence of investment advice, pedagogical fit and accessibility.
- [ ] Reviewer records documented acceptance or rejection **for version 2** with attribution, timestamps, source citations and corrective notes, and independently verifies key correctness.
- [ ] If corrections are needed, produce a new version and repeat independent review; prior case-version acceptance must not be reused.
- [ ] Only after a real approval, create the exact case-version `gu_lumen_assessment_case_release_v1` mapping using authorized server-side controls. Protect the existing global reward-release switch.
- [ ] Execute genuine eligible member grading, ensure the official bridge creates exactly one immutable evidence/outbox item, then verify controlled once-only award and balance reconciliation under separate release authorization.
- [ ] Confirm duplicate-submit prevention, processor-retry idempotence, guest/member permission denial, no Lumen grant from ungraded reflection, and zero third-party wallet leakage.

## Full protected-case mechanical preflight (54 cases, 216 questions)

A read-only production registry audit also tested all 54 currently stored protected assessment cases, each containing four questions (216 total). The following **mechanical** conditions passed with zero findings: prompts and rubric text are present and exceed minimal length; each question uses one of the four known assessment dimensions; there are at least three options; answer-key references exist; the keyed option is present; option codes are distinct; and exactly one option's corrective feedback uses an accepted `Correct.` or `Correct:` prefix, matching the protected key. **No answer-key content or option identifier was published.**

An initial prefix-only check incorrectly reported 26 inconsistencies because `Correct:` is a valid existing format. Repeating the audit with `^Correct[.:]` produced **zero** correct-feedback mismatches and zero duplicate option codes. This is structural acceptance only: it does **not** establish factual truth, absence of ambiguity, protected grading eligibility, review independence, public publication or any Lumen entitlement.

## Verified QA evidence, not an approval

A service-role, rollback-only submission attempt for this unpublished candidate was correctly denied as `case_not_published` after the content revision. No attempt, reviewed-grade outbox entry, Lumen award, gift, or permission switch was created. Source-contract regression resides in `tests/test_filings7_issuer_cik_draft_v2.mjs` and the `crownlight-member-lumens-v1.yml` GitHub Actions workflow.

**Required decision:** The independent reviewer must explicitly accept or reject version 2. No signature or human approval currently exists. Consequently, the Crownlight Lumens V1 acceptance metric remains **9/11 (81.8%)**, not 10/11.

## Document revision history

| Date | Version | Action | Decision |
| --- | --- | --- | --- |
| 2026-11-02 | 1.0 | Produce authoritative-source review matrix after draft v2 correction and disabled-state grader verification | Technical/editorial preparation complete; independent approval remains OPEN |

**Footer:** SMFGU-ACADEMY-FILINGS7-CASE-REVIEW-20261102 · v1.0 · Internal protected QA. No answer keys, real grades or legally binding approval.
