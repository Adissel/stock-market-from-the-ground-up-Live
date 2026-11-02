#!/usr/bin/env python3
"""Independent Decimal reference for optional React ECharts completed-candle adapter."""
from decimal import Decimal
def ema(values, period):
    assert period > 0
    if len(values) < period:
        return [None] * len(values)
    out = [None] * len(values)
    avg = sum(values[:period]) / Decimal(period)
    out[period - 1] = avg
    alpha = Decimal(2) / Decimal(period + 1)
    for i in range(period, len(values)):
        avg = alpha * values[i] + (Decimal(1) - alpha) * avg
        out[i] = avg
    return out
def vwap(bars):
    num = Decimal(0)
    denom = Decimal(0)
    out = []
    for h,l,c,v in bars:
        assert v >= 0
        num += ((h+l+c)/Decimal(3))*v
        denom += v
        out.append(num/denom if denom else None)
    return out
values = [Decimal(i) for i in range(1, 26)]
assert ema(values, 9)[8] == Decimal(5)
assert ema(values, 20)[19] == Decimal('10.5')
assert ema(values, 9)[9] == Decimal(6)
bars = [(Decimal(11),Decimal(9),Decimal(10),Decimal(100)),(Decimal(13),Decimal(11),Decimal(12),Decimal(300))]
assert vwap(bars) == [Decimal(10),Decimal(Decimal(46)/Decimal(4))]
assert vwap([(Decimal(1),Decimal(1),Decimal(1),Decimal(0))]) == [None]
print('PASS Decimal EMA initialization and HLC3 volume-weighted proxy')
