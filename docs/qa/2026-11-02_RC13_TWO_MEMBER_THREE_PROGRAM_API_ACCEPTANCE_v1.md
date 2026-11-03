# RC13 — Two-Member Three-Program Authenticated Academy API QA

**Project:** THE STOCK MARKET: FROM THE GROUND UP
**Document ID:** SMFGU-RC13-AUTH-SIX-API-20261102
**File:** docs/qa/2026-11-02_RC13_TWO_MEMBER_THREE_PROGRAM_API_ACCEPTANCE_v1.md
**Type:** Markdown
**Version:** 1.1
**Date:** 2026-11-02 America/Chicago / 2026-11-03 UTC
**Google Drive:** Not created; no Drive ID assigned
**Status:** SIX AUTHENTICATED API PATHS PASSED; HUMAN BROWSER/30–45 MINUTE JOURNEYS OPEN; TEMPORARY QA ACCESS REVOKED
**Purpose:** Six distinct real-auth API learning saves across two members and three courses, without repeating the historically accepted single-account B001
**Dependencies:** Supabase Auth, real nonstaff QA identities, server-controlled course beta flag, v0.14.0.168 shared Academy, temporary expiring test grants, evidence in GitHub run 41585492012

## Tested and accepted API scope
The first pass correctly failed at the controlled three-course beta allowlist despite both accounts proving real GoTrue credentials and active expiring training passes. The application did not permit a training pass to override a separate beta cohort restriction. One narrow, hard-expiring, two-exact-identity temporary beta allowance was released while the underlying beta flag and verified training entitlement both remained mandatory.

**Successful run:** https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41585492012

- Two distinct genuine signed nonstaff QA member identities, each with positive temporary noncommercial ONDEMAND_TRAINING entitlement.
- Each of tape10, indicators10, filings7: one new unused fictional day reflection saved by each member; six distinct interaction paths passed.
- Reload/GET preserved each private reflection and revision, stale save returned HTTP 409, injected other-member user_id selectors did not switch records, opposite member token did not read private marker, foreign-origin changes and guest reads denied, GoTrue refresh-token resume preserved all six.
- Stored result flags explicitly exclude official grading, claimed market outcomes and competency mastery. Observed runtime 19.2 seconds, which is **NOT** six genuine 30–45-minute human browser journeys or nine-stage learning completion.

## Postflight and permanent-boundary restoration
Temporary Supabase user_tool_passes entries 13 and 14 were canceled with ends_at set to the real revocation time. Two controlled delegated grant audit events and two delegated revoke events are present, all with actor_user_id NULL because these were connected management acts, not a signed-in Owner browser event. Zero active QA training passes, staff roles, billed QA passes, training attempts or Academy stage checkpoint rows remain. Prior reflections were not overwritten. The separately expiring source-only beta exception is rolled back to the original allowlist after test success; original general release flag stays disabled. Subsequent credentialed test workflow is manual-only, requiring a fresh authorized test grant.

## Acceptance boundaries and dependencies
The source-authored 240 guided prompts and Owner approval remain controlling. Formal Academy independent acceptance stays separately tracked at 93/380 unless review ledger changes. Protected grading remains 0/54. Six full-length genuine timed browser journeys remain 0/6 and must not be manufactured from this 19.2-second automated test. RC20 general release HOLD.

## Revision history
v1.0 | 2026-11-02 | New controlled real-member integration scope | Source candidate
v1.1 | 2026-11-03 UTC | Six-path authenticated API PASS, audited grant/revoke, postflight and immediate beta source rollback | API accepted; browser gate open

**Footer:** SMFGU-RC13-AUTH-SIX-API-20261102 · no charges, protected grades or real market source publication.
