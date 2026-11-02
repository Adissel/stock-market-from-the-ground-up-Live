#!/usr/bin/env python3
"""Independent Python 15-study fictional calculation fixture: canonical 31–45.
No external data, provider licensing, or source-publication approval.
"""
import json,math
c=[100+.15*i+(i%7)*.09 for i in range(80)]
h=[x+1.2 for x in c];l=[x-1.1 for x in c]
v=[1000+25*i for i in range(80)]
def sma(a):return sum(a)/len(a)
def ema(prices,n):
    value=sma(prices[:n])
    for price in prices[n:]:value=(2/(n+1))*price+(1-2/(n+1))*value
    return value
def atr(n):
    values=[h[0]-l[0]]
    for i in range(1,len(c)):
        values.append(max(h[i]-l[i],abs(h[i]-c[i-1]),abs(l[i]-c[i-1])))
    result=sma(values[:n])
    for x in values[n:]:result=(result*(n-1)+x)/n
    return result
trades=[(10,100),(10.4,200),(10.2,100),(10.6,50)]
shares=sum(q for _,q in trades)
exact=sum(p*q for p,q in trades)/shares
hlc3=(10.6+10+10.2)/3
sigma=math.sqrt(sum(q*(p-exact)**2 for p,q in trades)/shares)
logreturns=[math.log(c[i]/c[i-1]) for i in range(60,80)]
avg=sma(logreturns)
vol=math.sqrt(sum((x-avg)**2 for x in logreturns)/(len(logreturns)-1))*math.sqrt(252)
prevH,prevL,prevC=110,98,106
pivot=(prevH+prevL+prevC)/3
out={
"STUDY_KELTNER_CHANNELS":ema(c,20)+2*atr(14),
"STUDY_DONCHIAN_CHANNELS":max(h[59:79]),
"STUDY_ATR":atr(14),
"STUDY_ATRP":100*atr(14)/c[-1],
"STUDY_HISTORICAL_VOLATILITY":vol,
"STUDY_CHANDELIER_EXIT":max(h[-22:])-3*atr(22),
"STUDY_PIVOT_POINTS":2*pivot-prevL,
"STUDY_FIBONACCI_RETRACEMENT":130-.382*(130-100),
"STUDY_VWAP":exact,
"STUDY_ANCHORED_VWAP":sum(p*q for p,q in trades[1:])/sum(q for _,q in trades[1:]),
"STUDY_VWAP_BANDS":exact+2*sigma,
"STUDY_VOLUME_SMA":sma(v[-5:]),
"STUDY_RVOL":v[-1]/sma(v[-6:-1]),
"STUDY_MATCHED_TIME_RVOL":1300/sma([1000,1100,1200]),
"STUDY_DOLLAR_VOLUME":sum(p*q for p,q in trades)
}
print(json.dumps({"values":out,"exactAndProxyDiffer":abs(exact-hlc3)>1e-6,
"proxy":hlc3,"tradeVolume":shares,"periodConventions":"EMA20 SMA-seeded; ATR14/22 Wilder; 20 log returns sample SD x sqrt252; prior 20 Donchian excludes current; RVOL prior 5 excludes current"}))
