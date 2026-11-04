# Talia Market Tutor — Authenticated Premium Member Runtime, Wave 1

| Document control field | Value |
| --- | --- |
| Organization | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | THE STOCK MARKET: FROM THE GROUND UP — Talia Market Tutor |
| Document ID | SMFGU-TALIA-PREMIUM-RUNTIME-WAVE1-20261103-001 |
| GitHub location | `Adissel/stock-market-from-the-ground-up-Live`, branch `feature/talia-real-member-runtime-wave1-20261103` |
| Filename / type | `docs/qa/2026-11-03_TALIA_PREMIUM_AUTHENTICATED_MEMBER_RUNTIME_WAVE1_v1.md` / Markdown |
| Google Drive location / Google document ID | No Google Drive file created; no ID assigned; GitHub is the controlling record |
| Version / date | 1.0 / November 3, 2026 (America/Chicago) |
| Status | SOURCE INTEGRATED, MEMBER QA APPROVAL RECORDED; FULL PRODUCTION RELEASE AND INDEPENDENT REVIEW PENDING |
| Purpose | Integrate actual signed-in member progress, replay and curriculum records into premium Tutor teaching without relying on fabricated QA profiles or client-selected entitlements |
| Dependencies | `member-tool-access.js`, `competencies.js`, `learning-replay-v01492.js`, `market-tutor-v01492.js`, Supabase grant/competency/Academy/replay tables, original first-party educational guide catalogues |

## Accepted implementation boundaries

The existing source-grounded Tutor remains the only answering engine. No paid external language-model activation, new provider key, Stripe billing change, official grade, award or buy/sell execution is introduced.

The authenticated runtime API `/api/talia-premium-member-v1`:
1. Verifies the bearer against the existing `MARKET_TUTOR` member contract.
2. Resolves the active entitlement exclusively from server-owned `user_plan_grants` / `site_subscriptions` and the registered plan's edition.
3. Enables the premium beta only for explicit, authorized member IDs configured server-side or an Owner-audited, active, expiring QA marker on the user's server-owned plan grant. Otherwise returns 403, including when a browser forges `?tier=ENTERPRISE`.
4. Reuses the existing `competencies.js` canonical server calculation, never browser-supplied grades or private answer keys.
5. Returns only the member's own Academy and Lab participation, not other users' raw reflections, graded answers or journals.
6. For Professional, loads the user's current, unexpired fictional replay session, verifies the dataset with `fictionalReplayPermitted`, queries only indices up to the server cursor and returns at most the visible 40 completed bars.
7. For Enterprise, compares first-party original reviewed teaching briefs and aggregates the user's own active-course progress; does not claim historical source availability or redistribution permission.
8. Shows an authenticated member beta panel in `talia-classroom.html`. Clicking a contextual teaching action sends a new ungraded source-only request to the **existing** `/api/market-tutor` endpoint with `allowModel:false` and `saveHistory:false`. Review mode takes the learner's **voluntarily supplied reasoning**; no private transcript is copied to a third party.
9. Does not change the production `/api/member-learning-engine-versions` contract; non-beta members remain effective Foundation.

### Tier-specific runtime

| Tier | New member-data runtime | Evidence boundary |
| --- | --- | --- |
| Foundation | Inherited source-grounded member classroom | No enhanced entitlement implied |
| Advanced A01 | Canonical 30-competency data and explicit unavailable-status handling | No unsupported diagnosis if independent evidence is missing |
| Advanced A02 | Member-selected competency and actual written reasoning reviewed by the existing Tutor endpoint | Known error flags are NOT treated as psychological diagnoses |
| Advanced A03 | Personally recorded Lab and Academy activity combined with canonical next-step guidance | Participation does not become official mastery |
| Professional P01 | Current authorized fictional OHLCV completed candle + chart coaching prompt | No future bars and no unlicensed historical data |
| Professional P02 | Server-cursor-bounded sequence with time ordering and missing-future disclosure | No lookahead |
| Professional P03 | Recorded locked decision and visible completed-bar debrief | No actual fill, realized P&L or hindsight grade |
| Enterprise E01 | Own active courses and recorded progress crosswalk | No program inferred from mere unenrolled records |
| Enterprise E02 | Original authored EMA and Anchored VWAP guides and public reference links | Citations are not redistribution rights or verified historical publications |
| Enterprise E03 | Own participation report with counts and source-grounded transfer prompt | No raw member identifiers or official grades |

## Test-account release control

- Owner-approved account: `James_Test` (existing Founding 60-Day grant, plan and billing not changed).
- Stored in the existing active `user_plan_grants.metadata.talia_member_runtime_beta_v1` JSONB under a service-authorized audited action; no public self-service write RLS policy exists.
- Scope: `OWN_MEMBER_RECORDS`; four-tier testing permitted.
- Automatic expiry: **2026-11-10T00:00:00Z**, with a maximum 14-day allowed duration enforced server-side.
- Audit: `admin_audit_log` action `TALIA_MEMBER_RUNTIME_QA_APPROVED`, one write and one verification query completed.
- This is not public premium access, and the signed-in tester must still present a valid Supabase session. No credentials are stored in GitHub or in the browser.

## Evidence state and limitations

- Official competency definitions: 30; production `competency_evidence` has zero rows in the sampled database check. Advanced returns `Not independently assessed` and practice recommendations rather than inventing individual grades.
- The designated QA member has recorded Academy and Lab activity but no independent competency assessment data. Its Enterprise read can therefore show genuine course participation, not mastery.
- The designated QA member had no active fictional replay at inspection. Professional will truthfully report `no_active_replay` until an authorized fictional replay is started. Future data remains concealed by the server.
- The source-only versions of the original 9 premium capabilities remain unreleased; this new runtime is a separate beta implementation subject to genuine UI, two-account, mobile, accessibility and CI acceptance.
- Never claim independent review, complete teaching quality, source license, production exact-SHA parity or generative AI availability from the existence of these routes.

## Execution order remaining

1. Confirm latest branch-head syntax, source authorization regressions and security workflows green. Repair any failure before merging.
2. Integrate with `main` after comparing the latest base and confirming no source conflict. Confirm production Cloudflare deployment SHA matches the merge.
3. Authenticate as the designated QA member; run all four tier journeys including denied requests from a separate non-beta identity and cross-account record isolation. Preserve transcripts and QA evidence (without credentials).
4. Start a genuine authorized **fictional** replay on the QA account, lock a practice decision, then verify P01–P03 on a real server cursor; do not create false market fills.
5. Complete remaining independently audited source review, assistive-technology QA and member entitlement downgrade/revocation acceptance before general premium publication.

## Revision history

| Version | Date | Change | Status |
| --- | --- | --- | --- |
| 1.0 | 2026-11-03 | Implemented first authenticated premium member runtime and time-limited audited QA authorization; retains source rights, paid-model and launch holds | Source integrated / limited QA pending |

**Document footer:** SMFGU-TALIA-PREMIUM-RUNTIME-WAVE1-20261103-001 · v1.0 · GitHub controlling version · Owner-approved QA scope · General release HOLD.
