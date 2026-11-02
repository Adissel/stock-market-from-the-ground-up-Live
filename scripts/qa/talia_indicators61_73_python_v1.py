#!/usr/bin/env python3
"""Original independent fictional component calculations for studies 61-73.
VIX official benchmark is excluded: no licensed Cboe options series or vendor
methodology/constituent feed reconstructed. One declared variant per other study.
"""
import json,math
N=140
close=[100+.045*i+2*math.sin(.45*i)+.7*math.cos(.13*i) for i in range(N)]
high=[v+1.1+.07*(i%3) for i,v in enumerate(close)]
low=[v-1.1-.05*(i%5) for i,v in enumerate(close)]
volume=[4000+31*i+180*(i%7) for i in range(N)]
def mean(x):return sum(x)/len(x)
def ema_series(a,n):
    out=[None]*len(a)
    for i,x in enumerate(a):
        if i and out[i-1] is not None and x is not None:
            out[i]=2/(n+1)*x+(1-2/(n+1))*out[i-1]
        elif i>=n-1 and all(v is not None for v in a[i-n+1:i+1]):
            out[i]=mean(a[i-n+1:i+1])
    return out
def true_range(i):
    if i==0:return high[0]-low[0]
    return max(high[i]-low[i],abs(high[i]-close[i-1]),abs(low[i]-close[i-1]))
tr=[true_range(i) for i in range(N)]
e13=ema_series(close,13)
bull=high[-1]-e13[-1];bear=low[-1]-e13[-1]
distance=(high[-1]+low[-1])/2-(high[-2]+low[-2])/2
emv=distance*(high[-1]-low[-1])/(volume[-1]/100000000)
period=14
range14=max(high[-period:])-min(low[-period:])
chop=100*math.log10(sum(tr[-period:])/range14)/math.log10(period)
vmp=[abs(high[i]-low[i-1]) for i in range(N-period,N)]
vmm=[abs(low[i]-high[i-1]) for i in range(N-period,N)]
vortex_plus=sum(vmp)/sum(tr[-period:])
vortex_minus=sum(vmm)/sum(tr[-period:])
bp=[close[i]-min(low[i],close[i-1]) for i in range(1,N)]
utr=[max(high[i],close[i-1])-min(low[i],close[i-1]) for i in range(1,N)]
def uo(n):return sum(bp[-n:])/sum(utr[-n:])
ultimate=100*(4*uo(7)+2*uo(14)+uo(28))/7
delta=[close[i]-close[i-1] for i in range(1,N)]
tsi_n=ema_series(ema_series(delta,25),13)[-1]
tsi_d=ema_series(ema_series([abs(x) for x in delta],25),13)[-1]
tsi=100*tsi_n/tsi_d
ui_period=14
drawdown=[100*(close[i]/max(close[i-ui_period+1:i+1])-1) for i in range(N-ui_period+1,N)]
# First observation of the final 14-drawdown window uses its own past 14 closes
ui_drawdowns=[]
for i in range(N-ui_period,N):
    peak=max(close[i-ui_period+1:i+1])
    ui_drawdowns.append(100*(close[i]/peak-1))
ulcer=math.sqrt(mean([x*x for x in ui_drawdowns]))
ranges=[h-l for h,l in zip(high,low)]
em1=ema_series(ranges,9);em2=ema_series(em1,9)
ratios=[a/b for a,b in zip(em1[-25:],em2[-25:])]
mass=sum(ratios)
nvi=1000.;pvi=1000.
for i in range(1,N):
    if volume[i]<volume[i-1]:nvi*=close[i]/close[i-1]
    if volume[i]>volume[i-1]:pvi*=close[i]/close[i-1]
dpo=close[-12]-mean(close[-20:])
window=10
hh=max(high[-window:]);ll=min(low[-window:])
x=2*((close[-1]-ll)/(hh-ll)) - 1
bounded=max(-.999,min(.999,x))
fisher=.5*math.log((1+bounded)/(1-bounded))
values={
"STUDY_ELDER_RAY":bull,"STUDY_EMV":emv,"STUDY_CHOPPINESS":chop,
"STUDY_VORTEX":vortex_plus,"STUDY_ULTIMATE_OSCILLATOR":ultimate,
"STUDY_TSI":tsi,"STUDY_ULCER_INDEX":ulcer,"STUDY_MASS_INDEX":mass,
"STUDY_NVI":nvi,"STUDY_PVI":pvi,"STUDY_DPO":dpo,
"STUDY_FISHER_TRANSFORM":fisher}
print(json.dumps({"values":values,"nonNumeric":["STUDY_VIX_CONTEXT"],
"otherVortexLeg":vortex_minus,"otherElderLeg":bear,"rawFisherInput":x,
"conventions":"SMA seeded EMA; EMV volume scaled 1e8; CHOP14; Vortex14; UO7/14/28; TSI25/13; Ulcer14; Mass25,9,9; NVI/PVI seed1000; DPO20 shift11; Fisher10 no recursive smoothing and clamp0.999",
"restrictions":["VIX index requires eligible licensed SPX option quotations and complete Cboe methodology","DPO timestamp plotted at t-11 is only known as of t","Fisher fixture validates one normalized transform not full platform parity"]},sort_keys=True))
