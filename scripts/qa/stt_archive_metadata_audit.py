#!/usr/bin/env python3
"""Offline metadata-only research audit; never publishes STT text or market data.

Usage: python3 scripts/qa/stt_archive_metadata_audit.py /path/to/STT.zip
Requires only Python's standard library; no hosting or network service.
The output is a provenance checklist, not a license or independent fact-check.
"""
import json
import sys
import zipfile
from pathlib import Path

CANDIDATES = {
    8: "Phase_8_Scanner_Logic_FULL_MACHINE_READABLE.json",
    9: "Phase_9_Chart_Reading_and_Entry_Model_FULL_MACHINE_READABLE.json",
    10: "Phase_10_Risk_Position_Size_and_Trade_Management_FULL_MACHINE_READABLE.json",
}
def audit(path: Path) -> dict:
    result = {"archive": path.name, "classification": "RESEARCH_ONLY_NO_MARKET_DATA_RIGHTS",
              "licensed_ohlcv_or_redistribution_proven": False,
              "independent_technical_validation_proven": False, "phase_metadata": {}, "errors": []}
    with zipfile.ZipFile(path) as archive:
        names = archive.namelist()
        for phase, suffix in CANDIDATES.items():
            selected = [n for n in names if n.endswith(suffix)]
            if len(selected) != 1:
                result["errors"].append(f"Phase {phase}: missing or duplicate metadata source")
                continue
            if archive.getinfo(selected[0]).file_size > 2_000_000:
                result["errors"].append(f"Phase {phase}: excessive JSON size")
                continue
            record = json.loads(archive.read(selected[0]))
            ctl, stats = record.get("document_control", {}), record.get("stats", {})
            if not isinstance(ctl, dict) or not isinstance(stats, dict):
                result["errors"].append(f"Phase {phase}: invalid control or statistics shape")
                continue
            result["phase_metadata"][str(phase)] = {
                "document_id": ctl.get("Document_ID"), "version": ctl.get("Version"),
                "status_as_claimed_by_archive": ctl.get("Status"),
                "as_of": ctl.get("Document_Date"), "counts_as_claimed_by_archive": stats,
            }
    stats8 = result["phase_metadata"].get("8", {}).get("counts_as_claimed_by_archive", {})
    if stats8.get("Statistically_Validated_Strategies_From_Phase7") != 0 or stats8.get("Production_Challengers_Promoted") != 0:
        result["errors"].append("Phase 8 promotion controls differ from zero-evidence baseline; manual review required")
    return result

def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: stt_archive_metadata_audit.py STT.zip", file=sys.stderr)
        return 2
    path = Path(sys.argv[1])
    if not path.is_file():
        print("Archive not available", file=sys.stderr)
        return 2
    try:
        result = audit(path)
    except (OSError, ValueError, zipfile.BadZipFile) as error:
        print(f"Archive metadata audit failed: {type(error).__name__}: {error}", file=sys.stderr)
        return 1
    print(json.dumps(result, indent=2, sort_keys=True))
    return 1 if result["errors"] else 0

if __name__ == "__main__":
    raise SystemExit(main())
