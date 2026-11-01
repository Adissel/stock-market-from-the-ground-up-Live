#!/usr/bin/env python3
"""Independent Decimal verification of original fictional EMA/risk teaching.
Not a production Python service or market-data processor.
"""
from decimal import Decimal as D, getcontext
getcontext().prec=30
def ema(closes,period):
    if len(closes)<period+1: return None
    alpha=D(2)/D(period+1)
    seed=sum(closes[:period],D(0))/D(period)
    value=seed
    for price in closes[period:]:
        value=alpha*price+(D(1)-alpha)*value
    return (seed,alpha,value)
def risk(entry,stop):
    if entry<=0 or stop<=0 or entry==stop:return None
    return abs(entry-stop)
def sizing(entry,stop,budget,cash):
    d=risk(entry,stop)
    if d is None or budget<=0 or cash<=0:return None
    risk_cap=int(budget//d)
    cash_cap=int(cash//entry)
    return risk_cap,cash_cap,min(risk_cap,cash_cap)
assert ema(list(map(D,['10','12','14','16'])),3)==(D(12),D('0.5'),D(14))
assert ema(list(map(D,['20','22','24','26'])),3)==(D(22),D('0.5'),D(24))
assert ema(list(map(D,['10','12','14'])),3) is None
assert risk(D(42),D('40.5'))==D('1.5')
assert risk(D(30),D('28.75'))==D('1.25')
assert risk(D(42),D(42)) is None
assert sizing(D(42),D('40.5'),D(150),D(3000))==(100,71,71)
assert sizing(D(27),D(25),D(70),D(1200))==(35,44,35)
assert sizing(D(42),D('40.5'),D('149.99'),D(3000))==(99,71,71)
assert sizing(D(42),D(42),D(150),D(3000)) is None
assert sizing(D(42),D('40.5'),D('0.5'),D(3000))==(0,71,0)
print("11 independent Decimal checks passed: SMA-seeded EMA, risk, whole-share constraints.")
