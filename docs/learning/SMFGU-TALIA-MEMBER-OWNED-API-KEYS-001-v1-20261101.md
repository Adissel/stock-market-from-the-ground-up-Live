# Talia Market Tutor — Interim Member-Owned Third-Party API Credential Policy

| Document control | Value |
|---|---|
| Company / imprint | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | THE STOCK MARKET: FROM THE GROUND UP / Talia Market Tutor Engine only |
| Document ID | SMFGU-TALIA-BYOK-001 |
| Filename / type | `docs/learning/SMFGU-TALIA-MEMBER-OWNED-API-KEYS-001-v1-20261101.md` / Markdown |
| Google Drive location / document ID | Not created / unassigned; GitHub `main` is controlling |
| Version / date | 1.0 / 2026-11-01 |
| Status | Owner-directed policy recorded; optional Tutor BYOK implementation and provider-specific acceptance NOT released |
| Dependencies | `SMFGU-TALIA-FOUR-EDITION-MATRIX-001`; `SMFGU-TALIA-EDITION-001`; `functions/_lib/tutor-provider-v014107.js`; `functions/api/market-tutor-v01492.js`; member auth and privacy controls; provider-specific terms |
| Purpose | Define the zero-platform-provider-cost interim model for optional third-party Tutor API access without undermining first-party Foundation teaching, member privacy, or provider agreements |

## Owner decision — controlling interim approach

Until the organization can separately fund and contract for a platform-wide third-party service, an individual member who wants **optional** third-party Tutor functionality must obtain and fund any required personal API credentials through that third-party provider. No member credential may be treated as a shared site license or used to pay for requests by other members.

This is a **target product policy**, not evidence that every outside provider permits member-supplied API use within a commercial teaching website. Availability must be determined independently, provider by provider, from current terms, intended endpoint and account tier. Do not promise that every provider has a free key or that personal subscription access grants API access.

## Core Tutor service remains first-party and usable without any external key

- Original source-grounded explanation, deeper teaching, guided fictional examples, ordinary retries, ungraded corrections and published Foundation competence teaching remain available on the applicable authenticated membership **without requiring a third-party API key**.
- Member-owned keys are for additional provider-dependent inference, research or data features only; they do not bypass server-side Tutor edition/lesson entitlements.
- Do not require members to purchase a provider subscription to obtain ordinary Basic instructional explanations, and do not suggest that supplying a key unlocks unreleased Advanced, Professional or Enterprise capabilities.
- Existing paid inference remains OFF by default until provider-specific BYOK implementation, authorized opt-in, rate/cost limits, and acceptance pass. Do not enable `AI_SERVICE_ENABLED` or flip existing paid provider flags merely because this policy exists.

## Security and credential lifecycle requirements

1. Member signs in; a provider-specific integration screen explains which provider receives their prompts/data, expected provider billing, account requirements, and privacy implications. Consent is explicit and revocable.
2. Require provider-documented permission for this specific personal-key / third-party hosted-service workflow. When prohibited or unclear, disable that provider option until resolved; do not present personal-use keys as permission for commercial redistribution, resale or shared platform processing.
3. Members enter credentials only through a dedicated secure credential form, **never a Tutor chat prompt**, public URL, issue, email, JavaScript source file, localStorage, analytics event or ordinary logging channel.
4. Prefer a provider's delegated authorization/token-scoping flow. If a personal secret must be stored, encrypt server-side at rest using a separately controlled key; restrict decryption to a credential-owning member's verified server request; avoid browser exposure after submission; support rotation and deletion.
5. All provider calls are server-proxied where required, bound to the authenticated member and approved fixed provider endpoints and model allowlists; protect against cross-account use, SSRF, model substitution, prompt/response leaks, key logging and request replay.
6. Show member-specific usage/cost warnings; enforce bounded requests and quotas even if the provider bills the member. Never silently use the owner's provider account or a different member's key as fallback.
7. Deleting/disconnecting a key stops future requests and removes the stored credential; make clear that provider-side retained records and billing are governed by the provider's account settings.
8. Do not cache, publicly redistribute, resell or pool third-party restricted market data or copyrighted source content merely because a member provided an access credential.

## Current-code reconciliation as of 2026-11-01

- The existing `tutor-provider-v014107.js` obtains an OpenAI key from the site environment `AI_TUTOR_API_KEY` when owner-approved; it does **not** implement a per-member Tutor AI-key retrieval/rotation pathway.
- `market-tutor-v01492.js` enforces member access, confirmed saved AI opt-in, source grounding and quotas for optional inference. These existing controls must be preserved, not bypassed.
- Cloudflare Tutor AI flags were documented OFF on 2026-11-01. This policy makes **no runtime change**, requests **no provider payment**, and grants **no new member access**.
- Other subsystems' member-owned data credentials, e.g. personal Tiingo/Alpaca integrations, are informative patterns only. They do not demonstrate a completed Tutor BYOK integration or general provider permission.

## Implementation and acceptance order — Tutor only

1. Enumerate optional Tutor external providers/features and classify each as **BYOK permitted**, **BYOK prohibited**, or **verification pending**, with versioned endpoint, terms, cost and data-handling evidence.
2. Reuse existing authenticated credential-protection architecture only after independent security review; add separate Tutor-scoped credential ownership, encryption, consent, revocation and account-deletion coverage if the current schema is insufficient.
3. Add a protected member provider connection screen with **Connect / Test / Disconnect** controls and clear provider-cost notices. Do not ask for credentials in conversations.
4. Introduce a separately opt-in, server-controlled per-member provider routing path with fixed provider/model allowlists, no owner-paid fallback, safe outputs and denial on missing/invalid credentials. Preserve first-party source-only teaching.
5. Test genuine signed-in member/provider consent, cross-account isolation, cancellation, provider refusal, quota/cost controls, secret redaction, multi-turn safety and downgrade.
6. Require same-main-SHA GitHub CI, matching Cloudflare deployment, production security checks and the affected provider's applicable terms review before release.
7. A future organization-paid contract is a **separate owner-authorized transition**: negotiate terms, secure centrally funded secrets, set provider budgets and disclosures, and independently test billing/entitlement changes. Never assume the organization obtains a license automatically by funding API calls.

## Scope and authority

Owner-directed implementation policy; not legal counsel's license opinion or a claim of vendor endorsement. No developer may enable paid inference, make a charge, weaken original Tutor access, or change another engine's scope on the strength of this document alone.

## Revision history

| Version | Date | Change | Approval/status |
|---|---|---|---|
| 1.0 | 2026-11-01 | Recorded member-purchased personal-provider API-key interim direction, no-shared-key model, security/terms gates, and site-funded future migration | Owner direction captured; implementation and release pending |

**Footer:** SMFGU-TALIA-BYOK-001 · v1.0 · GitHub `main` controlling · Tutor-only policy · No paid provider authorization · No blanket BYOK provider acceptance.
