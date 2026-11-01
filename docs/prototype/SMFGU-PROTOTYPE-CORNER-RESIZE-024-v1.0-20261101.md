# Prototype Layout Designer — Four-Corner Resize
**Document ID:** SMFGU-PROTOTYPE-CORNER-RESIZE-024
**Project:** The Stock Market: From the Ground Up
**Filename / File type:** `docs/prototype/SMFGU-PROTOTYPE-CORNER-RESIZE-024-v1.0-20261101.md` / Markdown
**Google Drive location / ID:** Not created / unassigned
**Version:** 1.0
**Status:** Implemented on main; targeted build, browser test and exact-deployment verification pending
**Date:** 2026-11-01
**Purpose:** Let authorized staff click an actual prototype page element and resize it using visible draggable corner grips.

## Implementation
- Four visible corner grips (NW, NE, SW, SE) anchor to the current selected page element without adding children inside chart or instructional React components.
- Native pointer-driven resize previews dimensions continuously and persists width, height, and offset together in one browser-local atomic draft/Undo action on pointer release. Pointer cancellation restores previous sizing.
- Left/top corners preserve the opposite edge by applying calculated x/y offsets. 60×30 px minimum, 2200 px maximum; 10-px quantization when Snap to Grid is checked, 1-px precision when unchecked.
- Handle positions update on scroll, resize and selected element ResizeObserver notifications. Keyboard-accessible width/height inputs remain available; touch handles expand on small screens.
- Existing authenticated staff document access and visual-draft-only protections remain unchanged. No mutations to curriculum, protected grading, memberships, pricing, Supabase or live commerce.

## Acceptance evidence required
1. Source TypeScript build and static layout contract.
2. Chromium Owner/Admin staff fixture and Free-user denial; four corner grips, snap on/off mouse drag, real dimension changes, atomic Undo, existing text/delete behaviors.
3. Visual physical touch, screen reader and keyboard checks; confirmed deployed Cloudflare commit.
4. No separate database migration. Rollback by reverting main commit.

## Revision history
| Date | Version | Detail |
| --- | --- | --- |
| 2026-11-01 | 1.0 | Four-corner resize and new automated regression coverage |

**Footer:** SMFGU Prototype Corner Resize / V1.0 / Staff-only / Browser-local drafts.
