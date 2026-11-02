#!/usr/bin/env python3
"""Independent full-series fictional Crownlight browser source math reference.
This does NOT reimplement vendor-exact VWAP or confer member authorization.
All 225 observations correspond to completed regular-session fictional candles.
"""
import json,math
N=225
close=[100+i*.045+math.sin(i*.21)*.6 for i in range(N)]
opening=[x+(-.18 if i%2==0 else .14) for i,x in enumerate(close)]
high=[max(c,o)+.25 for c,o in zip(close,opening)]
low=[min(c,o)-.29 for c,o in zip(close,opening)]
volume=[1000+(i%17)*39 for i in range(N)]
def mean(a):return sum(a)/len(a)
def sma(a,n):
    out=[None]*len(a)
    for i in range(n-1,len(a)):
        window=a[i-n+1:i+1]
        if all(math.isfinite(x) for x in window):out[i]=mean(window)
    return out
def ema(a,n):
    out=[None]*len(a)
    if len(a)<n:return out
    if not all(math.isfinite(x) for x in a[:n]):return out
    prev=mean(a[:n]);out[n-1]=prev;alpha=2/(n+1)
    for i in range(n,len(a)):
        if not math.isfinite(a[i]):continue
        prev=alpha*a[i]+(1-alpha)*prev;out[i]=prev
    return out
def ema_sparse(a,n):
    indices=[i for i,v in enumerate(a) if v is not None]
    compact=[a[i] for i in indices];res=ema(compact,n);out=[None]*len(a)
    for index,value in zip(indices,res):out[index]=value
    return out
def rsi(n=14):
    out=[None]*N;gain=loss=0
    for i in range(1,n+1):
        change=close[i]-close[i-1]
        gain+=max(0,change);loss+=max(0,-change)
    gain/=n;loss/=n
    def val(g,l):return 50 if g==0 and l==0 else (100 if l==0 else 100-100/(1+g/l))
    out[n]=val(gain,loss)
    for i in range(n+1,N):
        diff=close[i]-close[i-1]
        gain=(gain*(n-1)+max(0,diff))/n
        loss=(loss*(n-1)+max(0,-diff))/n
        out[i]=val(gain,loss)
    return out
def atr(n=14):
    tr=[]
    for i in range(N):
        if i==0:tr.append(high[i]-low[i])
        else:tr.append(max(high[i]-low[i],abs(high[i]-close[i-1]),abs(low[i]-close[i-1])))
    out=[None]*N;v=mean(tr[:n]);out[n-1]=v
    for i in range(n,N):
        v=(v*(n-1)+tr[i])/n;out[i]=v
    return out
def bb(n=20,m=2):
    middle=sma(close,n);up=[None]*N;down=[None]*N
    for i in range(n-1,N):
        mu=middle[i]
        st=math.sqrt(sum((v-mu)**2 for v in close[i-n+1:i+1])/n)
        up[i]=mu+m*st;down[i]=mu-m*st
    return middle,up,down
e12=ema(close,12);e26=ema(close,26)
line=[a-b if a is not None and b is not None else None for a,b in zip(e12,e26)]
signal=ema_sparse(line,9)
hist=[x-y if x is not None and y is not None else None for x,y in zip(line,signal)]
volsum=notional=0;proxy=[];hod=[];lod=[];prev_hi=-math.inf;prev_lo=math.inf
for i in range(N):
    volsum+=volume[i]
    notional+=((high[i]+low[i]+close[i])/3)*volume[i]
    proxy.append(notional/volsum)
    prev_hi=max(prev_hi,high[i]);prev_lo=min(prev_lo,low[i])
    hod.append(prev_hi);lod.append(prev_lo)
middle,upper,lower=bb()
ors_hi=max(high[:5]);ors_lo=min(low[:5])
result={"EMA9":ema(close,9),"EMA20":ema(close,20),"EMA200":ema(close,200),
"SMA20":sma(close,20),"VOLUME_SMA20":sma(volume,20),
"RSI14":rsi(),"ATR14":atr(),"BB20_MIDDLE":middle,"BB20_UPPER":upper,
"BB20_LOWER":lower,"MACD_LINE":line,"MACD_SIGNAL":signal,"MACD_HIST":hist,
"VWAP_HLC3_PROXY":proxy,"HOD":hod,"LOD":lod,
"OPEN_RANGE5_UPPER":[None]*5+[ors_hi]*(N-5),
"OPEN_RANGE5_LOWER":[None]*5+[ors_lo]*(N-5)}
print(json.dumps({"bars":N,"fixture":"2024-05-07 09:30–13:14 ET 1-minute completed fictional",
"studyCount":len(result),"fullSeries":result,
"limitations":"HLC3 bar volume-weighted proxy, not trade print VWAP; single regular session; no authenticated market feed; Python and browser independent calculations only"},allow_nan=False))
