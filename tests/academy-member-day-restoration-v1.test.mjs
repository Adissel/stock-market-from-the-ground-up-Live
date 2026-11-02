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

test('Academy rejects invalid progress before restoring any private checkpoint',()=>{
 assert.match(source,/function validAcademyProgressRecords\(rows,code,dayCount,actor\)/);
 assert.match(source,/!Array\.isArray\(rows\)/);
 assert.match(source,/x\.day<1\|\|x\.day>dayCount/);
 assert.match(source,/x\.programCode!==undefined&&x\.programCode!==code/);
 assert.match(source,/if\(!validAcademyProgressRecords\(data\.progress,code,loaded\.length,userId\)\)/);
 assert.ok(source.indexOf('if(!validAcademyProgressRecords(')<source.indexOf('progress.clear();for(const x of data.progress)'));
});
test('Academy validator rejects duplicate-day records and member identifier mismatches',()=>{
 assert.match(source,/seen\.has\(x\.day\)/);
 assert.match(source,/seen\.add\(x\.day\)/);
 assert.match(source,/x\.user_id!==undefined&&x\.user_id!==actor/);
 assert.match(source,/x\.memberId!==undefined&&x\.memberId!==actor/);
});
