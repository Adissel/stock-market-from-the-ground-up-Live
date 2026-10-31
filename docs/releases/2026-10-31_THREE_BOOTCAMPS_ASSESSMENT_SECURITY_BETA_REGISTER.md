# Three New Boot Camps — Protected Assessment and Beta Acceptance Register

**Document ID:** SMFGU-ACADEMY-THREE-001
**Project:** The Stock Market: From the Ground Up — Boot Camp Academy
**Version:** 1.8
**Created:** October 31, 2026
**Last reviewed:** October 31, 2026
**File type:** Markdown (.md)
**Filename:** 2026-10-31_THREE_BOOTCAMPS_ASSESSMENT_SECURITY_BETA_REGISTER.md
**Repository location:** `docs/releases/` on GitHub `main`
**Google Drive location:** Not created; repository is current source of record
**Google Drive document ID:** Not assigned
**Status:** OWNER-APPROVED INVITATION-ONLY INSTRUCTIONAL BETA (27/27 days); authenticated member testing is a DURING-BETA exit gate; 54 protected graded cases still inactive and separate from the instructional approval
**Purpose:** Reconcile every new Academy day, protected case, access boundary and release evidence without inventing successful assessments.
**Dependencies:** `AGENTS.md`; `functions/_lib/academy-three-camps-v1.js`; `functions/_lib/bootcamp-academy-v014168.js`; `functions/api/bootcamp-academy.js`; `functions/api/academy-protected-assessment-v1.js`; `functions/api/assessment-v0135.js`; `public.competency_cases_v135`; `public.gu_academy_protected_cases_v1`; `ACADEMY_THREE_CAMPS_ENABLED`; existing single grading RPC.

## Owner-approved controls

- Direct work on `main` only; do not branch or overwrite unrelated work.
- Preserve original seven programs, Free Foundations, 419 Labs, 30 competencies, private member records and existing course access.
- Do not activate `ACADEMY_THREE_CAMPS_ENABLED` until complete editorial, assessment, billing-access, actual member and deployment acceptance.
- Prohibit paid test charges, unlicensed market data, third-party course-text copying and fabricated historical outcomes.
- Unreviewed instructional explanations do not award mastery. The 10-stage Academy journey remains formative; separate official assessments use the existing server-owned competency RPC.

## Current source and database findings

- Three course definitions: `tape10` (10), `indicators10` (10), `filings7` (7); 27 days total; existing seven still account for 247.
- The feature flag defaults disabled; public Academy catalog continues to expose seven programs when disabled.
- Supabase progress program-code migration already applied; original private progress table retained.
- Protected case routing migration applied to `public.gu_academy_protected_cases_v1`, with RLS enabled, no SELECT to `anon` or `authenticated`, service-role access only.
- As checked October 31, **54 provisional protected cases** exist, exactly two mapped per new study day. Each has four scored dimensions: knowledge, recognition, decision and process.
- **Zero cases are active or independently reviewed.** Initial generated candidates require individual technical, editorial and quantitative assessment review; many distractors need expert refinement for plausible difficulty and true unseen transfer.
- 27 version-two retake prompts have been differentiated from the first version. Distinct case codes plus immutable first grades ensure a prior scored case cannot be used for reassessment.
- Server route enforces course flag, active entitled account, specific enrollment, approved case routing, actual reviewer fields and first-submission history. Existing general competency endpoint now excludes all `BC3_` course cases and denies direct submission outside the Academy route.
- Talia stage-specific evidence uses fictional tapes, quote/depth facts, indicator ECharts and SEC-source evidence. It does not assert live/historical market replay.
- Source and browser acceptance are separate from actual beta-member acceptance.

## Per-day acceptance register

| Program | Day | Subject | Private assessment inventory | Actual acceptance |
|---|---:|---|---|---|
| tape10 | 1 | Introduction to Market Microstructure | 2 staged cases | Editorial + authentic QA blocked |
| tape10 | 2 | Bid, Ask, Spread, and Quote Interpretation | 2 staged cases | Editorial + authentic QA blocked |
| tape10 | 3 | Level II Order Book Fundamentals | 2 staged cases | Editorial + authentic QA blocked |
| tape10 | 4 | Time & Sales and Executed Transactions | 2 staged cases | Editorial + authentic QA blocked |
| tape10 | 5 | Liquidity, Depth, and Order Execution | 2 staged cases | Editorial + authentic QA blocked |
| tape10 | 6 | NBBO, Market Centers, ECNs, and ATSs | 2 staged cases | Editorial + authentic QA blocked |
| tape10 | 7 | Order Flow, Imbalances, and Interpretation Limits | 2 staged cases | Editorial + authentic QA blocked |
| tape10 | 8 | Trading Halts, Volatility, and Execution Risk | 2 staged cases | Editorial + authentic QA blocked |
| tape10 | 9 | Integrated Level II and Time & Sales Practice | 2 staged cases | Editorial + authentic QA blocked |
| tape10 | 10 | Independent Market Microstructure Practicum | 2 staged cases | Editorial + authentic QA blocked |
| indicators10 | 1 | Understanding Indicators and Their Inputs | 2 staged cases | Editorial + authentic QA blocked |
| indicators10 | 2 | Price, Volume, and Mathematical Foundations | 2 staged cases | Editorial + authentic QA blocked |
| indicators10 | 3 | VWAP Calculation From First Principles | 2 staged cases | Editorial + authentic QA blocked |
| indicators10 | 4 | Session VWAP Interpretation and Limitations | 2 staged cases | Editorial + authentic QA blocked |
| indicators10 | 5 | Simple Moving Averages Versus Exponential Moving Averages | 2 staged cases | Editorial + authentic QA blocked |
| indicators10 | 6 | EMA 9 and EMA 20 Calculations | 2 staged cases | Editorial + authentic QA blocked |
| indicators10 | 7 | Indicator Relationships and Market Structure | 2 staged cases | Editorial + authentic QA blocked |
| indicators10 | 8 | VWAP Reclaims, Rejections, and Failures | 2 staged cases | Editorial + authentic QA blocked |
| indicators10 | 9 | Conflicting Indicators and False Signals | 2 staged cases | Editorial + authentic QA blocked |
| indicators10 | 10 | Independent Indicator Analysis Practicum | 2 staged cases | Editorial + authentic QA blocked |
| filings7 | 1 | Understanding SEC Filings and Primary Sources | 2 staged cases | Editorial + authentic QA blocked |
| filings7 | 2 | Reading Corporate Announcements and Form 8-K | 2 staged cases | Editorial + authentic QA blocked |
| filings7 | 3 | Earnings Reports and Financial Disclosures | 2 staged cases | Editorial + authentic QA blocked |
| filings7 | 4 | Share Offerings, Dilution, and Capital Structure | 2 staged cases | Editorial + authentic QA blocked |
| filings7 | 5 | Stock Splits, Reverse Splits, and Corporate Actions | 2 staged cases | Editorial + authentic QA blocked |
| filings7 | 6 | Catalysts, Market Expectations, and Verification | 2 staged cases | Editorial + authentic QA blocked |
| filings7 | 7 | Independent Corporate Disclosure Research Practicum | 2 staged cases | Editorial + authentic QA blocked |

## Additional controlling depth requirement (concurrent Owner-approved V1 register)

The newer `docs/product/ACADEMY_LUMENS_WALLET_BILLING_V1_20261031.md`
(Document ID `SMFGU-ACADEMY-LUMEN-20261031-001`) now establishes:
- At least **30 minutes of planned active instruction per day**, presented as a 30–45 minute study itinerary rather than an idle attendance timer.
- At least **12 distinct, purposeful, individually authored formative teaching questions per day** as the initial editorial floor.
- Multiple substantially worked numerical or source cases, error-specific teaching, independent reviewed assessment and transfer.
- No student rewards or numeric Lumen amounts without a server-approved earning schedule; no second currency.

**Gap on this release:** The newly drafted 27 lessons and ten-stage formative controller do not yet meet the independently verified 30–45 minute / 12-question-per-day editorial depth standard. This is material unfinished implementation, not merely a browser test. All three programs remain IN DEVELOPMENT despite working routes and private protected-case infrastructure.

## Release gates — do not bypass

1. **Editorial:** independently verify each of 54 case scenarios, correct answers, distractors, numeric units, primary references, evidence cutoff and separate retake originality; reject generic or memorized-answer cases. Record reviewer identity/date. Check complete 27 lesson bodies for zero-knowledge sequencing, correction and accessible experience.
2. **Database:** ensure mapping `source_status='approved'` only AFTER case review, then record `competency_cases_v135.reviewed_by`, `reviewed_at` and `active=true` transactionally for the approved cases. Never assign reviewer evidence without an actual reviewer.
3. **Authorization:** genuine authenticated enrolled member positive route and entitled denial; genuine cross-member isolation, role restrictions, immutable first grade, non-reusable case and fresh alternative. Preserve server-only keys and all existing grades.
4. **Browser:** validate each program first/middle/last day at mobile, tablet and desktop, ECharts/subject evidence, Talia prompts, accessibility (keyboard, screen-reader, contrast, hidden state), progress save/resume and cross-account state clearing.
5. **Deployment:** verify exact SHA GitHub Actions and Cloudflare Pages production deployment, public catalog seven until activated, no new payments or plan entitlements.
6. **Business release:** after independent acceptance, obtain deliberate Owner activation of the three-course flag and corresponding course visibility/entitlement policy. Do not infer authorization from working source.

## Deployment and test evidence

The companion CI gate is `.github/workflows/bootcamp-full-width-acceptance-v1.yml`. It executes source contract, simulated authenticated assessment lifecycle, seven-program regression, responsive Chromium and original 30-day program tests. Record final workflow IDs, conclusions and Cloudflare SHA in a later evidence-only revision. A test that is queued, cancelled or not run cannot be recorded as passed.

## Unresolved acceptance blockers

- No independently signed-off private question/answer pair among 54 staged candidates.
- The case authoring method includes program-related guidance but requires meaningful alternative distractors and non-memorization checks for every new day.
- No genuine enrolled QA member positive assessment attempt; no approved cases exist for such a test.
- Need full authenticated 27-day browser/accessibility evidence and commercial rights checks for any future real market feed.
- The separate Windows Codex attachment path is not available from this repository connector; owner-provided execution requirements and in-repository rules were used.

## Evidence-only update — database and source security (October 31, 2026)

**Source commits:** `6899e38dc27f16753ff36428af0a1632b53f149f` (early origin rejection);
`e4cb3d618a34292c76ca7dc99aafb71852cd7ec5` (adversarial no-provider-call assertions);
`44f73b8b010d63e06636943f11a4a503d9b3a58c` (read-only readiness audit).

- Live Supabase join verified **20/20** protected cases for `tape10` (10 days), **20/20** for `indicators10` (10 days), **14/14** for `filings7` (7 days), with zero orphaned mappings. All **54 are inactive, not approved and not reviewer-attributed**.
- All **216** graded prompts across the cases are unique on exact text comparison. All 216 correct-option references resolve to precisely one option; no within-question duplicate option text/code was found. Each case has four dimensions and three response options per question. This does not prove unseen reasoning, numeric validity, or credible distractors.
- Editorial warning: only **68 distinct answer-option labels** occur across 240 option occurrences in each 10-day program; `filings7` has only **50 distinct labels** across 168 occurrences. Repeated answer language is a material memorization/predictability risk requiring case-by-case rewriting and independent review.
- RLS is enabled on the five assessed protected-case, attempt, routing, enrollment and progress tables; `anon` and `authenticated` have no direct SELECT, and `authenticated` has no direct INSERT. Existing grading RPC EXECUTE is service-role-only. These are metadata checks, **not** actual cross-member or browser penetration tests.
- The cross-origin assessment security fix now rejects invalid POST requests **before** member authentication and private database reads; a source regression test asserts that rejected cross-site requests issue no provider calls.
- Reproducible audit: `supabase/admin/20261031_three_bootcamps_release_readiness_read_only.sql`. Executed against the live project without mutation. The last reported output confirmed protected-table RLS and privilege settings; earlier inventory/structural queries were also executed individually.
- **Release remains blocked.** No grades or question-review fields were modified; full instructional depth, individual independent editorial sign-off, genuine enrolled-member assessment, accessibility, mobile and exact-commit deployment acceptance remain open.

## Owner-directed controlled instructional Beta — October 31, 2026

**Decision:** Owner explicitly requested release for Beta testing. This supersedes the prior blanket hold **for limited instructional testing only**, not the general-release, paid-product, editorial or official-grading gates.

**Beta architecture and deployment:**
- GitHub `main` has separate invitation-only course authorization in `functions/_lib/academy-three-camps-beta-access-v1.js`. Authorized codes are `tape10`, `indicators10` and `filings7` only.
- Cloudflare production configuration has `ACADEMY_THREE_CAMPS_ENABLED=false` (general release remains OFF); `ACADEMY_THREE_CAMPS_BETA_ENABLED=true` and an encrypted `ACADEMY_THREE_CAMPS_BETA_USERS` allowlist.
- Two existing, verified active test members have restricted access: Owner QA (`Adissel`) and Free baseline QA (`James_Test`). Their underlying user IDs are intentionally excluded from this public source document. No new QA accounts, memberships, purchases or paid transactions were created.
- The general public catalog remains **seven programs**, with no public listing or standalone sale for the three new courses. Eligible invited testers may use existing direct routes:
  `/bootcamp-academy.html?program=tape10`,
  `/bootcamp-academy.html?program=indicators10`,
  `/bootcamp-academy.html?program=filings7`.
- A verified enrolled test member can see fictional instruction and Talia evidence and save private reflections through the original progress RPC. The service labels this `betaStudy`; its enrollment and progress results explicitly remain ungraded and make no mastery or historical-outcome claims.
- The protected assessment endpoint returns `beta_instruction_only` to authenticated, enrolled Beta testers. It rejects all graded POSTs with HTTP 409 *before reading any private case keys or grading RPC*, even if review status changes. The old general assessment endpoint still blocks BC3 case-code bypass.
- Every non-invited member is rejected from the new course route, including existing paid members; suspended/restricted, deleted and Showcase identities remain excluded by existing member access checks.
- Tester enrollment **does not authorize** mastery, independent grades, certificates, Lumens issuance, new commerce entitlements, or unlocking the general-release switch.
- The source-only security and Beta entitlement contract is covered by `tests/test_academy_three_camps_invite_beta_v1.mjs`, included in the dedicated GitHub Actions Boot Camp workflow. GitHub Actions and Cloudflare release acceptance must be attributed to an exact commit and independently rechecked.

**Rollback:** Set `ACADEMY_THREE_CAMPS_BETA_ENABLED=false` (or clear the restricted list), redeploy the latest verified source, and confirm anonymous plus invited requests are denied. Preserve stored member progress and existing first attempts. Do not force-push or delete tables.

**Outstanding:** Truly authenticated tester browser sessions and per-user private progress verification; per-day editorial depth (at least twelve individually authored formative questions and 30–45 minutes planned active work); 54 individually reviewed protected assessment cases; supported accessibility review; and exact production deployment acceptance. Beta availability is **not** Beta acceptance or public-sale authorization.

## Independent acceptance audit and authored reference-batch progress — October 31, 2026

**CI evidence:** GitHub Actions dedicated Beta acceptance run `41229152950`, commit `858aa70f577f66c9ccf19ff72b5a33b7f93b7633`, finished **success**; source checks, static build, all six original Academy browser routes across four viewports, all three new courses and original 30-day course in Playwright fixtures. This is source-level and synthetic-browser evidence only.

**Production evidence:** Cloudflare production deployment ID `9f59ebbe-0e5d-4951-bdfa-fec35108dc30` successfully deployed the identical `858aa70f` commit. General release remains disabled; invite-only Beta is enabled. Later unrelated rapid main commits require separate deployment checks before claiming the then-current HEAD is released.

**Actual QA identity read:** `Adissel` and `James_Test` are verified active profiles eligible for the Beta allowlist. As of this audit, neither account has any enrollment in `tape10`, `indicators10`, or `filings7`: **0 of 6 account-course enrollments**, **0 recorded Beta day progress**, **0 private Beta reflections**. No genuine authenticated browser-session or cross-user isolation run was completed. Do not manufacture positive acceptance evidence.

**Instructional standard:** The live ten-stage guidance currently provides five generic checkpoints per new day, not twelve individually authored formative items. A new source-owned benchmark, `functions/_lib/academy-three-camps-formative-reference-v1.js`, now contains **12 individually written, day-specific practice prompts and corrective explanations for all 27 new course days = 324**. It is integrated into the original Academy day model and available in an accessible on-page, optional, ungraded response/review interface. The same guided interface now displays a 35–45-minute planned active-learning itinerary; it does not require idle seat time or change member records. **The 12-question authorship floor is source-covered on every new day (324/324), and Owner editorial approval for the 27-day invited instructional Beta is granted on October 31, 2026.** Separate expert accuracy review and Beta defect remediation remain desirable, but are not conditions for invited students to begin studying. The 27 day-specific practice sets now carry explicit *Owner* editorial Beta approval. This is not evidence of independent expert reviewer sign-off or authorization of protected official grades.

**Protected assessment evidence:** 54 draft cases / 216 questions / 648 candidate options; **zero** routed approvals, **zero** reviewer-attributed cases, **zero** active cases, **zero** actual assessment submissions. Answer-letter choices are balanced in aggregate, but many answer labels recur across variants and courses. Most importantly, **212 of the 216 questions still lack private rubric text and 636 of 648 options still lack private corrective feedback** (one draft case revised; all remain inactive) in live JSON records. The original grading RPC retains four-dimensional immutable first-attempt scoring. The new three-course-only endpoint now requires complete private per-question rubrics and option-specific explanations before exposing any future reviewed case. It returns a learner's selected-option feedback ONLY after the grading RPC confirms a successful first submission; unpublished review data never appears in the GET projection. One draft has the required metadata but remains inactive and reviewer-unattributed; none is authorized for official grading. Therefore **636 further individually relevant option-feedback decisions and 54 independent case-level source, math, fairness, reviewer and retake acceptance decisions remain open**. No keys, secure answers, private cases, attempts or approved statuses were modified by this audit. Reproducible private read-only audit: `supabase/admin/20261031_three_bootcamps_editorial_depth_audit_read_only.sql`.

**Updated acceptance sequencing (Owner controlling):** The instructional Beta owner-editorial gate is **APPROVED 27/27**. Genuine authorized-member sign-in, six account-course enrollments, progress saves/reloads, privacy isolation, keyboard/mobile and accessibility feedback are **IN-BETA TEST EXECUTION AND EXIT CRITERIA**, not prerequisites for invited Beta start. The 54 scored protected assessment variants, 212 remaining rubric texts and 636 corrective explanations are a **separate official-grading release gate**. Independent subject/arithmetical review may identify Beta corrections, but does not undo the express Owner authorization to begin limited instruction. Exact-deployed-commit CI, access and privilege safety checks still apply before claiming a new source revision deployed. No public sale or general availability authorized.

**Rollback:** Keep `ACADEMY_THREE_CAMPS_ENABLED=false`; set `ACADEMY_THREE_CAMPS_BETA_ENABLED=false` if a Beta authorization defect appears. Preserve all previous member progress and frozen curriculum baseline.

## Revision history

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | October 31, 2026 | Project engineering | Established 27-day private assessment inventory and acceptance register without declaring editorial or member beta approval. |
| 1.1 | October 31, 2026 | Project engineering | Incorporated later controlling 30–45-minute and 12-formative-question daily depth requirement; revised unfinished release classification. |
| 1.2 | October 31, 2026 | Security and release audit | Verified live case completeness, answer references, option-reuse risk and RLS; recorded source security hardening and read-only audit without promoting review status. |
| 1.3 | October 31, 2026 | Owner-directed Beta implementation | Introduced separate invitation-only Beta access for two verified existing QA identities while withholding grades, Lumens, certificates, public catalog visibility and general release. |
| 1.4 | October 31, 2026 | Editorial and Beta QA execution | Recorded successful full-width CI, exact production Beta deployment, zero actual QA enrollments, 36 new hand-authored formative benchmark questions, and a 54-case/648-option read-only gap audit. |
| 1.5 | October 31, 2026 | Reference lesson deepening | Added Day 2 to each Boot Camp formative benchmark (72 authored questions total, 6/27 days). Retained reviewer hold and 21 days still to strengthen. |
| 1.6 | October 31, 2026 | Protected corrective feedback | Added fail-closed private rubric/option-feedback contract for future approved cases, post-grading selected-option explanations and missing-feedback regression. No live protected cases changed. |
| 1.7 | October 31, 2026 | Authored all draft formative study-day sets | Reached 324 original study questions with individual corrective explanations mapped to all 27 new Academy days; maintained editorial and private assessment HOLD. CI and exact production verification separate. |
| 1.8 | October 31, 2026 | Owner delegated editorial decision | Approved all 27 study days for invited instructional Beta; moved real-member acceptance into Beta operations; kept 54 protected graded cases and public commerce release separate. See SMFGU-ACADEMY-OWNER-BETA-005. |

**Status classification:** All three courses: **INVITE-ONLY INSTRUCTIONAL BETA ACCESS** for explicitly authorized QA members only; instructional depth and official assessment remain in development. **Owner-approved instructional Beta, member acceptance in progress; not General Availability and not authorized for public sale or graded certification.**
