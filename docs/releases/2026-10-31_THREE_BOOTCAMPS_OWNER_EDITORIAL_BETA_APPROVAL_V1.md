# Three New Boot Camps — Owner Editorial Approval and Beta Member Acceptance

**Document ID:** SMFGU-ACADEMY-OWNER-BETA-005  
**Project:** The Stock Market: From the Ground Up — Boot Camp Academy  
**Version:** 1.0  
**Created:** October 31, 2026  
**Decision effective:** October 31, 2026  
**File type:** Markdown (.md)  
**Filename:** 2026-10-31_THREE_BOOTCAMPS_OWNER_EDITORIAL_BETA_APPROVAL_V1.md  
**Repository location:** `docs/releases/` on GitHub `cybernexuspublishing/stock-market-from-the-ground-up`, `main` only  
**Google Drive location:** Not created — GitHub is the controlling source  
**Google Drive document ID:** Unassigned  
**Status:** OWNER APPROVED for invited instructional Beta; protected official assessments separately held  
**Purpose:** Record the Owner's express editorial authorization for use by real, invited Beta testers, and separate pre-release engineering acceptance from member testing conducted during Beta.

## 1. Owner's controlling decision

The Owner expressly grants delegated Owner/Admin authority for product, instructional, editorial and nonmonetary Beta-release decisions for **all 27 new study days**:
- Reading the Tape and Market Microstructure — `tape10`, 10 days, 120 individually authored ungraded formative prompts and corrections.
- VWAP, EMA and Technical Indicator Mastery — `indicators10`, 10 days, 120 formative prompts/corrections.
- SEC Filings, Catalysts and Corporate Actions — `filings7`, 7 days, 84 formative prompts/corrections.

**Decision:** Accept the 27 authored instructional lessons for the controlled, invitation-only instructional Beta. This is an explicit **Owner editorial authorization**, not an invented independent academic, legal, accessibility, or third-party certification. Each lesson remains fictional-source-labeled and ungraded. Product status becomes `owner_approved_27_day_invite_beta_instruction_20261031`; source lesson status `owner_approved_invite_beta_instruction_20261031`. Frozen B01, 419 Labs, and seven existing Boot Camps remain unchanged.

The 324-question authorship and uniqueness checks, ten-stage teaching contract, 35–45-minute suggested **active** study itineraries, live restricted entitlement design and previous source-regression evidence support this owner decision. The Owner accepts that independent expert content review beyond the structural checks may still identify corrections, which will be tracked transparently as Beta findings rather than hidden or falsely reported as performed.

## 2. Member acceptance is an activity **during** Beta

**Decision:** Reclassify "genuine authenticated member acceptance" from a pre-invitation release gate to **BETA TEST EXECUTION AND EXIT CRITERION**. Use the two already-verified, allowlisted *real* QA accounts `Adissel` (Owner) and `James_Test` (Free baseline) as real signed-in testers. These accounts may enroll, study, navigate all days and save private reflection progress. No new purchases, paying Founder customers, or paid test services are required.

There is no legitimate claim of authentic session acceptance until those sessions actually run. In the Beta acceptance register, the initial matrix is:

| Scenario | Owner QA (`Adissel`) | Free QA (`James_Test`) | Required evidence |
|---|---|---|---|
| Direct invitation-only access to tape10 | Pending real signed-in test | Pending real signed-in test | Authenticated GET and complete course |
| Direct invitation-only access to indicators10 | Pending | Pending | Authenticated GET and complete course |
| Direct invitation-only access to filings7 | Pending | Pending | Authenticated GET and complete course |
| Enrollment on three separate program IDs | Pending | Pending | Active per-account enrollment rows |
| Start, save 80–2000 character reflection, reload, verify revision and content | Pending | Pending | Real POST/GET and database postflight without publicizing private notes |
| Logout, switch identity, check no cross-account reflections | Pending | Pending | Two genuinely authenticated user sessions; isolation confirmed |
| Blocked account, anonymous, noninvite and stale/cross-origin request behavior | Automated source tests passed earlier; fresh release verification pending | Same | 401/403/404/409 and zero unauthorized writes |
| Mobile/keyboard teaching and screen-reader basics | Synthetic Playwright runs previously passed; real user QA pending | Same | Genuine browser capture and accessibility feedback |

The lack of live enrollment before a tester actually visits a course is **expected during pre-acceptance**; do not manufacture enrollment, grade, or member progress or label zero enrollments a paid launch blocker.

## 3. Distinct protected-assessment decision

The Owner's editorial decision covers **teaching material and ungraded formative practice**, not automatic grading or protected case security. All 54 independently scored candidate cases remain **inactive and not public** until their private keys, rubric quality, distractor plausibility, case variants and reviewer attribution are evaluated. At the time of this decision, only one private case has four rubric texts and twelve option-specific corrections. The other 53 cases still require editorial strengthening. No official grades, mastery, certificates, Lumens or automatic purchases are authorized by this signoff.

Approval of *the instructional Beta* is not a claim that protected assessments have passed security or completed a genuine independent reviewer audit. The four scored competency dimensions, private grading RPC and original first-attempt semantics remain preserved.

## 4. Release configuration, rollback and operational rules

Keep `ACADEMY_THREE_CAMPS_ENABLED=false`; set `ACADEMY_THREE_CAMPS_BETA_ENABLED=true`; retain the server-only allowlisted QA UUIDs without exposing them. Do not publish the new three courses in the seven-course public catalog, create additional paid entitlements, or alter Stripe LIVE. The release is usable only after the matching `main` commit passes dedicated CI and Cloudflare production deployment. If any access/security defect appears, disable `ACADEMY_THREE_CAMPS_BETA_ENABLED`, redeploy a verified source, and preserve existing member progress.

Authorized Beta routes:
- `/bootcamp-academy.html?program=tape10`
- `/bootcamp-academy.html?program=indicators10`
- `/bootcamp-academy.html?program=filings7`

## 5. Acceptance outcome

- **Owner editorial approval of 27/27 instructional days:** **APPROVED FOR INVITED BETA**, effective October 31, 2026.
- **Authenticated member testing:** **OPEN — to be conducted by invited Beta testers during Beta**, not prelaunch.
- **Full official graded assessment:** **NOT YET RELEASED**; 54 private candidates remain subject to technical and case-by-case review.
- **Broad public sale/general availability:** **NOT APPROVED**.
- **Deployment acceptance of this decision:** Evidence of an exact SHA passing CI and Cloudflare is required before marking this specific revision production-confirmed.
- **Budget:** No new expenditure or LIVE payment authorized.

## Revision history

| Version | Date | Decision authority | Change |
|---|---|---|---|
| 1.0 | October 31, 2026 | Owner — delegated Admin implementation | Recorded owner editorial Beta approval for all 27 instructional days and correctly reassigned authentic member acceptance to Beta operations; kept graded-case and public release gates separate. |

**Footer:** Crown & Lantern Press / Cyber Nexus — controlled owner editorial decision and release register, not a statement of independent professional certification.
