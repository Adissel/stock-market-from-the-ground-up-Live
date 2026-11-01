# SMFGU-PROTOTYPE-EDITOR-023 — Direct Text Editing, Draft Deletion, Snap-to-Grid

**Document ID:** SMFGU-PROTOTYPE-EDITOR-023
**Project:** The Stock Market: From the Ground Up / Protected Prototype Layout Designer
**Filename:** docs/prototype/SMFGU-PROTOTYPE-EDITOR-023-v1.0-20261101.md
**File type:** Markdown (.md)
**Version:** 1.0
**Date:** 2026-11-01
**Branch:** main
**Status:** Source and tests committed; exact-SHA CI and live-role visual acceptance require verification
**Google Drive location / document ID:** Not assigned / not created
**New file required:** Yes
**Dependencies:** AGENTS.md, React/TypeScript Prototype LayoutStudio, Cloudflare Pages, browser-local viewport-specific draft storage
**Purpose:** Permit staff to edit on-page plain text, delete layout elements from a browser-local draft and enable/disable snap-to-grid.

## Implementation and safeguards
- Prior capture-phase pointerdown prevented native selection on every editable target. Headings/Text mode now permits native highlighting and an explicit Edit text directly checkbox enables HTML5 plaintext-only contentEditable for safe text-only noninteractive leaf nodes; markup and input/links remain untouched.
- An inspector textarea retains the existing source-free design-edit workflow. Inline edits save on focus loss to the existing per-page, per-viewport local draft only.
- Snap to grid defaults on with a 10-pixel movement grid. When disabled, pointer movement and accessible nudge buttons operate at individual pixels. Separate localStorage key retains preference through reload. Explicit width/height remain unrounded.
- Delete selected from draft asks for confirmation and uses a reversible deleted flag so the element is removed from the layout preview and flows close the gap. Deleted items are listed for Restore deleted; Undo and Reset page layout remain available.
- No product, Lab, Boot Camp, Tutor source, answers, live member progress, Stripe, Supabase or public website content is deleted or changed.

## Acceptance / dependencies
- Source and Chromium tests: inline edit and blur, snap true/false movement, delete and restore, existing protected Owner/Admin role browser flows and nonstaff denial.
- Must independently verify production sign-in, touch/keyboard text editing, WCAG, deployed exact SHA and final integrated release.
- Rollback: revert source commit on main. No database migration.

## Revision history
| Version | Date | Change | Status |
| --- | --- | --- | --- |
| 1.0 | 2026-11-01 | Editing, deleting and grid toggle | CI pending |

**Footer:** Staff design-only. Browser-local draft; no publishing or billing changes.
