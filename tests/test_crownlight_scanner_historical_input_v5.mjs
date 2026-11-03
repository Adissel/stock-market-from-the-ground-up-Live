import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {C,bars,args} from './_crownlight_scanner_wave5_helper.mjs';
const E=C.CrownlightScannerHistoricalV5,importer=C.GroundUpResearchBarsV014150;
test('existing CSV importer rejects duplicates, out-of-order and invalid OHLCV',()=>{
 const original=readFileSync('tests/fixtures/crownlight-scanner-five-minute-v5.csv','utf8');
 assert.equal(bars.length,211);
 assert.throws(()=>importer.csvBars(original.replace('9.980,10.040,9.940,10.000','9.980,9.000,9.940,10.000')),/OHLC/);
 const lines=original.trim().split('\n');
 assert.throws(()=>importer.csvBars([lines[0],lines[2],lines[1],...lines.slice(3)].join('\n')),/timestamps/);
 assert.throws(()=>importer.csvBars([lines[0],lines[1],lines[1],...lines.slice(2)].join('\n')),/timestamps/);
});
test('cutoff before first completed bar is unavailable, never invented',()=>{
 const r=E.evaluate({...args,asOf:'2026-10-28T13:32:00Z'});
 assert.equal(r.available,false);assert.equal(r.reason,'NO_COMPLETED_FIVE_MINUTE_BAR');
 assert.equal(r.tradeSignal,false);
});
test('premarket and misaligned bars rejected without resampling',()=>{
 const first=bars[0],early={...first,time:new Date('2026-10-28T13:25:00Z')};
 assert.throws(()=>E.evaluate({...args,bars:[early,...bars]}),/regular-session/);
 const bad={...first,time:new Date('2026-10-28T13:31:00Z')};
 assert.throws(()=>E.evaluate({...args,bars:[bad,...bars.slice(1)]}),/five-minute boundary/);
});
