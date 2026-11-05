#!/usr/bin/env python3
"""SMFGU-TALIA-CHAT-001: independent Decimal checks of fictional chart input."""
import ast
import re
from decimal import Decimal, getcontext
from pathlib import Path

getcontext().prec = 28
source = (Path(__file__).resolve().parents[2] / "src/tutor/talia-chart-evidence-v1.js").read_text()
classroom = (Path(__file__).resolve().parents[2] / "src/tutor/TaliaClassroom.tsx").read_text()
assert "const REPLAY:number[][]=TALIA_REPLAY" in classroom, "Classroom must use the same fixture as the server"
match = re.search(r"export const TALIA_REPLAY=\[([\s\S]*?)\];", source)
assert match, "The classroom fictional OHLC dataset must be explicit and reviewable"
bars = ast.literal_eval("[" + match.group(1) + "]")
assert len(bars) == 12
decimal = lambda n: Decimal(str(n))
for index, (opened, closed, lowest, highest) in enumerate(bars, 1):
    o, c, lo, hi = map(decimal, (opened, closed, lowest, highest))
    assert lo <= min(o, c) <= max(o, c) <= hi, f"Bad candle {index}"
    assert hi > lo, f"Zero-range fictional candle {index}"
closes = [decimal(row[1]) for row in bars]
seed = sum(closes[:3]) / Decimal(3)
assert seed == Decimal("20.17666666666666666666666667")
ema4 = (closes[3] + seed) / 2
ema5 = (closes[4] + ema4) / 2
assert abs(ema4 - Decimal("20.28833333333333333333333334")) < Decimal("0.0000000000001")
assert abs(ema5 - Decimal("20.31916666666666666666666667")) < Decimal("0.0000000000001")
assert len(bars) < 200, "The initial twelve reviewed bars alone cannot warm EMA 200"
print("Talia fictional OHLC + independent Decimal EMA initialization: PASS")
