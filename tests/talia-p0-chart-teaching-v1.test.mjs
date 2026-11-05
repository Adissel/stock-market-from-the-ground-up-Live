import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const src=readFileSync('src/tutor/TaliaClassroom.tsx','utf8');
const css=readFileSync('assets/css/talia-live-lesson-v1.css','utf8');
test('P0 earlier selected candle is the evidence boundary',()=>{
 for(const v of ['function chartEvidenceAt','const limit=(index+1)*timeframe','if(limit>visible)return null','const source=REPLAY.slice(0,limit)','if(rows.length!==timeframe)return null','chartEvidenceAt(index,interval,visible)','setFocusSelection({index,timeframe:interval})'])
  assert.ok(src.includes(v),v);
});
test('P0 evidence facts are calculated using completed fictional data and honest indicator terminology',()=>{
 for(const v of ['syntheticVolume(row,start+j)','closes.slice(0,p)','body/range*100','(x.high+x.low+x.close)/3','vwapProxy:','ema9:ema(9)','ema20:ema(20)','not exact trade-print VWAP','no future bars'])
  assert.ok(src.includes(v),v);
});
test('P0 instructor chart focus and follow-up controls remain accessible and entitlement bounded',()=>{
 for(const v of ['aria-label="Talia selected completed candle evidence"','Explain this evidence','Explain more simply','Show calculations','Ask me a question','teachingCatalog?.allowedDepths.includes(teachingDepth)?teachingDepth:\'FOUNDATION\'','Resume replay','tc-evidence-dock'])
  assert.ok(src.includes(v)||css.includes(v),v);
 assert.match(src,/if\(checkpoint&&selectedMode==='review'\)/);
 assert.match(src,/allowModel:false/);
});
