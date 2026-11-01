# Talia Market Tutor — Membership-Only Access and No Member API Keys

| Document control | Value |
|---|---|
| Organization | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | THE STOCK MARKET: FROM THE GROUND UP — Talia Market Tutor Engine only |
| Document ID | SMFGU-TALIA-MEMBER-ACCESS-001 |
| Filename / type | `SMFGU-TALIA-MEMBERSHIP-ACCESS-001-v1-20261101.md` / Markdown |
| Controlling GitHub location | `docs/learning/SMFGU-TALIA-MEMBERSHIP-ACCESS-001-v1-20261101.md` on `main` |
| Google Drive location / document ID | No Google Drive file created; unassigned |
| Version / date | v1.0 / November 1, 2026 |
| Status | Owner-directed Tutor scope approved; implementation committed, production end-to-end member acceptance pending |
| Dependencies | `functions/api/member-tool-access.js`, `functions/api/market-tutor-v01492.js`, `assets/js/member-tutor-version-loader-v1.js`, `assets/js/market-tutor.js`, `src/tutor/TaliaClassroom.tsx`, `tests/talia-membership-only-v1.test.mjs` |
| Purpose | Make Talia a first-party member-only educational application. Do not require or accept personal third-party API keys for Tutor access. |

## Controlling owner decision

1. **Talia Market Tutor is exclusively for eligible, signed-in website members.** No anonymous interactive teaching, conversation, training chart or private Tutor history. The page itself may contain ordinary public-facing marketing copy or a sign-in invitation, but no working Tutor experience for nonmembers.
2. **No member-supplied Tutor API keys.** Members do not register with a third-party AI provider, purchase model credits, connect an AI key or pay an outside provider to use their entitled Tutor instruction.
3. **Existing membership is sufficient for Basic instruction**, including eligible Free members under current owner-approved limits. Advanced, Professional and Enterprise features remain subject to the existing membership/upgrade entitlement system and separate release acceptance.
4. **Retain existing first-party source-grounded instruction.** Talia already supports original explanations, worked examples, guided review, corrections, private conversations and fictional diagrams/charts. Do not characterize the source-only teacher as external generative model inference.
5. **Optional future generative AI is a website infrastructure choice, not a member credential requirement.** Authentication does not itself run a language model. If owner-approved, use a reviewed site-controlled provider configuration or Cloudflare Workers AI binding with explicit budget, privacy, model and member authorization gates. Keep paid inference OFF unless independently approved and tested.
6. **The established BYO Tiingo and Alpaca market-data integrations remain untouched.** They are separate from the Tutor Engine. This decision does not ban third-party data connections elsewhere on the website.

## Access and security acceptance

- The existing Cloudflare `/api/market-tutor` verifies GoTrue identity and `MARKET_TUTOR` access server-side. `toolAccess` only allows private instruction for an eligible `account_kind=member` identity, refuses deleted, suspended, restricted and showcase accounts; eligible Free members receive Basic instruction independent of paid model inference.
- `market-tutor.html` is declared `data-auth-required=true`; the Tutor version loader verifies a token and `/api/member-tool-access?tool=MARKET_TUTOR` eligibility **before loading either the frozen or current teaching script**. This prevents the formerly public local-glossary fallback from running through the official Tutor interface.
- `assets/js/market-tutor.js` directly rejects anonymous question submission and always invokes the authenticated Tutor API, rather than an unauthenticated local glossary engine.
- The React classroom also verifies `/api/member-tool-access?tool=MARKET_TUTOR` before showing chat, fictional charts and exercises; signing out clears private state and user-specific pending work.
- Member Tutor private history, Talia source retrieval and optional model inference retain the existing server boundaries. No user-provided provider model identifier, private API key or direct browser-to-provider call is accepted.

## Implementation and verification status

- GitHub `main`: member-specific Tutor BYOK route, provider credential handler, settings UI and tests were reverted/deleted; existing Tiingo/Alpaca BYO remain. A previous optional personal-key policy (`SMFGU-TALIA-BYOK-001`) is retired and must not be implemented.
- `tests/talia-membership-only-v1.test.mjs` covers unauthenticated denial, ineligible/restricted/showcase denial, loader/client gates, retired Tutor personal-key routes and preservation of Tiingo/Alpaca.
- Run full Tutor CI and confirm the exact committed SHA deploys in Cloudflare; independently test a real Free member, paid entitled member, unauthorized account, account switch, mobile keyboard support and sign-out privacy before calling the feature production accepted.
- Do not enable site-paid model inference, install paid provider secrets, make payment requests or approve any billable provider tests as part of this change.

## What is next — execution order

1. Complete GitHub Actions and Cloudflare Pages exact-commit checks after the membership-only cleanup.
2. Verify real eligible Free and premium member browser access to both classic Tutor and React classroom.
3. Verify real nonmember, deleted/restricted/showcase account rejection, sign-out handling and private history isolation.
4. Continue Talia curricular and editorial improvements (600 original explanations, 73 indicator guides, contextual instruction); do not block original teaching on hypothetical commercial data licenses.
5. Evaluate possible site-controlled, bounded optional conversational inference separately without asking members for API keys or committing to provider expense.

## Revision history

| Version | Date | Change | Owner status |
|---|---|---|---|
| v1.0 | 2026-11-01 | Superseded optional member-Tutor BYOK direction, confirmed members-only Tutor access and keyless first-party instructional baseline | Approved direction; release QA pending |

**Footer:** SMFGU-TALIA-MEMBER-ACCESS-001 · v1.0 · November 1, 2026 · Tutor Engine only · GitHub `main` controlling · Owner member-only policy · No member Tutor API keys.
