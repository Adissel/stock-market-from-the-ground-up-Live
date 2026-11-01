# SMFGU-ACADEMY-SHARED-ENGINE-027 — Execution Acceptance Addendum

**Project:** The Stock Market: From the Ground Up — Boot Camp Academy  
**Company / imprint:** Cyber Nexus / Crown & Lantern Press  
**Document ID:** SMFGU-ACADEMY-SHARED-ENGINE-027  
**Version:** 1.1 (supersedes the stage-persistence status in v1.0)  
**Date:** November 1, 2026  
**Filename / type:** `SMFGU-ACADEMY-SHARED-ENGINE-027-v1.1-20261101.md` / Markdown  
**GitHub location:** `cybernexuspublishing/stock-market-from-the-ground-up` · `main/docs/learning/`  
**Google Drive location / document ID:** Not created / unassigned; a separate Drive file is required if desired.  
**Status:** Shared-engine / private stage checkpoint source implemented; dedicated CI and same-SHA production deployment verified. Authenticated real-member and protected editorial acceptance still HOLD.  
**Purpose:** Record completed actions and open release gates without conflating technical deployment and member-accepted instruction.  
**Dependencies:** Frozen Learning Engine v3.3 and Lab Engine v3.2 baselines, Academy v0.14.0.168, `toolAccess`, Supabase Auth, historical and fictional data provenance, original Boot Camp reflection ledgers, original protected grading.

## Verified engineering actions

1. **Lab-first Academy teaching:** `bootcamp-academy.html` and separate `bootcamp.html` render the existing Shared Lab Engine using isolated virtual `academy:<program>:<day>` instructional IDs; the 419 canonical Labs and original membership entitlements are unchanged. Original authored advanced instruction remains an optional supplemental panel.
2. **Talia instructional context:** Stage and teaching-intent categories are allowlisted in the existing authenticated Market Tutor bridge. Protected scoring keys, actual member answers, private rubrics, and future replay bars are not transmitted.
3. **New private checkpoint API:** `functions/api/academy-stage-checkpoint.js` enforces original training authorization, release restrictions, current member identification, program-day bounds, enrollment on non-30-day routes, same-origin writes, sanitized nine-stage payloads, and authoritative revision checks.
4. **New same-origin client:** `assets/js/academy-stage-checkpoint-v1.js` supports authenticated load/resume, serialized save, stale-session denial, and 409 stale-write conflicts. It is used by both Academy and the separate original 30-day course.
5. **Additive Supabase storage:** `supabase/migrations/20261101_academy_stage_checkpoint_v1.sql` was successfully applied to the stock-site Supabase project, creates `gu_academy_stage_checkpoint_v1` and `gu_academy_stage_checkpoint_save_v1` without changing or deleting day reflections, member grades, canonical Labs, commerce, rewards, or books.
6. **Security verification:** Database RLS is enabled. Anonymous and ordinary authenticated roles have no direct SELECT privilege or execution permission on the stage-saving RPC; service role has explicitly granted access. The RPC is SECURITY INVOKER (not SECURITY DEFINER). A transaction-only first-save and duplicate-revision test passed; the test was rolled back and left zero draft rows.
7. **Source checks:** Dedicated Boot Camp workflow passed on exact commit `1b263b7467669e5bcc5df678014f5932f2680b2b`, GitHub Actions run `41357922710` (job `original-seven-content`). A Cloudflare Pages production deployment at that SHA subsequently reported SUCCESS. Other current `main` commits require their own verification.

## Remaining acceptance limitations

- The first stage-saving release covers the nine non-Free Academy Boot Camp programs, including the separately controlled original 30-day course. Free Foundations `free5` retains its existing Free lesson teaching and progress path. Do not imply it was migrated.
- **No genuine member-browser evidence** has yet confirmed Stage save → reload → resume and 409 conflict recovery across account changes in production. Database transaction validation and fixture tests are technical evidence only, not this acceptance.
- No observed physical mobile/screen-reader acceptance. No protected case is approved for official grading by the stage draft feature.
- A developer-maintained research source directory is a research inventory, not a substitute for per-case provenance, source-rights, mathematical validation or independent assessment approval.
- The source preflight for 247 original days is a separate measure from the 20 formally accepted advanced-depth instructional days. No member mastery or grade is awarded by reading or saving drafts.

## Controlling owner acceptance denominators

| Stream | Accepted | Total | Completion |
| --- | ---: | ---: | ---: |
| Three new Boot Camp ungraded teaching days | 27 | 27 | 100.00% |
| Three new Boot Camp advanced cases | 45 | 45 | 100.00% |
| Original seven Boot Camp advanced-depth cases | 20 | 247 | 8.10% |
| Protected official grading cases | 0 | 54 | 0.00% |
| Genuine complete two-tester journeys | 0 | 6 | 0.00% |
| Historical software source gate | 1 | 1 | 100.00% |
| **Fixed Owner ledger** | **93** | **380** | **24.47%** |

**Accounting rule:** These results preserve the controlling October 31 / November 1 register. Technical changes and a new checkpoint test do not create new accepted curriculum cases or full real-user journeys.

## What is next — execution order

1. Verify final newest `main` CI and Cloudflare deployed SHA, including all changed page and checkpoint routes, without accepting stale green runs as current-head evidence.
2. Execute genuine authorized member sessions: signed-in Free and Founder permissions, Academy plus original 30-day course, save/reload/resume, second-tab conflict, account isolation, downgrade, sign-out and expiry.
3. Verify each selected day's worked numerical source, chart exercise and Talia correction matches its authored case; ensure chronological no-lookahead and independent assessment integrity.
4. Work through the 227 original unaccepted advanced-depth days in coherent topic batches, beginning with Risk60 guided-rehearsal D21–D40, and individually record source, formula, missing evidence and reviewer decisions. Do not auto-approve authoring coverage.
5. Finish the 54 private case authoring/acceptance decisions and six genuine complete two-tester journeys; keep public graded release disabled until separate security, accessibility and rights acceptance.

## Revision history

| Version | Date | Revision |
| --- | --- | --- |
| 1.0 | 2026-11-01 | Shared Lab-first teaching source integration; stage server persistence open |
| 1.1 | 2026-11-01 | Additive private Stage CAS storage, frontend and API; rollback-verified database test, exact-source CI and production deployment; retained member/editorial holds |

**Footer:** Crown & Lantern Press · controlled operational change record · no private answers, customer identifiers, authentication secrets, official scores or LIVE payment credentials included.
