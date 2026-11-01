#!/usr/bin/env python3
"""Independent Python reference: completed fictional, chronological bars only.
Default methods are declared variants, not universal vendor implementations.
"""
import math,json
N=160
close=[100+.17*i+math.sin(i/5)*3 - max(0,i-100)*.5 for i in range(N)]
bars=[]
for i,c in enumerate(close):
    op=(close[i-1] if i else 100)+.08*math.sin(i)
    bars.append({"open":op,"close":c,"high":max(op,c)+.5+.02*(i%3),
       "low":min(op,c)-.5-.01*(i%4)})
def tr(i):
    b=bars[i]
    if i==0:return b["high"]-b["low"]
    pc=bars[i-1]["close"]
    return max(b["high"]-b["low"],abs(b["high"]-pc),abs(b["low"]-pc))
def dmi(n=14):
    length=len(bars);tt=[0]*length;p=[0]*length;m=[0]*length
    for i in range(1,length):
        up=bars[i]["high"]-bars[i-1]["high"]
        down=bars[i-1]["low"]-bars[i]["low"]
        tt[i]=tr(i);p[i]=up if up>down and up>0 else 0
        m[i]=down if down>up and down>0 else 0
    adx=[None]*length;dp=[None]*length;dm=[None]*length;dx=[None]*length
    st=sum(tt[1:n+1]);sp=sum(p[1:n+1]);sm=sum(m[1:n+1])
    for i in range(n,length):
        if i>n:
            st=st-st/n+tt[i];sp=sp-sp/n+p[i];sm=sm-sm/n+m[i]
        if st<=0:continue
        dp[i]=100*sp/st;dm[i]=100*sm/st
        tot=dp[i]+dm[i];dx[i]=100*abs(dp[i]-dm[i])/tot if tot else 0
    if all(x is not None for x in dx[n:2*n]):
        adx[2*n-1]=sum(dx[n:2*n])/n
        for i in range(2*n,length):
            if dx[i] is not None:adx[i]=(adx[i-1]*(n-1)+dx[i])/n
    return adx,dp,dm
def psar(step=.02,maximum=.2):
    res=[None]*N;up=close[1]>=close[0]
    val=bars[0]["low"] if up else bars[0]["high"]
    ep=max(bars[0]["high"],bars[1]["high"]) if up else min(bars[0]["low"],bars[1]["low"])
    af=step;res[1]=val
    for i in range(2,N):
        x=bars[i];p=bars[i-1];old=bars[i-2]
        new=val+af*(ep-val)
        if up:
            new=min(new,p["low"],old["low"])
            if x["low"]<new:up=False;val=ep;ep=x["low"];af=step
            else:
                val=new
                if x["high"]>ep:ep=x["high"];af=min(maximum,af+step)
        else:
            new=max(new,p["high"],old["high"])
            if x["high"]>new:up=True;val=ep;ep=x["high"];af=step
            else:
                val=new
                if x["low"]<ep:ep=x["low"];af=min(maximum,af+step)
        res[i]=val
    return res
def atr(n=14):
    values=[tr(i) for i in range(N)];out=[None]*N
    out[n-1]=sum(values[:n])/n
    for i in range(n,N):out[i]=(out[i-1]*(n-1)+values[i])/n
    return out
def st(n=14,m=3):
    a=atr(n);out=[None]*N;direction=-1;upper=None;lower=None
    for i in range(n-1,N):
        center=(bars[i]["high"]+bars[i]["low"])/2
        u=center+m*a[i];l=center-m*a[i]
        if i==n-1:upper=u;lower=l;out[i]=upper;continue
        pc=close[i-1];pu=upper;pl=lower
        upper=u if u<pu or pc>pu else pu
        lower=l if l>pl or pc<pl else pl
        if direction==-1 and close[i]>upper:direction=1
        elif direction==1 and close[i]<lower:direction=-1
        out[i]=lower if direction==1 else upper
    return out
def mid(i,n):
    if i<n-1:return None
    region=bars[i-n+1:i+1]
    return (max(x["high"] for x in region)+min(x["low"] for x in region))/2
def cloud():
    a=[None]*N;b=[None]*N
    for i in range(N):
        t=mid(i,9);k=mid(i,26)
        a[i]=(t+k)/2 if t is not None and k is not None else None
        b[i]=mid(i,52)
    return a,b
def summary(vals):
    return {"last":vals[-1],"firstValid":next((i for i,v in enumerate(vals) if v is not None),None)}
dx,dp,dm=dmi();ca,cb=cloud()
print(json.dumps({"ADX":summary(dx),"+DI":summary(dp),"-DI":summary(dm),
"PSAR":summary(psar()),"ATR":summary(atr()),"SUPERTREND":summary(st()),
"SPAN_A":summary(ca),"SPAN_B":summary(cb),
"prefix":{"bars":N,"lastCompletedClose":close[-1],"plotIndex":N-1+26}},sort_keys=True))
