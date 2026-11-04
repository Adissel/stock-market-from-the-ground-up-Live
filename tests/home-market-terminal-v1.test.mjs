import vm from 'node:vm';
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const tsx=readFileSync('src/experience/HomeMarketTerminal.tsx','utf8'),build=readFileSync('scripts/build-pages.sh','utf8'),html=readFileSync('index.html','utf8');
test('home live JSX entry built with React/TypeScript',()=>{assert.match(build,/HomeMarketTerminal\.tsx/);assert.match(build,/typescript\/bin\/tsc/);assert.match(build,/home-market-terminal-v1\.bundle\.js/);assert.match(html,/type="module" src="\/assets\/js\/home-market-terminal-v1\.bundle\.js/);});
test('ECharts powered OHLCV with indicator and volume',()=>{for(const s of ['CrownlightECharts','candlestick','volume','dataZoom','EMA 9','SMA 20','ResizeObserver','setWindowSize'])assert.ok(tsx.includes(s),s);});
test('public simulation respects member data boundaries',()=>{assert.doesNotMatch(tsx,/supabase|access_token|service_role|fetch\(|\/api\/|protectedAnswer|gradeMember/i);assert.match(tsx,/Fictional simulation/);assert.match(tsx,/simulator\.html/);});

test('member progress is rendered from original statistics with no member data writes',()=>{
 const p=readFileSync('src/experience/MemberProgressVisual.tsx','utf8');
 const d=readFileSync('dashboard.html','utf8');
 for(const id of ['labs-completed','labs-in-progress','labs-not-started','dashboard-content'])assert.ok(p.includes(id),'missing original data binding '+id);
 assert.match(d,/member-progress-visual-v1\.bundle\.js/);
 assert.match(build,/MemberProgressVisual\.tsx/);
 assert.match(p,/MutationObserver/);
 assert.doesNotMatch(p,/fetch\(|supabase|access_token|\/api\/|localStorage|service_role/i);
});

test('homepage chart exposes keyboard candle navigation without changing public-only data',()=>{
 const source=readFileSync('src/experience/HomeMarketTerminal.tsx','utf8');
 for(const required of ['tabIndex={0}','onKeyDown={event','role="region"',"ArrowLeft","ArrowRight","Home","End","dispatchAction({type:'showTip'","setNote('Fictional B"])assert.ok(source.includes(required),required);
});
test('mobile chart controls remain usable at narrow widths',()=>{
 const css=readFileSync('assets/css/home-market-terminal-v1.css','utf8');
 for(const required of ['grid-template-columns:repeat(2,minmax(0,1fr))','min-height:44px','.cl-react-plot:focus-visible','outline:3px'])assert.ok(css.includes(required),required);
});
test('dashboard chart labels show real counts and percentage without synthetic member data',()=>{
 const p=readFileSync('src/experience/MemberProgressVisual.tsx','utf8');
 for(const required of ['toLocaleString','Math.round(value*100/total)','Completed','In progress','Not started','aria-label'])assert.ok(p.includes(required),required);
 assert.doesNotMatch(p,/fetch\(|service_role|access_token/i);
});

test('fictional candle and volume colors meet nontext contrast on dark training plot',()=>{
 const source=readFileSync('src/experience/HomeMarketTerminal.tsx','utf8');
 const css=readFileSync('assets/css/home-market-terminal-v1.css','utf8');
 const background='#071724';
 assert.ok(css.includes(background));
 const lum=hex=>{const c=hex.match(/[a-f0-9]{2}/ig);assert.equal(c?.length,3);const rgb=c.map(v=>parseInt(v,16)/255).map(n=>n<=0.04045?n/12.92:((n+0.055)/1.055)**2.4);return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2]};
 const contrast=(a,b)=>{const aa=lum(a),bb=lum(b);return (Math.max(aa,bb)+.05)/(Math.min(aa,bb)+.05)};
 for(const color of ['#37c7aa','#e36d79','#2da98f','#be6570']){assert.ok(source.includes(color),'Missing rendered color '+color);assert.ok(contrast(color,background)>=3,'Insufficient nontext contrast '+color)}
 assert.ok(source.includes('borderColor0'),'Bearish candle borders and wicks must remain visible');
 assert.ok(source.includes('borderColor:'),'Bullish candle borders and wicks must remain visible');
 assert.match(source,/Fictional market/);
});

test('canonical homepage linked illustration upgrades to the original interactive React chart without replacing the surrounding hero',()=>{
 assert.match(html,/class="gu-home-terminal"/,'Initial illustrative chart remains as a no-JavaScript fallback');
 assert.match(tsx,/querySelector<HTMLAnchorElement>\('main\.gu-premium-home a\.gu-home-terminal'\)/,'Original public hero is used as the mount point');
 assert.match(tsx,/linked\.replaceWith\(host\)/,'Only the chart illustration is replaced');
 assert.match(tsx,/host\.className='gu-home-terminal sm-v5-chart'/,'Existing dark styles and React host styles are retained');
 assert.match(tsx,/if\(existing\)return existing/,'Original V5 React chart location still works');
 assert.doesNotMatch(tsx,/removeChild\(main\)|main\.replaceWith/,'No whole-page replacement from the React mount');
});

test('intracandle simulation reveals only current fictional ticks; no future high, low or volume',()=>{
 const begin=tsx.indexOf('const TICKS_PER_MINUTE=20;'),end=tsx.indexOf('function Terminal(){',begin);
 assert.ok(begin>0&&end>begin,'Actual intrabar simulator source must be testable');
 let pure=tsx.slice(begin,end);
 for(const [before,after] of [
  ['function partialMinute(index:number,ticks:number):Bar{','function partialMinute(index,ticks){'],
  ['function groupMinutes(minutes:readonly Bar[],frame:Frame):Bar[]{','function groupMinutes(minutes,frame){'],
  ['function revealedBars(frame:Frame,position:number):Bar[]{','function revealedBars(frame,position){']
 ]){assert.ok(pure.includes(before),'Unrecognized simulator contract '+before);pure=pure.replace(before,after)}
 const fixture=Array.from({length:150},(_,i)=>{
  const open=100+i*.1,close=open+(i%2?.7:-.6);
  return {open,close,high:Math.max(open,close)+.8,low:Math.min(open,close)-.9,volume:100+i};
 });
 const api=vm.runInNewContext(pure+';({partialMinute,groupMinutes,revealedBars})',{DATA:fixture,Number,Math});
 const b=fixture[100],start=api.partialMinute(100,0);
 for(const k of ['open','close','high','low'])assert.equal(start[k],b.open,'No future prices at candle open: '+k);
 assert.equal(start.volume,0,'Volume starts at zero, not the finished value');
 let prior=start;
 for(let tick=1;tick<=20;tick++){
  const now=api.partialMinute(100,tick);
  assert.ok(now.high>=prior.high&&now.low<=prior.low&&now.volume>=prior.volume,'OHLCV is causal and volume monotonic');
  assert.ok(now.high<=b.high&&now.low>=b.low,'No observation exceeds completed fictional envelope');
  prior=now;
 }
 for(const k of ['open','close','high','low','volume'])assert.ok(Math.abs(prior[k]-b[k])<1e-8,'Final fictional candle reconciles: '+k);
 const one=api.revealedBars(1,0),after=api.revealedBars(1,1);
 assert.equal(one.length,101);assert.equal(one[100].volume,0);
 assert.ok(after[100].volume>0&&after[100].volume<b.volume,'Only observed volume becomes visible');
 const five=api.revealedBars(5,0);
 assert.equal(five.length,21,'Five-minute aggregation starts at a completed boundary');
 assert.equal(five[20].open,b.open);assert.equal(five[20].volume,0);
 const three=api.revealedBars(3,0);
 assert.equal(three.length,34,'Three-minute aggregation includes one forming group, without future data');
 assert.equal(three[33].volume,0);
 const final=api.revealedBars(5,1000);
 assert.equal(final.length,30,'Replay finishes with 30 complete five-minute candles');
 assert.equal(final[29].volume,fixture.slice(145,150).reduce((n,x)=>n+x.volume,0));
});
test('homepage replay provides functional accessible playback controls and updates the chart incrementally',()=>{
 for(const required of ['revealedBars(cfg.frame,playhead.current)','setPlaying(x=>!x)','onClick={restart}','0.1×','0.5×','3×','Pause','Resume','Replay','Timeframe','1m','3m','5m','aria-live="off"','prefers-reduced-motion'])assert.ok(tsx.includes(required),'Missing replay contract '+required);
 assert.match(tsx,/chart\.setOption\(\{tooltip,xAxis:\[\{data:labels\},\{data:labels\}\],series\},false\)/,'Each tick merges ECharts data without resetting user zoom');
 assert.match(html,/home-community\.js\?v=20261103-restore1/,'Restored public Member Status is loaded');
 assert.match(html,/home-member-stats\.css\?v=20261103-restore1/);
 const status=readFileSync('assets/js/home-community.js','utf8');
 assert.match(status,/<h2>Member Status<\/h2>/);
 assert.match(status,/fetch\('\/api\/home-member-stats-v01353\?action=public'/,'Existing public aggregate API is used');
 assert.match(status,/example\?'EXAMPLE':'LIVE DATA'/,'Demo counts are distinguished from verified aggregates');
 assert.doesNotMatch(status,/access_token|service_role|auth\.getSession/,'Public status never accesses private tokens');
});
