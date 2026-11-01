#!/usr/bin/env python3
"""Independent Python arithmetic reference for 15 existing Tutor indicator study IDs.
Fictional data only; no price feed, pandas, TA-Lib or paid infrastructure.
Conventions are explicitly specified, not claimed identical to every broker.
"""
import json
import math

N = 150
closes = [100 + .11*i + ((i % 11)-5)*.23 + ((i % 7)-3)*.07 for i in range(N)]
highs = [x + 1.20 + .01*(i%5) for i,x in enumerate(closes)]
lows = [x - 1.10 - .01*(i%4) for i,x in enumerate(closes)]

def sma(x,n):
    return [None if i<n-1 or any(v is None for v in x[i-n+1:i+1])
            else sum(x[i-n+1:i+1])/n for i in range(len(x))]

def ema(x,n):
    out=[None]*len(x); alpha=2/(n+1); seed=[]
    for i,v in enumerate(x):
        if v is None: continue
        if i and out[i-1] is not None: out[i]=alpha*v+(1-alpha)*out[i-1]
        else:
            seed=x[i-n+1:i+1] if i>=n-1 else []
            if len(seed)==n and all(z is not None for z in seed):
                out[i]=sum(seed)/n
    return out

def wma(x,n):
    out=[]
    for i in range(len(x)):
        window=x[i-n+1:i+1] if i>=n-1 else []
        out.append(sum((k+1)*v for k,v in enumerate(window))/(n*(n+1)/2)
                   if len(window)==n and all(v is not None for v in window) else None)
    return out

def hma(x,n):
    short=wma(x,n//2);long=wma(x,n)
    diff=[None if a is None or b is None else 2*a-b for a,b in zip(short,long)]
    return wma(diff,math.isqrt(n))

def kama(x,n=10):
    out=[None]*len(x)
    out[n-1]=sum(x[:n])/n
    fast=2/3;slow=2/31
    for i in range(n,len(x)):
        direction=abs(x[i]-x[i-n])
        volatility=sum(abs(x[k]-x[k-1]) for k in range(i-n+1,i+1))
        er=direction/volatility if volatility else 0
        smoothing=(er*(fast-slow)+slow)**2
        out[i]=out[i-1]+smoothing*(x[i]-out[i-1])
    return out

def rsi(x,n=14):
    out=[None]*len(x)
    gains=[max(x[i]-x[i-1],0) for i in range(1,len(x))]
    losses=[max(x[i-1]-x[i],0) for i in range(1,len(x))]
    avg_g=sum(gains[:n])/n;avg_l=sum(losses[:n])/n
    def calc(g,l):return 50 if g==0 and l==0 else (100 if l==0 else 100-100/(1+g/l))
    out[n]=calc(avg_g,avg_l)
    for i in range(n+1,len(x)):
        avg_g=(avg_g*(n-1)+gains[i-1])/n
        avg_l=(avg_l*(n-1)+losses[i-1])/n
        out[i]=calc(avg_g,avg_l)
    return out

def stochastic(x,h,l,n=14):
    out=[]
    for i in range(len(x)):
        if i<n-1:out.append(None);continue
        lo=min(l[i-n+1:i+1]);hi=max(h[i-n+1:i+1])
        out.append(None if hi==lo else 100*(x[i]-lo)/(hi-lo))
    return out

def stoch_rsi(values,n=14):
    out=[]
    for i in range(len(values)):
        chunk=values[i-n+1:i+1] if i>=n-1 else []
        if len(chunk)!=n or any(v is None for v in chunk):out.append(None);continue
        lo=min(chunk);hi=max(chunk);out.append(None if hi==lo else (values[i]-lo)/(hi-lo))
    return out

def cci(high,low,close,n=20):
    typical=[(a+b+c)/3 for a,b,c in zip(high,low,close)]
    avg=sma(typical,n);out=[]
    for i in range(len(typical)):
        if avg[i] is None:out.append(None);continue
        mean_dev=sum(abs(v-avg[i]) for v in typical[i-n+1:i+1])/n
        out.append(None if mean_dev==0 else (typical[i]-avg[i])/(.015*mean_dev))
    return out

a=sma(closes,10);e=ema(closes,10);w=wma(closes,10);h=hma(closes,16)
e2=ema(e,10);e3=ema(e2,10)
dema=[None if z is None else 2*x-z for x,z in zip(e,e2)]
tema=[None if z is None else 3*x-3*y+z for x,y,z in zip(e,e2,e3)]
fast=ema(closes,12);slow=ema(closes,26)
macd=[None if f is None or s is None else f-s for f,s in zip(fast,slow)]
signal=ema(macd,9)
hist=[None if m is None or s is None else m-s for m,s in zip(macd,signal)]
ppo=[None if f is None or s in (None,0) else 100*(f-s)/s for f,s in zip(fast,slow)]
r=rsi(closes);s=stochastic(closes,highs,lows);sr=stoch_rsi(r)
series={
 'STUDY_SMA':a,'STUDY_EMA':e,'STUDY_WMA':w,'STUDY_HMA':h,
 'STUDY_DEMA':dema,'STUDY_TEMA':tema,'STUDY_KAMA':kama(closes),
 'STUDY_MOVING_AVERAGE_RIBBON':sma(closes,20),
 'STUDY_MACD':macd,'STUDY_MACD_HISTOGRAM':hist,'STUDY_PPO':ppo,
 'STUDY_RSI':r,'STUDY_STOCHASTIC':s,'STUDY_STOCH_RSI':sr,
 'STUDY_CCI':cci(highs,lows,closes),
}
print(json.dumps({k:{"last":v[-1],"firstValid":next((i for i,x in enumerate(v) if x is not None),None)}
for k,v in series.items()},sort_keys=True,allow_nan=False))
