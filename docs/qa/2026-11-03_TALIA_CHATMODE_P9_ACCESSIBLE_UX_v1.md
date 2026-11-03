# Talia Tutor — Chat Mode Package 9: Accessible UX and Member Copy

| Control | Record |
|---|---|
| Company/project | Cyber Nexus Publishing / Crown & Lantern Press — The Stock Market: From the Ground Up |
| Document ID | SMFGU-TALIA-CHAT-P9-UX-A11Y-001 |
| Filename/type | `docs/qa/2026-11-03_TALIA_CHATMODE_P9_ACCESSIBLE_UX_v1.md` / Markdown |
| Machine file | `data/talia-chat-mode-p9-ux-accessibility-v1.json` / JSON |
| Version/date/status | 1.0 / 2026-11-03 / UI requirements and wording finished; independent assistive technology and production acceptance HOLD |
| GitHub / Google Drive | `Adissel/stock-market-from-the-ground-up-Live` / main; Drive not created or assigned |
| Dependencies | `src/tutor/TaliaClassroom.tsx`, 4 teaching modes, 73 indicators, member-only Tutor, ECharts, data-rights and V4 2/5 OAT |

## Controlled language

- **Header:** Talia Market Tutor — Your market learning instructor
- **Intro:** Ask a question, examine completed fictional market data, and practice your reasoning. Tutor lessons are educational and ungraded.
- **Source label:** Source-grounded instruction · Reference and as-of date shown where verified
- **Fictional label:** FICTIONAL TRAINING DATA — Not a live security, executed trade or forecast
- **VWAP proxy:** OHLCV HLC3-based VWAP proxy. Not exact transaction-price VWAP.
- **Save off:** Save Tutor responses to your private history (off by default)
- **Progress:** This practice does not record an official grade or award mastery.
- **Assess safe:** I can explain the method, but protected assessment answers and private rubrics remain unavailable.
- **Membership:** Your current verified membership determines which advanced tools are available. Ordinary explanations remain available for your accessible lessons.
- **AI cost:** Source-grounded teaching does not require an external AI key or payment for an explanation.

## State-by-state error messages

- `ERR_AUTH`: “Your session has expired. Sign in again to continue your private lesson.” — Render private transcript or retry with expired token
- `ERR_ACCESS`: “This learning feature is not included in your current authorized access.” — Unlock the requested premium feature from a client flag
- `ERR_SOURCE`: “Talia cannot verify that source or observation for this example. You can continue with an original fictional case.” — Invent a supporting quotation, chart print, grade or trade
- `ERR_CHART_CUTOFF`: “The selected candle was not complete at this decision point. Choose an earlier completed candle.” — Show later high, low, close or volume
- `ERR_MODEL_LIMIT`: “Optional AI assistance is unavailable. Source-grounded explanations and ordinary practice remain available.” — Charge member, prompt for API key or enable paid calls
- `ERR_SAVE`: “The conversation could not be saved. Your current unsaved explanation remains available in this session.” — Claim a persisted record exists
- `ERR_HISTORY`: “Your saved history cannot be loaded. Check your sign-in and try again.” — Show another account's exchanges or cached private data
- `ERR_ASSESS`: “I can explain the method and what evidence to examine, but I cannot reveal a protected assessment answer.” — Reveal key, hidden grade or unrevealed case

## Required accessibility and interaction acceptance

- **UX-01 — Semantic conversation:** Transcript is a named chronological list with stable speaker identity and language; updates announced without repetitive full-log live region Evidence: Keyboard and screen-reader reads two sequential turns correctly.
- **UX-02 — Input focus:** On send, focus stays predictable; errors announced in status region, not only by color; stop cancels without showing late answer Evidence: Tab, Shift+Tab, Enter and screen-reader status verification.
- **UX-03 — Voice/reading:** No autonomous audio; meaning and OHLC evidence available as readable text; label time zone, units and chart source Evidence: Nonvisual Tutor/chart learning journey complete.
- **UX-04 — Candle alternative:** Completed candle high/low/open/close/volume, numerical value, source, timestamp, timeframe and reveal cutoff accessible via a keyboard-operable ledger; no blind start Evidence: Keyboard selects 1/3/5m data and names selected candle exactly.
- **UX-05 — Chart interaction:** Mouse wheel zoom, drag pan, pointer release, one-candle reveal, keyboard equivalent and right buffer; no sticky dragging or future data Evidence: Real browser with mouse/pointer touch keyboard at each supported screen width.
- **UX-06 — Responsive layout:** Prefer stacked mobile layout and minimum readable candle/text sizing; split/chart/tutor focus controls must remain reachable without horizontal overflow Evidence: 390px mobile, tablet and 1440px desktop, 200% zoom and reduced width.
- **UX-07 — Color and theme:** Preserve approved dark Neon/Quantum or green/black identity, with contrast, non-color distinction and reduced motion; never force white default Evidence: Contrast measured against actual rendered theme and color-blind interpretation.
- **UX-08 — Accessibility motions:** Disable nonessential motion and flashing when prefers-reduced-motion; use focus-visible indicators and logical region order Evidence: Reduced-motion and accessibility browser checks; independent assistive-technology reviewer.
- **UX-09 — Learning states:** Distinguish source-only, original fictional, historical authorized, unavailable and protected Assess; uncertainty in output is text-labeled Evidence: Snapshot and screen reader states across all modes and sources.
- **UX-10 — Consent controls:** Save-history checkbox unselected by default, explicit before saving; labeling explains unsaved vs saved and new topic not deletion Evidence: Two-account consent/history persistence and deletion path review.
- **UX-11 — Entitlement locks:** Unavailable premium action visibly locked and keyboard discoverable with reason, do not remove Foundation free explanation Evidence: Foundation/paid/downgrade browser tests and API 403 matches UI.
- **UX-12 — Protected Assess:** During Assess the Tutor can teach general method but cannot display expected response or hidden rubric; 'Reveal/Skip' governed by Lab engine Evidence: Adversarial prompt tests and independent curricular review.
- **UX-13 — Chart-Tutor sync:** Selected candle and Tutor answer describe identical completed evidence cutoff and disclose proxy vs print VWAP Evidence: Timestamp/volume/indicator parity on 1/3/5m and late-print negative.
- **UX-14 — Recovery and offline:** Network errors preserve non-sensitive composer text locally for session only; do not imply save or send; source-only bounded fallback when allowed Evidence: Simulated API 401/403/429/503 with no private leaks.
- **UX-15 — Screen reader:** Independent NVDA/JAWS/VoiceOver read/review on member flow; role, live announcements, modal/menus, chart data, focus changes verified Evidence: Recorded real assistive-tech review, no fabricated certification.

## Actual evidence limits

Current source includes labeled chat transcript, controls, source-only indicator learning, five perspectives, six phases, chart, saved-history consent and accessible OHLC data. V4 previously verified 20/21 pinned Chromium checks (one staff-positive BLOCKED), 18/18 static skip-link checks and remained at **2/5 gate packages accepted**. Those historical findings are **not** an independent NVDA/JAWS/VoiceOver review, current SHA revalidation or sitewide WCAG certification. Real screen-reader and production source matching must be tested.

## Revision history

| Version | Date | Record |
|---|---|---|
| 1.0 | 2026-11-03 | Member-facing source/data/consent/assess copy, 8 error states and 15 accessible interaction acceptance cases defined |

Footer: SMFGU-TALIA-CHAT-P9-UX-A11Y-001 · v1.0 · Not a completed independent accessibility audit.
