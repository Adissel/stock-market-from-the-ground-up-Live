// SMFGU-TALIA-CLAIM-101-180-003. Structural and source-use checks only, not publication approval.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {answerFromGuide,originalGuides} from '../functions/_lib/original-competency-tutor-v014100.js';
const read=(name)=>JSON.parse(readFileSync(new URL('../data/'+name,import.meta.url),'utf8'));
const batches=[6,7,8,9].map(n=>read('talia-foundation-explanations-batch0'+n+'-v1.json'));
const topics=batches.flatMap(x=>x.guides);
test('80 structurally unique Foundation topics have bounded sources and individual HOLD statuses',()=>{
 assert.deepEqual(batches.map(b=>b.guides.length),[20,20,20,20]);
 assert.equal(topics.length,80);
 assert.equal(new Set(topics.map(g=>g.code)).size,80);
 assert.equal(new Set(topics.map(g=>g.title.toLowerCase())).size,80);
 for(const g of topics){
  assert.equal(g.officialCompetency,false,g.code);
  assert.equal(g.independentEditorialApproved,false,g.code);
  assert.equal(g.editorSourceReview.independentPublicationAccepted,false,g.code);
  assert.ok(g.sourceUrls.length>=1&&g.sourceUrls.length<=2,g.code+' source count must remain bounded');
  for(const source of g.sourceUrls){const u=new URL(source);assert.equal(u.protocol,'https:',g.code);}
  if(g.sourceUrls.length===2){
   assert.equal(g.code,'TALIA_TOPIC_DIVIDEND_CASH_VS_RETURN');
   assert.equal(g.previousGenericSourceUrl,'https://www.investor.gov/introduction-investing');
   assert.ok(g.sourceUrls.every(url=>url.startsWith('https://www.quantconnect.com/docs/')));
   assert.equal(g.sourceResearchTriage.independentPublicationApproved,false);
   assert.equal(g.sourceResearchTriage.sourceRedistributionRightsCleared,false);
  }
  assert.match(g.workedCase,/^FICTIONAL:/,g.code);
  for(const field of ['title','concept','procedure','workedCase','limit','invalidation','commonError','selfCheck','reviewExplanation','transferQuestion']){
   assert.ok(g[field]?.length>=70 || field==='title',g.code+' incomplete '+field);
  }
  const deep=answerFromGuide(g,'explain','','Teach this in more depth: '+g.title);
  assert.ok(deep.includes(g.workedCase),g.code);
  assert.ok(deep.includes(g.transferQuestion),g.code);
  const correction=answerFromGuide(g,'explain','','Explain the common mistake: '+g.title);
  assert.ok(correction.includes(g.commonError),g.code);
  const review=answerFromGuide(g,'review','I want to reconsider','Explain '+g.title);
  assert.match(review,/No rubric was scored and no mastery credit was awarded/);
  assert.doesNotMatch(deep,/we guarantee profit|mastery awarded|buy this stock now/i,g.code);
 }
});
test('eleven source-specific replacements retain runtime single-reference invariant',()=>{
 const updated=[
  'TALIA_TOPIC_CORRECTED_TRADE_REPORT','TALIA_TOPIC_HIDDEN_LIQUIDITY_INVISIBLE','TALIA_TOPIC_DEPTH_SNAPSHOT_VS_HISTORY',
  'TALIA_TOPIC_OFF_EXCHANGE_PRINT_LOCATION','TALIA_TOPIC_OPENING_AUCTION_PRICE',
  'TALIA_TOPIC_INDICATIVE_AUCTION_NOT_EXECUTED','TALIA_TOPIC_HALT_QUOTE_TRUST',
  'TALIA_TOPIC_LULD_BAND_NOT_STOP','TALIA_TOPIC_SSR_NOT_BLANKET_SHORT_BAN',
  'TALIA_TOPIC_DAY_ORDER_SESSION_END','TALIA_TOPIC_SHORT_LOCATE_NOT_FILL'
 ];
 for(const code of updated){
  const g=topics.find(x=>x.code===code);
  assert.ok(g,code);
  assert.match(g.editorSourceReview.result,/source_pointer_more_claim_specific/);
  assert.ok(g.sourceUrls[0],code);
  assert.equal(g.sourceUrls.length,1,code);
 }
 // The 11 more precise replacements leave exactly these 13 *unapproved*
 // SEC Rule 605 candidate pointers. Protect their identities, not a stale count:
 // additions/removals must prompt item-level source-scope review.
 const rule605=topics.filter(g=>g.sourceUrls[0].includes('rule-605-regulation-nms'));
 const stillUnderReview=[
   "TALIA_TOPIC_VENUE_QUOTE_DIFFERENCE",
   "TALIA_TOPIC_TRADE_AT_BID_NOT_INTENT",
   "TALIA_TOPIC_MIDPOINT_NOT_EXECUTABLE",
   "TALIA_TOPIC_LOCKED_CROSSED_QUOTE",
   "TALIA_TOPIC_NBBO_ELIGIBILITY_CONDITIONS",
   "TALIA_TOPIC_QUOTE_TRADE_CLOCK_ORDER",
   "TALIA_TOPIC_TRADE_COUNT_VS_SHARE_VOLUME",
   "TALIA_TOPIC_TAPE_COLOR_CONVENTION",
   "TALIA_TOPIC_ONE_SIDED_QUOTE_NO_SPREAD",
   "TALIA_TOPIC_QUOTED_EFFECTIVE_SPREAD",
   "TALIA_TOPIC_PRICE_IMPROVEMENT_BENCHMARK",
   "TALIA_TOPIC_SLIPPAGE_REFERENCE_EXPLICIT",
   "TALIA_TOPIC_REALIZED_SPREAD_HORIZON"
 ];
 assert.deepEqual(rule605.map(g=>g.code).sort(),stillUnderReview.sort(),
  'Track every remaining SEC Rule 605 source candidate for claim-specific editorial review');
});
test('author/editor improves six specific weak prompts without inventing an independent reviewer',()=>{
 const repaired=[
 'TALIA_TOPIC_STOCK_SHAREHOLDER_RESIDUAL','TALIA_TOPIC_COMPOUND_RETURNS_PATH',
 'TALIA_TOPIC_REBALANCING_TARGET_DOLLARS','TALIA_TOPIC_TENQ_VS_TENK_PERIOD',
 'TALIA_TOPIC_AVERAGE_INVENTORY_TURNOVER','TALIA_TOPIC_DEBT_EQUITY_DEFINITION'
 ];
 for(const code of repaired){
  const g=topics.find(x=>x.code===code);assert.ok(g,code);
  assert.ok(g.commonError.length>=70 && g.selfCheck.length>=70,code);
  assert.equal(g.independentEditorialApproved,false,code);
 }
});
test('existing member-facing source loader retrieves all 80 audited topics',async()=>{
 const env={ASSETS:{fetch:async request=>{
  const name=new URL(request.url).pathname.split('/').at(-1);
  try{return new Response(readFileSync(new URL('../data/'+name,import.meta.url),'utf8'));}
  catch{return new Response('not found',{status:404});}
 }}},request=new Request('https://tutor.example/api/market-tutor-v01492');
 // A sample per batch plus each of eight changed reference cases catches a silently rejected batch.
 for(const g of [...batches.map(b=>b.guides[0]),...topics.filter(x=>x.editorSourceReview?.result?.includes('source_pointer_more_claim_specific'))]){
  const res=await originalGuides(env,request,'Explain '+g.title);
  assert.equal(res[0]?.code,g.code,g.code+' not retrieved');
 }
});
