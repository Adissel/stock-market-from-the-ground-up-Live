import test from 'node:test';
import assert from 'node:assert/strict';
import {parseChartPassRequest} from '../functions/api/member-sparks-chart.js';
/* Runtime source-contract acceptance. No wallet debits or payments. */
const base={sku:'CHART_ADVANCED_DAY',requestId:'11111111-1111-4111-8111-111111111111',expectedCost:6};
const request=(headers={})=>new Request('https://site.test/api/member-sparks-chart',{method:'POST',headers:{origin:'https://site.test','content-type':'application/json',...headers}});
const cases=[
...['CHART_ADVANCED_DAY','CHART_ADVANCED_WEEK','CHART_ADVANCED_MONTH','CHART_PROFESSIONAL_DAY','CHART_PROFESSIONAL_WEEK','CHART_PROFESSIONAL_MONTH'].map(sku=>['valid '+sku,JSON.stringify({...base,sku}),{},200]),
['reject unknown SKU',JSON.stringify({...base,sku:'CHART_ADMIN_DAY'}),{},400],
['reject case bypass',JSON.stringify({...base,sku:'chart_advanced_day'}),{},400],
['reject malformed requestId',JSON.stringify({...base,requestId:'not_uuid'}),{},400],
['reject missing id',JSON.stringify({sku:base.sku,expectedCost:6}),{},400],
['reject zero cost',JSON.stringify({...base,expectedCost:0}),{},400],
['reject fraction cost',JSON.stringify({...base,expectedCost:1.5}),{},400],
['reject missing expectedCost',JSON.stringify({sku:base.sku,requestId:base.requestId}),{},400],
['reject forged user_id',JSON.stringify({...base,user_id:'other'}),{},400],
['reject malformed JSON','{"sku":',{},400],
['reject array JSON','[]',{},400],
['reject foreign origin',JSON.stringify(base),{origin:'https://hostile.test'},403],
['reject cross-site fetch',JSON.stringify(base),{'sec-fetch-site':'cross-site'},403],
['reject text/plain',JSON.stringify(base),{'content-type':'text/plain'},415],
['reject multibyte UTF-8 overflow',JSON.stringify({...base,padding:'界'.repeat(400)}),{},413]
];
assert.equal(cases.length,20);
for(const [i,c] of cases.entries())test(String(i+1).padStart(2,'0')+' '+c[0],()=>{
 const actual=parseChartPassRequest(request(c[2]),c[1]);
 assert.equal(actual.status,c[3],c[0]);
 if(actual.status===200)assert.equal(actual.value.sku,JSON.parse(c[1]).sku);
});
