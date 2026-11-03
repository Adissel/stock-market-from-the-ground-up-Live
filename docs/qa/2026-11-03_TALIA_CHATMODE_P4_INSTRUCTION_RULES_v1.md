# Talia Tutor — Chat Mode Package 4: Conversational Instruction Contract

| Control | Value |
|---|---|
| Project/company | The Stock Market: From the Ground Up — Cyber Nexus Publishing / Crown & Lantern Press |
| Document ID | SMFGU-TALIA-CHAT-P4-INSTRUCTION-001 |
| Version/date | 1.0 / 2026-11-03 |
| Filename / type | `docs/qa/2026-11-03_TALIA_CHATMODE_P4_INSTRUCTION_RULES_v1.md` / Markdown |
| Data file | `data/talia-chat-mode-p4-instruction-contract-v1.json` / JSON |
| GitHub location | `Adissel/stock-market-from-the-ground-up-Live` / main |
| Google Drive / document ID | Not created / unassigned |
| Status | Chat Mode teaching policy defined; authenticated runtime and independent editorial acceptance still OPEN |
| Dependencies | Existing Tutor API and source guides, React Classroom, learning v3.3, Lab v3.2, original 30 competencies, 419 Labs, 274 Boot Camp positions |

## Frozen behavior

- Four existing member-facing modes: Explain (`explain`), Guided Self-Check (`question`), Review Reasoning (`review`), Recommend Practice (`practice`). Do not redefine these as graded Assess stages.
- Six existing progressive phases: **Observe → Explain → Attempt → Correct → Retry → Transfer**, mapped to the original Classroom phase controls. This is distinct from the nine-stage Learning Journey.
- Five instructional perspectives: **Understand, Recognize, Apply, Common Mistake, Limitations**. Five methods: **I DO, WE DO, YOU DO, REVIEW, TRANSFER**. The data register defines all **25 perspective/method combinations** as acceptance expectations; combinations do not automatically mean 25 separately deployed premium features.
- First-principles explanation uses source-grounded original examples, explicit units, common mistakes, counterexamples, limitations and different independent transfer scenarios. Ask for learner reasoning before coaching, provide hints, correct process and never assign mastery.
- Consented saving is off by default; unsaved previous messages are not trusted as member history. The authenticated backend must own identity, entitlement, context and source selection. No added inference fees, no member AI keys or lookahead.
- Assess stage: no protected answer key, unrevealed event, final grade, private rubric or premature explanation. Free deeper explanation is not a Lumens purchase.

## Example dialogues

1. **VWAP exact-versus-proxy:** Fictional transactions 100 at $10 and 300 at $12 imply exact trade VWAP $11.50. An HLC3 aggregate bar with H=12 L=10 C=12 V=400 produces only the proxy $11.333333. Separate the input datasets.
2. **Incomplete candle:** A green forming candle cannot establish final high/low/close or predict the next completed candle.
3. **Position sizing:** A $100 planning budget divided by $0.50 fictional entry-stop distance gives an arithmetic ceiling of 200 shares before capital/fees; realized losses may exceed planned price risk and orders may not execute.
4. **Unsaved chat:** Never invent past member reasoning when verified private saved history is absent.

Full example turns and case acceptance are in the JSON contract. The four cases are approved for *original fictional teaching specification only*, not release grading or market prediction.

## QA and decisions

Accept only when real signed-in authorized sessions demonstrate all modes, independent lens/method checks, misconception-specific correction, no assessed answer leakage, correct examples, saved-history isolation, keyboard/mobile accessibility, no model spending and complete source provenance. Existing Classroom source and tests are references, not proof that every 25-combination journey is live.

## Revision

| Version | Date | Record |
|---|---|---|
| 1.0 | 2026-11-03 | Consolidated four modes, six phases, 25 lens/method combinations, prohibited responses and sample dialogues; preserved existing controls and protected grading. |

Footer — SMFGU-TALIA-CHAT-P4-INSTRUCTION-001 · v1.0 · Internal teaching specification only.
