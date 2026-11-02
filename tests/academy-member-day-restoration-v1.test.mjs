import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('../assets/js/bootcamp-academy-v014168.js',import.meta.url),'utf8');

test('Free and Academy programs restore a valid requested study day',()=>{
 assert.match(source,/const desired=Number\(new URL\(location\.href\)\.searchParams\.get\('day'\)\)/);
 assert.match(source,/desired>=1&&desired<=days\.length\?desired:firstUnsaved/);
 assert.doesNotMatch(source,/desired<=5\?desired:firstUnsaved/);
});

test('Free and Academy programs resume at first unfinished day',()=>{
 assert.match(source,/days\.find\(d=>progress\.get\(d\.day\)\?\.status!==\s*'reflection_saved'\)\?\.day\|\|days\.length/);
 assert.match(source,/progress\.clear\(\);for\(const x of data\.progress\)progress\.set\(x\.day,x\)/);
 assert.ok(source.indexOf("progress.clear();for(const x of data.progress)progress.set(x.day,x)")<
  source.indexOf("const desired=Number(new URL(location.href).searchParams.get('day'))"));
});

test('restoration does not weaken authenticated progress or checkpoint gates',()=>{
 assert.match(source,/progressStore:enrolled&&progressAvailable/);
 assert.match(source,/client,userId:dayMember,programCode:d\.programCode,day:d\.day/);
 assert.match(source,/alive:\(\)=>dayMember===userId&&daySession===sessionSerial/);
 assert.match(source,/if\(!\['start','save_reflection'\]\.includes\(action\)\|\|busy\|\|!program\|\|!progressAvailable\|\|!enrolled\)return/);
});

test('Academy rejects cross-program, missing, or invalid progress responses before restoring private checkpoints',()=>{assert.match(source,/!Array\.isArray\(data\.progress\)/);assert.match(source,/x\.day<1\|\|x\.day>loaded\.length/);assert.match(source,/x\.programCode!==undefined&&x\.programCode!==code/);assert.ok(source.indexOf('if(!Array.isArray(data.progress)')<source.indexOf('progress.clear();for(const x of data.progress)'));});
