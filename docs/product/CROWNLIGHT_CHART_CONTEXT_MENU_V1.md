# Crownlight Chart Studio — Full Indicator Context Menu and Custom Studies

Document Control
Project: THE STOCK MARKET: FROM THE GROUND UP
Filename: CROWNLIGHT_CHART_CONTEXT_MENU_V1.md | Type: Markdown
Version: 1.0.0 | Status: Source candidate; independent acceptance outstanding
Date: 2026-11-03 | GitHub: docs/product/CROWNLIGHT_CHART_CONTEXT_MENU_V1.md
Google Drive: No connected Drive location or verified document ID; no Drive file created.
Purpose: Approved exhaustive chart-context interaction and entitlement safety baseline.
Dependencies: Chart Studio Lightweight Charts v2; indicator math; verified server tier access; private workspace revisioned persistence.

## Owner-approved functional scope
- Right-click anywhere in the chart plotting area opens a contextual menu. The header Chart menu provides an equivalent keyboard/touch pathway.
- Hovering Indicators displays all seventeen currently defined Chart Studio studies. Hovering or focusing one opens its presets and Custom control.
- EMA quick add: 9, 20, 200. Each instance is independently configurable and removable.
- Custom settings are method-specific: EMA/SMA/RSI period plus price source; MACD fast/slow/signal and source; BB period, source, standard deviation multiplier; ATR and volume average period; opening range and structure bounded period. Observed levels have appearance settings, not invented numerical options.
- Each instance has its own color, 1–4 px width and solid/dashed/dotted style.
- Drawings header and menu exposes horizontal level; KLineChart supports trendline, extended line and Fibonacci when verified Advanced-or-better access and an enhanced chart are active.
- Every indicator remains visible including locked items. Locked control shows required access and does not activate or modify entitlement.
- Standard preserves existing EMA and VWAP. The other studies are Advanced or better. No product offering is silently changed.

## Data and security
All study calculations use previously revealed candles; EMA 200 requires sufficient warmup. VWAP is explicitly an HLC3 or alternative bar-price volume-weighted approximation, not venue-exact transaction VWAP. This does not introduce a paid data source or redistribute market feeds.

The chart context menu checks the existing server-verified tier snapshot. Server persistence permits only numeric whitelisted settings, selected price sources and line appearance. Saved Advanced indicators are not plotted after downgrade or expiration. Existing account isolation, workspace compare-and-swap, and access/revocation mechanisms remain the authority.

## Acceptance gates
- [ ] Exact GitHub commit and CI source tests green
- [ ] Browser right-click/hover/click and keyboard Enter/Escape/arrow keys
- [ ] Standard/Advanced/Professional real authenticated members and expiry
- [ ] Manual cross-account and downgraded workspace restoration
- [ ] Test EMA 9, EMA 20, EMA 200, custom source and lookahead/warmup
- [ ] Test mobile/tablet header access, reduced motion and screen reader
- [ ] Exact-SHA Cloudflare deployment and owner operational sign-off
- [ ] Extend shared interface to KLineChart/ECharts/prototype/Lab canvases only after individual adapter acceptance

## Revision history
1.0.0 | 2026-11-03 | Approved full-catalog and custom-settings delivery candidate.
