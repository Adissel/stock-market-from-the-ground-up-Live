# Chart Studio Mixed TEST Checkout — Acceptance Register

**Project:** The Stock Market: From the Ground Up  
**Document ID:** SMFGU-COMMERCE-CHART-MIXED-TEST-001  
**Filename / type:** `2026-10-31_CHART_MIXED_TEST_SETTLEMENT_ACCEPTANCE.md` / Markdown  
**Repository:** `cybernexuspublishing/stock-market-from-the-ground-up` — `main/docs/releases/`  
**Google Drive location:** Not established  
**Version:** 1.2  
**Review date:** October 31, 2026  
**Status:** **Genuine Stripe TEST mixed paid/refund AND provider-expired/Lumen-restored lifecycle ACCEPTED; customer cancel-button, dispute, zero-cash member path and commercial acceptance OPEN**  
**Dependencies:** Stripe TEST, Supabase private settlement ledger, signed Stripe webhook, Cloudflare Pages, Chart Studio effective-tier resolver  
**Purpose:** Preserve actual accepted evidence and untested risks without conflating simulated tests with genuine Stripe provider events.

## Scope and controlling rules

One-time, nonrenewing Chart Studio Advanced ($9.99/30 days) and Professional ($19.99/30 days). Mixed payments draw from the **single existing Crownlight Lumens wallet** at the approved test discount rate of $0.07/Lumen. Current member entitlement is checked before checkout. Server-side reservations, provider-verified payment, refund/dispute reversal, and $0 zero-cash fulfillment are required; no LIVE charge or commercial sale activation is authorized.

## Genuine provider-backed tests — accepted

**Professional mixed TEST order, October 31, 2026**

| Evidence | Verified value |
| --- | --- |
| Original Professional price | $19.99 |
| Lumens redeemed | 10 |
| Credit discount | $0.70 |
| Stripe TEST card payment | $19.29 |
| Stripe Checkout Session | `cs_test_a1YEVUmx0roii7uDDDSb1e0Awz0zGusLh5adHOHmGIw7ZNW70Hh85qQwIF` |
| Stripe PaymentIntent | `pi_3UWXxLJY9FI7byHB06FIrFOv` |
| Signed paid event in private settlement ledger | `evt_1UWXxOJY9FI7byHBpLOVg9dv` |
| Signed refund event in private settlement ledger | `evt_3UWXxLJY9FI7byHB018v5GHY` |
| Stripe TEST refund | `re_3UWXxLJY9FI7byHB0J0a5Y0N` |
| Final order and cash entitlement | Refunded; premium cash access revoked |
| Final existing Lumen balance | 29; all 10 applied Lumens returned |
| Saved Chart Studio workspace | 1 retained |

Signed paid and refunded events were independently present in the private event ledger. This is **genuine TEST purchase → fulfillment → refund → Lumen restoration → revocation acceptance** for Professional, not merely mock SQL.

**Separate full-price (nonmixed) checkout expiration:** The abandoned $19.99 Professional TEST session `cs_test_a11DxLJD9zfvIfrjdmNKsaQeMJ4jDWhx8IEw7V7pG3Sy7YD2dPHqsOYF04` is recorded as expired. Signed expiration event `evt_1UWXwvJY9FI7byHB004XzX7g` is recorded in the **cash-only** event ledger. This does not satisfy mixed-credit cancellation acceptance.

## v1.2 genuine TEST expiration and restored reservation — October 31, 2026

**Independent evidence:** Read-only Stripe TEST connected account `acct_1URGkDJY9FI7byHB` returned a real mixed-checkout session `cs_test_a1opFD2BmystbGxhpaM9j0uom9d22mGR1jTf3laMJuetNH0MFQarzmnp2v` with `livemode=false`, `status=expired`, `payment_status=unpaid` and `amount_total=1992` cents. Stripe returned matching `evt_1UWeTQJY9FI7byHBq0DedrlD` of type `checkout.session.expired`, with the same session ID and zero pending webhook deliveries. Supabase's private `crownlight_chart_mixed_test_v1` record is `status=expired`, `cash_cents=1992`, `lumens=1`, **no PaymentIntent**, and the event ledger independently stores that exact event ID as `expired`. The original reserved one-Lumen debit bucket is marked returned, exactly once.

**Disposition:** **Real provider-backed mixed unpaid expiration and server-ledger credit restoration ACCEPTED**, replacing the earlier SQL-only expiration evidence for this narrow path. Whether the *member-facing cancel control* initiated this exact expiry remains **NOT INDEPENDENTLY VERIFIED**; preserve that browser acceptance requirement. No Stripe charge was captured for the expired session.

**Current aggregate TEST ledger (read-only):** four mixed paid/refunded orders; one separate expired/unpaid mixed order; four recorded paid events, four refund events, one expired event; five Lumen debit rows totaling 14, all 14 Lumens restored. Stripe TEST lists no disputes at the check time. A completed provider refund does not substitute for genuine dispute acceptance or a fully Lumen-funded authenticated zero-cash order.

**Remaining gates:** real member-facing cancel-button-to-provider-expiry workflow; actual supported Stripe TEST dispute event; signed-webhook idempotency under duplicate/reordering; genuine fully Lumen-funded QA order and reversal; authenticated Chart Studio entitlement downgrade/workspace isolation; exact-head CI and Cloudflare production acceptance. **No LIVE changes.**

## Database rollback tests — verified, not genuine provider acceptance

- Atomic mixed reservation and debit calculated the correct reduced cash amount, without permanently consuming credits.
- A zero-cash Professional purchase granted a 30-day entitlement with no Stripe charge; a zero-cash refund restored credits once.
- Duplicate requests reused their original order; another unresolved reservation was blocked.
- Cancellation/expiration returned credits in a rolled-back transaction.
- A simulated disputed $19.85 Professional purchase using two Lumens revoked access and returned the two credits. A subsequent simulated refund did not restore credits twice. Entire test rolled back; final wallet remained at 29. **No genuine Stripe dispute event was produced.**
- Anonymous/authenticated clients cannot read or mutate private settlement tables or execute service-role settlement functions directly.

## Current effective access (data-layer verification)

The Professional cash entitlement is revoked. The temporary Advanced Lumen pass remains active through November 7, 2026 (UTC expiry: `2026-11-07T07:35:05.638093Z`). A previous Professional Lumen pass is expired. One saved workspace remains.

The expected effective tier is **Advanced**, but authenticated member-browser downgrade and workspace reopening have **not** been independently accepted.

## Open acceptance gates

1. **Mixed-payment member-facing cancellation:** Provider `checkout.session.expired` and one-credit restoration independently verified in v1.2. Confirm in a genuine member browser that its Cancel control initiates the expected provider expiry and subsequent signed webhook idempotently (rather than a separate manually expired session).
2. **Actual dispute:** Use a genuine supported Stripe TEST dispute scenario on an eligible QA payment, verify signed `charge.dispute.created`, immediate entitlement protection, correct Lumen restoration, and subsequent event idempotency. SQL simulation is not acceptance.
3. **Authenticated downgrade/workspace:** Sign into James_Test, verify its actual effective Advanced tier, confirm Professional-only controls are inaccessible, and reopen the existing private saved workspace. Cross-account workspace isolation must remain enforced.
4. **Final release gate:** Review exact-commit CI and Cloudflare deployment for changes made during acceptance. LIVE checkout and unrelated product classes stay disabled.

## Revision history

| Version | Date | Summary | Status |
| --- | --- | --- | --- |
| 1.0 | 2026-10-31 | Initial implementation and database simulation evidence | Superseded |
| 1.1 | 2026-10-31 | Recorded genuine discounted TEST purchase/refund, signed events, wallet reconciliation, and separate dispute simulation | Superseded |\n| 1.2 | 2026-10-31 | Verified real TEST unpaid mixed-session expiration and exact signed provider event, one-Lumen return, updated four refunds/one expired ledger aggregate | Controlling register |

**Decision:** Accept genuine mixed TEST payment/refund and provider-unpaid-expiration/Lumen-restoration paths. Do **not** classify user-facing cancellation, actual dispute, independent zero-cash browser fulfillment, authenticated downgrade, or public LIVE sale as accepted.
