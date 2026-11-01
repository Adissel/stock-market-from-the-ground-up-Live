# Talia Market Tutor — Interim Member-Owned Third-Party API Credential Policy

| Document control | Value |
|---|---|
| Company / imprint | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | THE STOCK MARKET: FROM THE GROUND UP / Talia Market Tutor Engine only |
| Document ID | SMFGU-TALIA-BYOK-001 |
| Filename / type | `docs/learning/SMFGU-TALIA-MEMBER-OWNED-API-KEYS-001-v1-20261101.md` / Markdown |
| Google Drive location / document ID | Not created / unassigned; GitHub `main` is controlling |
| Version / date | 1.1 / 2026-11-01 |
| Status | Owner policy reconciled with already implemented BYO credential infrastructure; only the optional Tutor provider adapter and acceptance remain open |
| Dependencies | `SMFGU-TALIA-FOUR-EDITION-MATRIX-001`; `SMFGU-TALIA-EDITION-001`; `functions/_lib/tutor-provider-v014107.js`; `functions/api/market-tutor-v01492.js`; member auth and privacy controls; provider-specific terms |
| Purpose | Extend the **existing** member BYO credential architecture to optional third-party Tutor API access; no duplicated general vault or account-connection page |

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

## Verified existing BYO architecture — REUSE, do not rebuild

GitHub `main` already contains an operational source architecture for personally supplied API keys. The Tutor Engine is one additional consumer of this infrastructure, not a greenfield BYO project.

| Existing source | Already provided | Tutor-specific treatment |
|---|---|---|
| `functions/api/credentials.js` | Verified member-only list/save/delete and provider validation; explicit `TIINGO_BYO` and `ALPACA_BYO` allowlist | Extend safely for an approved Tutor provider; do not duplicate a credential-management API |
| `user_secure_credentials`, `user_market_data_connections` | Member-owned encrypted records, connection metadata and server-side account scoping | Reuse existing vault and provider-scoping conventions, subject to production schema and access verification |
| `MARKET_DATA_ENCRYPTION_KEY`, AES-GCM routines | Existing encrypted-at-rest credential mechanism | Reuse reviewed cryptographic patterns, but evaluate Tutor-specific cryptographic domain separation; never put secrets in Tutor chat |
| `data-connections.html`, existing Dashboard connections | Existing BYO connection-management interface | Add Tutor-specific connection settings to this existing experience, rather than create a competing general-purpose page |
| `functions/api/marketdata.js` | Authorized fixed-provider data requests for Tiingo/Alpaca | Do not send Tutor model inference through the market-data endpoint; reuse its auth and allowlist patterns only |
| `functions/_lib/tutor-provider-v014107.js` | Current optional AI routing uses site-controlled `AI_TUTOR_API_KEY` or a Workers AI binding under separate cost flags | New per-member Tutor credential resolution/routing still required |
| `functions/api/market-tutor-v01492.js` | Authenticated source-only Tutor, saved model opt-in, source validation and usage gates | Preserve current privacy, opt-in, rate, answer-validation and no-cost fallback |

**Precise boundary:** The existing BYO infrastructure is already implemented for its supported market-data providers. It is not yet an accepted member-key AI provider path for Talia. Source presence does not prove production deployment or third-party permission for every prospective Tutor provider.

## Next execution — Tutor-specific extension of existing architecture

1. Validate the existing live BYO connection-management implementation, relevant credential fields, encryption domain, server-side ownership and account-deletion behavior; preserve existing Tiingo and Alpaca contracts.
2. Identify an optional Tutor inference provider that explicitly permits individually owned credentials for this hosted member workflow; validate provider limits, billing and privacy notices.
3. Extend the existing credentials API and connection UI with an allowlisted Tutor provider, reusing authentication, credential encryption, masked status, test/verify, rotation and disconnect flows. Add only schema or cryptographic separation demonstrably needed for this service.
4. Extend the existing Tutor server provider router to resolve the authenticated member's own credential, never another member's or the website's funded secret; enforce affirmative opt-in, quotas, cost warnings, grounded output and fail-closed behavior.
5. Run cross-account, role, secret-redaction, invalid-key, disconnect, regression and no-key source-only Tutor tests, followed by exact-SHA GitHub Actions and matching Cloudflare deploy acceptance. Do not activate paid inference by changing global site flags.

**Anti-duplication instruction:** No second member key vault, no replacement BYO architecture, no duplicate generic connection page and no separate ownership store unless an existing security constraint requires a narrow documented extension.

## Scope and authority

Owner-directed implementation policy; not legal counsel's license opinion or a claim of vendor endorsement. No developer may enable paid inference, make a charge, weaken original Tutor access, or change another engine's scope on the strength of this document alone.

## Revision history

| Version | Date | Change | Approval/status |
|---|---|---|---|
| 1.0 | 2026-11-01 | Recorded interim member-owned API credential policy and cost boundaries | Owner direction captured; Tutor-specific implementation pending |
| 1.1 | 2026-11-01 | Reconciled existing BYO vault, credentials route, UI and Tiingo/Alpaca adapters; prohibited duplicate BYO architecture | Existing source verified; Tutor adapter release pending |

**Footer:** SMFGU-TALIA-BYOK-001 · v1.1 · GitHub `main` controlling · Tutor-only policy · No paid provider authorization · No blanket BYOK provider acceptance.
