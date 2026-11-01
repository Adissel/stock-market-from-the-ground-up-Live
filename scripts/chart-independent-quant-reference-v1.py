#!/usr/bin/env python3
"""Original, stdlib-only independent quantitative reference for fictional training candles.
No network, account, prices, orders, authentication, or paid infrastructure.
Use absolute UTC minute boundaries for completed 1/3/5-minute bars.
"""
from __future__ import annotations
import datetime as dt
import json
import math

def training_bars():
    result = []
    for day in (7, 8):
        start = dt.datetime(2024, 5, day, 13, 30, tzinfo=dt.timezone.utc)
        for k in range(120):
            i = len(result)
            op = round(98 + 0.07*i + (i % 7 - 3)*0.08, 4)
            close = round(op + (i % 5 - 2)*0.04, 4)
            high = round(max(op, close) + 0.12 + (i % 3)*0.02, 4)
            low = round(min(op, close) - 0.13 - (i % 4)*0.01, 4)
            result.append({"ms": int((start + dt.timedelta(minutes=k)).timestamp()*1000),
                           "o":op,"h":high,"l":low,"c":close,"v":700+(i%13)*43+(i//15)*11})
    return result

def simple_mean(numbers, window):
    return [None if i+1<window else math.fsum(numbers[i-window+1:i+1])/window
            for i in range(len(numbers))]

def exp_mean(numbers, window):
    out = [None]*len(numbers)
    if len(numbers)<window:
        return out
    a = 2/(window+1)
    current = math.fsum(numbers[:window])/window
    out[window-1] = current
    for i in range(window,len(numbers)):
        current = a*numbers[i]+(1-a)*current
        out[i] = current
    return out

def rsi(prices,window):
    out = [None]*len(prices)
    if len(prices)<=window:return out
    differences=[prices[i]-prices[i-1] for i in range(1,len(prices))]
    gains=math.fsum(max(0,x) for x in differences[:window])/window
    losses=math.fsum(max(0,-x) for x in differences[:window])/window
    def value(g,l):
        return 50 if g==0 and l==0 else 100 if l==0 else 100-100/(1+g/l)
    out[window]=value(gains,losses)
    for i in range(window+1,len(prices)):
        change=differences[i-1]
        gains=(gains*(window-1)+max(0,change))/window
        losses=(losses*(window-1)+max(0,-change))/window
        out[i]=value(gains,losses)
    return out

def atr(rows,window):
    out=[None]*len(rows)
    if len(rows)<window:return out
    tr=[]
    for i,b in enumerate(rows):
        prior=rows[i-1]["c"] if i else None
        tr.append(b["h"]-b["l"] if prior is None else max(
            b["h"]-b["l"],abs(b["h"]-prior),abs(b["l"]-prior)))
    last=math.fsum(tr[:window])/window
    out[window-1]=last
    for i in range(window,len(rows)):
        last=(last*(window-1)+tr[i])/window
        out[i]=last
    return out

def bb(prices,window,multiplier):
    middle=simple_mean(prices,window)
    upper=[None]*len(prices)
    lower=[None]*len(prices)
    for i,mean in enumerate(middle):
        if mean is None:continue
        variance=math.fsum((x-mean)**2 for x in prices[i-window+1:i+1])/window
        upper[i]=mean+multiplier*math.sqrt(variance)
        lower[i]=mean-multiplier*math.sqrt(variance)
    return {"middle":middle,"upper":upper,"lower":lower}

def macd(prices):
    a,b=exp_mean(prices,12),exp_mean(prices,26)
    line=[None if x is None or y is None else x-y for x,y in zip(a,b)]
    indices=[i for i,x in enumerate(line) if x is not None]
    values=[line[i] for i in indices]
    smoothed=exp_mean(values,9)
    signal=[None]*len(prices)
    for i,x in zip(indices,smoothed):signal[i]=x
    histogram=[None if line[i] is None or signal[i] is None else line[i]-signal[i] for i in range(len(prices))]
    return {"line":line,"signal":signal,"histogram":histogram}

def vwap(rows):
    result=[]
    day=None;total_value=0.;total_volume=0
    for b in rows:
        date=dt.datetime.fromtimestamp(b["ms"]/1000,dt.timezone.utc).date()
        if date!=day:day=date;total_value=0.;total_volume=0
        typical=(b["h"]+b["l"]+b["c"])/3
        total_value+=typical*b["v"];total_volume+=b["v"]
        result.append(total_value/total_volume if total_volume else None)
    return result

def completed_aggregate(rows,window):
    if window==1:
        return [dict(b,end=b["ms"]+60000) for b in rows]
    buckets={}
    for b in rows:
        key=b["ms"]//(window*60000)
        buckets.setdefault(key,[]).append(b)
    result=[]
    for key in sorted(buckets):
        seq=buckets[key]
        start=key*window*60000
        if len(seq)!=window or seq[0]["ms"]!=start:continue
        if any(seq[i]["ms"]!=start+i*60000 for i in range(window)):continue
        result.append({"ms":start,"end":start+window*60000,
                       "o":seq[0]["o"],"h":max(x["h"] for x in seq),
                       "l":min(x["l"] for x in seq),"c":seq[-1]["c"],
                       "v":sum(x["v"] for x in seq)})
    return result

def main():
    bars=training_bars()
    closes=[b["c"] for b in bars]
    out={"bars":bars,
         "studies":{"sma9":simple_mean(closes,9),"ema9":exp_mean(closes,9),
                    "ema20":exp_mean(closes,20),"ema200":exp_mean(closes,200),
                    "rsi14":rsi(closes,14),"atr14":atr(bars,14),
                    "bb20":bb(closes,20,2),"macd":macd(closes),"vwap":vwap(bars)},
         "aggregate":{str(k):completed_aggregate(bars,k) for k in (1,3,5)},
         "prefixes":{str(n):{str(k):completed_aggregate(bars[:n],k) for k in (1,3,5)}
                     for n in (8,37,119,120,125,240)}}
    print(json.dumps(out,allow_nan=False,separators=(",",":")))

if __name__=="__main__":main()
