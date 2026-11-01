# SMFGU-CHART-MEMBER-APPEARANCE-V16 — Existing Private Workspace Integration
**Project:** The Stock Market: From the Ground Up / Crownlight Chart Studio
**Company:** Cyber Nexus Publishing / Crown & Lantern Press
**Filename/type:** `docs/qa/2026-11-01_CHART_MEMBER_APPEARANCE_WORKSPACE_V16.md` / Markdown (.md)
**Document ID:** SMFGU-CHART-MEMBER-APPEARANCE-V16
**Version:** 1.0 | **Date:** November 1, 2026
**Status:** Source implementation; authenticated real-device acceptance pending
**Repository/branch:** cybernexuspublishing/stock-market-from-the-ground-up / main
**Google Drive location/ID:** Not created / unassigned
**Purpose:** Integrate actual member chart appearance settings and indicator line styles into the existing private revision-protected member workspace, not a second system.
**New file:** Yes
**Dependencies:** Existing /api/chart-workspace, gu_crownlight_chart_workspace_save_v4, Cloudflare Pages, Supabase JSONB settings and RLS policy, Lightweight Charts v5, ECharts educational workspaces, entitlement verification.

## Implementation
- Real member Chart Studio: accessible colors/spacing dialog, bullish/bearish/doji and grid colors, candle spacing, right buffer, per-indicator solid/dashed/dotted line styles.
- Existing workspace Save/Restore: optional appearance + chartStudies fields, bounded validated colors, numeric values, and indicator types. Legacy records without these keys remain readable.
- Retain optimistic CAS, account isolation, access downgraded premium preservation, staff authorization and no future-bar leakage. Deferral on chart mounting; reset pending restore on member-change event.
- No new SQL migration, tables, billing, AI model activation, paid services, or personal trading data. No additional Python runtime, because these controls run in the existing browser/JavaScript architecture.
- CI source contracts validate malicious field dropping and allowed values; real cross-browser authenticated two-device persistence and visual behavior still require independent acceptance.

## Release and rollback
- Source changes require exact-head CI, deployment SHA, member-versus-guest permissions and real save/restore visual acceptance before final production sign-off.
- Rollback: revert this source commit on main. Existing JSONB documents remain backward compatible. SQL preflight/migration/postflight not required.

## Revision history
| Version | Date | Changes | Sign-off |
| --- | --- | --- | --- |
| 1.0 | 2026-11-01 | Member appearance and studio preference integration | Source acceptance pending CI |

**Footer:** Internal document · Synthetic replay boundaries unchanged · No financial actions.
