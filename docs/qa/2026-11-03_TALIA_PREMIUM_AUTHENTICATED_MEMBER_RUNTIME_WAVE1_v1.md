# Talia Market Tutor — Authenticated Premium Member Runtime, Wave 1

| Document control field | Value |
| --- | --- |
| Organization | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | THE STOCK MARKET: FROM THE GROUND UP — Talia Market Tutor |
| Document ID | SMFGU-TALIA-PREMIUM-RUNTIME-WAVE1-20261103-001 |
| GitHub location | `Adissel/stock-market-from-the-ground-up-Live`, branch `feature/talia-real-member-runtime-wave1-20261103` |
| Filename / type | `docs/qa/2026-11-03_TALIA_PREMIUM_AUTHENTICATED_MEMBER_RUNTIME_WAVE1_v1.md` / Markdown |
| Google Drive location / Google document ID | No Google Drive file created; no ID assigned; GitHub is the controlling record |
| Version / date | 1.1 / November 3, 2026 (America/Chicago) |
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


## Combined Tutor Classroom Interface Patch — v1.1

**Controlling release unit:** One integrated GitHub PR #68, not separate production feature activations.

| Component | Implementation and testable behavior | Release status |
| --- | --- | --- |
| Conversation | Existing member-authenticated `POST /api/market-tutor` invoked directly by chart teaching actions, typed composer (Enter sends / Shift+Enter newline), and source-grounded continuation prompts | Branch source implemented, browser acceptance pending |
| Typing presentation | Progressively reveals the completed server reply at Slow / Normal / Fast / Show Instantly; Show All Text; reduced-motion bypass | Not native streaming model tokens |
| Fictional chart | One shared, locally revealed 260-bar original teaching fixture; 1/3/5-minute aggregation; ECharts pan/zoom/indicators; high/low/open/close horizontal guides | Not server-owned historical replay |
| Playback | Auto Play, Pause, manual reveal, speed choices, visibility pause, pause during server waiting and the instructor's displayed explanation | No future candle reveal through educational controls |
| Checkpoints | Automatic pause on defined revealed fictional bars; MCQ, individual body/range/percentage calculations, three-input trade-print VWAP; feedback, unlimited Retry, free explanation and Skip | Ungraded only; no Lumens consumption |
| Teaching progression | Ten visible instructional steps distinguish learning tasks; original nine saved stages are untouched | No new mastery/progress records |
| Membership | One source-grounded Tutor workstation with Foundation always available and explicit server-verified Advanced/Professional/Enterprise betas; no client-side paid access claims | Existing test-only Owner grant, not production tier release |
| Layout | Chat composer moved adjacent to conversation; original dark terminal, responsive calculator/checkpoint styling; duplicate standalone tier panel disabled | Keyboard/screen reader browser QA still required |

### Evidence and regression

- The scoped source test `tests/talia-live-interactive-v1.test.mjs` was added to `scripts/build-pages.sh`. Existing protected classroom, tier, history, source, chart and subscription tests remain controlling.
- A successful Pages preview for an earlier integrated commit is evidence of buildability, not proof of every action in an authenticated browser.
- A fresh, exact latest-commit Cloudflare preview success and complete GitHub CI acceptance are required before any merge.
- Changes do not activate paid AI inference, monetize explanations, publish protected assessment answers or modify the commercial membership matrix.
- A complete authenticated test should confirm the correct lessons, all four allowed beta editions, first-principles VWAP and candle mathematics, wrong-answer correction, keyboard focus, auto pause/resume, and distinct second-account access denial.

### Release decision

**Combined source patch created; controlled preview acceptance pending. Production premium-release HOLD remains.** The named test-account grant is time-limited and automatically expires; it does not modify subscriptions, entitlement levels or public access.

## Revision history

| Version | Date | Change | Status |
| --- | --- | --- | --- |
| 1.1 | 2026-11-03 | Consolidated synchronized chart playback, chat, typing, questions, calculations and authenticated premium evidence in one PR #68 | Preview integration; release HOLD |
| 1.0 | 2026-11-03 | Implemented first authenticated premium member runtime and time-limited audited QA authorization; retains source rights, paid-model and launch holds | Source integrated / limited QA pending |

**Document footer:** SMFGU-TALIA-PREMIUM-RUNTIME-WAVE1-20261103-001 · v1.0 · GitHub controlling version · Owner-approved QA scope · General release HOLD.
