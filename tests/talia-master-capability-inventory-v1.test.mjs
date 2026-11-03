import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const inventory=JSON.parse(readFileSync('data/talia-master-capability-inventory-v1.json','utf8'));
const all=inventory.sections.flatMap(section=>section.requirements);
test('November 3 Tutor master inventory freezes all fifteen controlling capability areas',()=>{
 assert.equal(inventory.baselineDate,'2026-11-03');assert.equal(inventory.repository,'Adissel/stock-market-from-the-ground-up-Live');
 assert.equal(inventory.sections.length,15);assert.deepEqual(inventory.sections.map(x=>x.id),Array.from({length:15},(_,i)=>'TAL-MASTER-'+String(i+1).padStart(2,'0')));
 assert.ok(all.length>=180,'Inventory must retain detailed capabilities rather than section titles only');
});
test('curriculum scale and non-equivalent indicator claims remain explicit',()=>{
 assert.deepEqual(inventory.curriculumScale,{canonicalLabs:419,declaredBootCampStudyDayPositions:274,officialCompetencies:30,supplementalFoundationExplanations:600,indicatorSourceGuides:73,indicatorSourceGuidesIndependentlyValidatedAsChartOverlays:null});
 assert.ok(all.some(x=>x.includes('419 canonical Labs')));assert.ok(all.some(x=>x.includes('73 guides as source guides')));
});
test('Tutor remains one zero-budget source-grounded engine with protected boundaries',()=>{
 assert.equal(inventory.architecture.existingTutorOnly,true);assert.equal(inventory.architecture.zeroAdditionalExpenditure,true);assert.equal(inventory.architecture.foundationWorksWithoutPaidProvider,true);assert.equal(inventory.architecture.noProtectedAnswerDisclosure,true);assert.equal(inventory.architecture.noLookahead,true);
 for(const phrase of ['never overwrite grades','prevent lookahead','member-owned','never execute orders','never reduce inherited teaching quality'])assert.ok(all.some(x=>x.includes(phrase)),phrase);
});
test('implementation, editorial, browser and production evidence cannot collapse into one status',()=>{
 assert.deepEqual(inventory.evidenceStates,['source_implemented','source_tested','member_integration_verified','editorial_preflight_completed','independently_editorially_accepted','authenticated_browser_accepted','production_release_accepted']);
 assert.deepEqual(inventory.editionReleaseAcceptance,{FOUNDATION:'OPEN',ADVANCED:'OPEN',PROFESSIONAL:'OPEN',ENTERPRISE:'OPEN'});
});
