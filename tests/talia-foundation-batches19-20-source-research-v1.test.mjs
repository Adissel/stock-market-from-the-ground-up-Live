import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
const B=n=>JSON.parse(readFileSync(new URL('../data/talia-foundation-explanations-batch'+n+'-v1.json',import.meta.url),'utf8')).guides;
const batches=[B('19'),B('20')],all=batches.flat();
test('Foundation batches 19 and 20: forty claim-scoped primary/methodology citations with no publication approvals',()=>{
 assert.deepEqual(batches.map(b=>b.length),[20,20]);
 assert.equal(new Set(all.map(g=>g.code)).size,40);
 for(const g of all){
  assert.equal(g.previousGenericSourceUrl,'https://www.sec.gov/edgar/search/');
  assert.ok(g.sourceUrls.length>=1&&g.sourceUrls.length<=2,g.code);
  for(const s of g.sourceUrls){ const u=new URL(s);assert.equal(u.protocol,'https:');assert.notEqual(s,g.previousGenericSourceUrl); }
  assert.equal(g.sourceResearchTriage.internalResearchDate,'2026-11-03');
  assert.ok(g.sourceResearchTriage.supportedScope.length>=75,g.code);
  assert.ok(g.sourceResearchTriage.limitationsAndOpenQuestions.length>=75,g.code);
  assert.equal(g.sourceResearchTriage.independentMathAccepted,false,g.code);
  assert.equal(g.sourceResearchTriage.independentPublicationApproved,false,g.code);
  assert.equal(g.sourceResearchTriage.sourceRedistributionRightsCleared,false,g.code);
  assert.equal(g.independentEditorialApproved,false,g.code);
  assert.equal(g.officialCompetency,false,g.code);
  assert.equal(g.editorSourceReview.independentPublicationAccepted,false,g.code);
 }
});
test('Batch19 negative-base revenue comparison remains explanatory rather than misleading',()=>{
 const g=batches[0][16];
 assert.equal(g.code,'TALIA_TOPIC_REVENUE_GROWTH_WITH_A_NEGATIVE_BASE');
 assert.match(g.workedCase,/Prior-period net revenue is -\$100/);
 assert.match(g.workedCase,/\+\$120/);
 assert.match(g.workedCase,/-120%/);
 assert.match(g.reviewExplanation,/not a meaningful ordinary growth rate/);
 assert.equal(20-(-100),120);
 assert.equal(((20-(-100))/(-100))*100,-120);
 assert.equal(Number.isFinite((20-0)/0),false);
 assert.equal(g.independentEditorialApproved,false);
});
test('Batch20 vintage chronology, mixed executions and model assumptions have explicit limits',()=>{
 assert.match(batches[1][0].sourceUrls[0],/fred\.stlouisfed\.org/);
 assert.match(batches[1][7].sourceUrls[0],/volume-weighted-average-price-vwap/);
 assert.match(batches[1][13].sourceResearchTriage.limitationsAndOpenQuestions,/survivorship/);
 assert.match(batches[1][16].sourceResearchTriage.limitationsAndOpenQuestions,/fees and slippage/);
 assert.ok(Math.abs((20*10+90*21)/100-20.9)<1e-9);
 assert.ok(Math.abs(20/Math.sqrt(25)-4)<1e-9);
 assert.equal((100-80)/100,0.2);
});

test('The all-600 scanner recognizes broad SEC EDGAR search links excluded by the legacy counter',()=>{
 const scanner=readFileSync(new URL('../scripts/qa/talia-foundation-source-quality-v1.mjs',import.meta.url),'utf8');
 assert.match(scanner,/edgarGeneric/);
 assert.ok(scanner.includes("https://www.sec.gov/edgar/search/"));
 assert.match(scanner,/genericEdgarSearchReferences/);
 assert.equal(batches.flat().filter(g=>g.sourceUrls.includes('https://www.sec.gov/edgar/search/')).length,0);
 // Inventory is dynamic: Batch 26's formerly generic EDGAR link was
 // replaced by a scoped primary source. Do not demand that a bad URL persist.
 // Verify all 600 actual sources against the scanner's executed result.
 const all600=Array.from({length:30},(_,i)=>B(String(i+1).padStart(2,'0'))).flat();
 assert.equal(all600.length,600,'All thirty original batches must remain present');
 assert.equal(new Set(all600.map(g=>g.code)).size,600,'All lessons must retain unique codes');
 const outstanding=all600.flatMap(g=>g.sourceUrls.filter(uri=>uri==='https://www.sec.gov/edgar/search/'));
 const scan=JSON.parse(execFileSync(process.execPath,[new URL('../scripts/qa/talia-foundation-source-quality-v1.mjs',import.meta.url).pathname],{encoding:'utf8'}).trim());
 assert.equal(scan.counts.lessons,600);
 assert.equal(scan.counts.genericEdgarSearchReferences,outstanding.length,
  'The executed all-600 scanner must count every still-generic EDGAR source');
 assert.equal(scan.counts.independentApprovals,0,
  'Source updates cannot silently approve publication');
 assert.equal(scan.counts.missingRightsMetadata,0,
  'Source updates must retain explicit rights-hold metadata');
});
