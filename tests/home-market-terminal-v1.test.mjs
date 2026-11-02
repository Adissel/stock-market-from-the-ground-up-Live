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
