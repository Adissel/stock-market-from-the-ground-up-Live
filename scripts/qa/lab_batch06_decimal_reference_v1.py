"""Independent decimal comparisons for 20 original fictional Batch06 cases; not financial source approval."""
from decimal import Decimal
from pathlib import Path
import json
root=Path(__file__).resolve().parents[2]
fixture=json.loads((root/'data/lab-bridge-batch06-quant-fixtures-v1.json').read_text())
assert fixture['schema']=='SMFGU-LAB-BATCH06-QUANT-FIXTURES-V1'
assert len(fixture['cases'])==20
seen=set()
for item in fixture['cases']:
    lab=item['labId']
    assert lab not in seen
    seen.add(lab)
    a,b=(Decimal(str(value)) for value in item['inputs'])
    assert abs(a-b)==Decimal(str(item['expected'])),(lab,a,b,item['expected'])
    assert item['unit'] in ('USD/share','shares')
    assert item['status']=='FICTIONAL_MATH_ONLY_NO_EDITORIAL_ACCEPTANCE'
print('PASS 20 independent fictional Batch06 arithmetic checks; claim and member acceptance remain pending.')
