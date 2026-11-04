import test from 'node:test';
import assert from 'node:assert/strict';
import {C,bars,args} from './_crownlight_scanner_wave5_helper.mjs';
const historical=C.CrownlightScannerHistoricalV5;
test('impossible calendar dates and nonstandard +14 offset cannot be silently normalized',()=>{
 for(const time of ['2026-02-29T09:30:00Z','2026-02-30T09:30:00Z',
  '2026-04-31T09:30:00-04:00','2026-11-31T09:30:00Z',
  '2026-10-30T09:30:00+14:01','2026-10-30T09:30:00-14:59']){
  assert.throws(()=>historical.cutoff(time),/Invalid calendar date or UTC offset/,time);
  assert.throws(()=>historical.evaluate({...args,asOf:time}),/Invalid calendar date or UTC offset/,time);
 }
 assert.equal(new Date(historical.cutoff('2028-02-29T09:30:00Z')).toISOString(),
  '2028-02-29T09:30:00.000Z');
 assert.equal(new Date(historical.cutoff('2026-10-30T09:30:00+14:00')).toISOString(),
  '2026-10-29T19:30:00.000Z');
});
test('explicit offsets distinguish repeated DST wall times',()=>{
 const before=historical.cutoff('2026-11-01T01:30:00-04:00');
 const after=historical.cutoff('2026-11-01T01:30:00-05:00');
 assert.equal(after-before,60*60*1000);
});
test('missing bars before cutoff are disclosed, not treated as live observations',()=>{
 const baseline=historical.evaluate(args);
 assert.equal(baseline.cutoffLagMinutes,0);
 assert.equal(baseline.sourceFreshness,'RECENT_COMPLETED_OBSERVATION');
 const later=historical.evaluate({...args,bars:bars.slice(0,159),asOf:'2026-10-30T14:00:00Z'});
 assert.equal(later.available,true);
 assert.equal(later.cutoffLagMinutes,15);
 assert.equal(later.sourceFreshness,'NO_OBSERVATION_AT_CUTOFF');
 assert.equal(later.row.price,baseline.row.price);
 assert.match(later.warnings.join(' '),/subsequent observations were not supplied/);
 assert.equal(later.tradeSignal,false);
 assert.equal(later.marketDataVerified,false);
});
