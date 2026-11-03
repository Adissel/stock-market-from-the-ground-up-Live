import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const source=read('assets/js/academy-tutor-bridge-v1.js');
const sent=[];let current=true,account='learner-one',optIn=false;
const context={window:{},crypto:{randomUUID:()=> '123e4567-e89b-42d3-a456-426614174000'},
 fetch:async(url,options)=>{
  assert.equal(url,'/api/market-tutor');assert.equal(options.method,'POST');
  assert.equal(options.headers.authorization,'Bearer test-token');
  const body=JSON.parse(options.body);sent.push(body);
  assert.equal(body.mode,'explain');assert.equal(body.saveHistory,false);
  assert(!JSON.stringify(body).includes('PRIVATE_ANSWER_7789'));
  assert(!JSON.stringify(body).includes('Confidential lesson'));
  return {ok:true,status:200,json:async()=>({ok:true,answer:'Fictional practice and a source limitation.',generation:'reviewed-glossary-logic'})};
 }};
vm.runInNewContext(source,context);
const api=context.window.GroundUpAcademyTutorBridgeV1;
assert(api&&typeof api.create==='function');
assert.equal(api.topicFor({title:'VWAP Review'}),'VWAP mathematics and source limitations');
const day={programCode:'risk60',day:12,title:'VWAP Review',objective:'Confidential lesson PRIVATE_ANSWER_7789'};
const client={auth:{getSession:async()=>({data:{session:{
 access_token:'test-token',user:{id:account,user_metadata:{market_tutor_ai_enabled:optIn}}}}})}};
const request=api.create({client,userId:'learner-one',day,isCurrent:()=>current});
assert.equal((await request()).answer,'Fictional practice and a source limitation.');
assert.equal(sent[0].allowModel,false);
assert.match(sent[0].question,/^Academy program: risk60\. Study day: 12\. Instructional stage: Learn\./);
optIn=true;await request();assert.equal(sent[1].allowModel,true);
account='learner-two';await assert.rejects(request(),/current member account/);
assert.equal(sent.length,2);
current=false;await assert.rejects(request(),/learning session changed/);
assert.equal(sent.length,2);
for(const page of ['bootcamp.html','bootcamp-academy.html']){
 const html=read(page);
 assert(html.includes('academy-tutor-bridge-v1.js'));
 assert(html.indexOf('academy-tutor-bridge-v1.js')<html.indexOf('academy-guided-v1.js'));
}
for(const page of ['assets/js/bootcamp.js','assets/js/bootcamp-academy-v014168.js']){
 const js=read(page);assert(js.includes('GroundUpAcademyTutorBridgeV1?.create?.'));
 assert(js.includes('memberFirstName'));assert(js.includes('tutorRequest'));
}
const guide=read('assets/js/academy-guided-v1.js');
assert(guide.includes('Ask Market Tutor — optional'));
assert(guide.includes('cancelTutor();'));
assert(guide.includes('![0,1,2,7,8,9].includes(stage)'));
console.log('PASS authenticated topic-only Academy Tutor bridge, session isolation and optional AI consent boundaries');
