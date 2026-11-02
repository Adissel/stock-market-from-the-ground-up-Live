#!/usr/bin/env python3
"""Independent source-only reference values for eight Talia educational studies.
Fixed fictional inputs. Not full 73-indicator chart series or official SCTR/VIX."""
import json, math
BARS=[{"high":10.2,"low":9.8,"close":10.0},{"high":10.5,"low":9.9,"close":10.3},{"high":10.8,"low":10.1,"close":10.7}]
def true_range(bar, prior):
    return max(bar["high"]-bar["low"],abs(bar["high"]-prior["close"]),abs(bar["low"]-prior["close"]))
def vortex(bars):
    plus=sum(abs(bars[i]["high"]-bars[i-1]["low"]) for i in range(1,len(bars)))
    minus=sum(abs(bars[i]["low"]-bars[i-1]["high"]) for i in range(1,len(bars)))
    tr=sum(true_range(bars[i],bars[i-1]) for i in range(1,len(bars)))
    return {"plus":plus/tr,"minus":minus/tr,"period":len(bars)-1,"trueRangeSum":tr}
def idx(closes,volumes,kind):
    v=1000.;series=[v]; count=0
    for i in range(1,len(closes)):
        changed=volumes[i]<volumes[i-1] if kind=="NVI" else volumes[i]>volumes[i-1]
        if changed:
            v*=closes[i]/closes[i-1]
            count+=1
        series.append(v)
    return {"kind":kind,"seed":1000,"value":v,"series":series,"updates":count}
def chop(bars):
    tr=sum(true_range(bars[i],bars[i-1]) for i in range(1,len(bars)))
    spread=max(x["high"] for x in bars[1:])-min(x["low"] for x in bars[1:])
    return {"period":len(bars)-1,"sum":tr,"range":spread,"value":100*math.log10(tr/spread)/math.log10(len(bars)-1)}
def emv(ph,pl,h,l,volume,scale):
    movement=(h+l-ph-pl)/2
    box=(volume/scale)/(h-l)
    return {"movement":movement,"boxRatio":box,"value":movement/box,"scale":scale}
def main():
    c=[10,11,10.5,12];v=[100,80,120,90]
    out={
     "elder":{"bull":10.5-10,"bear":9.6-10},
     "vortex":vortex(BARS),
     "NVI":idx(c,v,"NVI"),
     "PVI":idx(c,v,"PVI"),
     "ulcer":math.sqrt((100+25+0)/3),
     "emv":emv(10.2,9.8,10.7,10.1,1200,10000),
     "chop":chop(BARS),
     "fisher":.5*math.log((1+.5)/(1-.5))
    }
    print(json.dumps(out,allow_nan=False))
if __name__=="__main__":
    main()
