import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

/* Exercise the actual TypeScript pure formatter, not a copy of its logic.
 * The narrow syntax normalization below strips only the formatter's known
 * static annotations; unfamiliar changes fail the test rather than pass.
 */
const source=readFileSync('src/experience/HomeMarketTerminal.tsx','utf8');
const start=source.indexOf('function marketTooltip(');
const end=source.indexOf('\n/** Intracandle simulation',start);
assert.ok(start>=0&&end>start,'The production tooltip formatter is present');
let fn=source.slice(start,end);
const changes=[
 ['params:unknown,bars:readonly Bar[],indicator:readonly (number|null)[],study:Study','params,bars,indicator,study'],
 ['):string{','){'],
 ['(x):x is {dataIndex:number}=>','(x)=>'],
 ['(x as {dataIndex?:unknown}).dataIndex','x.dataIndex'],
 ['(value:number)=>','(value)=>'],
 ['const rows:[string,number][]=', 'const rows=']
];
for(const [from,to] of changes){
 assert.ok(fn.includes(from),'Unexpected formatter change: '+from);
 fn=fn.replace(from,to);
}
const format=vm.runInNewContext(fn+'\nmarketTooltip',{Number,Math,String,Array});
const up={open:94.79828978098946,high:95.34828978098946,low:93.63067000819346,close:95.03167000819347,volume:1234.8};
const down={open:95.79828978098946,high:96.34828978098946,low:93.63067000819346,close:94.03167000819347,volume:980.2};
const bars=[up,down];
const point=i=>[{dataIndex:i,seriesName:'<img src=x onerror=alert(1)>',axisValue:'<script>alert(1)</script>'}];
const call=(i=0,indicator=[92.923,91.867],study='ema9',rows=bars)=>format(point(i),rows,indicator,study);
test('01 blank hover produces no tooltip',()=>assert.equal(format([],bars,[],'ema9'),''));
test('02 null pointer produces no tooltip',()=>assert.equal(format(null,bars,[],'ema9'),''));
test('03 object without index is rejected',()=>assert.equal(format({axisValue:'B01'},bars,[],'ema9'),''));
test('04 negative indexes are rejected',()=>assert.equal(call(-1),''));
test('05 future index beyond public candles is rejected',()=>assert.equal(call(2),''));
test('06 fractional index is rejected',()=>assert.equal(call(.5),''));
test('07 numeric string index is rejected',()=>assert.equal(format([{dataIndex:'0'}],bars,[],'ema9'),''));
test('08 first valid series index is used',()=>assert.match(format([{},...point(1)],bars,[],'none'),/Candle B02/));
test('09 first candle labeled B01',()=>assert.match(call(0),/Candle B01/));
test('10 second candle labeled B02',()=>assert.match(call(1),/Candle B02/));
test('11 open displays exactly two decimal places',()=>assert.match(call(),/Open<\/span><strong>94\.80<\/strong>/));
test('12 high displays exactly two decimal places',()=>assert.match(call(),/High<\/span><strong>95\.35<\/strong>/));
test('13 low displays exactly two decimal places',()=>assert.match(call(),/Low<\/span><strong>93\.63<\/strong>/));
test('14 close displays exactly two decimal places',()=>assert.match(call(1),/Close<\/span><strong>94\.03<\/strong>/));
test('15 volume is rounded and uses thousands separators',()=>assert.match(call(),/Volume<\/span><strong>1,235<\/strong>/));
test('16 EMA 9 label and value are formatted',()=>assert.match(call(),/EMA 9<\/span><strong>92\.92<\/strong>/));
test('17 SMA 20 label and value are formatted',()=>assert.match(call(0,[92.923],'sma20'),/SMA 20<\/span><strong>92\.92<\/strong>/));
test('18 no study never claims an indicator',()=>assert.doesNotMatch(call(0,[92.923],'none'),/EMA 9|SMA 20/));
test('19 indicator warmup does not invent data',()=>assert.doesNotMatch(call(0,[null],'ema9'),/EMA 9<\/span>/));
test('20 nonfinite OHLC is rejected without fabricated data',()=>assert.equal(call(0,[],'none',[{...up,close:NaN}]),''));
test('21 finite upper candle uses gain color',()=>assert.match(call(0),/#37d7ad/));
test('22 finite lower candle uses loss color',()=>assert.match(call(1),/#fb7b90/));
test('23 tooltip explicitly labels simulated observations',()=>assert.match(call(),/>Simulated<\/span>/));
test('24 untrusted chart pointer text is never rendered',()=>assert.doesNotMatch(call(),/<script>|onerror/));

test('25 homepage deploy uses updated OHLCV chart bundle URL',()=>{
 const html=readFileSync('index.html','utf8');
 assert.ok(html.includes('home-market-terminal-v1.bundle.js?v=20261104-realism1'));
});
test('26 homepage deploy uses updated OHLCV chart stylesheet URL',()=>{
 const html=readFileSync('index.html','utf8');
 assert.ok(html.includes('home-market-terminal-v1.css?v=20261104-realism1'));
});
