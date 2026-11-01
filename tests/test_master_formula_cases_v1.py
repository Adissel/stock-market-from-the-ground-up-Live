"""Independent Python stdlib recomputation; not a web service and not licensed data ingestion."""
import json,math,pathlib
d=json.loads((pathlib.Path(__file__).resolve().parents[1]/'docs/research/master/formula-verification-fixtures-v1.json').read_text())
assert len(d['cases'])==10
def near(actual,target): assert math.isfinite(actual) and math.isclose(actual,target,rel_tol=0,abs_tol=1e-9),(actual,target)
def seeded_ema(vals,p):
    out=[None]*(p-1)+[sum(vals[:p])/p]
    alpha=2/(p+1)
    for x in vals[p:]:out.append(alpha*x+(1-alpha)*out[-1])
    return out
def evaluate(c):
    x,e=c['inputs'],c['expected']
    if c['id']=='SMA':near(sum(x['closes'][-x['period']:])/x['period'],e['valueAtIndex3'])
    elif c['id']=='EMA':
        a=seeded_ema(x['closes'],x['period']);near(a[x['period']-1],e['seed']);near(a[-1],e['valueAtIndex3'])
    elif c['id']=='VWAP_PRINTS':
        total=sum(v['shares'] for v in x['prints']);notional=sum(v['price']*v['shares'] for v in x['prints']);near(total,e['totalShares']);near(notional,e['totalNotional']);near(notional/total,e['value'])
    elif c['id']=='VWAP_OHLCV_PROXY':
        total=sum(v['volume'] for v in x['bars']);vwap=sum((v['high']+v['low']+v['close'])/3*v['volume'] for v in x['bars'])/total;near(vwap,e['value']);assert abs(vwap-11.5)>0.1
    elif c['id']=='RSI':
        prices=x['closes'];p=x['period'];deltas=[b-a for a,b in zip(prices,prices[1:])]
        g=sum(max(z,0) for z in deltas[:p])/p;l=sum(max(-z,0) for z in deltas[:p])/p
        near(g,e['seedGain']);near(l,e['seedLoss'])
        for z in deltas[p:]:g=(g*(p-1)+max(z,0))/p;l=(l*(p-1)+max(-z,0))/p
        value=50 if g==l==0 else 100 if l==0 else 100-100/(1+g/l)
        near(value,e['valueAtIndex4'])
    elif c['id']=='MACD':
        values=x['closes'];fast=seeded_ema(values,x['fast']);slow=seeded_ema(values,x['slow'])
        line=[fast[i]-slow[i] for i in range(x['slow']-1,len(values))]
        signal=seeded_ema(line,x['signal'])
        near(line[-1],e['lineAtIndex5']);near(signal[-1],e['signalAtIndex5']);near(line[-1]-signal[-1],e['histogramAtIndex5'])
    elif c['id']=='ATR':
        bars=x['bars'];trs=[bars[0]['high']-bars[0]['low']]
        for i in range(1,len(bars)):
            z=bars[i];last=bars[i-1]['close']
            trs.append(max(z['high']-z['low'],abs(z['high']-last),abs(z['low']-last)))
        p=x['period'];value=sum(trs[:p])/p;near(value,e['seed'])
        for tr in trs[p:]:value=(value*(p-1)+tr)/p
        near(value,e['valueAtIndex3'])
    elif c['id']=='BOLLINGER':
        v=x['closes'];mid=sum(v)/len(v);var=sum((z-mid)**2 for z in v)/len(v)
        near(mid,e['middle']);near(var,e['populationVariance']);near(mid+x['multiplier']*math.sqrt(var),e['upper']);near(mid-x['multiplier']*math.sqrt(var),e['lower'])
    elif c['id']=='EXPECTANCY':
        near(x['winProbability']*x['gain']-(1-x['winProbability'])*x['loss']-x['cost'],e['netPerTrade'])
    elif c['id']=='POSITION_SIZING':
        risk=x['entry']-x['stop'];assert x['entry']>x['stop']>0
        near(risk,e['perShareRisk']);near(math.floor(x['riskBudget']/risk),e['riskLimitedShares'])
        near(math.floor(x['capital']/x['entry']),e['cashLimitedShares'])
        shares=math.floor(min(x['riskBudget']/risk,x['capital']/x['entry']))
        near(shares,e['wholeShares']);near(shares*risk,e['plannedStopRisk'])
    else:raise AssertionError('Unknown pilot method '+c['id'])
for case in d['cases']:evaluate(case)
print('PASS independent Python stdlib recomputation: 10/10 fictional methods (source QA; no editorial or licensing approval).')
