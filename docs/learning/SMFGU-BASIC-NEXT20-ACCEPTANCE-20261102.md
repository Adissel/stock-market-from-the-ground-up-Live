# Basic Learning and Lab Engines — Next 20 Acceptance Executions

**Project:** THE STOCK MARKET: FROM THE GROUND UP  
**Document ID:** SMFGU-BASIC-NEXT20-ACCEPTANCE-20261102  
**Version:** 1.0  
**Date:** 2026-11-02  
**Status:** Executed and verified automated/metadata checks; real-member and assistive-technology acceptance open  
**File type:** Markdown (`.md`)  
**Filename:** SMFGU-BASIC-NEXT20-ACCEPTANCE-20261102.md  
**GitHub location:** `docs/learning/` on `main`  
**Google Drive location:** Not created; GitHub `main` is the authoritative copy.  
**Purpose:** Preserve verifiable execution evidence without falsely closing authentic-member/browser acceptance.

## Executive results

1. **Twenty independent live Supabase SQL checks: 20 passed, 0 failed.** Connected stock-market project `oxihglyfgzywsupnyicb`; read-only metadata/permission queries, not fabricated browser users or application mutations.
2. **Twenty separately reported Academy progress-validator tests: 20 passed, 0 failed, 0 skipped.** The tests execute the production `validAcademyProgressRecords` function extracted from the Academy engine at runtime; they do not duplicate its implementation.
3. **Production build/deploy exact SHA:** `aaf87e0595a6582714d40d323289dd2074fa2afa` succeeded in Cloudflare Pages, deployment ID `4dd6c26d-c5f2-4e7e-9224-fab492af7fd4`.
4. **Build evidence:** Cloudflare build log includes `1..20`, `# tests 20`, `# pass 20`, `# fail 0` for `tests/academy-20-actual-progress-validation-v1.test.mjs`; production `scripts/build-pages.sh` has `set -euo pipefail` and runs this suite.
5. **Owner editorial sign-off:** Previously recorded in `docs/learning/SMFGU-BASIC-OWNER-APPROVAL-20261102.md`; no repeat editorial review required.

## Twenty separate live database checks

| Gate | Executed condition | Result |
|---|---|---|
| 01 | Academy progress table RLS enabled | PASS |
| 02 | Academy enrollment table RLS enabled | PASS |
| 03 | Academy stage-checkpoint table RLS enabled | PASS |
| 04 | Academy audit table RLS enabled | PASS |
| 05 | Lab-progress table RLS enabled | PASS |
| 06 | Site Lab progress table RLS enabled | PASS |
| 07 | No direct anonymous SELECT on Academy progress | PASS |
| 08 | No direct member SELECT on Academy progress | PASS |
| 09 | No direct anonymous INSERT on Academy progress | PASS |
| 10 | No direct member INSERT on Academy progress | PASS |
| 11 | No direct anonymous SELECT on Academy enrollments | PASS |
| 12 | No direct member SELECT on Academy enrollments | PASS |
| 13 | No direct anonymous SELECT on Academy checkpoints | PASS |
| 14 | No direct member SELECT on Academy checkpoints | PASS |
| 15 | No direct anonymous SELECT on Academy audit records | PASS |
| 16 | No direct member SELECT on Academy audit records | PASS |
| 17 | Lab progress SELECT policy references `auth.uid()` | PASS |
| 18 | Site Lab progress SELECT policy references `auth.uid()` | PASS |
| 19 | Site Lab progress UPDATE has owner checks in USING and WITH CHECK | PASS |
| 20 | Lab attempts INSERT checks record owner | PASS |

All checks were separate read-only SQL queries against the connected production database catalog. A matching RLS policy is configuration evidence, not proof of end-to-end authorization with two actual accounts.

## Twenty production-function Academy tests

| Gates | Scope | Result |
|---|---|---|
| 01–04 | Empty first-run record; day one; final day; multiple distinct days | PASS |
| 05–10 | Correct program identifiers and matching user/member identifiers (camel-case and snake-case) | PASS |
| 11–16 | Null progress, null record, zero/out-of-range/fractional day, duplicate day | PASS |
| 17–20 | Cross-program mismatch and cross-member user/member identifier mismatch | PASS |

**Implementation:** `assets/js/bootcamp-academy-v014168.js`, `tests/academy-20-actual-progress-validation-v1.test.mjs`, and existing Academy regression source suites.

## Acceptance limitations

- User-provided editorial approval is recorded. It must not be relabeled independent third-party publication-rights or legal review.
- RLS catalog checks and production-function tests do **not** prove genuine signed-in Free/Academy workflows, sign-out, session expiry, browser focus behavior, screen-reader output, or cross-account isolation in an authenticated browser.
- A successful Cloudflare build is separate from the full GitHub Actions workflow matrix; GitHub combined commit status did not expose the workflow run matrix.
- The controlling `data/learning-lab-engine-feature-audit-v1.json` remains Learning BASIC 5/8 (62.5%) and Lab BASIC 5/8 (62.5%) until remaining technical acceptance criteria are met.
- No LIVE payment, grade, premium access, or RLS schema changes were made.

## What is next, in execution order

1. Browser acceptance under authorized QA identities for Free/Academy enrollment, save/restore, transition, sign-out and account switching.
2. Keyboard and screen-reader acceptance of five indicator workbenches using actual assistive technology.
3. Full relevant-Lab quantitative/ECharts parity and source-rights reconciliation for 419 authored Labs.
4. Independently verify mandatory GitHub Actions release matrix and exact deployment SHA.
5. Close the six remaining Basic requirements only with actual supporting evidence.

## Dependencies and sign-off

**Depends on:** Existing Academy API and server-enforced authorization; Cloudflare build gate; previously attested editorial review.

**Owner editorial authorization:** Attested by the owner, November 2, 2026.  
**Engineering automated acceptance:** PASS for 20/20 independent production-function tests and 20/20 database privilege/ownership metadata checks.  
**Authenticated browser and assistive-technology release acceptance:** OPEN.

## Revision history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-02 | Recorded forty independently executed checks and exact deployed CI build evidence |

**Footer:** SMFGU-BASIC-NEXT20-ACCEPTANCE-20261102 · v1.0 · Owner-approved editorial · Engineering test evidence verified · Real-member acceptance open.
