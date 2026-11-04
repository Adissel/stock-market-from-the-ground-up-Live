/* Source-field coverage for Crownlight research rules, not source verification.
 * All calculations use already-loaded member snapshots in memory.
 */
(function(root){
'use strict';
const dependencies=Object.freeze({
 dollar_volume_proxy:['price','volume'],
 vwap_distance_pct:['price','vwap'],
 price_below_high_pct:['price','day_high']
});
function audit(rows,rule,engine){
 if(!engine?.validate||!engine?.read||!Array.isArray(rows)||rows.length>2000)
  throw Error('Invalid source evidence or rule engine.');
 const normalized=engine.validate(rule),keys=new Set();
 function add(key){for(const k of dependencies[key]||[key])keys.add(k);}
 function walk(n){
  if(n.type==='rule'){add(n.field);if(n.compareField)add(n.compareField);}
  else if(n.type==='not')walk(n.child);
  else n.children.forEach(walk);
 }
 walk(normalized);
 const fields=[...keys].sort().map(field=>{
  let supplied=0,valid=0;
  for(const row of rows){
   if(row&&Object.hasOwn(row,field)&&row[field]!==null&&
      String(row[field]).trim()!==''){
    supplied++;
    if(engine.read(row,field)!==null)valid++;
   }
  }
  return Object.freeze({field,supplied,valid,missingOrInvalid:rows.length-valid});
 });
 return Object.freeze({
  inspected:rows.length,fields:Object.freeze(fields),
  sourceVerified:false,licensedFeed:false,tradeSignal:false,
  methodology:'COUNTS_ONLY_NO_SOURCE_AUTHENTICATION'
 });
}
root.CrownlightScannerEvidenceV6=Object.freeze({audit});
})(globalThis);
