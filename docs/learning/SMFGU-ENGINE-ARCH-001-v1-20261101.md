# SMFGU-ENGINE-ARCH-001 — Three-Engine Classroom Runtime Contract

**Company:** Cyber Nexus / Crown & Lantern Press  
**Project:** The Stock Market: From the Ground Up  
**File/type:** `docs/learning/SMFGU-ENGINE-ARCH-001-v1-20261101.md` / Markdown  
**Document ID:** SMFGU-ENGINE-ARCH-001  
**Version:** 1.0 | **Date:** November 1, 2026  
**Status:** Shared read-only classroom contract implemented in source; full premium engines NOT released; production and real-member acceptance depend on exact-main CI and authentication  
**Google Drive folder:** Not created; GitHub main controlling  
**Google Drive document ID:** Unassigned  
**Purpose:** Protect Basic while the three existing shared engines develop independently into higher-capability editions, without duplicating access, grading, payment or progress systems.

## Controlling architecture
- Preserve **Shared Learning v3.3 Basic**, **Shared Lab v3.2 Basic**, **Talia Market Tutor v0.14.0.149 Basic** as frozen operational baselines.
- Separate (1) membership policy *target*, (2) source *presentation version*, (3) actually *released edition*, and (4) *authorized lesson/tool entitlement*. No value in one dimension grants another.
- `functions/_lib/engine-classroom-contract-v1.js` is the single source of the read-only classroom capability envelope. It consumes the existing `enginePolicyForPlan` rather than adding an entitlement lookup or ledger. Member API attaches `classroom` to its current response; no new endpoint or database table.
- Until premium editions are separately built and accepted, every engine reports operational **Basic**; a 419-Lab member is not restricted to the first 20 editorial-upgraded Labs. Available lessons remain governed by the existing entitlement service.
- Content quality: equal first-principles explanations, normal retries and worked arithmetic for every accessible lesson. Premium upgrades may add adaptive orchestration, visualization, comparisons, diagnostics and advanced tools, not exclusive essential explanations.
- No future historical bars before a decision; distinguish fictional, sourced historical, user-provided and trade-print feeds. Chart Study descriptions and mathematical limitations remain traceable.
- Existing member learning progress, protected answer keys, RLS, Chart Studio rights, Tutor paid inference opt-in/quota and Stripe billing are unchanged.

## Technology placement
- **React 19 + TypeScript:** complex member and prototype workspaces, deterministic state, component boundaries, ECharts lifecycle and accessible interaction.
- **Apache ECharts 6.1.0:** same-origin, locally hosted 2D candlesticks, volume, indicators, linked data-zoom, comparisons and analytics. No suggestion that all 61 researched indicator guides are operational computed studies.
- **JavaScript / Cloudflare Pages Functions:** authenticated APIs, dispatchers, existing edge runtime; Supabase maintains authorized progress, roles and access. Do not introduce Python into the Cloudflare JavaScript worker execution path.
- **HTML5 and CSS3:** semantic controls, accessible form/keyboard use, layouts, sizing, alignment, colors and responsive visual design; retain Owner-arrangeable prototype surfaces.
- **Python:** offline data preparation, reproducible quantitative calculations and editorial provenance checks only when free execution and source rights are verified. Python is not prerequisite to browser visuals.
- **3D / AI:** evaluate per feature for compatibility, license, accessible alternatives, performance and actual zero-cost limits; no provider inference or 3D engine is implicitly enabled by a presentation tier.

## Implementation gates (three engines before curriculum-scale authoring)
1. **Basic preservation:** source snapshot + protected grading, progress, entitlements, source-only Tutor, no pay-per-explanation.
2. **One cross-engine classroom envelope:** target versus effective Basic, source version, accessible-lesson boundaries, provenance. *Source implemented in this change; real member browser verification pending.*
3. **Learning Engine:** staged prerequisite diagnostics and adaptive examples with independent correction; no fake mastery.
4. **Lab Engine:** true completed-bar evidence, ECharts comparison, interactive mathematics, replay with no lookahead and protected independent assessment.
5. **Talia:** learning-context and chart-linked teaching with bounded, source-grounded responses; consent, zero-pay default, and usage limits.
6. **Three-engine integration:** account switch, downgrade and saved-progress isolation; Basic member never loses entitled explanations.
7. **Representative test set:** initial 20 revised Lab bridges, five Free Foundations days, selected Boot Camp days and all 61 indicator source briefs; not a claim that remaining 399 are editorially accepted.
8. **Member permissions:** per-plan and individual add-on access determined only from existing protected entitlements; release flags cannot be bypassed via client values.
9. **CI and deployment:** exact `main` SHA for source, sitewide Playwright, Node contracts, Cloudflare; maintain no-charge tests.
10. **Independent premium release:** Owner-authorized rollout only after genuine browser, accessibility, quantitative, source, security and commercial safeguards.

## Revision history
| Version | Date | Change |
| --- | --- | --- |
| 1.0 | 2026-11-01 | Engine-first decision established; cross-engine Basic-only runtime envelope, safety contracts, member status label and synthetic source tests. |

**Dependencies:** `AGENTS.md`, `PROJECT_SITEWIDE_RULES.md`, `docs/learning/SMFGU-TALIA-EDITION-001-v1-20261101.md`, `functions/_lib/learning-engine-tier-policy-v1.js`, `functions/api/member-learning-engine-versions.js`, existing private Supabase grading/entitlement services.

**Footer:** SMFGU-ENGINE-ARCH-001 · v1.0 · Source implementation ≠ premium release · No paid services or new member-data writes
