# SMFGU-VIS-CONTRACT-001 — Shared Visualization Data and Provenance Contract

| Document control | Value |
|---|---|
| Company / imprint | Cyber Nexus Publishing / Crown & Lantern Press |
| Project | The Stock Market: From the Ground Up — Interactive Website |
| Document ID | SMFGU-VIS-CONTRACT-001 |
| Filename / type | `SMFGU-VISUALIZATION-DATA-CONTRACT-v1.md` / Markdown |
| GitHub source location | `cybernexuspublishing/stock-market-from-the-ground-up` / `main` / `docs/engineering/` |
| Google Drive location / document ID | Not created / not assigned |
| Version / date | 1.0 / 2026-11-01 |
| Status | CONTRACT DEFINED; consumers and release acceptance tracked individually |
| Purpose | Enable five-chat concurrency through a pure, presentation-only ECharts interface while preserving current server/authentication/education boundaries |
| Dependencies | SMFGU-COORD-005, AGENTS.md, Shared Learning Engine v3.3, Shared Lab Engine v3.2, Talia, ECharts 6.1.0 loader, existing authenticated event producers |

## Principles and ownership

The *Indicator Implementation* chat supplies numerical studies, seed/warm-up settings, unit, period, and bars actually available at the decision. The ECharts chat renders, compares and labels the results without substituting another mathematical implementation. *Learning And Lab Engines* supplies actual authorized learning state, not UI-inferred mastery. *Tutor Training* supplies source-approved feedback; *Build Interactive Tutor Website* handles conversation and authenticated interaction. The visualization layer consumes already-authorized data and has no new read/write entitlements.

This contract does not authorize client-supplied flags as evidence of authentication, computed correctness, licenses, or proprietary assessment access. Consumers must obtain those assurances from the existing authenticated owner and server systems **before** handing display data to any chart. The ECharts library does not enforce RLS or grade.

## Existing production interfaces (retain, do not replace)

| Existing producer / consumer | Existing wire interface | What is allowed |
|---|---|---|
| `assets/js/dashboard.js` -> `assets/js/free-foundations-echarts-v1.js` | DOM event `smfgu:free-foundations-evidence`, five ordered `{day,status}` entries; `smfgu:free-foundations-unavailable` clears | Current signed-in member's saved, started, not-started **ungraded** five-day record; no fabricated competence |
| Admin authorized summary -> `assets/js/crownlight-echarts-admin-v1.js` | Window event `groundup:admin-summary` with existing authorized count snapshot | Nonnegative integer record counts; categories overlap, not a revenue trend |
| Lab/Boot Camp visible stage -> `assets/js/learning-progress-echarts-v1.js` | DOM event `gu-learning-visible-progress` with stage `index` and display `percent` | Visible journey stage only; do not infer a score |
| `assets/js/crownlight-learning-echarts-v1.js` | Locally constructed FICTIONAL interactive candle / VWAP examples | Free ungraded conceptual instruction, not chart replay or protected answer keys |
| Chart Studio/indicator math -> ECharts replay/studio controllers | Existing controlled chart math and replay consumers | Preserve actual historical cutoff, warm-up, signed-in tier and workspaces; no adapter may expose lookahead |

These names are verified existing source interfaces. No new event is claimed deployed by this contract.

## Reusable visual kit: `window.CrownlightVisualKitV1`

The dedicated source file `assets/js/crownlight-visual-kit-v1.js` defines pure ECharts option factories. These are **not** new APIs, user endpoints, subscription controls, or progress ledgers:

```ts
type RecordKind = "counts" | "progress";
type ProgressItem = { label: string; value: number; capacity: number };
type CountItem = { label: string; value: number };
type BarInput =
  | { kind: "counts"; sourceLabel: string; items: CountItem[] }
  | { kind: "progress"; sourceLabel: string; items: ProgressItem[] };
type IndicatorPoint = { bar: number; value: number | null };
type IndicatorInput = {
  label: string;
  points: IndicatorPoint[];
  visibleThroughBar: number; // last authorized COMPLETE visible bar
  sourceLabel: string; // declaration supplied by upstream authority
};
interface VisualKit {
  barOptions(input: BarInput): object | null;
  indicatorSeries(input: IndicatorInput): object | null;
  stageJourneyOptions(input: {labels: string[]; index: number; sourceLabel: string; reducedMotion?: boolean}): object | null;
}
```

**Validation:** An invalid kind, empty or excessive label, non-finite/negative/unsafe count, out-of-range progress, missing source label, unsupported number of records, negative or unsorted bar index, or missing/invalid cutoff returns `null`. No data is silently promoted to an official score. Zero is a meaningful observed value, not missing data.

**Indicator lookahead:** The factory returns only finite-or-null computed samples with `bar <= visibleThroughBar`. It does not reconstruct the withheld bars, compute the study, manufacture a warm-up, infer future state, or authorize a data source. The upstream source determines whether the series is historical, licensed, synthetic, or member-provided, and must verify that declared source. Missing values remain `null`, not zero.

**Visible-stage timeline:** \`stageJourneyOptions\` accepts ten existing published stage names and current 0-based visible-stage index from the current engine. Colored segments describe *navigation position*, not completed tasks, scores, mastery, or authorized membership. It never mutates progress; invalid labels or indices fail closed. The existing Lab/Academy visible-stage ECharts widget uses this shared factory with its former implementation preserved as fallback.\n\n**Accessibility:** Every view must have an explicit, accurate label and native exact-value table or equivalent semantic fallback on the consuming page; an ECharts `aria` label alone is insufficient. Avoid embedding unsanitized user HTML in tooltip strings; use rich-text tooltip mode or safe text construction. Honor reduced motion, proper contrast, keyboard focus, zoom behavior and account-change disposal.

## Consumer binding policy

| Consumer | Contract binding | Status |
|---|---|---|
| Free Foundations five-day dashboard | Map `days` to five `progress` items (saved = 1, not saved = 0, capacity = 1); ungraded only | Existing ECharts producer; pure-kit adoption separately tracked |
| Lab / Boot Camp learning progress | Display authorized current stage using existing event, not the grade ledger; optional `progress` summary only with actual server-supplied eligible totals | Existing visible-stage ECharts; new aggregate bridge NOT IMPLEMENTED |
| Indicator comparisons / Chart Studio | Numeric computation from Indicator Implementation; `indicatorSeries` only after verified cutoff and provenanced data | Adapter defined; new consumer adoption NOT IMPLEMENTED |
| Interactive Tutor | Visual references on actually visible bars; Tutor text and permission remains Tutor/Interactive responsibility | Shared interface defined; new consumer adoption NOT IMPLEMENTED |
| Admin | Existing authorized count snapshot; `counts` mode forbids capacity/percentage claims | Existing visualization; pure-kit adoption separately tracked |
| Journal and member portfolio analytics | Must use existing authorized records; no new history, holdings, trading or profit values | NOT IMPLEMENTED by this source-only contract |

## Tests and release gates

1. Unit tests check exact option series, count zero, bounded capacity, label input, bad inputs, the cutoff fence and warm-up nulls.
2. Run real ECharts/Chromium suites for Free five-day, Admin, Lab charts and mobile viewport; avoid interpreting source tests as genuine account tests.
3. Verify no hidden answer, future candle, unauthorized member data, account crossing, localStorage/sessionStorage persistence or new server data read.
4. Verify source and workflow against an exact stable `main` SHA after other chats have finished their current batch.
5. Verify Cloudflare deployment for that exact SHA, authorized real member screens, responsive layout, keyboard and screen-reader.
6. Keep protected scoring, official mastery, course IDs, membership/Stripe controls and Cloudflare/Supabase architecture unchanged.

## Revision history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-01 | Five-chat visualization contract, concrete existing event inventory, option factory and acceptance boundaries |

**Footer:** SMFGU-VIS-CONTRACT-001 · v1.0 · Specification is not a release sign-off.
\n## One-Time Member Tutor Handoff (v1.1)\n\nThe existing \`crownlight:revealed-bars\` event is consumed by the read-only chart-Talia adapter. Only after the existing member chart renders **validated completed/revealed history** does the adapter offer an optional, user-initiated **Ask Talia about this revealed chart** action. Implemented by \`assets/js/crownlight-tutor-chart-handoff-v1.js\` and \`assets/js/crownlight-talia-echarts-bridge-v1.js\` on \`simulator.html\` and \`verified-replay.html\`. The receiving surface is the original editable \`#tutor-question\` field on \`market-tutor.html\`; no replacement Tutor engine exists.\n\n**Protocol:** A direct click opens \`/market-tutor.html?chartHandoff=<32-hex-random-nonce>\` on the same origin. The URL contains **no chart prices, indicators, account ID, token, protected assessment, answer, or other learner data**. The receiving page must independently verify the Supabase session and verified user ID, and recheck \`/api/member-tool-access?tool=MARKET_TUTOR\` using the session's bearer token. It then sends a one-time same-origin \`postMessage\` readiness message to its exact opener. The source verifies the exact opened tab, nonce, recent click, origin, current verified member, and matching receiver member ID before sending an in-memory question of at most 450 characters. The receiver rechecks its identity before inserting the question. It does **not** send the question to Tutor automatically. No browser storage, database, or cloud cache is written by this integration.\n\nThe question summarizes one already completed candle and only canonical EMA 9, EMA 20, and HLC3-volume VWAP approximation values, with explicit no-lookahead and NO TRADE limitations. Unsupported studies are not silently promoted to computed member overlays. Old questions are cleared on chart-session/member changes. A member may edit or decline before clicking the original Tutor submit control. This is **a user-consented, same-account contextual handoff**, not live bi-directional transcript sync or newly authorized AI access.\n\n**QA:** \`tests/test_crownlight_tutor_chart_handoff_v1.mjs\` verifies correct-member, wrong-member, denied-entitlement, nonce-only URL, no storage, no auto-submit and first-party existing routes. \`tests/test_crownlight_tutor_chart_handoff_browser_v1.mjs\` covers an actual Chromium user-click, popup, editable field and denied/mismatched user **with mocked authentication**. They run via the existing focused ECharts workflow. Source changes and tests are not independent signed-in production acceptance.\n\n**Ownership:** ECharts Dashboard Implementation owns only the chart offer, visualization math consuming and the handoff adapter. Build Interactive Tutor Website owns downstream Tutor message submission, transcript/history, advanced features, authenticated acceptance and release. Tutor Training owns approved coaching content. Indicator Implementation owns formulas and rights. Learning and Lab Engines own official lesson scores and prerequisites.\n\n**Release:** Exact-main GitHub Actions + matching Cloudflare, cross-account/screen reader/touch/browser acceptance, and final editorial/source rights remain OPEN until separately verified.\n