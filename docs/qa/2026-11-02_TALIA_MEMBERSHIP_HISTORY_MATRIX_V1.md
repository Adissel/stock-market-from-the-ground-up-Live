# Talia Membership and Private-History Matrix v1

Date: 2026-11-02

Scope: Talia execution Gates 3 and 4

Evidence type: source and server-handler integration test

## Result

The real Tutor and member-access handlers now have mandatory automated coverage for `FREE`, `FOUNDING_14`, `FOUNDING_30`, `FOUNDING_60`, and `OWNER` identities. The test sends synthetic authenticated requests through the production handler code and asserts the authoritative server RPC controls premium authorization.

The matrix verifies:

- Free and Founding 14 members remain eligible for Foundation source teaching without being represented as premium-authorized.
- Founding 30, Founding 60, and Owner permissions are accepted only when the authoritative `user_has_tool_access` RPC returns true.
- An expired Founding 60 permission loses premium authorization while preserving Free source teaching and the member's own legitimate history.
- Each membership can restore only its own server-verified conversation context.
- Client-supplied `priorTurns` are ignored and cannot forge teaching memory.
- Cross-account conversation identifiers return a denial without disclosing history.
- Restricted and Showcase accounts fail closed.
- The matrix never invokes an external model provider.

## Acceptance boundary

This evidence completes the source/server integration matrix. It uses synthetic authenticated identities and mocked Supabase responses; it is not evidence that all five memberships have completed real authenticated browser sessions in production. Production account, session-expiry, downgrade, mobile, keyboard, assistive-technology, and deployed-SHA acceptance remain separate gates and must be recorded only when authorized real sessions are available.

No premium capability, membership benefit, or independent acceptance is inferred from these tests.

## Reproduction

```text
node --test tests/talia-membership-history-matrix-v1.test.mjs
```
