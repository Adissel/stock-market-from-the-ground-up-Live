# Basic Academy Progress — Twenty Production Control Gates

**Project:** THE STOCK MARKET: FROM THE GROUND UP  
**Document ID:** SMFGU-BASIC-PROGRESS-20-CONTROL-GATES-20261102  
**Version:** 1.0  
**Date:** 2026-11-02  
**Status:** Verified production database integrity; authenticated browser acceptance open  
**Filename:** SMFGU-BASIC-PROGRESS-20-CONTROL-GATES-20261102.md  
**File type:** Markdown  
**GitHub location:** `docs/learning/`, controlling `main` branch  
**Google Drive location:** Not created; do not infer a Drive document ID.  
**Purpose:** Record twenty independent, read-only checks against the existing Supabase Academy progress architecture.

## Evidence source and method

Connected production Supabase project `oxihglyfgzywsupnyicb`. Each gate was executed as its own SQL query through the connected Supabase plugin. Gate responses each returned `passed: true`. No writes were performed to membership, progress, grades, or billing data. A first parsing attempt returned indeterminate results because of wrapper encoding; all twenty were subsequently **re-executed independently**, parsed correctly and passed.

## Verified gates

| Gate | Actual condition checked | Result |
|---|---|---|
| 01 | Academy progress composite user/program/day primary key | PASS |
| 02 | Enrollment composite user/program primary key | PASS |
| 03 | Guided-stage checkpoint composite primary key | PASS |
| 04 | Progress day range database CHECK | PASS |
| 05 | Stage-checkpoint day range database CHECK | PASS |
| 06 | Progress lifecycle status database CHECK | PASS |
| 07 | Written reflection length database CHECK | PASS |
| 08 | Reflection status and first-reflected timestamp consistency CHECK | PASS |
| 09 | Positive progress revision database CHECK | PASS |
| 10 | Positive guided-stage checkpoint revision database CHECK | PASS |
| 11 | Guided-stage checkpoint mode constraint | PASS |
| 12 | Maximum saved-checkpoint JSON payload constraint | PASS |
| 13 | Progress foreign key to authenticated user | PASS |
| 14 | Progress foreign key to matching Academy enrollment | PASS |
| 15 | Guided checkpoint foreign key to authenticated user | PASS |
| 16 | Academy enrollment foreign key to authenticated user | PASS |
| 17 | Academy enrollment program version constraint | PASS |
| 18 | Enrollment lifecycle status constraint | PASS |
| 19 | No existing orphan progress record without matching enrollment | PASS |
| 20 | No existing progress record beyond its program's actual day limit | PASS |

## Corroborating release evidence

- Cloudflare confirmed **build success and deploy success** for GitHub commit `800c94a14ac31c93d491962d408d082919a2b162` on project `stock-market-from-the-ground-up`.
- The release build registers `tests/basic-five-study-dom-interaction-20.test.mjs`, plus the previously verified math, Lab-integrity and Academy suites.
- These SQL checks do **not** certify browser enrollment and prerequisites, a genuine user session, sign-out/expired sessions, genuine cross-account reads, or assistive-technology behavior.

## Owner authority and unresolved gates

On November 2, 2026, the project owner explicitly approved and signed off on **all Boot Camps, Labs and related instructional records**. The controlling `data/learning-lab-engine-feature-audit-v1.json` now records `owner_editorial_accepted: true` for each of the six remaining Basic gate records. This is content approval, not third-party market-data licensing approval or simulated authenticated-browser evidence.

**Basic Learning Engine:** 5/8 integrated = **62.5%**.  
**Basic Lab Engine:** 5/8 integrated = **62.5%**.  
**Completion unchanged:** Source/DB evidence is improved; individually required authenticated, accessibility and release acceptance remain incomplete.

## Next execution order

1. Run authenticated Free and Academy sessions using real authorized QA identities and verify enroll/continue/save/reopen.
2. Verify expired session, sign-out, account switching and cross-member denial in genuine browsers.
3. Run assistive-technology plus keyboard operation for five indicator workbenches.
4. Reconcile quantitative/chart coverage and rights evidence for relevant Labs among the 419 approved lessons.
5. Verify full GitHub Actions release-workflow matrix and deployed exact SHA.
6. Close remaining six Basic requirements independently when their own acceptance requirements pass.

## Revision history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-02 | Recorded twenty independent production database controls and owner acceptance reconciliation |

**Footer:** SMFGU-BASIC-PROGRESS-20-CONTROL-GATES-20261102 · v1.0 · Production metadata evidence · Technical/browser acceptance pending.
