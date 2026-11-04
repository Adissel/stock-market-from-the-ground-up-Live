#!/usr/bin/env python3
"""Independent Python arithmetic from fictional CSV; no internet or data feed."""
import csv
import json
import math
import subprocess
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
with (ROOT / 'tests/fixtures/crownlight-scanner-five-minute-v5.csv').open(newline='', encoding='utf-8') as fh:
    rows = list(csv.DictReader(fh))
bars = [dict(t=b['timestamp'], close=float(b['close']), high=float(b['high']),
             low=float(b['low']), volume=int(b['volume'])) for b in rows]
groups = defaultdict(list)
for bar in bars:
    groups[bar['t'][:10]].append(bar)
days = list(groups.values())
assert len(bars)==211 and [len(day) for day in days]==[78,78,55]

def ema(values, period):
    value = sum(values[:period])/period
    for x in values[period:]:
        alpha=2/(period+1)
        value=x*alpha + value*(1-alpha)
    return value

def rsi(values, period=14):
    changes = [values[i]-values[i-1] for i in range(1,len(values))]
    gain=sum(max(x,0) for x in changes[:period])/period
    loss=sum(max(-x,0) for x in changes[:period])/period
    for change in changes[period:]:
        gain=(gain*(period-1)+max(change,0))/period
        loss=(loss*(period-1)+max(-change,0))/period
    return 50 if gain==0 and loss==0 else 100 if loss==0 else 100-100/(1+gain/loss)

def atr(rows,period=14):
    tr=[max(rows[i]['high']-rows[i]['low'],
            abs(rows[i]['high']-rows[i-1]['close']),
            abs(rows[i]['low']-rows[i-1]['close'])) for i in range(1,len(rows))]
    value=sum(tr[:period])/period
    for x in tr[period:]:
        value=(value*(period-1)+x)/period
    return value

node=subprocess.run(['node','tests/fixtures/crownlight-scanner-v5-output.mjs'],
    cwd=ROOT,check=True,capture_output=True,text=True)
result=json.loads(node.stdout)
row=result['row']
closes=[b['close'] for b in bars]
expected={
 'price':closes[-1],
 'change_5m_pct':(closes[-1]/closes[-2]-1)*100,
 'change_2d_pct':(closes[-1]/days[0][-1]['close']-1)*100,
 'change_pct':(closes[-1]/days[1][-1]['close']-1)*100,
 'volume':sum(b['volume'] for b in days[2]),
 'prev_close':days[1][-1]['close'],
 'yesterday_volume':sum(b['volume'] for b in days[1]),
 'day_high':max(b['high'] for b in days[2]),
 'day_low':min(b['low'] for b in days[2]),
 'bar_vwap_proxy':sum(((b['high']+b['low']+b['close'])/3)*b['volume']
                      for b in days[2])/sum(b['volume'] for b in days[2]),
 'ema_9':ema(closes,9),'ema_20':ema(closes,20),'ema_200':ema(closes,200),
 'rsi_14':rsi(closes),'atr_14':atr(bars)
}
assert result['observed']==211
for name,expected_value in expected.items():
    observed=row[name]
    if observed is None or not math.isclose(observed,expected_value,rel_tol=1e-9,abs_tol=1e-9):
        raise AssertionError(f'Python/JS mismatch for {name}: {observed} vs {expected_value}')
assert row['rvol'] is None and row['float'] is None and row['spread_pct'] is None
assert row.get('vwap') is None
print('PASS: Independent Python-vs-JS parity for '+str(len(expected))+
      ' mathematical metrics over 211 fictional five-minute candles.')
