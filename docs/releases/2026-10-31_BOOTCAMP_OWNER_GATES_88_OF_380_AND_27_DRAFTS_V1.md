# Boot Camp Academy — Owner Execution and Acceptance Gate Register

**Document ID:** SMFGU-ACADEMY-OWNER-GATES-012  
**Project:** The Stock Market: From the Ground Up — Boot Camp Academy  
**Version:** 1.0  
**Status:** Instructional Beta active for invited users; graded and public release HOLD  
**Prepared / verification date:** October 31, 2026  
**Filename:** `2026-10-31_BOOTCAMP_OWNER_GATES_88_OF_380_AND_27_DRAFTS_V1.md`  
**File type:** Markdown (.md)  
**Authoritative GitHub location:** `cybernexuspublishing/stock-market-from-the-ground-up/docs/releases/`, branch `main`  
**Google Drive location:** Not created  
**Google Drive document ID:** Unassigned; a new Drive file is required only if synchronized document distribution is authorized.  
**Purpose:** Correct the earlier point-in-time 83/380 estimate using CI and production evidence; distinguish live draft-authoring from grading acceptance and establish the next release gates without changing the fixed denominator.

## Owner approvals and fixed-unit completion

The shared Risk60 original advanced package now includes canonical Days 1–15, with twelve distinctive formative question/explanation pairs and an advanced independent case for each day. The original frozen source-day mapping, existing private progress, B01 decisions, membership entitlements, billing, Lumens and private grading remain intact.

**Owner instructional acceptance:** APPROVED for *ungraded instructional Beta* for Risk60 D11–D15 after CI and descendant production verification. The old focused browser run [41243398909](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41243398909) failed because its test asserted an obsolete literal itinerary phrase. Later corrected focused browser CI [41243996280](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41243996280) and expanded D11/D14/D15 CI [41244410126](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41244410126) completed SUCCESS. Cloudflare successfully deployed revision `598a89d8b226bc33b26bc18a0cd225eb00ff862f`; GitHub comparison verifies it descends from CI-tested `01d7fe3f8052dd2ccf8d7a2803518acb016e1833` (46 ahead, zero behind at assessment). This verifies tested software lineage, not real-member acceptance.

| Fixed acceptance unit | Total | Accepted | Outstanding | Rate |
|---|---:|---:|---:|---:|
| Three new courses' instructional days | 27 | 27 | 0 | 100.0% |
| Three new courses' advanced teaching cases | 45 | 45 | 0 | 100.0% |
| Protected official graded assessments | 54 | 0 | 54 | 0.0% |
| Authentic invited tester-course journeys | 6 | 0 | 6 | 0.0% |
| Original advanced-depth study-day packages | 247 | 15 | 232 | 6.1% |
| Software CI / production acceptance | 1 | 1 | 0 | 100.0% |
| **Overall** | **380** | **88** | **292** | **23.2%** |

**Three-new-course subset remains 73/133 = 54.9%** under the existing denominator. The original seven courses' **247/247 individually authored initial fictional teaching cases** are a separate, 100%-authored baseline; the **15/247** strict advanced 12-question-plus-independent-case acceptance standard is not interchangeable with that initial-source metric.

## Private assessment authoring — directly verified from the live protected database

A read-only postflight confirmed **54** total protected cases, **27/54** fully drafted rubric/option-feedback packages, **108/216** substantive rubric texts and **324/648** option-specific corrective explanations. The three additional guarded drafts newly revised are:
- `BC3_FILINGS7_D01_V2`: distinct EDGAR CIK/accession and publication-time transfer.
- `BC3_INDICATORS10_D06_V1`: EMA9/EMA20 recursive calculations, completed-bar cutoff and warmup limits.
- `BC3_TAPE10_D06_V1`: NBBO displayed depth, market centers and static weighted execution estimates.

After the updates, the database returned **27 complete drafts, 27 remaining incomplete drafts, 108 rubrics and 324 explanations still unwritten**. All 216/216 answer references resolved structurally; all 54 cases remain inactive with **zero reviewer-approved official grading cases**. No private correct-option values or question bodies are stored in this public file. Draft completeness does not imply every distractor is fair or prove an authenticated scoring RPC/retake security check.

## Actual Beta account acceptance evidence

Read-only production queries found that `James_Test` is enrolled in `tape10`, `indicators10`, and `filings7` with one Day 1 saved reflection in each (revision 2), but **no completed study-day records**. `Adissel` has zero new-course enrollments and no saved study days. **Genuine completed user-course journeys remain 0/6**, although there are three real account-course enrollment/persistence records that are valid partial QA evidence.

The separate two-account CI run [41244110593](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41244110593) correctly **failed closed** at authorization preflight: its second account was not invited, so the test made no six-journey acceptance claim. The designated secondary QA identity in that script is not automatically identical to `Adissel`. Any future approved Beta allowlist update must identify the authorized account precisely and preserve existing invitees; do not invent a real sign-in or overwrite genuine member progress.

## Next gates in execution order

| Gate | Acceptance criterion | Current evidence | Decision |
|---|---|---|---|
| G1 — Corrected source/browser CI | Corrected Day 11–15 focused and expanded browser check; descendant production | Both recent CI checks successful; production descendant verified | **PASS** for ungraded instruction |
| G2 — Identity/invite eligibility | Both named, genuinely signed-in QA accounts can access only their invited three courses | `James_Test` partial progress; `Adissel` not enrolled; secondary CI account denied | **OPEN** |
| G3 — Six full genuine journeys | Actual independent enrollment, guided stages, reflections, reread, stale-revision rejection, cross-account isolation and accessibility | 0/6 fully evidenced; 3/6 partial persistence | **HOLD** |
| G4 — 54 private case content and editorial | 216 rubrics, 648 explanations, correct answer exclusivity, source chronology, unique retake variants and individual case decisions | 27/54 complete drafts; 0/54 approved | **HOLD** |
| G5 — Official grading security | Authenticated first-score immutability, fresh reassessment, server-only answers, RLS/role denials and no unintended Lumens/certificates | Four relevant tables confirmed RLS enabled; authenticated end-to-end grade acceptance not certified | **HOLD** |
| G6 — 247 original advanced study days | Twelve unique first-principles questions and advanced independent case each, frozen B01 decisions and evidence of math/source review | 15/247 accepted, 232 outstanding | **IN PROGRESS** |
| G7 — Final release / commerce | Source review, signed QA matrix, access/privacy, accessibility, production SHA, explicit billing scope authorization | Instructional Beta only; general switch OFF; no paid charges | **HOLD** |

## Security, dependencies and rollback

The postflight found row-level security enabled on `competency_cases_v135`, `gu_academy_protected_cases_v1`, `gu_bootcamp_academy_progress_v014168`, and `gu_bootcamp_academy_enrollments_v014168`. This checks the enabled flag only; it does not establish that all access policies are correct. Protected updates required `active=false`, `reviewed_at IS NULL`, matching original private answer references, and eligible Draft source status; none activated grading.

Backend and source dependencies: `AGENTS.md`, `PROJECT_SITEWIDE_RULES.md`, `functions/_lib/academy-three-camps-beta-access-v1.js`, `functions/api/bootcamp-academy.js`, `functions/_lib/bootcamp-academy-v014168.js`, shared Talia ten-stage UI and controlled Cloudflare/Supabase environments. For rollback: retain live case rows inactive, roll back only the respective updated private JSONB draft rows from an authorized backup if a substantive error is discovered; do not reset authentic progress. Restore a prior tested deployment only through approved main-branch repair (no feature branch), keeping Beta invitation restrictions.

**Revision history:** v1.0 — October 31, 2026 — verified corrected browser CI and production descendant, Owner approved Risk60 D11–D15, audited 27 protected complete drafts and partial authentic tester persistence, set fixed 88/380 acceptance.

**Footer:** Crown & Lantern Press — internal restricted instructional Beta evidence; not an attorney, auditor, brokerage, second human reviewer or paid-service signoff.
