# Talia Market Tutor — Batch 022: Primary Research and Replay Timing

| Document control | Value |
|---|---|
| Company | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | THE STOCK MARKET: FROM THE GROUND UP — Talia Market Tutor |
| Document ID | SMFGU-TALIA-EXEC-022 |
| Filename / file type | docs/qa/2026-11-03_TALIA_SOURCE_REMEDIATION_BATCH022-v1.md / Markdown |
| Google Drive / document ID | Not created / unassigned |
| Version / date | v1.0 / 2026-11-03 |
| Status | Internal source remediation; exact-commit CI and independent publication HOLD |
| Purpose | Reconcile three source/teaching deficiencies, preserve audit provenance, and prevent unobserved financial filing information from contaminating replay. |
| Dependencies | Owner-approved seven priorities, claims 101–140, claim-specific supporting research, Foundation Batches06/07, member-only Tutor and Cloudflare release controls. |

## Changes and evidence

1. **104 — Issuer repurchase:** The archived SEC 2023 Commissioner discussion remains historical context. The SEC's 2024 vacatur notice confirms the May 2023 share-repurchase disclosure amendments were vacated effective December 19, 2023. Lesson text no longer treats that vacated rule as current. Cash from a repurchase goes to participating sellers, not automatically to continuing shareholders. Conditional share percentage changes remain fictional. Source: https://www.sec.gov/rules-regulations/2024/03/s7-21-21.
2. **129 — Portfolio concentration:** The principal source is replaced with State Street's direct discussion of portfolio HHI, sum of squared decimal portfolio weights and its reciprocal effective holdings. Example .5²+.3²+.2²=.38 and 1/.38≈2.63 are original hypothetical arithmetic. No covariance, guaranteed diversification, antitrust/legal determination or third-party redistribution is inferred. Source: https://www.ssga.com/us/en/intermediary/insights/concentration-is-up-diversification-isnt-gone.
3. **133 — Historical filing evidence:** SEC Webmaster FAQ distinguishes the EDGAR acceptance timestamp from public dissemination: normal website lag is often 1–3 minutes but the SEC does not guarantee a maximum or publish an exact first-available timestamp. Fictional 14:00 EDGAR acceptance and separately observed 14:03 retrieval prohibit a 14:01 replay from using that 10-K. Source: https://www.sec.gov/about/webmaster-frequently-asked-questions.
4. **Source-only replay prototype:** A deliberately unreleased helper requires a server-verified first public observation before permitting a filing at the instructional historical cutoff. Caller provenance is not an authorization guarantee; integration with a real verified event log remains open.
5. **Checks:** Existing claim-count, source consistency and 35-case Python/JavaScript arithmetic tests are reconciled. Additional claim-specific and replay-visibility tests run within the Tutor CI workflow.

## Independent acceptance and safety

The three editorial source-scope remediations are NOT independent publication signoffs. Source content remains original, ungraded and member-gated. All regulatory/methodology rights remain on HOLD. No Supabase migration, member learning record, grant, grade, paid provider call, Stripe change, historical feed, trading advice or official benchmark reproduction is introduced.

## Execution, rollback and signoff

At commit time, verify HEAD and run full GitHub source CI and Cloudflare Pages production on the same final revision. Revert the isolated Batch022 pointers, helper, tests and doc if needed. Keep original 30 competencies, 419 Labs, 274 Academy study days and existing member progress unchanged.

## Revision history

| Version | Date | Change | Status |
|---|---|---|---|
| 1.0 | 2026-11-03 | Correct source scope for #104/#129/#133, strengthen EDGAR timing guard, update CI and audit evidence | Internal technical review; release HOLD |

**Footer:** SMFGU-TALIA-EXEC-022 · v1.0 · Not legal advice, a data license or release certification.
