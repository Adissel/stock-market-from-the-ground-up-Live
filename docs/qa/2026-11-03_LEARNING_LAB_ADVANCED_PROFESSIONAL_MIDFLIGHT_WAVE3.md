# Learning/Lab Advanced and Professional — Midflight Authorization Wave 3

| Document Control | Value |
|---|---|
| Document ID | SMFGU-LELAB-AP-AUTH-20261103-W3 |
| Project | THE STOCK MARKET: FROM THE GROUND UP / Crownlight |
| Google Drive location | Not created; authoritative file is in GitHub |
| Filename | docs/qa/2026-11-03_LEARNING_LAB_ADVANCED_PROFESSIONAL_MIDFLIGHT_WAVE3.md |
| File type | Markdown |
| Version | 3.0 |
| Effective date | November 3, 2026 |
| Status | Source QA and CI acceptance pending; independent member release on HOLD |
| Dependencies | Learning v3.3 Basic; Lab v3.2 Basic; 419 Labs; 30 competencies; server-owned grants; Cloudflare Pages; Supabase RLS |
| Purpose | Deny premium workspace saves when authorization or identity changes during server computation |

## Implemented safeguard

The optional premium workspace endpoint now checks server-owned authorization a second time after computing an ungraded exercise, and immediately before writing the result. A change of verified member ID, family or edition is rejected. A revoked, expired, downgraded, restricted or denied grant is also refused by the existing entitlement checks on reauthorization.

This is defense in depth. It reduces the interval between authorization and write but is not an atomic database authorization-and-write transaction. The private table RLS, service access controls, and independent account tests remain necessary.

## Automated QA inventory

Four matrix targets, each with 24 named scenarios: Advanced Learning, Advanced Lab, Professional Learning, Professional Lab. Total: 96 stateful handler-level scenarios and an additional test asserting the matrix denominator and uniqueness.

Coverage includes save, restore, Basic restriction, second account isolation, CAS revision conflict, concurrent revision protection, downgrade, revocation, fake answer key stripping, fictional-only data, nine authorization/configuration changes occurring during exercise computation, canonical registry checks, no-lookahead evidence, cross-origin rejection and regrant continuity.

All 96 cases use simulated session tokens and an in-memory fake PostgREST transport with the actual repository API handlers. They are not genuine signed-in website journeys. Passing these cases must not set the real-member acceptance or independent release acceptance ledger flags.

## Prior live database evidence

The connected Supabase database previously showed one James_Test member profile with an active Founding 60-Day plan and explicit unexpired Professional Learning and Professional Lab grant metadata. Two read-only transactions under separate simulated authenticated-role claims yielded eight and three visible own plan-grant rows respectively, and zero cross-member plan grants. These probes do not constitute live browser acceptance.

No Supabase membership, table, policy, payment, official grade, user data or production entitlement is changed in this code batch.

## Outstanding acceptance

1. Complete exact-head CI and Cloudflare preview, then merge only if all applicable checks pass.
2. Verify exact merged main SHA and successful production deployment.
3. Run genuine authenticated James_Test and second QA identity browser journeys.
4. Verify real downgrade, renewal, expiration, revocation, account switching and regrant behavior.
5. Complete keyboard, screen-reader, mobile, source-rights, editorial and protected-assessment acceptance.
6. Change individual ledger statuses only when supporting evidence exists. Keep all premium release flags disabled pending independent approval.

## Revision History

| Version | Date | Change | Status |
|---|---|---|---|
| 3.0 | 2026-11-03 | Midflight authorization recheck, 96-case contract suite, CI and verification record | Source QA only |

Footer: SMFGU-LELAB-AP-AUTH-20261103-W3 — source regression evidence, not member release approval.
