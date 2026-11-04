# Lumens V1 — Rollback and post-launch operations
| Control | Value |
| --- | --- |
| Project | THE STOCK MARKET: FROM THE GROUND UP / Crownlight |
| Document ID | SMFGU-LUMENS-V1-ROLLBACK-20261104 |
| Filename / type | docs/qa/2026-11-04_LUMENS_V1_ROLLBACK_RUNBOOK.md / Markdown |
| Google Drive location / document ID | Not created / not assigned |
| Version / date | 1.0 / 2026-11-04 |
| Status | REHEARSAL NOT EXECUTED; full Lumens V1 NO-GO |
| Dependencies | Exact successful Cloudflare production deployment ID, main SHA, authenticated two-member QA, paid and graded OAT |
| Purpose | Restore an authorized Pages release without altering financial ledgers |

## Authorized rollback sequence
An authorized owner or operations reviewer must document incident ID, failure evidence, affected scope, candidate prior production deployment ID, customer impact and explicit authorization before action. Pause unreleased features; do not toggle gifting, graded reward, or LIVE mixed checkout flags as a test.

Verify the previous **successful production** Pages deployment, not a preview. The Pages API has a `POST /accounts/{account_id}/pages/projects/{project_name}/deployments/{deployment_id}/rollback` endpoint. A production rollback is an effectful action; invoke it only for an authorized incident, never to obtain a green QA badge.

If code must be rolled back, make a **revert commit** directly to GitHub main. No force push and no alternate long-lived branches. Verify required GitHub Actions checks and a new Pages production deployment. Do not delete ledger rows or rewrite Stripe transaction history. Use audited financial reversal logic for any genuine affected purchase.

After rollback verify `release-manifest.json`, its exact SHA, signed-in and anonymous wallet access, private history, member entitlement boundaries, keyboard navigation, disabled V2 gifting and unapproved awards, Stripe webhook reconciliation and Supabase RLS.

## Operational observation
Review GitHub CI, Cloudflare Pages deployment/errors, Supabase auth/edge/Postgres logs, security advisories, Stripe webhook delivery and retry status, credit-bucket reconciliation, accessibility incidents and graded-award provenance. Record dates, operator, action, SHA and independent acceptance. A single snapshot is not continuous monitoring.

**Rollback rehearsal: NOT EXECUTED.** No production rollback or paid/member-balance modification is authorized by this document alone.

## Revision history
| Version | Date | Description |
| --- | --- | --- |
| 1.0 | 2026-11-04 | Main-only Pages recovery and post-launch evidence requirements |

Footer: SMFGU-LUMENS-V1-ROLLBACK-20261104 · Technical runbook, not legal or commercial approval.
