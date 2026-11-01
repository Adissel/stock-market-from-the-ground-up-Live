"""Independent Decimal check for original fictional Lab Batch 04 arithmetic."""
from decimal import Decimal
from pathlib import Path
import json

root = Path(__file__).resolve().parents[2]
data = json.loads((root / "data/lab-bridge-batch04-quant-fixtures-v1.json").read_text())
assert data["schema"] == "SMFGU-LAB-BATCH04-QUANT-V1"
assert len(data["items"]) == 20
seen = set()
for row in data["items"]:
    lab = row["labId"]
    assert lab not in seen, lab
    seen.add(lab)
    a, b = (Decimal(str(v)) for v in row["inputs"])
    expected = Decimal(str(row["expected"]))
    assert abs(a-b) == expected, (lab, a, b, expected)
    assert row["kind"] == "independent_fictional_pair_difference"
    assert row["distinctTransferPrompt"].startswith("For ") or row["distinctTransferPrompt"].startswith("On ") or row["distinctTransferPrompt"].startswith("With ") or row["distinctTransferPrompt"].startswith("Using "), lab
print(f"PASS Batch04: {len(seen)} original fictional decimal calculations; not market data, grading, or editorial acceptance")
