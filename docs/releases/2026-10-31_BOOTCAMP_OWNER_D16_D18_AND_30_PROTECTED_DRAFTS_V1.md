# Boot Camp Academy — Owner Parallel Execution: Original Days 16–18 and Protected Draft Cases

**Document ID:** SMFGU-ACADEMY-OWNER-PARALLEL-017  
**Project:** The Stock Market: From the Ground Up / Boot Camp Academy  
**Version:** 1.0  
**Prepared:** October 31, 2026  
**Document status:** Source implemented, original study-day final CI/browser acceptance pending; private assessment draft postflight VERIFIED; graded/general release HOLD  
**Filename:** `2026-10-31_BOOTCAMP_OWNER_D16_D18_AND_30_PROTECTED_DRAFTS_V1.md`  
**File type:** Markdown (.md)  
**Authoritative location:** `cybernexuspublishing/stock-market-from-the-ground-up/docs/releases/`, `main`  
**Google Drive location / document ID:** Not created / not assigned. A new Drive file would be required for an authorized synchronized copy.  
**Purpose:** Maintain fixed-denominator evidence and distinguish case writing, source deployment, synthetic browser checks, real learner progress, and independent official scoring.

## 1. Work implemented on main

**Original Risk60 Days 16–18:** All three canonical days have a new, original 12-question/free-feedback package and a numerical advanced-case transfer exercise attached to the existing shared Academy import contract, without changing course codes, progress records, B01 frozen decisions, authentication, entitlements, private grading, or member awards. Fictional teaching topics:

| Canonical day | Existing parent source day | New formative prompts | New independent worked case |
|---|---:|---:|---|
| 16 | 24 | 12 | Dated SEC filing versus rumor; 08:13–08:20 source-window math |
| 17 | 25 | 12 | Session maximum of three submitted attempts; rejection/cancel/fill counting |
| 18 | 26 | 12 | Versioned watchlist; amendment after 75 minutes and invalid quote freshness |
| **Total** | Frozen mapping retained | **36** | **3** |

Source module: `functions/_lib/academy-risk60-depth-day16-18-v1.js`, imported by the already shipped `academy-risk60-depth-day10-v1.js` aggregation (same main engine). Updated `tests/test_academy_guided_v1.mjs` to assert **216 distinct Risk60 question prompts, 18 worked cases, and 18 preserved parent source-day mappings**, `scripts/academy-274-advanced-readiness-preflight-v1.mjs` to require 18 original advanced days, the full-width workflow to validate the new module and `tests/test_risk60_advanced_days11_14_browser_v1.mjs` to exercise Day 18 on mobile, tablet and desktop.

**GitHub CI:** Dedicated workflow [41253510586](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41253510586) was QUEUED at the postflight. Cloudflare Pages had accepted the exact source revision `4cd100c36e85e492887fdb096228374583885ee9` into its deployment pipeline (status ACTIVE), but a completed successful deployment stage and the dedicated browser result were not yet available. These are **three source-ready units**, not three formally accepted full-depth study-day units.

## 2. Six-gate progress — fixed denominator remains 380

| Category | Total | Formally accepted | Remaining |
|---|---:|---:|---:|
| Three new courses instructional days | 27 | 27 | 0 |
| New-course advanced ungraded cases | 45 | 45 | 0 |
| Official protected case grading approvals | 54 | 0 | 54 |
| Genuine complete two-account invited Beta journeys | 6 | 0 | 6 |
| Original advanced-depth study days | 247 | 15 | 232 |
| Prior accepted CI/deployment unit | 1 | 1 | 0 |
| **OVERALL** | **380** | **88 (23.16%)** | **292** |

**Source-ready including the three new original days = 91/380 = 23.95%, conditional.** Full advanced original source coverage 18/247 = 7.29%; formally accepted advanced original coverage 15/247 = 6.07%. All 247 original first-level teaching cases are independently *authored source material*, which is a separate and weaker prerequisite than the complete advanced instruction standard. The new three-course subset remains 73/133=54.9%.

## 3. Private assessment authoring — postflight and review restrictions

Guarded private Supabase JSONB updates have now fully authored three additional candidates:

- `BC3_FILINGS7_D06_V1` — proposed versus completed catalyst, contract contingencies, dated primary source.
- `BC3_INDICATORS10_D05_V1` — SMA5/EMA5 calculation, completed-bar averaging and EMA seed.
- `BC3_TAPE10_D07_V1` — bid/offer imbalance, 3.0 to 0.6 ratio update and no-hindsight quote evidence.

**Verified aggregate:** 54 total protected candidates, **30 complete private draft cases = 55.56%**, **120/216 substantive rubric fields = 55.56%**, **360/648 option-level corrective explanations = 55.56%**, and **216/216 private correct-option references structurally resolving**. Outstanding: **24 unfinished drafts, 96 rubric fields, 288 feedback entries**. **All 54 inactive, none approved/reviewed for official grading**. The writing completion metric does not establish answer fairness, independent examiner signatures, secure graded-RPC acceptance, certified mastery or real-money return.

Private answer keys and item text have **not** been added to this GitHub report. All three updates required inactive/unreviewed Draft status and exact matching existing private answer-key references.

## 4. Real invited Beta member evidence and security controls

Live read-only production audit: `James_Test` had an active enrollment and one saved fictional Day 1 reflection, revision 2, in each of `tape10`, `indicators10` and `filings7`; **zero completed study-day records**. `Adissel` had no new-course enrollment or saved reflection. The genuine single-account persistence checks were previously evidenced in Actions [41244639841](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41244639841), but **six full two-account learner journeys remain 0/6 formally accepted**. The distinct QA-B test [41244110593](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41244110593) failed closed due to absent private invitation; an invitation alone would still not prove a completed signed-in journey.

Cloudflare production remains `ACADEMY_THREE_CAMPS_ENABLED=false`, `ACADEMY_THREE_CAMPS_BETA_ENABLED=true`; the invited-membership list uses a security-sensitive binding. **No allowlist replacement or invented user sessions were performed.** Supabase RLS is enabled on the two Academy enrollment/progress tables and both protected case tables; `anon` and `authenticated` have no direct SELECT/INSERT table privileges on those four. This does not substitute for authenticated server-level negative tests or a full RLS policy audit.

## 5. Next measurable gates and Owner disposition

1. **Current G5 source acceptance:** Close CI 41253510586; verify full-width Chromium, no source registry drift and successful Cloudflare production descendant of the exact test revision. Only then accept original Risk60 Days 16–18 and raise fixed total to 91/380.
2. **G3 private authoring:** Finish the next **24** incomplete case drafts (96 rubrics and 288 option feedback entries) with factual/quantitative review; do not activate a Draft as a public grade.
3. **G2 genuine invited QA:** Verify the real intended second tester identity and authorizations without replacing the secret allowlist; perform real signed-in enrollment, guided complete-day work, persistence, 409 revision conflict, cross-account denial and accessible mobile/keyboard sessions.
4. **G4 official grading:** Independently review and approve each of 54 protected cases after validating exact grading keys, alternative variant independence, original-attempt integrity, private scoring RPC, anti-leak and role policies.
5. **G5 remaining curriculum:** Upon this batch's acceptance, **229** original advanced study days still need full 12-question + worked-case packages; preserve all existing parent sources and frozen B01 review decisions.
6. **G6 final publication:** Perform production SHA parity, rights and source provenance review, independent acceptance, accessibility and separate public commerce approval. No LIVE payment charges or product switch changes without their separate gates.

**Owner content authorization:** Approved the three newly authored fictional Risk60 lessons as eligible for restricted **ungraded instructional Beta after CI and deployment success**; all official scoring and public commerce remain HOLD. No second independent human reviewer or genuine authenticated login is claimed.

**Dependencies:** `AGENTS.md`, sitewide frozen requirements, existing Academy engine, Cloudflare Pages, Supabase private case/progress tables, and GitHub Actions workflows.  
**Revision history:** v1.0 — October 31, 2026 — three original advanced source days, three complete private Draft cases and separate CI, privacy and six-journey blockers recorded.  
**Footer:** Crown & Lantern Press — internal controlled evidence for educational Beta, not independently attested professional review or legal/financial certification.
