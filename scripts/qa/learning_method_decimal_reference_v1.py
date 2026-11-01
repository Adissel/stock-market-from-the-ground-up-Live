#!/usr/bin/env python3
"""Independent stdlib Decimal checks: original FICTIONAL learning math."""
from decimal import Decimal as D
def body(o,h,l,c):
    assert l <= min(o,c) <= max(o,c) <= h
    distance=abs(c-o); span=h-l
    return (distance,span,None if span==0 else D(100)*distance/span)
def vwap(items):
    value=sum((p*n for p,n in items),D(0))
    shares=sum((n for _,n in items),D(0))
    return (value,shares,None if shares==0 else value/shares)
assert body(D('31'),D('32.5'),D('30.5'),D('32')) == (D('1'),D('2'),D('50'))
a=vwap([(D('8'),D('200')),(D('10'),D('100'))])
assert a[:2] == (D('2600'),D('300'))
assert abs(a[2]-D('8.66666666666666666666667'))<D('.000001')
assert abs(body(D('18'),D('19.2'),D('17.8'),D('18.6'))[2]-D('42.85714285714'))<D('.000001')
assert vwap([(D('7'),D('120')),(D('10'),D('80'))]) == (D('1640'),D('200'),D('8.2'))
assert body(D('25'),D('25'),D('25'),D('25'))[2] is None
assert vwap([(D('5'),D('0'))])[2] is None
print('Six independently calculated scenario/edge validations passed')
