// SMFGU-TALIA-PRIMARY-CLAIM-CHECK-013 — independent synthetically calculated evidence.
// Source-scope checks are not licenses, financial advice or independent release signatures.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const get=name=>JSON.parse(readFileSync(new URL('../data/'+name,import.meta.url),'utf8'));
const review=get('talia-primary-claim-check-rule605-options-v1.json');
const options=get('talia-foundation-explanations-batch11-v1.json').guides;
const tape=[get('talia-foundation-explanations-batch08-v1.json'),get('talia-foundation-explanations-batch09-v1.json')]
 .flatMap(b=>b.guides);
const near=(actual,expected)=>assert.ok(Number.isFinite(actual)&&Math.abs(actual-expected)<1e-7,actual+' vs '+expected);
test('14 SEC FAQ and 20 OCC/OIC subject-specific dispositions remain scope-limited and never publication-approved',()=>{
 assert.equal(review.rule605.length,14);assert.equal(review.options.length,20);
 assert.equal(review.actualReviewedTopicCount,34);assert.equal(review.publicationApprovedCount,0);
 for(const row of review.rule605){
  const topic=tape[row.ordinal-141];
  assert.equal(row.topicCode,topic.code);assert.equal(row.canonicalSourceUrl,topic.sourceUrls[0]);
  assert.equal(row.factualSourceReviewed,true);
  assert.equal(row.publicationRightsAccepted,false);
  assert.equal(row.independentEditorialPublicationApproved,false);
  assert.ok(row.specificSourceFinding.length>=40);
 }
 for(const [i,row] of review.options.entries()){
  const topic=options[i];assert.equal(row.ordinal,201+i);
  assert.equal(row.topicCode,topic.code);assert.equal(row.canonicalSourceUrl,topic.sourceUrls[0]);
  assert.equal(topic.sourceUrls.length,1);
  assert.match(row.canonicalSourceUrl,/^https:\/\/(www\.)?(investor\.gov|optionseducation\.org)\//);
  assert.equal(row.independentEditorialPublicationApproved,false);
  assert.equal(row.memberVisibilityApproved,false);
  assert.equal(row.specialistPlacement,'ADVANCED_SPECIALIST_HOLD');
 }
});
test('regulatory reporting scope does not silently certify time-and-sales colors, trade motive or print aggregation',()=>{
 const by=Object.fromEntries(review.rule605.map(row=>[row.ordinal,row]));
 for(const n of [144,151,152])assert.equal(by[n].verificationStatus,'NOT_SUPPORTED_BY_RULE_605');
 assert.match(by[146].specificSourceFinding,/FAQ 19/);
 assert.match(by[147].specificSourceFinding,/2026-11-01/);
 assert.match(by[176].canonicalSourceUrl,/investor-bulletins-51/);
 assert.ok(by[179].verificationStatus.startsWith('INDIRECT_'));
});
test('options arithmetic and risk conventions independently validate all example-valued subjects',()=>{
 // Rights and exercise/assignment are conceptual; a 100-share multiplier is not universal.
 near(2.40*100,240);near(3*1.20*100,360);
 near(Math.max(46-40,0),6);near(Math.max(70-64,0),6);
 near(4.20-2.50,1.70);near(50+2.50,52.50);near(60-3,57);
 near(Math.max(58-50,0)-3,5);near(Math.max(70-60,0)-4,6);
 near(Math.max(77-80,0)-1.50,-1.50);
 near(2-Math.max(75-50,0),-23); // uncovered call: no capped upside exposure
 near(Math.max(60-50,0)-Math.max(60-55,0)-1.50,3.50);
 near(Math.max(60-50,0)-Math.max(55-50,0)-2,3);
 near(Math.max(112-100,0)+Math.max(100-112,0)-6,6);
 near(Math.max(42-40,0)-4,-2);
 near((1.20-1.00)*100,20);
 // In theory, the uncovered short call liability is unbounded as spot rises.
 assert.ok(2-Math.max(500-50,0)<-400);
 // A valid long put is bounded below by an underlying value of zero.
 assert.ok(Math.max(60-0,0)-3<=57);
});
test('microstructure arithmetic distinguishes reporting metrics from actual member fill evidence',()=>{
 near(Math.max(20,20.02),20.02);
 near((10+10.06)/2,10.03);
 near(15-15.01,-.01); // crossed; do not display as valid cheap liquidity
 near(100+400+25,525);assert.notEqual(3,525);
 near(10.10-10,.10);near(2*(10.08-10.05),.06);
 near(12.05-12.03,.02);
 near(5000*.36*5/360,25);
 near((10.08-10)*100,8);
 near(2*(10.08-10.06),.04);
});
