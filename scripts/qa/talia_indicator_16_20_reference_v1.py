#!/usr/bin/env python3
"""Independent Python Tutor numerical reference — studies 16–20.
Fictional completed observations, declared settings; no third-party data or model.
Period conventions: Williams %R 14, ROC and momentum 10, TRIX EMA(9) triple
SMA-seeded, KST ROC 10/15/20/30 smoothed 10/10/10/15 with weights 1/2/3/4.
"""
import json
prices = [100+.11*i+((i%11)-5)*.23+((i%7)-3)*.07 for i in range(150)]
high = [x+1.20+.01*(i%5) for i,x in enumerate(prices)]
low = [x-1.10-.01*(i%4) for i,x in enumerate(prices)]
def rolling_mean(a,length):
    result=[None]*len(a)
    for pos in range(length-1,len(a)):
        segment=a[pos-length+1:pos+1]
        if all(v is not None for v in segment):
            result[pos]=sum(segment)/length
    return result
def seeded_ema(series,period):
    out=[None]*len(series)
    factor=2/(period+1)
    for i,value in enumerate(series):
        if value is None:continue
        if i and out[i-1] is not None:out[i]=factor*value+(1-factor)*out[i-1]
        elif i>=period-1:
            chunk=series[i-period+1:i+1]
            if all(v is not None for v in chunk):out[i]=sum(chunk)/period
    return out
def roc(a,period):
    out=[None]*len(a)
    for t in range(period,len(a)):
        p=a[t-period]
        if p is not None and p!=0 and a[t] is not None:
            out[t]=100*(a[t]/p-1)
    return out
will=[]
for t,v in enumerate(prices):
    if t<13:will.append(None);continue
    h=max(high[t-13:t+1]);l=min(low[t-13:t+1])
    will.append(-100*(h-v)/(h-l) if h!=l else None)
momentum=[None if t<10 else prices[t]-prices[t-10] for t in range(len(prices))]
e1=seeded_ema(prices,9);e2=seeded_ema(e1,9);e3=seeded_ema(e2,9)
trix=[None]*len(prices)
for t in range(1,len(prices)):
    a,b=e3[t],e3[t-1]
    if a is not None and b not in (None,0):trix[t]=100*(a/b-1)
parts=[rolling_mean(roc(prices,n),smooth) for n,smooth in [(10,10),(15,10),(20,10),(30,15)]]
kst=[None if any(row[t] is None for row in parts)
     else sum((j+1)*row[t] for j,row in enumerate(parts)) for t in range(len(prices))]
series={'STUDY_WILLIAMS_R':will,'STUDY_ROC':roc(prices,10),
'STUDY_PRICE_MOMENTUM':momentum,'STUDY_TRIX':trix,'STUDY_KST':kst}
print(json.dumps({k:{'last':arr[-1],'firstValid':next((i for i,x in enumerate(arr) if x is not None),None),'prefix60':arr[59]} for k,arr in series.items()},sort_keys=True,allow_nan=False))
