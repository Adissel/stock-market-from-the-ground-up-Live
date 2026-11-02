#!/usr/bin/env python3
"""Independent ORIGINAL fictional reference for canonical indicator guides 46–60.
Fourteen calculable conventions; proprietary SCTR remains UNVERIFIED.
No live feeds, vendor code, protected assessment or publication permission.
"""
import json,math
N=140
close=[100+.045*i+2*math.sin(.45*i)+.7*math.cos(.13*i) for i in range(N)]
high=[v+1.1+.07*(i%3) for i,v in enumerate(close)]
low=[v-1.1-.05*(i%5) for i,v in enumerate(close)]
volume=[4000+31*i+180*(i%7) for i in range(N)]
def avg(x):return sum(x)/len(x)
def ema(a,n):
    if len(a)<n:return None
    old=avg(a[:n]);alpha=2/(n+1)
    for x in a[n:]:old=alpha*x+(1-alpha)*old
    return old
obv=0
adl=[]
acc=0
money=[]
typical=[(h+l+c)/3 for h,l,c in zip(high,low,close)]
for i in range(N):
    if i:
        obv+=volume[i] if close[i]>close[i-1] else (-volume[i] if close[i]<close[i-1] else 0)
    span=high[i]-low[i]
    clv=(2*close[i]-high[i]-low[i])/span if span else 0
    flow=clv*volume[i]
    money.append(flow)
    acc+=flow;adl.append(acc)
pos=neg=0
for i in range(N-14,N):
    raw=typical[i]*volume[i]
    if typical[i]>typical[i-1]:pos+=raw
    elif typical[i]<typical[i-1]:neg+=raw
mfi=(100 if pos>0 and neg==0 else (0 if neg>0 and pos==0 else (50 if not pos and not neg else 100*pos/(pos+neg))))
cmf=sum(money[-20:])/sum(volume[-20:])
profile={}
for i in range(N):
    k=math.floor(close[i]/2)*2
    profile[k]=profile.get(k,0)+volume[i]
# Closing-price-bin allocation is only a fictional PROXY; not real volume at price.
bucket=max(profile.items(),key=lambda kv:(kv[1],-kv[0]))
benchmark=95+.03*(N-1)+.3*math.sin(.2*(N-1))
advance=[600+(13*i%97) for i in range(N)]
decline=[520+(11*i%83) for i in range(N)]
rana=[1000*(a-d)/(a+d) for a,d in zip(advance,decline)]
eligible_close=[112,105,99,102,88,105,115,93]
eligible_ma=[110,100,100,101,90,100,110,95]
values={
"STUDY_OBV":obv,
"STUDY_ACC_DIST_LINE":adl[-1],
"STUDY_CMF":cmf,
"STUDY_MFI":mfi,
"STUDY_CHAIKIN_OSCILLATOR":ema(adl,3)-ema(adl,10),
"STUDY_PVO":100*(ema(volume,12)-ema(volume,26))/ema(volume,26),
"STUDY_FORCE_INDEX":(close[-1]-close[-2])*volume[-1],
"STUDY_VOLUME_PROFILE":bucket[1],
"STUDY_PRICE_RELATIVE":close[-1]/benchmark,
"STUDY_ADVANCE_DECLINE":sum(a-d for a,d in zip(advance,decline)),
"STUDY_NEW_HIGHS_LOWS":(100+(N-1)%17)-(80+(N-1)%13),
"STUDY_MCCLELLAN_OSC":ema(rana,19)-ema(rana,39),
"STUDY_PERCENT_ABOVE_MA":100*sum(p>m for p,m in zip(eligible_close,eligible_ma))/len(eligible_close),
"STUDY_PUT_CALL_RATIO":9200/12500
}
print(json.dumps({"values":values,"nonNumerical":["STUDY_SCTR"],"sampleBars":N,
"volumeProfile":"illustrative_close_price_bin_proxy_NOT_EXCHANGE_VOLUME_AT_PRICE",
"mcclellan":"19_and_39_SMA_seeded_EMAs_on_ratio_adjusted_net_advances_times_1000",
"mfi":"14_period_typical_price_flow_no_zero_negative_in_this_fixture",
"sourceUse":"original_fictional_values_only_no_vendor_data_or_code"},sort_keys=True))
