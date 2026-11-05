import test from'node:test';import assert from'node:assert/strict';import{readFileSync}from'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const m=JSON.parse(read('data/knowledge/kdb-priority25-curriculum-crosswalk-v1.json'));
const paths=JSON.parse(read('data/competency-lab-paths-v01499.json'));
const claims=JSON.parse(read('data/knowledge/kdb-claim-evidence-priority25-v1.json'));
test('25 claim versions use 30 official skill IDs and existing 419 Lab inventory only as provisional links',()=>{
 assert.equal(m.articleCount,25);assert.equal(m.entries.length,25);assert.equal(m.canonicalLabInventory,419);
 assert.equal(m.canonicalLabMappingCoverage,419);assert.equal(m.competencyCount,30);
 assert.equal(m.linkedCompetencyCandidates,21);assert.equal(m.taliaRegistered,25);
 assert.equal(m.bootCampDayAccepted,0);assert.equal(new Set(m.entries.map(e=>e.slug)).size,25);
 for(const e of m.entries){
  assert.equal(e.articleVersion,claims.entries.find(x=>x.slug===e.slug).article_version);
  assert.equal(e.bootCampDayLinks.length,0);
  assert(e.taliaJourney!=='no_registered_talia_lesson');
  if(!e.proposedCompetency){assert.equal(e.candidateLabs.length,0);continue}
  assert(paths.bySkill[e.proposedCompetency],e.proposedCompetency);
  assert(e.candidateLabs.length>=1);
  assert(e.candidateLabs.length<=7);
  for(const lab of e.candidateLabs){assert(paths.byLab[lab.labId]);assert(paths.bySkill[e.proposedCompetency].includes(lab.labId))}
 }
});
console.log('PASS Knowledge P25 curriculum candidates: 21 competency bridges, canonical Lab links and 25 existing Talia journeys; zero unearned grades.');
