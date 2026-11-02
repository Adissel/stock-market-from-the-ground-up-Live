"""Independent Python Decimal arithmetic for 20 fictional Batch05 original Lab examples."""
from decimal import Decimal
from pathlib import Path
import json
root=Path(__file__).resolve().parents[2]
fixture=json.loads((root/'data/lab-bridge-batch05-quant-fixtures-v1.json').read_text())
assert fixture['schema']=='SMFGU-LAB-BATCH05-QUANT-FIXTURES-V1'
assert len(fixture['cases'])==20
seen=set()
for item in fixture['cases']:
    lab=item['labId']
    assert lab not in seen
    seen.add(lab)
    values=[Decimal(str(s)) for s in item['inputs']]
    assert len(values)==2
    expected=Decimal(str(item['expected']))
    assert abs(values[0]-values[1])==expected, (lab,values,expected)
    assert item['status']=='FICTIONAL_MATH_SOURCE_ONLY'
print('PASS 20 Batch05 original fictional independent arithmetic cases; NOT external source, legal or member approval')
