# Website Development Roadmap — November 1 Release and Curriculum Reconciliation

| Document control | Value |
|---|---|
| Company / imprint | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | The Stock Market: From the Ground Up — Website Development Roadmap |
| Document ID | SMFGU-WEB-ROADMAP-RECON-20261101-001 |
| Filename / file type | `SMFGU-WEB-ROADMAP-RECON-20261101-001.md` / Markdown |
| GitHub location | `cybernexuspublishing/stock-market-from-the-ground-up` / `main` / `docs/roadmap/` |
| Google Drive location / document ID | Not assigned / not created. GitHub is the current source of record. |
| Version / prepared | 1.0 / 2026-11-01 |
| Status | Source implemented; exact-head CI, Cloudflare matching deployment, genuine Owner browser and consolidated release acceptance tracked independently |
| Owner | Delegated project/editor/QA authority for source scope; only genuine authenticated OWNER may save roadmap completion or authorize private edits |
| Purpose | Bring the actual private /owner-roadmap.html forward from its Oct 28 audit snapshot without changing preserved project commitments or treating staged authoring, source code or CI as blanket production certification |
| Dependencies | AGENTS.md, PROJECT_SITEWIDE_RULES.md, README_START_HERE.md, 105 historical docs/releases records, current docs/learning engine architecture and tier register, protected Owner Roadmap API and existing Supabase site_settings, current Cloudflare Pages build |

## Scope and source of truth

The existing 281 original core items plus 94 October 18 additions remain **375 primary commitments**, supplemented by **1,815 historical requirement/reference items** = **2,190 unchanged canonical records**. No ID was removed, relabeled or silently marked accepted. Existing saved OWNER progress and audit history still win over delegated source evidence. The new reconciliation section is **read-only** and visible only after the existing server-side OWNER authorization and member-account-status checks. Ordinary Admin/Moderator, restricted, suspended, SHOWCASE and anonymous accounts remain denied by the existing endpoint. The historical eight deployment packages are retained as planning scope and not claimed completed.

The old `docs/CURRENT_RELEASE.md` (v0.14.0.12), `RELEASE_MANIFEST.json` (v0.14.0.17), root `release-manifest.json` (v0.14.0.155) and the October 28 audit snapshot are historical source records, **not a replacement for current-main, exact-head GitHub Actions and Cloudflare production evidence**. `README_START_HERE.md` explicitly makes current `main` authoritative.

## Reconciled planning facts (different denominators)

| Stream | Historical/review baseline reflected in private Owner page | Meaning and open approval |
|---|---|---|
| Lab registry | 419 canonical mapped Lab bridges / 30 competencies | Mapping and teaching-source evidence; individually reviewed, graded and historical provenance require separate decisions |
| Original Academy seven programs | 247/247 fictional day source-case presence | 225 were initially parent-derived; authoring is **not** independent advanced instruction or official grading |
| Fixed advanced-depth acceptance ledger | **93/380 = 24.47%** accepted restricted ungraded Beta units, 287 unaccepted | Supersedes the prior dated 91/380 and 88/380 reports. No independent professional accreditation inferred |
| Three invited Beta Boot Camps | 27/27 original instructional days accepted | Ungraded, invitation-only scope; public retail and protected grading remain on hold |
| Private three-course assessments | 41/54 complete drafts, 0/54 approved for scoring at the dated Oct 31 snapshot | Draft authoring `41/54` ≠ protected release, no server answer-key disclosure |
| B01 graded Beta preparation | 62% managerial weighted preparation | 0/20 private sets independently signed; grading release blocked |
| Indicator studies | 61 original written research guides across seven families | Exactly 15 calculated ECharts chart studies, not 61 executable overlays |
| Talia | 134 research/tutor modules | Source catalog not universal individual editorial approval |
| Chart Studio | 3/14 fully accepted strict release gates | Ten partial, one open; historical half-credit estimate 57.1% not equivalent to signoff |
| Free V1 | Historical planning 88% | Five original ungraded Free days accepted in their narrow scope; two-account privacy, full accessibility and final release distinct |

No single percentage above is an independently verified whole-website build completion score.

## Controlling three-engine Owner policy

There are three separate future product families: Shared Learning Engine (Basic v3.3 source), Shared Lab Engine (Basic v3.2 source), and Talia Market Tutor (Foundation Basic v0.14.0.149 customer-facing label). Each may eventually offer separately priced advanced add-ons, but current higher editions, premium checkout, SKU prices, and full entitlement/expiry/revocation must not be inferred from a target row.

| Membership | Learning target | Lab target | Talia target |
|---|---|---|---|
| Free, Founding 14-Day, Pick What You Want | Basic | Basic | Foundation (Basic) |
| OnDemand | Based on individually verified product | Same | Same |
| Founding 30-Day | Advanced / next best | Advanced / next best | Advanced |
| Founding 60-Day, Full Monthly | Professional / best available | Professional / best available | Professional |
| Full Lifetime | Enterprise / best-of-best | Enterprise / best-of-best | Enterprise |
| Full Annual and legacy founding terms | Unassigned — Owner reconciliation required | Unassigned | Unassigned |

A source version, target product edition and real released server capability are different. Equal essential first-principles instruction, free explanations, worked calculations, correction, retries, transfer and grading security are guaranteed for each lesson that a member is already entitled to access. Premium may add independently accepted depth/workflows, not gate basic explanations or official answer keys.

## Ten controlling next execution gates

1. **CI:** select stable `main` SHA, finish mandatory workflows without counting pending/cancelled checks, verify same successful Cloudflare Pages SHA.
2. **Genuine staff browser:** Owner/Admin and denied-role auth, three protected A/B/C prototype experiences, sign-out, session expiry and revocation.
3. **419 Lab parity:** ten visible teaching steps, five original facets, numerical reasoning, adaptive correction, retry, fresh transfer, server-owned scoring.
4. **Academy 380-unit depth:** separately verify each day, especially remaining 287 advanced-depth units, ungraded 27-day invited Beta, draft/public boundaries, prerequisites and Talia.
5. **61 indicators:** individual published authority/formula/unit/warm-up/session interpretation/limitation, original research guide vs 15 real calculations.
6. **15 computed indicators:** independent OHLCV numerical reference, no lookahead, initial/warm-up/reset/missing bar/parameter cases.
7. **Professional ECharts:** React/TypeScript and locally hosted Apache ECharts 6.1, linked charts, pan/zoom/release, overlays, pane resizing, mobile and keyboard acceptance.
8. **Two independent genuine accounts:** secure entitlement and mutual denial across Labs, Academy, Tutor, Watchlist, Replay, Journal and Studio.
9. **Accessibility and educational integrity:** actual screen-reader review, focus/keyboard/reduced motion, source-level trading/regulatory/market-data correctness, actual separate reviewers where required.
10. **Consolidated production release:** exact SHA, full CI, provider deployment, payments/legal/publishing/consent/security/rollback acceptance, explicit Owner disposition, no speculative launch.

Add-on sales, private official grading, KDP/market-data rights and full LIVE payment authorization are separate open gates, not automatic consequences of this read-only roadmap update. No production database migration, money transfer, new user record or premium feature is introduced.

## Files changed

- `functions/_lib/owner-roadmap-release-reconciliation-v1.js` — private, versioned evidence, policy and ten execution gates (not deployed as public data).
- `functions/api/owner-roadmap.js` — extends the existing OWNER-protected GET and compact delivery summary without altering POST, role check, metadata or 2,190-record catalog.
- `owner-roadmap.html` — a new current-release section above the preserved eight-package plan; October 28 header correctly labeled historical.
- `assets/js/owner-roadmap-release-reconciliation-v1.js` — textContent-based accessible renderer loaded after actual OWNER GET; no private writes and no innerHTML.
- `assets/js/owner-roadmap.js` — connects authorized API evidence to read-only renderer without changing progress/Owner actions.
- `assets/css/owner-roadmap.css` — responsive evidence cards, navigable membership table and ten-gate execution list.
- `tests/test_owner_roadmap_release_reconciliation_v1.mjs` — historical ID preservation, revised denominators, membership matrix, authorization boundary, no price activation.
- `.github/workflows/owner-roadmap-workflow-v014063.yml` — validates new module syntax, tests and deployment build privacy.

## Acceptance and rollout

The source change is a **scoped product/engineering implementation** only. CI success and live Cloudflare deployment must be recorded at the current exact SHA after the final code commit. Actual signed-in OWNER visual/keyboard use, access revocation and content approval require separate evidence. No previous documented Owner saved status is overwritten; no new percentages are artificially assigned to all completed work.

**Rollback:** Revert the new source, private API view field, HTML section, browser asset, stylesheet addition, new contract test and workflow references together on `main`. Preserve existing protected checklist, stored Owner progress and audit history; no Supabase migration or Stripe rollback.

## Revision history

| Version | Date | Change | Owner disposition |
|---|---|---|---|
| 1.0 | 2026-11-01 | Reconcile release records, engine edition targets, 93/380 Academy acceptance, source/graded separations and ten ordered gates in the real authenticated Roadmap UI | Source implementation; final production signoff open |

**Footer:** SMFGU-WEB-ROADMAP-RECON-20261101-001 · v1.0 · Private Owner evidence snapshot · No payment, independent editorial, legal, graded-assessment or full website release certification.
