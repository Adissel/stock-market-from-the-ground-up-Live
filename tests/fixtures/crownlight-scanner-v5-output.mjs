import {C,bars,args} from '../_crownlight_scanner_wave5_helper.mjs';
const result=C.CrownlightScannerHistoricalV5.evaluate({...args,asOf:'2026-10-30T18:05:00Z'});
process.stdout.write(JSON.stringify({row:result.row,session:result.sessionDay,observed:result.observedBars})+'\n');
