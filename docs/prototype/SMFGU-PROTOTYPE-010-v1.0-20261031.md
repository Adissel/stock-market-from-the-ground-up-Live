# SMFGU-PROTOTYPE-010 — Premium Chart and Differentiated Member Learning Experience

**Document ID:** SMFGU-PROTOTYPE-010  
**Project:** The Stock Market: From the Ground Up — Crownlight  
**Company / imprint:** Cyber Nexus / Crown & Lantern Press  
**Document filename:** `SMFGU-PROTOTYPE-010-v1.0-20261031.md`  
**File type:** Markdown (.md)  
**Version:** 1.0  
**Created:** October 31, 2026 (America/Chicago)  
**Repository:** `cybernexuspublishing/stock-market-from-the-ground-up`  
**Repository folder:** `docs/prototype/`  
**Branch:** `main` exclusively  
**Google Drive location:** Unassigned. A Google Drive file has not been created.  
**Status:** Source implementation in main; exact-final-commit CI and Cloudflare deployment acceptance are evidence-dependent, not implied by source changes.  
**Purpose:** Respond to Owner visual-quality and membership-differentiation feedback for three staff-only advanced demonstration pages, without altering paid products or learning records.  
**Dependencies:** Controlling `AGENTS.md`, protected `/prototype.html`, Cloudflare Pages production site, React/TypeScript, Apache ECharts 6.1, original `CrownlightIndicatorMath` and 61 public indicator research briefs.  
**New file required:** Yes — this control record complements, not supersedes, the previously frozen Prototype V1–V2 control records.

## Owner feedback / observed defect

The submitted screenshots showed flat, repetitive card layouts; an oversized settings panel above the chart; nearly indistinguishable membership experiences; visually unconvincing market candles; a lower-page instructional card rather than integrated Tutor coaching; and an unintuitive Ctrl+wheel requirement.

Owner requires that the *working prototype* resemble a polished application and illustrate a compelling difference between memberships, while preserving the same instructional quality once a Lab is accessible.

## Changes implemented in source

### Design and chart fidelity

- Six intentionally differentiated dark graphical systems (Quantum, Neon Flux, Green/Black, Ember, Aurora and Onyx), including the actual ECharts color tokens and chart-terminal skins rather than recolored page decorations.
- A new compact chart-first surface with a trading workstation header, prominent synthetic last price, session change, offline/simulation identity, stronger foreground/background separation, less clutter, higher primary price-plot allocation, and right-side price scale.
- Deterministically seeded fictional one-minute OHLCV generated with varying volatility and volume regimes rather than visually smooth periodic candle movement.
- ECharts crosshair, aligned hover axes, market-style tooltip, current-price horizontal marker and cleaner structural pivots.
- **Unmodified mouse wheel zoom** and **mouse-button hold + drag pan**. Also accessible dedicated zoom, pan, fit and range-slider controls. Existing replay reveals one completed bar at a time; no future bars are provided to the chart.
- Indicator management starts **collapsed**, with the complete catalog one click away. The user's past feedback indicates that putting every study on every chart simultaneously creates a poor trading experience.

### Membership-differentiated experience (design, NOT entitlement grants)

The existing eight preview identities remain unchanged. Each now selects a unique default learning scenario, Studio preview and three interactive workspace modules:

| Preview identity | Proposed member experience | Studio preview |
|---|---|---|
| Free | Foundations Portal; chart-focused education and single-chart practice | Standard |
| Founding 14-Day | Starter Workshop; structured daily routines and guided review | Standard |
| Founding 30-Day | Analysis Desk; technical evidence and comparisons | Advanced |
| Founding 60-Day | Flagship; connected workspace, sophisticated analysis and approved Founders Commons concept | Professional |
| Full Platform Monthly | Unified research and study command center | Advanced |
| Full Platform Annual | Long-horizon Academy with progression planning | Advanced |
| Lifetime | Legacy Studio and long-term reference organization | Professional |
| OnDemand Monthly | Replay Arena with pause/decision/review emphasis | Advanced |

These are **product design scenarios**; sale status and actual subscription-to-feature mapping have not been verified against the authoritative live entitlement table. The preview can independently override Studio for design inspection without granting real access. Do not advertise a proposed ability as an implemented production entitlement.

Studio preview boundaries:
- Standard: foundational EMA, bar-volume and VWAP-proxy chart studies; all other calculated chart controls visibly distinguished and disabled.
- Advanced: the wider first-party calculated technical-studies set and analytical visualization.
- Professional: an additional **ECharts-connected synchronized second price chart** with the same revealed fictional candles, linked chart viewport, and professional analytics surfaces.
- Full 61-guide authorship remains browsable educational material. The preview's 15 numerically implemented studies are never misrepresented as 61 calculation-ready engines.
- The tutor's lesson quality, guided explanations, worked math and free retries are the same for all membership states whenever the lesson itself is authorized.

### Tutor instruction

- Full nine-stage learning sequence with the original beta teaching terminology: Start, Learn, Experiment, Predict, Practice, Assess, Review, Transfer, Results.
- Talia's I DO / WE DO / YOU DO demonstration sequence is located beside the price chart in Option A on desktop.
- Interactive chart evidence pause: choose whether the current completed candle supports certainty, observation, or an invalid inference; receive correction.
- Independent editable VWAP trade-size calculations and candlestick anatomy builder.
- Four Tutor actions offer different instructional material, not a cosmetic state change.
- Corrective feedback detects unweighted VWAP averages and confusion of candle body and range, then explains the specific wrong approach.
- The fresh ungraded transfer exercise does not display its answer before the learner attempts it.
- **No production member progress, protected answer keys or real beta Tutor lesson records are modified.** Completing the prototype does not itself make the new teaching available to beta members.

## Files and scope

`src/prototype/PrototypeExperiences.tsx`, `assets/css/prototype-experiences-v1.css`, `tests/prototype-experiences-v1-browser.test.mjs`, `tests/prototype-indicator-workbench-v2.test.mjs`, and this control record. The existing auth bootloader, deployed page paths and server authorization contracts remain unchanged.

## Acceptance criteria / remaining gates

1. Every selected design causes actual market-chart palette differences, not merely a top-banner change.
2. All eight membership selections change default workspace, modules and Studio tool presentation.
3. Standard chart study locks are demonstrable; Advanced can enable expanded studies; Professional displays two connected price charts.
4. Wheel zoom, button-held chart dragging and button-based panning visibly change the viewport without requesting a real order or violating no-lookahead replay.
5. Talia sits beside the chart on supported desktop viewports, offers complete guided explanation and corrected misconceptions, and the independent transfer task stays ungraded.
6. CI: JavaScript source checks, strict TypeScript build, canonical math and accessibility contracts, authenticated-role synthetic browser checks at desktop/tablet/mobile, new interaction tests, and Cloudflare production deployment for the same commit. Final acceptance is incomplete until these pass.
7. Independent Owner visual approval, real authenticated beta-tester educational comparison, screen-reader manual audit and live entitlement implementation require separate evidence.

**Competitive positioning:** Visual ambition may be compared to professional charting applications, but the claim "better than the top 30 competitors" has **not** been established by a documented independent usability, feature or performance study. Do not publish that claim.

## Operational and financial control

No GitHub feature branches; no SQL migration, Stripe product change, paid API, member permission change, true brokerage order, third-party licensed market feed, separate Lumens wallet or merchant transaction. All examples remain explicitly fictional. Roll back only the targeted V3 main-branch commits; keep previously approved training and Prototype Center assets intact.

## Revision history

| Version | Date | Authoring scope | Status |
|---|---|---|---|
| 1.0 | October 31, 2026 | Premium graphical redesign, eight membership experiences, Studio preview boundaries, mouse controls and Lab-style Tutor improvements | Implemented in source; independent release verification recorded in CI |
