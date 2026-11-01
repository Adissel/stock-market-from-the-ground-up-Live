#!/usr/bin/env python3
"""Separate Decimal reference for original FICTIONAL RSI/MACD/ATR/Bollinger tests."""
from decimal import Decimal as D, getcontext
getcontext().prec=32
def ema(a,p):
    x=sum(a[:p],D(0))/D(p)
    values=[None]*(p-1)+[x]
    alpha=D(2)/D(p+1)
    for val in a[p:]:
        x=x+alpha*(val-x)
        values.append(x)
    return values
def rsi(values,p):
    diffs=[values[i]-values[i-1] for i in range(1,len(values))]
    g=sum((max(v,D(0)) for v in diffs[:p]),D(0))/p
    l=sum((max(-v,D(0)) for v in diffs[:p]),D(0))/p
    for d in diffs[p:]:
        g=(g*(p-1)+max(d,D(0)))/p
        l=(l*(p-1)+max(-d,D(0)))/p
    value=D(50) if g==0 and l==0 else D(100) if l==0 else D(100)-D(100)/(1+g/l)
    return g,l,value
def atr(rows,p):
    true_ranges=[]
    for i,(high,low,close) in enumerate(rows):
        true_ranges.append(high-low if i==0 else max(high-low,abs(high-rows[i-1][2]),abs(low-rows[i-1][2])))
    x=sum(true_ranges[:p],D(0))/p;seed=x
    for r in true_ranges[p:]:
        x=(x*(p-1)+r)/p
    return true_ranges[-1],seed,x
def bands(closes,p,k):
    window=closes[-p:]
    mean=sum(window,D(0))/p
    sigma=(sum(((x-mean)**2 for x in window),D(0))/p).sqrt()
    return mean,sigma,mean+k*sigma
def close(a,b,eps=D('0.000001')):return abs(a-b)<=eps
g,l,r=rsi(list(map(D,[10,11,12,11,13,14])),3)
assert close(g,D(29)/D(27)) and close(l,D(4)/D(27))
assert close(r,D('87.87878787878788'))
mac=list(map(D,[10,11,12,11,13,14,15,14]))
f=ema(mac,3);s=ema(mac,5)
line=[f[i]-s[i] for i in range(4,len(mac))]
signal=ema(line,3)
assert len(signal)==4 and signal[0] is None and signal[1] is None
assert close(line[-1],f[-1]-s[-1]) and signal[-1] is not None
rows=[tuple(map(D,x)) for x in [(11,9,10),(12,10,11),(13,10,12),(14,11,13),(15,12,14)]]
assert atr(rows,3)==(D(3),D(7)/D(3),D(73)/D(27))
mean,sd,up=bands(list(map(D,[10,11,12,13,12,14])),3,D(2))
assert mean==D(13) and close(sd,(D(2)/D(3)).sqrt())
assert close(up,D(13)+D(2)*(D(2)/D(3)).sqrt())
print('Original independent Decimal indicator validation passed: RSI MACD ATR Bollinger')
