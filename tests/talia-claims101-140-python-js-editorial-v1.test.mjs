import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
const load=p=>JSON.parse(readFileSync('data/'+p,'utf8'));
const claim=load('talia-claims-101-140-evidence-batch-v1.json');
const other=load('talia-claims-remaining21-source-review-v1.json');
const guides=[...load('talia-foundation-explanations-batch06-v1.json').guides,
 ...load('talia-foundation-explanations-batch07-v1.json').guides];
const mean=a=>a.reduce((x,y)=>x+y,0)/a.length;
const values={
101:50*.4,102:(39+1.5-40)/40,103:4*.3/24,104:1000-100,106:1000*10,
107:22-18,108:1000*.06/2,109:50/800,110:1000/1.05,111:1000*1.03,
112:1000/1.1,113:(9.8e6-.2e6)/4e5,114:.076-.08,115:50-20,116:3e5+5e4,
117:Math.max(7e5-8e5,0),118:15.25-15.2,120:(23-20)*10,121:100*.3/15,
122:1.1*.9-1,123:Math.sqrt(1.2*.9)-1,124:1.08/1.03-1,125:1.05**2-1,
126:.6*.10+.4*(-.05),127:720/1120,128:720-.6*1120,
129:[.5,.3,.2].reduce((a,b)=>a+b*b,0),130:(-.10)/2+(-.10)/2,
134:(100-(60+30))/100,135:12/3,136:120/mean([20,30]),
137:365*18/180,138:15/mean([80,120]),139:90/60,140:5/50
};
const qualitative=[105,119,131,132,133];
test('35 individual fictional case calculations independently agree in Python and JavaScript',()=>{
 const r=spawnSync('python3',['scripts/qa/talia_claims101_140_independent_python_v1.py'],
  {encoding:'utf8',timeout:8000});
 assert.equal(r.status,0,r.stderr);
 const py=JSON.parse(r.stdout);
 assert.deepEqual(Object.keys(values).sort(),Object.keys(py.values).sort());
 assert.deepEqual(Object.keys(py.qualitative).map(Number).sort((a,b)=>a-b),qualitative);
 for(const [id,v] of Object.entries(values)){
  const n=Number(id),g=guides[n-101],row=claim.rows[n-101];
  assert.ok(Number.isFinite(v)&&Math.abs(v-py.values[id])<1e-8,id);
  assert.equal(row.code,g.code);
  assert.match(g.workedCase,/^FICTIONAL:/);
  assert.equal(row.independentPublicationApproved,false);
 }
 assert.equal(py.finalEditorialApproved,false);
});
test('all 40 have distinct math or qualitative dispositions and retain release holds',()=>{
 const ids=Object.keys(values).map(Number).concat(qualitative).sort((a,b)=>a-b);
 assert.deepEqual(ids,Array.from({length:40},(_,i)=>101+i));
 assert.equal(guides.length,40);
 const reviewed=new Map(other.items.map(x=>[x.number,x]));
 assert.equal(reviewed.size,21);
 for(const [n,review] of reviewed){
  assert.equal(review.code,guides[n-101].code);
  assert.equal(review.independentPublicationAccepted,false);
 }
 assert.equal(reviewed.get(104).review,'CORRECTION_REQUIRED');
 assert.equal(reviewed.get(133).review,'CORRECTION_REQUIRED');
 assert.equal(reviewed.get(129).review,'SOURCE_MISMATCH');
 for(const [id,phrase] of [[105,'noncumulative'],[119,'Macaulay'],
  [131,'unaudited'],[132,'conditional'],[133,'February 20']]){
  assert.match(guides[id-101].workedCase,new RegExp(phrase,'i'));
 }
});

test('P2 claim-specific references #103 and #122 stay synchronized and unapproved',()=>{
 const pointers=new Map([[103,'https://syndication.finra.org/content/defining-value-investment'],[122,'https://syndication.finra.org/content/how-are-your-investments-doing-returns-explained']]);
 for(const [id,url] of pointers){
  const guide=guides[id-101],row=claim.rows[id-101];
  assert.equal(guide.sourceUrls.length,1);
  assert.equal(guide.sourceUrls[0],url);
  assert.equal(row.source,url);
  assert.equal(guide.independentEditorialApproved,false);
  assert.equal(row.independentPublicationApproved,false);
  assert.equal(row.thirdPartyRights,'NOT_APPROVED');
  assert.match(row.sourceStatus,/PRIMARY_PAGE_CONTENT_SCOPED_TARGETED/);
 }
 assert.ok(Math.abs(4*.3/24-.05)<1e-12,'Indicated yield is only hypothetical');
 assert.ok(Math.abs(1.1*.9-1+.01)<1e-12,'Compounded loss differs from zero');
 const shell=readFileSync('scripts/build-pages.sh','utf8');
 assert.ok(!shell.includes('\\r'),'Pages build script must remain LF-only');
});
