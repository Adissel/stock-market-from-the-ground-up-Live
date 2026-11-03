/* Crownlight original scanner templates: rule examples, not a market-data strategy library.
 * Named solely by observable criteria; thresholds are fictional research inputs.
 */
(function(root){
'use strict';
const R=(field,op,value)=>({type:'rule',field,op,value});
const G=(op,...children)=>({type:'group',op,children});
const definitions=[
 {id:'PRICE_VOLUME',name:'Price and volume research',
  description:'Illustrative price interval and supplied share-volume threshold. Does not claim a trading edge.',
  requiredFields:['price','volume'],rules:G('AND',R('price','GTE',0.1),R('price','LTE',13.75),R('volume','GTE',250000))},
 {id:'NEGATIVE_5M',name:'Five-minute negative-to-zero window',
  description:'A bounded momentum interval −3% through 0%, inclusive; requires observed 5-minute change.',
  requiredFields:['change_5m_pct'],rules:G('AND',R('change_5m_pct','GTE',-3),R('change_5m_pct','LTE',0))},
 {id:'SUPPLIED_VWAP',name:'Price above supplied VWAP',
  description:'Comparison to externally provided VWAP, whose calculation and timestamps are not verified here.',
  requiredFields:['price','vwap'],rules:G('AND',R('price','GTE',0.1),{type:'rule',field:'price',op:'GTE',compareField:'vwap'})},
 {id:'DAY_HIGH',name:'Price within 3% below supplied high',
  description:'Research proximity to a supplied session high; invalid/inconsistent highs fail closed.',
  requiredFields:['price','day_high'],rules:G('AND',R('price_below_high_pct','BETWEEN',0),R('price_below_high_pct','LTE',3))},
 {id:'TWO_DAY_CHANGE',name:'Two-day plus daily momentum research',
  description:'Shows how a 2-day change combines with a current-day threshold; does not predict future performance.',
  requiredFields:['change_2d_pct','change_pct'],rules:G('AND',R('change_2d_pct','GTE',15),R('change_pct','GTE',1))}
];
// The DAY_HIGH template uses a fully specified BETWEEN bound after data construction.
definitions[3].rules.children[0].maxValue=3;
const items=definitions.map(x=>Object.freeze({...x,requiredFields:Object.freeze(x.requiredFields.slice()),
 rules:JSON.parse(JSON.stringify(x.rules))}));
const lookup=id=>items.find(x=>x.id===id)||null;
root.CrownlightScannerTemplatesV1=Object.freeze({items:Object.freeze(items),lookup});
})(globalThis);
