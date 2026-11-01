#!/usr/bin/env python3
"""Independent Decimal mathematical reference, fictional indicators only.

No member records, private answer keys, market feeds or paid services.
Exact seeding and missing-data conventions are declared per calculation.
"""
import json
from decimal import Decimal as D, getcontext
getcontext().prec = 35

def convert(x):
    return None if x is None else float(x)

def gap_sma(values, period):
    result = []
    for i in range(len(values)):
        window = values[i-period+1:i+1] if i>=period-1 else []
        result.append(sum(window)/D(period) if len(window)==period
                      and all(x is not None for x in window) else None)
    return result

def gap_ema(values, period):
    result=[None]*len(values)
    if len(values)<period or any(x is None for x in values[:period]):
        return result
    alpha=D(2)/D(period+1)
    previous=sum(values[:period])/D(period)
    result[period-1]=previous
    for i in range(period,len(values)):
        if values[i] is None:
            continue
        previous=alpha*values[i]+(D(1)-alpha)*previous
        result[i]=previous
    return result

def main():
    gap=[D(1),D(2),None,D(4),D(5),D(6)]
    ema_gap=[D(1),D(2),D(3),None,D(5),D(6)]
    bad_seed=[D(1),None,D(3),D(4),D(5),D(6)]
    trades=[(D(10),D(1)),(D(20),D(9))]
    exact=sum(p*v for p,v in trades)/sum(v for _,v in trades)
    hlc3=(D(20)+D(10)+D(20))/D(3)
    atr=(D(10)-D(8)+max(D(13)-D(10),abs(D(13)-D(9)),abs(D(10)-D(9))))/D(2)
    result={
        "sma_gapped":list(map(convert,gap_sma(gap,2))),
        "ema_gapped":list(map(convert,gap_ema(ema_gap,3))),
        "ema_missing_seed":list(map(convert,gap_ema(bad_seed,3))),
        "rsi_flat":[None,None,None,50,50],
        "vwap_pre_regular_zero_volume":[10,20,20],
        "vwap_trade_print":convert(exact),
        "vwap_bar_hlc3":convert(hlc3),
        "atr_two_bar_gap_seed":convert(atr),
        "bb_constant":{"middle":[None,None,5],"upper":[None,None,5],"lower":[None,None,5]}
    }
    print(json.dumps(result,separators=(',',':'),allow_nan=False))

if __name__=='__main__':
    main()
