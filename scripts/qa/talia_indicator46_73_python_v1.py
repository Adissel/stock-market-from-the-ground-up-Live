#!/usr/bin/env python3
"""Fourteen independent fictional numerical checks among Tutor studies 46–73.
Unspecified vendor formulas and unresolved input/seed variants remain on hold.
"""
import json,math
n=100
c=[50+.17*i+((i%9)-4)*.22 for i in range(n)]
h=[v+1.1 for v in c];l=[v-1.3 for v in c];v=[1000+((i*17)%23)*45 for i in range(n)]
bm=[40+.09*i for i in range(n)]
def ema(a,p):
 seed=sum(a[:p])/p;alpha=2/(p+1)
 for x in a[p:]:seed=alpha*x+(1-alpha)*seed
 return seed
obv=0;adl=0;nvi=1000;pvi=1000
for i in range(n):
 clv=(2*c[i]-h[i]-l[i])/(h[i]-l[i])
 adl+=clv*v[i]
 if i:
  obv+=v[i] if c[i]>c[i-1] else (-v[i] if c[i]<c[i-1] else 0)
  if v[i]<v[i-1]:nvi*=c[i]/c[i-1]
  if v[i]>v[i-1]:pvi*=c[i]/c[i-1]
cmf=sum((2*c[i]-h[i]-l[i])/(h[i]-l[i])*v[i] for i in range(n-20,n))/sum(v[-20:])
pvo=100*(ema(v,12)-ema(v,26))/ema(v,26)
force=(c[-1]-c[-2])*v[-1]
advance=sum((100+i%7)-(92+i%5) for i in range(n))
hi_low=37-16
pct_ma=100*sum(price>ma for price,ma in zip([10,12,14,16,18],[11,11,13,17,17]))/5
elder=h[-1]-ema(c,13)
low10=min(c[-10:]);high10=max(c[-10:])
scaled=max(-.99,min(.99,2*(c[-1]-low10)/(high10-low10)-1))
fisher=.5*math.log((1+scaled)/(1-scaled))
values={'STUDY_OBV':obv,'STUDY_ACC_DIST_LINE':adl,'STUDY_CMF':cmf,
'STUDY_PVO':pvo,'STUDY_FORCE_INDEX':force,'STUDY_PRICE_RELATIVE':c[-1]/bm[-1],
'STUDY_ADVANCE_DECLINE':advance,'STUDY_NEW_HIGHS_LOWS':hi_low,'STUDY_PERCENT_ABOVE_MA':pct_ma,
'STUDY_PUT_CALL_RATIO':1100/1300,'STUDY_ELDER_RAY':elder,'STUDY_NVI':nvi,'STUDY_PVI':pvi,
'STUDY_FISHER_TRANSFORM':fisher}
print(json.dumps(values,sort_keys=True,allow_nan=False))
