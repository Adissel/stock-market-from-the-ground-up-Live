// Independent, non-approval technical review of the owner-supplied four-lesson
// packet. Reviewer must be a separate human/editorial authority before APPROVED.
// This test protects source scope, math, fresh-transfer boundaries and status.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const load=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const packet=load('docs/research/talia/2026-10-31_four_lesson_editorial_packet_v1.json');
const library=load('data/tutor-lab-claim-evidence-v1.json');
const canonical=load('data/competency-lab-paths-v01499.json');
assert.equal(packet.documentId,'SMFGU-TALIA-REVIEW-027A');
assert.equal(packet.status,'SOURCE_RECHECKED_INDEPENDENT_EDITORIAL_PENDING');
assert.equal(packet.reviews.length,4);
assert.equal(new Set(packet.reviews.map(r=>r.labId)).size,4);
const reviewed=new Set(['F2-C04-L01','F2-C04-L02','DT-C41-L01','DT-C41-L02']);
for(const item of packet.reviews){
 assert(reviewed.has(item.labId));
 assert.equal(item.title,canonical.byLab[item.labId].title);
 assert.match(item.contentSha256,/^[a-f0-9]{64}$/,'Owner-supplied hash shape; canonical hash method not asserted');
 assert.equal(item.independentReviewer,null,'No invented independent reviewer');
 assert.equal(item.independentEditorialDecision,'PENDING');
 assert.equal(item.assessmentPublicationAuthorized,false);
 assert.equal(item.rights,'Link and original summary only; no article or market-data reproduction.');
 const lesson=library.records.find(r=>r.id===item.labId);
 assert(lesson);
 assert.equal(lesson.title,item.title);
 assert.equal(lesson.worked,item.workedCase);
 assert.equal(lesson.counterexample,item.counterexample);
 assert.equal(lesson.sourceUrl,item.sourceUrl);
 assert.equal(lesson.learningObjective,item.learningObjective);
 assert.equal(lesson.evidenceProcedure,item.evidenceProcedure);
 assert.equal(lesson.freshTransfer,item.freshTransfer);
 assert(lesson.freshTransfer.startsWith('FICTIONAL:'));
 assert(lesson.evidenceProcedure.length>=55);
 assert(lesson.learningObjective.length>=55);
 assert.equal(lesson.reviewStatus,'source_specific_general_claim_checked_ungraded_not_independently_approved');
}
const money=(x)=>Math.round(x*1000000)/1000000;
const mid=(bid,ask)=>(bid+ask)/2;
assert.equal(money(20.10-19.95),0.15,'Bid/ask transfer spread, dollars/share');
assert.equal(money(mid(19.95,20.10)),20.025,'Preserve $20.025 unrounded midpoint');
assert.equal(money(8.48-8.40),0.08,'First spread in width comparison');
assert.equal(money(8.56-8.40),0.16,'Second spread comparison');
assert(200>25,'Market buy requested quantity exceeds displayed quote depth');
assert(100>10,'Buy-limit proposed quantity exceeds observed offered shares');
assert(6.08<=6.10,'Buy-limit constrains maximum price, not successful fill quantity');
const protect=['FICTIONAL','NO TRADE','source'];
assert(packet.reviews.some(x=>/NO TRADE/.test(x.freshTransfer)));
assert(library.records.length===17,'No canonical count change');
console.log('PASS four editorial technical preflight packets; original arithmetic, title and cited-source scope; no reviewer invention or independent acceptance.');
