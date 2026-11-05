import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
const pack=JSON.parse(readFileSync(new URL('../data/knowledge/kdb-priority25-numeric-review-pack01-v1.json',import.meta.url),'utf8'));
const nearly=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`expected ${b} received ${a}`);
const mean=v=>v.reduce((s,x)=>s+x,0)/v.length;
const trade=prints=>prints.reduce((s,t)=>s+t.price*t.shares,0)/prints.reduce((s,t)=>s+t.shares,0);
test('review packet scope and independent review hold',()=>{
 assert.equal(pack.status,'DRAFT_NOT_LIVE_NOT_INDEPENDENTLY_APPROVED');
 assert.equal(pack.articles.length,5);
 assert.equal(new Set(pack.articles.map(a=>a.slug)).size,5);
 for(const a of pack.articles){assert.equal(a.sources.length>=2,true);assert.equal(a.articleVersion>0,true);assert.equal(a.key.startsWith('P25-'),true);for(const s of a.sources){assert.match(s.url,/^https:\/\//);assert.equal(s.copyrightAndDisplayRights,'not_cleared');assert.match(s.section,/\S/);}for(const k of ['understand','recognize','apply','commonMistake','limitations','accessibleVisual'])assert.ok(a.sections[k].length>70, a.slug+' missing '+k);}
});
test('SMA completed-bar roll and counterfactual',()=>{const f=pack.articles[0].fixture;nearly(mean(f.completedCloses.slice(0,3)),11);nearly(mean(f.completedCloses.slice(1,4)),12);nearly(mean([11,12,f.alternateFourthClose]),32/3);});
test('trade-price VWAP with unequal share weights',()=>{const f=pack.articles[1].fixture;nearly(trade(f.trades),11.5);nearly(trade([{price:10,shares:300},{price:12,shares:100}]),10.5);assert.notEqual(mean(f.trades.map(t=>t.price)),trade(f.trades));});
test('print VWAP differs from HLC3 OHLCV proxy',()=>{const f=pack.articles[2].fixture;const p=trade(f.trades);const bar=(f.bar.high+f.bar.low+f.bar.close)/3;nearly(p,23.2);nearly(bar,68/3);nearly(p-bar,23.2-68/3);assert.ok(Math.abs(p-bar)>0.5);});
test('EMA first-close and SMA-seeded paths have different early values',()=>{const f=pack.articles[3].fixture;const alpha=2/(f.length+1);nearly(alpha,0.5);let e=f.completedCloses[0];nearly(e,10);for(let i=1;i<f.completedCloses.length;i++){e=alpha*f.completedCloses[i]+(1-alpha)*e;nearly(e,f.firstCloseSeedSeries[i]);}const seed=mean(f.completedCloses.slice(0,3));nearly(seed,40/3);nearly(alpha*f.completedCloses[3]+(1-alpha)*seed,47/3);assert.ok(Math.abs(e-47/3)>0.4);});
test('Bollinger declared population vs sample denominator',()=>{const f=pack.articles[4].fixture;const mu=mean(f.closes);const sum=f.closes.reduce((s,x)=>s+(x-mu)**2,0);const pop=Math.sqrt(sum/f.closes.length);const sample=Math.sqrt(sum/(f.closes.length-1));nearly(mu,12);nearly(pop,Math.sqrt(8/3));nearly(mu+2*pop,f.upper);nearly(mu-2*pop,f.lower);nearly(mu+2*sample,16);nearly(mu-2*sample,8);});
