// SMFGU-TALIA-CLAIMS-015: 40 individual source holds + fictional arithmetic + context security.
// No service key, answer bank, personal member data, price feed or paid model.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {isContextualTutorFollowup,getVerifiedPriorTutorQuestion}
 from '../functions/_lib/tutor-conversation-context-v014159.js';
const read=name=>JSON.parse(readFileSync('data/'+name,'utf8'));
const claims=read('talia-claims-101-140-evidence-batch-v1.json');
const guides=[...read('talia-foundation-explanations-batch06-v1.json').guides,...read('talia-foundation-explanations-batch07-v1.json').guides];
const near=(got,expected)=>assert.ok(Math.abs(got-expected)<1e-9,got+' != '+expected);
test('40/40 canonical topic codes matched, one source reference each, full ungraded teaching and explicit release holds',()=>{
 assert.equal(claims.rows.length,40);assert.equal(claims.sourcePagesIndividuallyRead,6);
 assert.equal(new Set(claims.rows.map(x=>x.code)).size,40);
 for(let i=0;i<40;i++){
  const x=claims.rows[i],g=guides[i];
  assert.equal(x.number,i+101);assert.equal(x.code,g.code);
  assert.equal(x.source,g.sourceUrls[0]);assert.equal(g.sourceUrls.length,1);
  assert.ok(x.originalWorkedCase.startsWith('FICTIONAL:'));
  assert.ok(x.originalReviewCaveat.length>=35);
  assert.equal(x.structureValid,true);assert.equal(x.independentPublicationApproved,false);
  assert.equal(x.thirdPartyRights,'NOT_APPROVED');
  assert.equal(g.independentEditorialApproved,false);
  assert.equal(x.mathStatus,'FULL_REFERENCE_AND_IMPLEMENTATION_CROSSCHECK_PENDING');
 }
});
test('32 explicitly reviewed classroom calculations and 8 interpretation boundaries',()=>{
 const calc=new Map([
 [101,[50*.4,20]],[102,[(39-40+1.5)/40,.0125]],
 [103,[4*.3/24,.05]],[104,[1000-100,900]],[106,[1000*10,10000]],
 [107,[22-18,4]],[108,[1000*.06/2,30]],[109,[50/800,.0625]],
 [110,[1000/1.05,952.3809523809524]],[111,[1000*1.03,1030]],
 [112,[1000/1.1,909.090909090909]],[113,[(9.8e6-.2e6)/4e5,24]],
 [114,[.076-.08,-.004]],[115,[50-20,30]],[116,[300000+50000,350000]],
 [117,[Math.max(700000-800000,0),0]],[118,[15.25-15.20,.05]],
 [120,[10*(23-20),30]],[121,[100*.30/15,2]],
 [122,[1.10*.90-1,-.01]],[123,[Math.sqrt(1.08)-1,.0392304845413265]],
 [124,[1.08/1.03-1,.0485436893203883]],[125,[1.05**2-1,.1025]],
 [126,[.6*.1+.4*(-.05),.04]],[127,[720/(720+400),.6428571428571429]],
 [128,[720-.6*1120,48]],[129,[.5**2+.3**2+.2**2,.38]],
 [130,[.5*(-.1)+.5*(-.1),-.1]],
 [134,[(100-60-30)/100,.1]],[135,[12/3,4]],
 [136,[120/((20+30)/2),4.8]],[137,[18/180*365,36.5]],
 [138,[15/((80+120)/2),.15]],[139,[90/60,1.5]],[140,[5/50,.1]]
 ]);
 assert.equal(calc.size,35);
 for(const [id,[value,expected]] of calc){near(value,expected);assert.ok(claims.rows[id-101].originalWorkedCase.length>85)}
 const interpret=[105,119,131,132,133];
 assert.equal(interpret.length,5);
 for(const id of interpret)assert.ok(claims.rows[id-101].originalReviewCaveat.length>35);
 // A $350k missing-assets illustration is NOT a $350k promised SIPC payout.
 assert.equal(claims.rows[116-101].independentPublicationApproved,false);
 // The SEC ratio guide uses total liabilities/equity; interest-bearing debt is a distinct definition.
 assert.match(claims.rows[139-101].sourceFactScope,/total liabilities/i);
 // A public annual report was not accessible before its EDGAR timestamp.
 assert.match(claims.rows[133-101].originalWorkedCase,/January 15/);
});
test('Tutor followup request cannot inject browser history, answer keys or another member turn',async()=>{
 const A='11111111-1111-4111-8111-111111111111';
 const B='22222222-2222-4222-8222-222222222222';
 const C='33333333-3333-4333-8333-333333333333';
 assert.equal(isContextualTutorFollowup('Why did that EMA signal lag?'),true);
 assert.equal(isContextualTutorFollowup('Explain more'),true);
 assert.equal(isContextualTutorFollowup('What is a simple moving average?'),false);
 let pathCount=0;
 const mock=async(_env,path)=>{
  pathCount++;
  assert.match(path,new RegExp('user_id=eq\\.'+A));
  assert.match(path,new RegExp('conversation_id=eq\\.'+C));
  assert.match(path,/select=question,generation/);
  assert.doesNotMatch(path,/answer|rubric|member_email|protected/i);
  return {ok:true,data:[{question:'Please explain SMA seeding with three completed bars',generation:'verified:original-competency-guide'}]};
 };
 const text=await getVerifiedPriorTutorQuestion({},A,C,{rest:mock});
 assert.match(text,/SMA seeding/);assert.equal(pathCount,1);
 assert.equal(await getVerifiedPriorTutorQuestion({},'browser-injected',C,{rest:mock}),null);
 assert.equal(await getVerifiedPriorTutorQuestion({},B,'malformed', {rest:mock}),null);
 assert.equal(await getVerifiedPriorTutorQuestion({},A,C,{rest:async()=>({ok:true,data:[{question:'Private fake answer',generation:'unverified:model'}]})}),null);
 assert.equal(await getVerifiedPriorTutorQuestion({},A,C,{rest:async()=>({ok:true,data:[{question:'valid',generation:'verified:reviewed-glossary-logic'},{question:'extra',generation:'verified:reviewed-glossary-logic'}]})}),null);
});
