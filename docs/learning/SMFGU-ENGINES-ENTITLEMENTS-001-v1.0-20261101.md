# SMFGU-ENGINES-ENTITLEMENTS-001 — Three Independent Learning Engines and Membership Targets

**Company / imprint:** Cyber Nexus Publishing / Crown & Lantern Press  
**Project:** The Stock Market: From the Ground Up  
**Google Drive location / document ID:** Unassigned; no Google Drive file created.  
**Controlling GitHub location:** `cybernexuspublishing/stock-market-from-the-ground-up`, branch `main`, `docs/learning/SMFGU-ENGINES-ENTITLEMENTS-001-v1.0-20261101.md`  
**Filename / type:** `SMFGU-ENGINES-ENTITLEMENTS-001-v1.0-20261101.md` / Markdown  
**Document ID:** SMFGU-ENGINES-ENTITLEMENTS-001  
**Version:** 1.0  
**Prepared / effective owner decision:** November 1, 2026  
**Status:** Owner tier targets recorded and read-only member/Owner visibility implemented; distinct premium runtimes, separately purchasable add-ons, pricing, grants, authenticated lifecycle and paid checkout are **NOT RELEASED**.  
**Purpose:** Correctly distinguish actual source engine version, approved membership edition target and *currently released* engine capability. Prevent any prototype selection from creating a paid or protected product entitlement.  
**Dependencies:** `AGENTS.md`; `functions/api/member-learning-engine-versions.js`; `functions/api/admin-learning-engine-versions.js`; `functions/_lib/learning-engine-tier-policy-v1.js`; `src/prototype/PrototypeExperiences.tsx`; existing Supabase member entitlements and Owner-only version assignment RPCs; current lab access and private grading contract.

## Frozen Owner membership edition mapping

| Membership plan | Shared Learning Engine | Shared Lab Engine | Talia Market Tutor | Source/version and activation rules |
|---|---|---|---|---|
| FREE | Basic, source v3.3 | Basic, source v3.2 | Foundation (Basic) | Basic included |
| FOUNDING_14 | Basic v3.3 | Basic v3.2 | Foundation (Basic) | Basic included |
| PICK_WHAT_YOU_WANT | Basic v3.3 | Basic v3.2 | Foundation (Basic) | Basic included; add-ons separate, not released |
| FOUNDING_30 | Advanced target (next best) | Advanced target (next best) | Advanced target | Tier TARGET; runtime not released |
| FOUNDING_60 | Professional target (best available) | Professional target | Professional target | Tier TARGET; runtime not released |
| FULL_MONTHLY | Professional target | Professional target | Professional target | Tier TARGET; runtime not released |
| LIFETIME | Enterprise target (best-of-best) | Enterprise target (best-of-best) | Enterprise target | Highest-tier TARGET; runtime not released |
| ONDEMAND_MONTHLY | Product-dependent | Product-dependent | Product-dependent | Specific valid product entitlement required; never infer from membership name |
| FULL_ANNUAL and legacy founding annual/monthly | Unassigned | Unassigned | Unassigned | Owner has not resolved separately; **no implicit premium assignment** |

**Terminology:** “v3.3,” “v3.2” and “v0.14.0.149” in the current site are deployed **source version names**, not proof of three or four separately validated commercial engine product editions. The member API continues to report selected source assets separately.

## Current implementation and product readiness

1. **Pure, shared policy contract:** `functions/_lib/learning-engine-tier-policy-v1.js` resolves all eight explicitly authorized membership maps and leaves legacy annual plans unassigned. It never authorizes a purchase, grade, market data source, pricing, private Tutor action, subscription or external AI call.
2. **Authenticated member information:** `GET /api/member-learning-engine-versions` includes `engineTierPolicy` alongside `versions` and `tutorEdition`. Three independently upgradeable families are visible; `premiumFeaturesReleased:false` and `addOnCheckoutEnabled:false`. Current effective capability remains Basic/Foundation until each independently authorized capability passes its actual release gates. This API does not substitute for a specific member's product entitlement.
3. **Owner Control Center:** `GET /api/admin-learning-engine-versions` presents target Learning/Lab/Talia policy and existing persisted source/tutor assignments separately, with mismatch warnings. Owner-only POST version assignment remains unchanged and audited; no non-owner receives write controls.
4. **React staff prototype:** Lifetime preview now correctly reflects *Enterprise* as the target for ALL three engines. Prototype selection is local/synthetic and must never issue a payment or entitlement change.
5. **Verification:** `tests/learning-engine-tier-policy-v1.test.mjs` checks the eight controlled mappings, three independent add-on families, guaranteed full-quality Basic explanation/correction/retries, restricted OnDemand, unresolved legacy plans, API/UI source contract and no premium grant. The existing Learning Engine Membership Versions workflow executes this test with all prior contract suites.
6. **Not implemented:** Advanced/Professional/Enterprise source-engine forked runtimes and actual feature differentiation; independently sellable add-on SKUs; price and charging agreements; server-owned add-on lifecycle; suspension/expiry/revocation; cross-account member acceptance; app-wide comparative classroom acceptance.

## Non-negotiable teaching rules

- If a Lab or Boot Camp is **entitled**, Basic must still teach from first principles with worked units, intermediate calculations, mistakes, free Explain This Concept, Teach This in More Depth, guided retries, no-trade decisions, independent transfer and proper source/limit disclosure. Do not monetize explanations or disable assessment integrity for a lower plan.
- Higher editions may add validated analytical depth, custom workspaces, advanced visualization via **Apache ECharts**, personalization, multi-chart workflows, research breadth and advanced instructor interaction. They cannot promise verified historical prices, live execution, or private answer exposure absent independent evidence.
- Select technology by function: HTML5/CSS3/accessible JavaScript for regular site controls; existing React/TypeScript plus ECharts for sophisticated teaching/chart experiences; Cloudflare Functions + Supabase/Postgres for authenticated version and entitlement enforcement; Python only when useful for deterministic data science, research and offline numerical reference. Do not introduce paid services.

## Next ten acceptance gates, in execution order

| Gate | Acceptance criterion | Current state |
|---|---|---|
| E01 | Eight approved plan mappings including real server readback; legacy plans unassigned | Source contract and production plan read-only review |
| E02 | Basic independently validated for v3.3 Learning, v3.2 Lab, Foundation Talia | Existing source deployed; editorial improvements open |
| E03 | Owner actual authenticated plan-matrix read and audit/no-write evidence | Real Owner browser acceptance open |
| E04 | Three distinct Advanced/Professional/Enterprise feature specifications and source assets | NOT IMPLEMENTED |
| E05 | Independently priced Learning Engine add-on with server-verified entitlement | BLOCKED: no Owner-approved price or launch approval |
| E06 | Independently priced Lab Engine add-on with server-verified entitlement | BLOCKED: no Owner-approved price or launch approval |
| E07 | Independently priced Talia add-on with validated service and feature enforcement | BLOCKED: no Owner-approved price, service release or launch approval |
| E08 | Paid onboarding, cancel, expiry, recovery, cross-account denial and lifecycle | NOT IMPLEMENTED |
| E09 | Actual member access, keyboard/screen-reader and current membership-source parity | PARTIAL; genuine two-account and assistive-tech review open |
| E10 | Identical exact-commit CI/Cloudflare, consolidated Owner acceptance, release/rollback log | OPEN; source/CI snapshot alone does not approve live sale |

## Owner signoff boundaries and rollback

Owner-delegated product policy mapping and no-charge source implementation may be accepted on successful CI. **No live add-on sale, price change, purchase, AI charge, entitlement migration or regulatory compliance sign-off** follows automatically. Unknown annual-plan tier choices must be explicitly reconciled before deployment of premium engine access. Revert only the policy, API presentation and staff preview source commits on `main` if acceptance fails; no database migration or commercial rollback is needed for this batch.

## Revision history

| Version | Date | Change | Disposition |
|---|---|---|---|
| 1.0 | November 1, 2026 | Recorded current controlling three-engine tier targets; implemented source/UI target disclosure and independent tier contract | Source and CI gated, premium sale HOLD |

**Footer:** SMFGU-ENGINES-ENTITLEMENTS-001 · v1.0 · Owner policy targets distinct from capabilities · No live sales / prices / protected member grants.
