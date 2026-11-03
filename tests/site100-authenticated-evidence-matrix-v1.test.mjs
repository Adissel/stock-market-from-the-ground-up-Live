import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const data=JSON.parse(readFileSync(new URL('../data/site100-member-journey-acceptance-matrix-v1.json',import.meta.url),'utf8'));
const original=JSON.parse(readFileSync(new URL('../data/lab-227-remaining-source-internal-evidence-v1.json',import.meta.url),'utf8'));
const read=p=>readFileSync(join(root,p),'utf8');
const parse=l=>[...l.matchAll(/"((?:[^"]|"")*)"|([^,]+)/g)].map(m=>(m[1]??m[2]).replaceAll('""','"'));
const lines=read('docs/research/stockstotrade/canonical_419_lab_source_candidates_v2.csv').trim().split(/\r?\n/),h=parse(lines[0]);
const canonical=lines.slice(1).map(l=>Object.fromEntries(parse(l).map((v,i)=>[h[i],v])));
const siteRows=canonical.filter(x=>x.lab_id.startsWith('SITE-'));
const labels=['Understand','Recognize','Apply','Failure Modes & Review'];
test('100 SITE cases exist in original canonical order and map to 25 four-activity families',()=>{
 assert.equal(canonical.length,419);assert.equal(siteRows.length,100);
 assert.equal(data.records.length,100);assert.equal(data.sourceCaseGroups,25);
 assert.equal(new Set(data.records.map(x=>x.labId)).size,100);
 assert.deepEqual(data.records.map(x=>x.labId),siteRows.map(x=>x.lab_id));
 assert.deepEqual(data.records.map(x=>x.activityType),Array.from({length:100},(_,i)=>labels[i%4]));
 assert.equal(data.status,'QA_SCENARIO_MATRIX_NOT_GENUINE_MEMBER_ACCEPTANCE');
 assert.equal(data.counts.authenticatedPassed,0);
});
for(const [i,row] of data.records.entries()){
 test('SITE '+String(i+1).padStart(3,'0')+' '+row.labId+' is ready for genuine two-account QA, not approved',()=>{
  const originalRow=siteRows[i];
  assert.equal(row.labId,originalRow.lab_id);assert.equal(row.canonicalTitle,originalRow.title);
  assert.deepEqual(row.officialCompetencies,originalRow.competencies.split(';'));
  assert.ok(row.genuineMemberAcceptanceScenario.length>40);
  assert.ok(row.requiredTestIdentities.length===2);
  assert.equal(row.identityNames,'QA_PLACEHOLDERS_NOT_ACTIVE_ACCOUNT_CREDENTIALS');
  assert.equal(row.requiresCrossAccountDeny,true);assert.equal(row.requiresKeyboardAndMobile,true);
  assert.equal(row.requiresScreenReader,true);
  assert.equal(row.genuineBrowserTestPassed,false);assert.equal(row.actualTwoAccountTestPassed,false);
  assert.equal(row.releaseAccepted,false);assert.equal(row.ownerAuthoredLessonsPreserved,true);
  assert.equal(row.rightsAndPrivateDataGate,'OPEN');
  assert.ok(existsSync(join(root,row.representativeExistingRoute)),row.labId+' missing route');
  assert.equal(row.javascriptEvidencePaths.length,2);
  for(const path of row.javascriptEvidencePaths)assert.ok(existsSync(join(root,path)),path+' missing');
 });
}
for(const [i,f] of original.internalEvidenceCandidates.entries()){
 test('Product family '+String(i+1).padStart(2,'0')+': sources and real HTML landmarks, not granted entitlement',()=>{
  const rows=data.records.slice(i*4,(i+1)*4);
  assert.equal(rows.length,4);assert.ok(rows.every(x=>x.featureId===f.id));
  const html=read(rows[0].representativeExistingRoute);
  assert.match(html,/<title[^>]*>[^<]+<\/title>/i);
  assert.match(html,/<body\b/i);assert.match(html,/<main\b/i);
  assert.match(html,/<h1\b/i);
  for(const path of f.paths){const source=read(path);assert.ok(source.trim().length>300,path+' suspiciously short');}
 });
}
test('Security and release decisions remain frozen despite 100 generated cases',()=>{
 assert.equal(data.protectedMembershipTargets.independentPremiumActivation,false);
 assert.equal(data.protectedMembershipTargets.livePaymentChanges,false);
 assert.equal(data.counts.caseRecords,100);assert.equal(data.counts.featureFamilies,25);
 assert.equal(data.counts.sourceJavascriptPointers,50);
 assert.equal(data.counts.independentlyReleased,0);
});
