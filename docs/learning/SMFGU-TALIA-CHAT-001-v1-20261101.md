# SMFGU-TALIA-CHAT-001 — Interactive Member Classroom Execution Record

**Company:** Cyber Nexus Publishing / Crown & Lantern Press  
**Project:** The Stock Market: From the Ground Up  
**Document ID:** SMFGU-TALIA-CHAT-001  
**Filename:** `docs/learning/SMFGU-TALIA-CHAT-001-v1-20261101.md`  
**File type:** Markdown  
**Controlling location:** GitHub `cybernexuspublishing/stock-market-from-the-ground-up`, branch `main`  
**Google Drive location:** Not created; no Drive document required for this source-level implementation record  
**Google Drive document ID:** Not assigned  
**Version:** 1.0  
**Date:** November 1, 2026  
**Status:** Source implemented for optional classroom beta; full TypeScript, CI, production, authenticated-browser, accessibility and teaching acceptance remain separately gated  
**Purpose:** Establish a responsive React chat classroom using existing Market Tutor services without changing permissions, grading, payment, member histories or the frozen Basic engines.  
**Dependencies:** `market-tutor.html`, `functions/api/market-tutor-v01492.js`, `functions/api/member-tutor-conversations.js`, `functions/api/member-tutor-history-v014102.js`, `assets/js/lab-v33-instructor.js`, `assets/js/academy-tutor-bridge-v1.js`, frozen Learning v3.3 / Lab v3.2, existing Supabase authentication and Cloudflare Pages build.

## Implementation completed in source
1. React/TypeScript member chat at `src/tutor/TaliaClassroom.tsx` with separate interactive workspace at `talia-classroom.html`.
2. Existing authenticated `/api/market-tutor` endpoint reused; no new model provider, paid calls or private grading path. `allowModel:false` is explicit. The member can request Explain, Guided Self-check, Review Reasoning (ungraded) or Practice.
3. Existing history endpoint and member-owned conversation API reused; saving is an affirmative in-page checkbox, off by default. No questions or full responses are cached in browser storage. Cross-account UI state is cleared and pending requests aborted.
4. Original fictional 12-candle ECharts example with initially seven visible completed candles, a one-candle reveal control, a keyboard-accessible OHLC readout and chart-to-composer question selection. The full fictional fixture remains public client-side: this is **not** a protected real historical replay or an independent blind assessment.
5. Separate responsive CSS and a beta link from `market-tutor.html`; classic Tutor remains intact.
6. Node source-boundary tests and independent Python Decimal tests in the existing Pages build. Build must type-check and bundle the React component using the pinned existing React/TypeScript toolchain.

## Limitations / acceptance
- A new conversational presentation is **not** yet continuous Tutor intelligence across Lab and Boot Camp stages. The existing stage adapters have been audited but not wired into this new React component.
- Contextual follow-up with verified prior questions requires an authorized saved conversation. Unsaved turns remain visual, not server-trusted context.
- Source-level fictional chart interaction is **not** live Studio synchronization, indicator mastery, historical replay validation or production approval.
- Private history and conversation features may be unavailable to individual membership plans if the existing server entitlement or database schema is not present. Fail closed; do not grant access from the UI.
- Do not claim an entire 419-Lab or Boot Camp curriculum conversion. Preserve author-controlled curriculum and protected assessments.
- Do not activate Advanced / Professional / Enterprise versions or bill for AI during this batch.

## Next ten gates (execution order)
| Gate | Execution | Source position | Release acceptance |
| --- | --- | --- | --- |
| 1 | Review existing Tutor, Learning, Lab, Boot Camp, chart and identity contracts | Primary integration contracts inspected | Broader source/behavior inventory open |
| 2 | React/TypeScript interactive chat | New optional beta source, chart companion and CSS committed | TS build, Playwright and actual account QA open |
| 3 | Learning Engine v3.3 continuity | Existing v3.3 source preserved | Live prerequisite and adaptive handoff open |
| 4 | Lab Engine v3.2 continuity | Existing v3.2 source preserved | Authorized lesson-stage bridge open |
| 5 | ECharts Tutor synchronization | Fictional completed-bar chart-to-composer example | Existing Chart Studio/replay linkage open |
| 6 | Python math verification | Original OHLC + EMA seed Decimal regression script | Complete indicator-family validation open |
| 7 | Boot Camps / Free Foundations | Existing Academy bridge preserved | New chat stage integration open |
| 8 | Conversation privacy and persistence | Existing history/conversation APIs reused | Genuine authenticated isolation, deletion and restore open |
| 9 | Edition-specific access | Basic-only effective runtime preserved | Premium runtimes not operationally released |
| 10 | Release evidence | Source and Page build checks added | Same-SHA CI, Cloudflare production and manual accessibility open |

**Percentage policy:** No inferred overall percentage for 10 differently sized gates. Numerator of newly independently signed-off end-to-end gates: 0 of 10 = 0% **new classroom release acceptance**, not 0% of existing Tutor functionality. Advanced/Professional/Enterprise premium editions: 0% newly release-accepted. The existing frozen Basic engine snapshots remain operational source baselines and are not reset by this figure.

## Revision history
| Version | Date | Change | Disposition |
| --- | --- | --- | --- |
| 1.0 | 2026-11-01 | Added optional React chat classroom, member-owned history reuse, fictional ECharts coaching and independent build checks | Source implementation; production acceptance HOLD |

**Footer:** SMFGU-TALIA-CHAT-001 · v1.0 · Source and product release are distinct · No new paid infrastructure, trading execution, grading or protected data exposure.
