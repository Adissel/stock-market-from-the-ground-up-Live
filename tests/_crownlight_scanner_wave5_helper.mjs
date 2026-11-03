import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const c={Math,Number,String,Array,Object,Set,RegExp,URL,Date,Intl,TextEncoder};c.globalThis=c;
for(const path of [
 'assets/js/market-bars-import-v014150.js',
 'assets/js/market-research-engine-v014145.js',
 'assets/js/crownlight-indicator-math-v2.js',
 'assets/js/crownlight-scanner-rules-v1.js',
 'assets/js/crownlight-scanner-historical-v5.js'
])runInNewContext(readFileSync(path,'utf8'),c,{filename:path});
export const C=c;
export const bars=c.GroundUpResearchBarsV014150.csvBars(readFileSync('tests/fixtures/crownlight-scanner-five-minute-v5.csv','utf8'));
export const args={bars,asOf:'2026-10-30T13:45:00Z',symbol:'TEST',sourceNote:'Original fictional OHLCV, approved for internal testing'};
