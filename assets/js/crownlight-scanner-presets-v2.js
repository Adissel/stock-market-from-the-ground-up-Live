/* Crownlight Scanner Presets v2 — original educational rule recipes.
 * Only existing read-only scalar fields are compiled. These are not
 * historical trading strategies, live quotes, proprietary vendor scanners,
 * or probability/price prediction models.
 */
(function(root){
'use strict';
const C=root.CrownlightScannerRulesV1,legacy=root.CrownlightScannerTemplatesV1;
if(!C||!legacy)throw Error('Legacy Crownlight rule engine and five approved teaching examples are required.');
const R=(field,op,value,maxValue)=>op==='BETWEEN'?
 {type:'rule',field,op,value,maxValue}:{type:'rule',field,op,value};
const F=(field,op,compareField)=>({type:'rule',field,op,compareField});
const G=(op,...children)=>({type:'group',op,children});
const N=child=>({type:'not',child});
const sources=Object.freeze({
 Foundations:Object.freeze(['assets/js/crownlight-scanner-rules-v1.js','data/crownlight-scanner-research-catalog-v1.json']),
 Momentum:Object.freeze(['assets/js/crownlight-scanner-rules-v1.js','functions/_lib/academy-scanners10-depth-v1.js','data/crownlight-scanner-phase8-crosswalk-v1.json']),
 Participation:Object.freeze(['assets/js/market-research-engine-v014145.js','data/crownlight-scanner-research-catalog-v1.json','functions/_lib/academy-scanners10-depth-v1.js']),
 Liquidity:Object.freeze(['assets/js/crownlight-scanner-rules-v1.js','data/crownlight-scanner-phase8-crosswalk-v1.json','functions/_lib/academy-scanners10-depth-v1.js']),
 'VWAP & levels':Object.freeze(['assets/js/crownlight-scanner-rules-v1.js','assets/js/crownlight-scanner-templates-v1.js','docs/research/scanner/2026-11-03_SCANNER_WAVE2_RESULTS_AND_TEACHING.md']),
 Combined:Object.freeze(['assets/js/crownlight-scanner-rules-v1.js','data/tutor-watchlist-study-v1.json','data/crownlight-scanner-research-catalog-v1.json'])
});
const derived=Object.freeze({
 dollar_volume_proxy:Object.freeze(['price','volume']),
 vwap_distance_pct:Object.freeze(['price','vwap']),
 price_below_high_pct:Object.freeze(['price','day_high'])
});
const spec=(id,name,category,description,rules)=>({id,name,category,description,rules});
const added=[
 spec('PRICE_UNDER_DOLLAR','Under-$1 price research','Foundations','Member-supplied price from $0.01 through $1; this is a volatile segment, not an eligibility or buy signal.',G('AND',R('price','BETWEEN',0.01,1),R('volume','GTE',100000))),
 spec('PRICE_1_TO_5','Price from $1 to $5','Foundations','Inclusive price band and supplied share-volume floor for beginner screening.',G('AND',R('price','BETWEEN',1,5),R('volume','GTE',250000))),
 spec('PRICE_5_TO_20','Price from $5 to $20','Foundations','Inclusive price band and supplied share-volume floor; timestamps and splits still require review.',G('AND',R('price','BETWEEN',5,20),R('volume','GTE',250000))),
 spec('PRICE_ABOVE_20','Price at least $20','Foundations','Price-level research on the provided snapshot; not a valuation assessment.',G('AND',R('price','GTE',20),R('volume','GTE',250000))),
 spec('ABOVE_PRIOR_CLOSE','Price above supplied prior close','Foundations','Field-to-field research comparing last price against independently supplied prior close.',G('AND',F('price','GT','prev_close'),R('volume','GTE',250000))),
 spec('BELOW_PRIOR_CLOSE','Price below supplied prior close','Foundations','Field-to-field research comparing last price against a supplied prior close.',G('AND',F('price','LT','prev_close'),R('volume','GTE',250000))),
 spec('AT_SUPPLIED_HIGH','Last equals supplied session high','Foundations','Exact reported last-versus-day-high equality; not proof of an actual breakout or trigger.',G('AND',F('price','EQ','day_high'),R('volume','GTE',250000))),
 spec('DAILY_CHANGE_UP_5','Daily change at least +5%','Momentum','Supplied daily change plus a volume floor; not a certified quote or continuation forecast.',G('AND',R('change_pct','GTE',5),R('volume','GTE',250000))),
 spec('DAILY_CHANGE_DOWN_5','Daily change at most −5%','Momentum','Supplied negative change plus volume for downside research; not a short-sale trigger.',G('AND',R('change_pct','LTE',-5),R('volume','GTE',250000))),
 spec('DAILY_CHANGE_NEAR_ZERO','Daily change between −1% and +1%','Momentum','An illustrative inclusive change interval, not proof of accumulation.',G('AND',R('change_pct','BETWEEN',-1,1),R('volume','GTE',250000))),
 spec('FIVE_MIN_CHANGE_UP_2','Five-minute change at least +2%','Momentum','Requires a supplied completed, consistently defined five-minute change; no unfinished-bar inference.',G('AND',R('change_5m_pct','GTE',2),R('volume','GTE',250000))),
 spec('FIVE_MIN_CHANGE_DOWN_2','Five-minute change at most −2%','Momentum','Requires a supplied five-minute change with timestamp and session basis.',G('AND',R('change_5m_pct','LTE',-2),R('volume','GTE',250000))),
 spec('DAILY_AND_FIVE_MIN_UP','Positive daily and five-minute changes','Momentum','Both supplied changes meet positive thresholds; no claim that the pattern will continue.',G('AND',R('change_pct','GTE',3),R('change_5m_pct','GTE',1),R('volume','GTE',250000))),
 spec('DAILY_UP_FIVE_MIN_DOWN','Daily up, five-minute pullback observation','Momentum','Positive reported day with a negative five-minute interval; not a confirmed pullback setup.',G('AND',R('change_pct','GTE',5),R('change_5m_pct','LTE',-1),R('volume','GTE',250000))),
 spec('TWO_SESSION_UP_10','Supplied two-session change at least +10%','Momentum','Uses the supplied two-session change only; exchange-day/calendar basis is not certified.',G('AND',R('change_2d_pct','GTE',10),R('volume','GTE',250000))),
 spec('TWO_SESSION_DOWN_10','Supplied two-session change at most −10%','Momentum','Negative supplied multi-session change; not a reversal or short-sale model.',G('AND',R('change_2d_pct','LTE',-10),R('volume','GTE',250000))),
 spec('TWO_SESSION_UP_DAILY_DOWN','Multi-session up, daily down','Momentum','Opposing supplied time-window changes for review; no inferred first-red-day structure.',G('AND',R('change_2d_pct','GTE',5),R('change_pct','LT',0),R('volume','GTE',250000))),
 spec('VOLUME_ONE_MILLION','At least one million reported shares','Participation','Reported share-volume count only; the provider and measurement window remain unverified.',G('AND',R('volume','GTE',1000000),R('price','GT',0))),
 spec('VOLUME_FIVE_MILLION','At least five million reported shares','Participation','Illustrative reported high-volume threshold without actual trade-feed verification.',G('AND',R('volume','GTE',5000000),R('price','GT',0))),
 spec('REPORTED_RVOL_TWO','Provided RVOL at least 2','Participation','Uses only member-provided RVOL; reference time-of-day and baseline are not verified.',G('AND',R('rvol','GTE',2),R('volume','GTE',250000))),
 spec('REPORTED_RVOL_LOW','Provided RVOL at most 1','Participation','Low reported relative-volume research; not a measured same-time participation model.',G('AND',R('rvol','LTE',1),R('volume','GTE',100000))),
 spec('REPORTED_TRADES_1000','At least 1,000 reported trades','Participation','Trade-count value must be supplied; trade provenance and consolidated coverage are not certified.',G('AND',R('trades','GTE',1000),R('volume','GTE',250000))),
 spec('DOLLAR_VOLUME_PROXY_5M','Price × volume proxy at least $5m','Participation','Calculated as last reported price times reported shares, NOT actual venue dollar turnover.',G('AND',R('dollar_volume_proxy','GTE',5000000),R('volume','GTE',250000))),
 spec('FLOAT_BELOW_15M','Reported float no more than 15m','Liquidity','Uses supplied float and share volume only; corporate actions, float source and effective date require checks.',G('AND',R('float','LTE',15000000),R('volume','GTE',250000))),
 spec('FLOAT_ABOVE_100M','Reported float at least 100m','Liquidity','Contextual high-float segment, not proof of tradable liquidity.',G('AND',R('float','GTE',100000000),R('volume','GTE',250000))),
 spec('SPREAD_AT_MOST_ONE','Provided spread at most 1%','Liquidity','Reported spread filter; does not establish quote freshness, size, depth or executable fill.',G('AND',R('spread_pct','LTE',1),R('volume','GTE',250000))),
 spec('SPREAD_AT_LEAST_THREE','Provided spread at least 3%','Liquidity','Research on broad reported spreads; flagged for caution, not automatic trade advice.',G('AND',R('spread_pct','GTE',3),R('volume','GTE',250000))),
 spec('MARKET_CAP_BELOW_300M','Supplied market cap at most $300m','Liquidity','Provided market-cap research only; not independently validated fundamentals.',G('AND',R('market_cap','GT',0),R('market_cap','LTE',300000000))),
 spec('GAP_AT_LEAST_FIVE','Provided gap at least +5%','Liquidity','Supplied gap percent; premarket/day boundaries and corporate adjustments not certified.',G('AND',R('gap_pct','GTE',5),R('volume','GTE',250000))),
 spec('GAP_AT_MOST_MINUS_FIVE','Provided gap at most −5%','Liquidity','Negative supplied gap for research, not proof of a gap-and-fade setup.',G('AND',R('gap_pct','LTE',-5),R('volume','GTE',250000))),
 spec('GAP_WITHIN_ONE','Supplied gap within ±1%','Liquidity','Supplied gap between −1% and +1%, inclusive.',G('AND',R('gap_pct','BETWEEN',-1,1),R('volume','GTE',250000))),
 spec('BELOW_SUPPLIED_VWAP','Price below supplied VWAP','VWAP & levels','Compares price with a supplied VWAP; no evidence it is exact trade-print VWAP.',G('AND',R('vwap','GT',0),F('price','LT','vwap'))),
 spec('NEAR_SUPPLIED_VWAP_ONE','Within ±1% of supplied VWAP','VWAP & levels','Signed distance to a supplied VWAP is between −1% and +1%; source methods may differ.',G('AND',R('vwap_distance_pct','BETWEEN',-1,1),R('volume','GTE',250000))),
 spec('ONE_PERCENT_ABOVE_VWAP','At least 1% above supplied VWAP','VWAP & levels','Uses signed price/VWAP distance; not proof of a VWAP-hold pattern.',G('AND',R('vwap_distance_pct','GTE',1),R('volume','GTE',250000))),
 spec('NEAR_SUPPLIED_HIGH_ONE','Within 1% below supplied day high','VWAP & levels','Distance is (day high − last)/day high, with consistency checks; no breakout claim.',G('AND',R('price_below_high_pct','BETWEEN',0,1),R('volume','GTE',250000))),
 spec('DAY_UP_NEAR_HIGH','Daily strength near supplied high','VWAP & levels','Daily change at least 5% and last within 3% of supplied day high. No entry trigger.',G('AND',R('change_pct','GTE',5),R('price_below_high_pct','BETWEEN',0,3),R('volume','GTE',250000))),
 spec('LOW_FLOAT_REPORTED_RVOL','Low reported float plus RVOL','Combined','A snapshot intersection; NOT a verified low-float-gap trade setup.',G('AND',R('float','LTE',15000000),R('rvol','GTE',2),R('volume','GTE',250000))),
 spec('REPORTED_GAP_AND_RVOL','Gap ≥5% plus supplied RVOL ≥2','Combined','Combines supplied fields; corporate actions, same-time RVOL and catalysts remain unverified.',G('AND',R('gap_pct','GTE',5),R('rvol','GTE',2),R('volume','GTE',250000))),
 spec('DAY_MOMENTUM_TIGHT_SPREAD','Daily change and tight reported spread','Combined','Daily percent at least +5%, supplied spread no more than 1%, and volume floor.',G('AND',R('change_pct','GTE',5),R('spread_pct','LTE',1),R('volume','GTE',250000))),
 spec('PRICE_VOLUME_TIGHT_SPREAD','Price band, volume and reported spread','Combined','A three-field classroom filter, not a fill-quality assurance.',G('AND',R('price','BETWEEN',1,20),R('volume','GTE',500000),R('spread_pct','LTE',2))),
 spec('NOT_REPORTED_WIDE_SPREAD','NOT reported wide spread','Combined','Illustrates tri-state NOT: unknown spread does not become safe; source remains unverified.',G('AND',N(R('spread_pct','GT',3)),R('volume','GTE',250000))),
 spec('HIGH_VOLUME_OR_RVOL','High shares OR high provided RVOL','Combined','Illustrates OR, not a guaranteed liquidity event. Requires the original snapshot columns.',G('AND',R('price','GT',0),G('OR',R('volume','GTE',2000000),R('rvol','GTE',2)))),
 spec('GAP_UP_ABOVE_VWAP','Provided gap and price above VWAP','Combined','Two supplied research predicates. Does not confirm genuine catalyst, opening-range or trade-print VWAP.',G('AND',R('gap_pct','GTE',5),F('price','GT','vwap'),R('volume','GTE',250000)))
];
const unroll=(n,used)=>{
 if(n.type==='rule'){
  for(const key of [n.field,n.compareField]){
   if(!key)continue;for(const expanded of derived[key]||[key])used.add(expanded);
  }
 }else if(n.type==='not')unroll(n.child,used);
 else n.children.forEach(x=>unroll(x,used));
};
const deepFreeze=x=>{
 if(x&&typeof x==='object'){Object.values(x).forEach(deepFreeze);Object.freeze(x);}
 return x;
};
function normalize(raw,index){
 const tree=C.validate(raw.rules),used=new Set();unroll(tree,used);
 const legacyItem=index<legacy.items.length;
 const category=legacyItem?'Foundations':raw.category;
 const src=legacyItem?
  ['assets/js/crownlight-scanner-templates-v1.js','docs/research/scanner/2026-11-03_SCANNER_WAVE2_RESULTS_AND_TEACHING.md']:
  sources[category];
 if(!src)throw Error('Preset category not mapped to source inventory.');
 if(!/^[A-Z][A-Z0-9_]{2,63}$/.test(raw.id)||typeof raw.description!=='string'||
    raw.description.length<35||!raw.name)throw Error('Invalid source-only preset metadata.');
 return deepFreeze({
  id:raw.id,name:raw.name,category,description:raw.description,
  requiredFields:Array.from(used).sort(),sourceFiles:Array.from(src),
  rules:tree,origin:legacyItem?'LEGACY_FIVE_PRESERVED':'GITHUB_SOURCE_BACKED_RULE',
  sourceStatus:'UNVERIFIED_SNAPSHOT_CRITERIA',statisticalEdgeValidated:false,
  membershipTierChanged:false,imagesReviewed:false,recommendedTrade:false
 });
}
const original=legacy.items.map(x=>({...x}));
const items=Object.freeze([...original,...added].map(normalize));
const map=new Map(items.map(x=>[x.id,x]));
if(map.size!==items.length)throw Error('Duplicate scanner preset ID.');
const categories=Object.freeze([...new Set(items.map(x=>x.category))]);
function filter({category='',query=''}={}){
 const q=String(query||'').slice(0,120).trim().toLowerCase();
 return items.filter(x=>(!category||x.category===category)&&
  (!q||[x.id,x.name,x.category,x.description,...x.requiredFields].join(' ').toLowerCase().includes(q)));
}
const lookup=id=>typeof id==='string'?map.get(id)||null:null;
root.CrownlightScannerPresetsV2=Object.freeze({
 version:'2.0',items,categories,filter,lookup,count:items.length,
 originalCount:legacy.items.length,addedCount:added.length,
 sourceFolderPicturesReviewed:0,provenTradingStrategies:0,liveFeed:false
});
})(globalThis);
