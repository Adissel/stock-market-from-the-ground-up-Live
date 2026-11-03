// Internal original synthetic arithmetic and source-review regression, not editorial signoff.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=n=>JSON.parse(readFileSync(new URL('../data/talia-foundation-explanations-batch'+n+'-v1.json',import.meta.url),'utf8')).guides;
const topics=[23,24,29,30].flatMap(n=>read(String(n).padStart(2,'0')));
const report=JSON.parse(readFileSync(new URL('../data/talia-foundation-mega80-research-20261103-v1.json',import.meta.url),'utf8'));
const fixtures=[
  {
    "n": 561,
    "expected": 10.064,
    "token": "$10.064"
  },
  {
    "n": 562,
    "expected": 320,
    "token": "320 shares"
  },
  {
    "n": 563,
    "expected": true,
    "token": "$24.50"
  },
  {
    "n": 564,
    "expected": 28,
    "token": "$28"
  },
  {
    "n": 565,
    "expected": 160,
    "token": "160 shares"
  },
  {
    "n": 566,
    "expected": 1.5,
    "token": "1.5%"
  },
  {
    "n": 567,
    "expected": 12.333333333,
    "token": "$12.3333"
  },
  {
    "n": 568,
    "expected": 96,
    "token": "$96"
  },
  {
    "n": 569,
    "expected": 25.04,
    "token": "$25.04"
  },
  {
    "n": 570,
    "expected": 1.5,
    "token": "+1.5R"
  },
  {
    "n": 571,
    "expected": 2.5,
    "token": "2.5%"
  },
  {
    "n": 572,
    "expected": 7.2,
    "token": "7.2%"
  },
  {
    "n": 573,
    "expected": 30,
    "token": "30 wall minutes"
  },
  {
    "n": 574,
    "expected": 20.1,
    "token": "$20.10"
  },
  {
    "n": 575,
    "expected": 165,
    "token": "$165"
  },
  {
    "n": 576,
    "expected": 1920,
    "token": "$9.60"
  },
  {
    "n": 577,
    "expected": 7.5,
    "token": "$7.50"
  },
  {
    "n": 578,
    "expected": 20,
    "token": "20%"
  },
  {
    "n": 579,
    "expected": 12,
    "token": "4%"
  },
  {
    "n": 580,
    "expected": -200,
    "token": "−$200"
  },
  {
    "n": 581,
    "expected": [
      0.1,
      -0.04
    ],
    "token": "+0.10R"
  },
  {
    "n": 582,
    "expected": 0.3,
    "token": "+0.3R"
  },
  {
    "n": 583,
    "expected": 60,
    "token": "60%"
  },
  {
    "n": 584,
    "expected": 1.5,
    "token": "1.5"
  },
  {
    "n": 585,
    "expected": 10,
    "token": "10%"
  },
  {
    "n": 586,
    "expected": 5,
    "token": "5%"
  },
  {
    "n": 587,
    "expected": [
      75,
      -0.1339745962155614
    ],
    "token": "$75"
  },
  {
    "n": 588,
    "expected": 19.049409439665055,
    "token": "19.0%"
  },
  {
    "n": 589,
    "expected": 20,
    "token": "20%"
  },
  {
    "n": 590,
    "expected": true,
    "token": "May 8"
  },
  {
    "n": 591,
    "expected": 15,
    "token": "15%"
  },
  {
    "n": 592,
    "expected": 35,
    "token": "35%"
  },
  {
    "n": 593,
    "expected": 5,
    "token": "$5m"
  },
  {
    "n": 594,
    "expected": 1.5,
    "token": "1.5"
  },
  {
    "n": 595,
    "expected": 2,
    "token": "$2.00"
  },
  {
    "n": 596,
    "expected": [
      6000,
      6000
    ],
    "token": "$6,000"
  },
  {
    "n": 597,
    "expected": 0.25,
    "token": "+0.25%"
  },
  {
    "n": 598,
    "expected": 25,
    "token": "25%"
  },
  {
    "n": 599,
    "expected": [
      800,
      800
    ],
    "token": "$800"
  },
  {
    "n": 600,
    "expected": true,
    "token": "May 5"
  }
];
const f={561:()=>(((60*10.04+40*10.10)/100)),
562:()=>(500-180),
563:()=>(24.5<24.7),
564:()=>(100*(15-14.72)),
565:()=>(Math.floor(120/.75)),
566:()=>((90+140+70)/20000*100),
567:()=>((1200+650)/150),
568:()=>(120*(10.8-10)),
569:()=>(25+8/200),
570:()=>(225/150),
571:()=>((30-29.25)/30*100),
572:()=>((13.4-12.5)/12.5*100),
573:()=>(35-5),
574:()=>(Math.min(20.1,20.25,20.4)),
575:()=>((22-20.9)*150),
576:()=>(200*9.6),
577:()=>(5000*.18*3/360),
578:()=>(4/20*100),
579:()=>(3*4),
580:()=>(-180-20),
581:()=>([2*.55-1,2*.48-1]),
582:()=>(.4*2-.5),
583:()=>(18/30*100),
584:()=>(900/600),
585:()=>((12000-10800)/12000*100),
586:()=>((12600-12000)/12000*100),
587:()=>([100*1.5*.5,Math.sqrt(.75)-1]),
588:()=>(.012*Math.sqrt(252)*100),
589:()=>(2/10*100),
590:()=>(Date.parse('2026-04-15')<Date.parse('2026-05-08')),
591:()=>((46-40)/40*100),
592:()=>((80-52)/80*100),
593:()=>(12-7),
594:()=>(30/20),
595:()=>(10/5),
596:()=>([100*60,300*20]),
597:()=>((39.6-40+.5)/40*100),
598:()=>(2.5/10*100),
599:()=>([1000*.8,100*8]),
600:()=>(Date.parse('2026-05-01')<Date.parse('2026-05-05')&&Date.parse('2026-05-05')<Date.parse('2026-05-10'))};
const close=(x,y)=>Math.abs(x-y)<=1e-6*Math.max(1,Math.abs(y));
test('Mega80 complete source map and independent release holds',()=>{assert.equal(report.records.length,80);assert.equal(topics.length,80);assert.equal(new Set(topics.map(x=>x.code)).size,80);assert.equal(report.metrics.newReviewMetadata,40);assert.equal(report.metrics.correctedSourcePointers,33);assert.equal(fixtures.length,40);assert.equal(report.metrics.independentApprovals,0);});
for(let i=0;i<topics.length;i++)test('Mega80 source and rights #'+report.records[i].lessonId,()=>{const g=topics[i],r=report.records[i];assert.equal(g.code,r.topicId);assert.equal(g.title,r.title);assert.deepEqual(g.sourceUrls,r.candidateSources);assert.ok(g.sourceResearchTriage?.supportedScope?.length>50);assert.ok(g.sourceResearchTriage?.limitationsAndOpenQuestions?.length>50);assert.match(g.workedCase,/^FICTIONAL:/);assert.match(g.status,/pending_independent_editorial_review/);assert.equal(g.independentEditorialApproved,false);assert.equal(g.editorSourceReview?.independentPublicationAccepted,false);assert.equal(g.sourceResearchTriage?.independentMathAccepted,false);assert.equal(g.sourceResearchTriage?.independentPublicationApproved,false);assert.equal(g.sourceResearchTriage?.sourceRedistributionRightsCleared,false);assert.ok(g.sourceUrls.length>=1&&g.sourceUrls.length<=2);for(const s of g.sourceUrls){const u=new URL(s);assert.equal(u.protocol,'https:');assert.equal(u.username,'');assert.equal(u.password,'');assert.notEqual(u.hostname,'www.irs.gov','runtime source allowlist excludes IRS host');}});
for(const c of fixtures)test('Mega80 synthetic computation #'+c.n,()=>{const g=topics.find((x,i)=>report.records[i].lessonId===c.n);assert.ok(g.workedCase.includes(c.token),'missing worked datum '+c.n+' '+c.token);const actual=f[c.n](),expected=c.expected;if(Array.isArray(expected)){assert.equal(actual.length,expected.length);for(let i=0;i<expected.length;i++)assert.ok(close(actual[i],expected[i]),c.n+' element '+i);}else if(typeof expected==='number')assert.ok(close(actual,expected),c.n+' wrong arithmetic');else assert.equal(actual,expected);assert.equal(g.independentEditorialApproved,false);});

test('Cost-basis source uses permitted FINRA host without weakening strict Tutor source allowlist',()=>{const row=report.records.find(r=>r.lessonId===568);assert.equal(row.candidateSources[0],'https://syndication.finra.org/content/tax-time-topics-cost-basis-what-you-need-know');const loader=readFileSync(new URL('../functions/_lib/original-competency-tutor-v014100.js',import.meta.url),'utf8');assert.ok(loader.includes('syndication.finra.org'));assert.ok(!row.candidateSources.some(x=>x.includes('www.irs.gov')));});
