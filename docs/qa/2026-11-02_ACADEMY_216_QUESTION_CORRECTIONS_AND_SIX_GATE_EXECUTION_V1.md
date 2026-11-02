# Academy Protected Assessments — 216-Question Remediation and Six-Gate Execution

| Document control | Value |
|---|---|
| Project | The Stock Market: From the Ground Up — Boot Camp Academy |
| Document ID | SMFGU-ACADEMY-SIX-GATE-20261102 |
| Version | 1.1 |
| Date | November 2, 2026 |
| Filename/type | `docs/qa/2026-11-02_ACADEMY_216_QUESTION_CORRECTIONS_AND_SIX_GATE_EXECUTION_V1.md` / Markdown |
| GitHub location | `cybernexuspublishing/stock-market-from-the-ground-up`, `main` |
| Google Drive location/document ID | Not created / not assigned |
| Status | **Private draft technical remediation completed; substantive independent assessment approval and LIVE release remain HOLD** |
| Purpose | Record confirmed production private assessment corrections, test evidence, release blockers and the next execution order, without publishing protected questions or answers. |
| Dependencies | `AGENTS.md`; existing three-course source definition; `functions/api/academy-protected-assessment-v1.js`; `functions/api/assessment-v0135.js`; `public.competency_cases_v135`; `public.gu_academy_protected_cases_v1`; competency grading RPC; CI; Cloudflare Pages; authentic member QA |

## 1. Independent question validation — targeted defect remediation, not 216 examiner approvals

- Full private field-structure scan: **54/54 cases, 216/216 questions, 216/216 rubric fields, 648/648 option explanations**.
- Machine-verifiable key-to-option resolution: **216/216**; feedback Correct/Incorrect tag agreement **648/648** after changes.
- **First-pass AI-assisted scored-choice-to-rubric inspection covered 216/216 private questions. Fifty-five defensible-answer contradictions were corrected**, with explanations rewritten in private storage. The initial keyword-risk screen found 10; complete question-by-question inspection identified 45 more (13 SEC Filings, 16 Reading the Tape, 16 Technical Indicators). This is an editorial QA pass, NOT independent expert acceptance or full distractor/source validation.
- Initial 10 corrections affected cases: `BC3_FILINGS7_D07_V2`, `BC3_INDICATORS10_D04_V2`, `BC3_INDICATORS10_D06_V1`, `BC3_INDICATORS10_D06_V2`, `BC3_INDICATORS10_D07_V1` (two questions), `BC3_TAPE10_D01_V2`, `BC3_TAPE10_D05_V1`, `BC3_TAPE10_D06_V1`, `BC3_TAPE10_D07_V2`.
- Distinctions checked: reverse splits do not prevent financing dilution; EMA9 smoothing is 2/10 and EMA20 smoothing is 2/21 with a defined previous seed; a displayed bid/offer is not a guaranteed fill; an execution print differs from a quote; marketable order execution requires actual route/size evidence.
- Only **20/216** questions presently contain an explicit `source_url` research-reference field and those **20 are labeled pending independent verification**. The remaining **196** need per-item source traceability or approved equivalent documentation. This count is not a judgment that their subject matter is necessarily wrong.
- **No case is independently accepted for official grades: 0/54.** Structural review and targeted fixes do not justify claiming all 216 questions have passed semantic/fair-answer/source validation. Review remaining distractors, calculations, source dates, scope and uncertainty.

### Extended manual scoring inspection — 45 further corrections after the initial report

The whole-inventory first pass compared each of the 216 currently keyed responses against its associated question and rubric. It found another **45 demonstrably incorrect keyed selections in 23 inactive cases**, all repaired through conditional private database updates with concise corrective rationales:

| New correction batch | Questions corrected | Private cases updated |
|---|---:|---:|
| SEC Filings | 13 | 6 |
| Reading the Tape | 16 | 8 |
| Technical Indicators | 16 | 9 |
| **Additional** | **45** | **23** |

These are in addition to the initial 10 fixes in nine cases; some cases overlap across batches. **Cumulative correction count this execution: 55 questions.** No protected question, option label, answer code or member record was committed to GitHub.

**Scope and remaining issue:** This first pass assessed the stored selected responses in all 216 questions and inspected alternate options in flagged cases, but is *not* a full independent examiner review of all 648 distractors and feedback meanings, nor independent factual/source approval. Reviewers must still check case-specific fair answers, difficulty, alternative reasonable interpretations, all calculations, and associated sources.

Post-correction rerun of `20261102_academy_protected_54_private_integrity_READ_ONLY.sql` again returned `private_draft_integrity_hold_pass=true` with 216/216 resolvable keys, 648/648 explanatory tags aligned, zero live grading records, 54/54 inactive cases and zero approved route mappings. Its passing state is structural only.

## 2. Independent version-two transfer cases

- Each of 27 new Academy days has exactly two protected case variants (54 cases), each with four dimensions.
- The first 108 pairings of same-dimension questions revealed template-similarity issues even though exact original prompts differed. A targeted batch reauthored **five variant-two cases**, each with four full private prompts, rubrics, options and corrective explanations:
  - `BC3_INDICATORS10_D08_V2`: distinguish completed-bar rejection from intrabar event, signed VWAP displacement and session reset.
  - `BC3_INDICATORS10_D09_V2`: RSI/VWAP conflict, volume comparison and independent decision cutoff.
  - `BC3_INDICATORS10_D10_V2`: trade-print VWAP versus HLC3 bar proxy and independently seeded EMA20.
  - `BC3_TAPE10_D09_V2`: synchronized quote, midpoint print, later quote-change and time sequence.
  - `BC3_TAPE10_D10_V2`: conditional multi-level displayed-liquidity estimate, execution uncertainty and no-look-ahead memo.
- Subsequent private database comparison of **108 matched pairs** found **zero exact prompt duplicates and zero exact correct-option duplicates**. After replacing numeric values with placeholders, also **zero identical prompt templates and zero identical correct-option templates**. These are lexical controls, not a final guarantee of unseen transfer difficulty, substantive independence or appropriate item difficulty.
- All 54 candidate cases remain inactive and unreviewed.

## 3. Grading security — static and database enforcement checks passed; native authenticated proof open

- Source inspection: Academy route checks course flag, real user tool access, member enrollment, source-status approval, active case, reviewer attribution, first-attempt history and same-origin submissions. The general grading route explicitly excludes `BC3_` cases.
- Existing `submit_competency_case_v135(uuid,text,jsonb)` PostgreSQL function has `SECURITY DEFINER`, but its EXECUTE privilege is **denied to anon and authenticated**, and permitted to service role. Route authorization is therefore critical; not a reason to expose or grant the RPC directly to members.
- Protected cases, mapping and attempts all have RLS enabled and no direct table SELECT or INSERT privileges to `anon` or `authenticated`.
- Attempts contain a unique index on `(user_id,case_code)`; the database RPC checks for existing submissions and handles unique violations. This is source/index evidence of first-submission protection, not a substitute for genuine concurrent authenticated tests.
- Private postflight: **0 protected grades and 0 protected competency-evidence records**, with **0 active/reviewed cases**.
- **Remaining:** authenticated and anonymous REST negatives/positives at the active real browser route, token expiry/revocation, entitlement changes, concurrent duplicate submission, actual grading flow, corrective-feedback timing, accessible screen-reader review and incident-log checks. No artificial grades were created.

## 4. Editorial acceptance

**0/54 individual graded-case approvals.** The previously approved 27-day instructional Beta is not a transfer of editorial grading authority. Record each true examiner's identity, source/date evidence, adversarial distractor and numeric checks, and approved revision before changing mapping status or marking a case active.

## 5. Genuine Beta journeys

Live aggregate: **3 course enrollments associated with one account**, **3 saved Academy progress rows**, **0 protected submissions**. These aggregates do not establish six genuine completed learner journeys. Formal case/member Beta acceptance remains **0/6 documented as accepted**. No fake users, impersonation, paid charges or protected grades were generated.

## 6. Release/CI/Cloudflare exact-commit gate

A point-in-time GitHub/Cloudflare read before this document commit found GitHub main `1918c7e03b33fbc48355e66d875c8d28a94928b2` and a matching Cloudflare production deployment still queued. GitHub Actions at this SHA had 25 observed runs: 12 queued, 2 in progress and 11 cancelled. This does **not** meet the site-wide exact-SHA successful CI and Cloudflare production deployment acceptance criteria.

Publishing this report also changes `main` and requires a fresh exact-head check; do not claim an earlier Cloudflare success proves the newer commit. Official grading, certification, Lumens awards, membership charges or full public Academy flag changes are **not authorized** by this report.

## Verified regression guard

`supabase/admin/20261102_academy_protected_54_private_integrity_READ_ONLY.sql` was committed and executed against connected Supabase. The query returned **`private_draft_integrity_hold_pass=true`**, with 54 held cases, 216 structurally valid questions, 648 complete explanations, 216 resolvable keys, 648 syntactically aligned labels, zero active/reviewed routes, no graded attempts/evidence, and restricted member/anonymous RPC grants. It intentionally returns no private key or option text.

## What is next — strict execution order

1. Complete remaining item-by-item **semantic** validity and primary-source evidence review without mistaking structural key consistency for a correct key; target all 216 questions, especially any previously auto-generated labels.
2. Adversarially examine all 27 second-variant transfer scenarios for genuine alternative evidence, unique defensible options and no look-ahead. Correct any further flagged pair, then rerun read-only SQL.
3. Run genuine authenticated two-member grading-security negatives/positives and concurrent first-attempt controls in an isolated approved QA environment; preserve all production member records.
4. Register 54 genuine attributable independent editorial approvals (or explicit rejection/HOLD), without assigning fictional reviewer identities.
5. Complete six documented actual invited Beta journeys across the three new courses, with accessibility and progress-resumption evidence.
6. Freeze exact main SHA, run all required CI to success without cancelled required jobs, verify matching successful production Cloudflare deployment and complete release signoff. Only then consider enabling graded assessments.

**Risk classification:** Critical issue remediation (incorrect private keys) executed; source lineage/independent examiner and authenticated Beta blockers remain critical. **Official release decision: HOLD.**

**Revision history:** v1.0 — 2026-11-02: initial 10 scoring corrections and five V2 revisions. v1.1 — 2026-11-02: first-pass 216-question selected-answer inspection, 45 additional private corrections, repeat structural postflight; no graded publication.

**Footer:** Crown & Lantern Press — privacy-safe internal QA metadata. No protected answer-key values, option codes, student records or confidential item bodies published.
