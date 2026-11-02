#!/usr/bin/env python3
"""Independent fictional numerical reference for eight of ten Talia studies 21-30.
SAR and Supertrend remain unverified vendor-algorithm variants.
"""
import json,math
c=[100+i*0.11+((i%7)-3)*0.31 for i in range(120)]
h=[v+1.2 for v in c]
l=[v-1.1 for v in c]
def ar(a,high=True):
 window=a[-25:]
 v=max(window) if high else min(window)
 ago=24-max(i for i,x in enumerate(window) if x==v)
 return 100*(25-ago)/25
up=ar(h);dn=ar(l,False)
n=14;tr=[];pos=[];neg=[]
for i in range(1,120):
 tr.append(max(h[i]-l[i],abs(h[i]-c[i-1]),abs(l[i]-c[i-1])))
 u=h[i]-h[i-1];d=l[i-1]-l[i]
 pos.append(u if u>d and u>0 else 0)
 neg.append(d if d>u and d>0 else 0)
rt=sum(tr[:n]);rp=sum(pos[:n]);rm=sum(neg[:n]);dx=[]
for i in range(n-1,len(tr)):
 if i>=n:
  rt=rt-rt/n+tr[i];rp=rp-rp/n+pos[i];rm=rm-rm/n+neg[i]
 p=100*rp/rt;m=100*rm/rt
 dx.append(100*abs(p-m)/(p+m) if p+m else 0)
adx=sum(dx[:n])/n
for v in dx[n:]:adx=(adx*13+v)/14
def midpoint(length):
 return (max(h[-length:])+min(l[-length:]))/2
ich=(midpoint(9)+midpoint(26))/2
w=c[-20:];mid=sum(w)/20
sd=math.sqrt(sum((v-mid)**2 for v in w)/20)
hi=mid+2*sd;lo=mid-2*sd
v={'STUDY_AROON':up,'STUDY_AROON_OSCILLATOR':up-dn,
'STUDY_ADX':adx,'STUDY_DIRECTIONAL_MOVEMENT':p-m,
'STUDY_ICHIMOKU':ich,'STUDY_BOLLINGER_BANDS':hi,
'STUDY_BOLLINGER_PERCENT_B':(c[-1]-lo)/(hi-lo),
'STUDY_BOLLINGER_BANDWIDTH':100*(hi-lo)/mid}
print(json.dumps(v,sort_keys=True,allow_nan=False))
