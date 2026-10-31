# Crownlight Chart Studio — Real Cross-Account and Professional QA Acceptance

**Document ID:** SMFGU-QA-CHART-ISOLATION-20261031-002  
**Project:** The Stock Market: From the Ground Up — Crownlight Chart Studio  
**Filename:** `docs/qa/2026-10-31_CHART_REAL_CROSS_ACCOUNT_PROFESSIONAL_ACCEPTANCE_v1.md`  
**File type:** Markdown (.md)  
**Version:** 1.0  
**Status:** ACCEPTED — separate noncommercial authenticated production API subgates; human/browser and paid-plan proof explicitly outside scope  
**Execution date:** October 31, 2026 (America/Chicago; workflow records UTC)  
**Repository / branch:** `cybernexuspublishing/stock-market-from-the-ground-up` / `main`  
**Google Drive location and document ID:** Not assigned; new authoritative repository-controlled QA record.  
**Purpose:** Verify two distinct legitimate QA member Auth sessions, Standard versus Professional authorization and account-bound workspace privacy without a charge or a permanent privileged test endpoint.  
**Dependencies:** GitHub Actions, GitHub OIDC, Supabase Auth Admin/GoTrue, Cloudflare production Chart Studio endpoints, existing verified Advanced James_Test acceptance, private workspace save RPC.

## Controlling results

- **Real production acceptance:** [Actions 41233580742](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41233580742), tested commit `df58283b918c813c8708400d63bcae3d2c9fad89`. Job **completed successfully**.
- The QA-only endpoint verified GitHub's RS256-signed OIDC token against exact repository, `main` branch, workflow, audience, issuer and token validity.
- Supabase Auth Admin provisioned two separate **disposable, noncommercial** members with unique project-controlled aliases and short-lived random passwords, never committed or printed. Both signed in through GoTrue password grants and had distinct identities.
- The server independently authorized **Standard** and **Professional** Chart Studios; Professional resulted solely from a scoped, temporary QA grant, not a Founder sale or paid plan.
- Each member made an authenticated revision-controlled workspace save and independently read back its own settings; attempts to select the other account's private record were ignored in both directions. Guest access and direct client table reads were denied.
- The procedure automatically deleted both QA identities and their test workspaces/grant. Returned acceptance fields included `ok:true`, `cleaned:true`, `actualGoTrueMembers:2`, `qaWorkspacesSaved:2`, `crossAccountSelectorDenied:true`, `directDatabaseDenied:true`, `commercialCharges:0`, and `lumenChanges:0`.

## Independent cleanup and security postflight

A subsequent Supabase SQL read returned:
- **0** remaining QA grants with reason `OIDC-bound disposable noncommercial three-tier acceptance`.
- **0** matching temporary `ChartMatrix%` profile rows.
- **1** total private workspace, the original previously saved member document.

The one-time Supabase Edge function `smfgu-chart-matrix-github-oidc-v1` was retired to an unconditional **HTTP 410** response, with `verify_jwt=true`, deployed version **6**. Its deployed source matches the current deny-all GitHub file at `supabase/functions/smfgu-chart-matrix-github-oidc-v1/index.ts`, committed `363545a1573efdae46020560f0a09824fc2e9410`. Its GitHub Actions push trigger was retired; no standing Auth Admin test interface remains.

## Acceptance classifications and exclusions

| Acceptance gate | Result | Evidence type |
| --- | --- | --- |
| Two genuinely authenticated production QA member accounts | **PASS** | Real Supabase GoTrue password authentication; independent identities |
| Standard versus independently granted Professional | **PASS** | Real production entitlement API; noncommercial, short-lived QA entitlement |
| Cross-account private workspace isolation | **PASS** | Authenticated member saves, both-direction forged selectors, direct database denial |
| Existing James_Test Advanced browser and workspace | **Previously PASS** | [Actions 41230791651](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41230791651) |
| Full Standard/Advanced/Professional UI behavior | **Fixture regression PASS; real Standard and Professional Chromium still OPEN** | [Actions 41232073311](https://github.com/cybernexuspublishing/stock-market-from-the-ground-up/actions/runs/41232073311) |
| Human-operated CAPTCHA sign-in | **OPEN** | Direct OAuth/password session testing does not exercise the CAPTCHA form |
| Actual purchased and active Professional subscription | **OPEN** | QA entitlement explicitly cannot be represented as a paid customer |
| Long-lived separate QA accounts with stored encrypted GitHub Secrets | **OPEN** | Prior QA-secret run 41232984370 failed safely due missing second-account credentials |

These limits must be preserved in customer-facing readiness reports. No production customer record was intentionally mutated, no LIVE Stripe payment was initiated, and no Lumen wallet was debited.

## Revision history

| Version | Date | Change | Status |
| --- | --- | --- | --- |
| 1.0 | 2026-10-31 | Real signed QA two-account isolation and Professional grant; exact-run evidence; cleanup and endpoint retirement | Accepted for documented API scope |

**Footer:** SMFGU-QA-CHART-ISOLATION-20261031-002 · v1.0 · Internal QA evidence · Noncommercial · Not a paid-member, CAPTCHA or full-visual acceptance certificate.
