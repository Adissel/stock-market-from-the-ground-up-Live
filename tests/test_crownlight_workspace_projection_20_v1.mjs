/* Twenty independent first-party workspace projection acceptance tests.
 * Uses the real chart-workspace API normalizer (not a duplicated implementation).
 * Offline, deterministic, no paid calls or member mutations.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeWorkspace} from '../functions/api/chart-workspace.js';
const pro={tier:'PROFESSIONAL',allowed:['STANDARD','ADVANCED','PROFESSIONAL']};
const adv={tier:'ADVANCED',allowed:['STANDARD','ADVANCED']};
const std={tier:'STANDARD',allowed:['STANDARD']};
const point=(timestamp=1790000000000,value=21)=>({timestamp,value});
const drawing=(name='segment',points=[point()])=>({name,points});
test('01 empty workspace yields safe Standard defaults',()=>{
 const x=normalizeWorkspace({},std);assert.equal(x.version,2);assert.equal(x.selected,'STANDARD');assert.equal(x.sync,true);
});
test('02 Professional member retains saved Professional tier',()=>assert.equal(normalizeWorkspace({selected:'PROFESSIONAL'},pro).selected,'PROFESSIONAL'));
test('03 downgraded Advanced member sees saved Professional workspace as Advanced',()=>assert.equal(normalizeWorkspace({selected:'PROFESSIONAL'},adv).selected,'ADVANCED'));
test('04 downgraded Standard member sees saved Professional workspace as Standard',()=>assert.equal(normalizeWorkspace({selected:'PROFESSIONAL'},std).selected,'STANDARD'));
test('05 unknown tier never upgrades to a premium tier',()=>assert.equal(normalizeWorkspace({selected:'OWNER_OVERRIDE'},pro).selected,'STANDARD'));
test('06 allowlist is authoritative even if tier rank claims Advanced',()=>assert.equal(normalizeWorkspace({selected:'PROFESSIONAL'},{tier:'ADVANCED',allowed:['STANDARD']}).selected,'STANDARD'));
test('07 saved Standard choice is not silently upgraded for Professional members',()=>assert.equal(normalizeWorkspace({selected:'STANDARD'},pro).selected,'STANDARD'));
test('08 boolean false disables synchronization; string false does not',()=>{assert.equal(normalizeWorkspace({sync:false},std).sync,false);assert.equal(normalizeWorkspace({sync:'false'},std).sync,true)});
test('09 supported studies are deduplicated while order is preserved',()=>assert.deepEqual(normalizeWorkspace({studies:['EMA','RSI','EMA','ATR','VOL']},pro).studies,['EMA','RSI','ATR','VOL']));
test('10 invalid study tokens and injected names are rejected',()=>assert.deepEqual(normalizeWorkspace({studies:['EMA','HACK',null,{},'ATR']},pro).studies,['EMA','ATR']));
test('11 valid drawing with two points retains exact time and price',()=>{
 const a=point(),b=point(1790000060000,22);assert.deepEqual(normalizeWorkspace({drawings:[drawing('segment',[a,b])]},pro).drawings,[drawing('segment',[a,b])]);
});
test('12 nonpositive drawing prices and malformed drawing names are discarded',()=>assert.deepEqual(normalizeWorkspace({drawings:[drawing('segment',[point(1790000000000,-1)]),drawing('script',[point()])]},pro).drawings,[]));
test('13 unsafe-integer timestamps are excluded from saved annotations',()=>assert.deepEqual(normalizeWorkspace({drawings:[drawing('segment',[point(Number.MAX_SAFE_INTEGER+1,21)])]},pro).drawings,[]));
test('14 drawings are bounded to twenty-four objects',()=>assert.equal(normalizeWorkspace({drawings:Array.from({length:30},()=>drawing())},pro).drawings.length,24));
test('15 drawing context rejects HTML markup before persistence',()=>assert.equal(normalizeWorkspace({drawingContext:'<script>alert(1)</script>'},pro).drawingContext,null));
test('16 drawing context accepts 150 and denies 151 characters',()=>{assert.equal(normalizeWorkspace({drawingContext:'A'.repeat(150)},pro).drawingContext,'A'.repeat(150));assert.equal(normalizeWorkspace({drawingContext:'A'.repeat(151)},pro).drawingContext,null)});
test('17 annotation books deduplicate dataset contexts',()=>{
 const x=normalizeWorkspace({drawingSets:[{context:'AAPL:5m',drawings:[drawing()]},{context:'AAPL:5m',drawings:[drawing()]},{context:'MSFT:1m',drawings:[drawing()]}]},pro);
 assert.deepEqual(x.drawingSets.map(d=>d.context),['AAPL:5m','MSFT:1m']);
});
test('18 annotation books cannot exceed ten datasets',()=>assert.equal(normalizeWorkspace({drawingSets:Array.from({length:15},(_,i)=>({context:'SYMBOL:'+i,drawings:[drawing()]}))},pro).drawingSets.length,10));
test('19 appearance controls clamp invalid spacing and reject injected color values',()=>{
 const x=normalizeWorkspace({appearance:{bullish:'javascript:alert(1)',bearish:'#ABCDEF',barSpacing:29,rightBuffer:-1,script:'evil'}},pro).appearance;
 assert.equal(x.bullish,'#2bf2b1');assert.equal(x.bearish,'#abcdef');assert.equal(x.barSpacing,10);assert.equal(x.rightBuffer,16);assert.equal(Object.hasOwn(x,'script'),false);
});
test('20 ECharts preferences retain only approved study types, colors and pane bounds',()=>{
 const x=normalizeWorkspace({echartsPreferences:{enabled:{macd:true,script:true,ema9:'yes'},colors:{macd:'#AABBCC',script:'#999999'},paneSizes:{macd:225,rsi14:300,atr14:110},lineStyles:{macd:'dashed',script:'solid'},apiKey:'TOP_SECRET'}},pro).echartsPreferences;
 assert.deepEqual(x.enabled,{macd:true});assert.deepEqual(x.colors,{macd:'#aabbcc'});assert.deepEqual(x.paneSizes,{macd:225,atr14:110});assert.deepEqual(x.lineStyles,{macd:'dashed'});assert.equal(Object.hasOwn(x,'apiKey'),false);
});
