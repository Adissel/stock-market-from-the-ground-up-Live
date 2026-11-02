#!/usr/bin/env python3
"""Offline deterministic validation of indicator math and fictional OHLCV.
No paid services, database access, or live market-feed dependencies.
Usage: python3 tools/finance/verify_indicators.py
"""
from dataclasses import dataclass
from math import isfinite
from typing import Sequence
@dataclass(frozen=True)
class Bar:
    close: float
    high: float
    low: float
    volume: float
def check(bars: Sequence[Bar]) -> None:
    for index, bar in enumerate(bars):
        if not all(map(isfinite, (bar.close, bar.high, bar.low, bar.volume))):
            raise ValueError(f"nonfinite bar {index}")
        if bar.volume < 0 or bar.low > bar.close or bar.high < bar.close or bar.low > bar.high:
            raise ValueError(f"invalid OHLCV bar {index}")
def ema(closes: Sequence[float], period: int) -> list[float]:
    if period < 1 or len(closes) < period: raise ValueError("not enough bars")
    if not all(map(isfinite, closes)): raise ValueError("nonfinite closes")
    values=[float("nan")]*(period-1)
    prior=sum(closes[:period])/period
    values.append(prior)
    alpha=2/(period+1)
    for value in closes[period:]:
        prior=alpha*value+(1-alpha)*prior
        values.append(prior)
    return values
def hlc3_vwap(bars: Sequence[Bar]) -> list[float]:
    """Bar-based proxy VWAP, NOT exact trade-print VWAP."""
    check(bars); numerator=0.;denominator=0.;out=[]
    for bar in bars:
        numerator+=(bar.high+bar.low+bar.close)/3*bar.volume
        denominator+=bar.volume
        out.append(numerator/denominator if denominator else float("nan"))
    return out
def test() -> None:
    e=ema([1.,2.,3.,4.],3)
    assert len(e)==4 and e[2]==2 and e[3]==3
    bars=[Bar(10,11,9,100),Bar(12,13,11,200)]
    v=hlc3_vwap(bars)
    assert len(v)==2 and abs(v[-1]-(10*100+12*200)/300)<1e-10
    try: check([Bar(3,2,1,10)])
    except ValueError: pass
    else: raise AssertionError("Invalid bar accepted")
if __name__=="__main__":
    test()
    print("PASS: Python indicator and OHLCV verification")
