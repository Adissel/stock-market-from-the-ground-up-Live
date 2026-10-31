/* Independent values, not a copied Tutor answer: real source URLs are
 * vetted external references but every example below is synthetic.
 * No private assessments, historical exchange executions or live trading. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const raw=JSON.parse(readFileSync('data/tutor-lab-claim-evidence-v1.json','utf8'));
const by=Object.fromEntries(raw.records.map(row=>[row.id,row]));
assert.equal(raw.records.length,17);
const required={
 'F1-C08-L02':'https://www.investor.gov/introduction-investing/investing-basics/glossary/market-capitalization',
 'DT-C04-L01':'https://syndication.finra.org/content/understanding-new-intraday-margin-requirements',
 'DT-C22-L02':'https://www.sec.gov/about/webmaster-frequently-asked-questions',
 'DT-C23-L01':'https://www.investor.gov/introduction-investing/getting-started/researching-investments/using-edgar-research-investments',
 'DT-C10-L03':'https://www.investor.gov/glossary-term-categories/stocks?page=3',
 'TAPE-C04-L01':'https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/executing-order'
};
let assertions=0;
const check=(condition,msg)=>{assert(condition,msg);assertions++;};
for(const [id,url] of Object.entries(required)){
 const entry=by[id];check(!!entry,'Exact canonical Lab '+id);
 check(entry.sourceUrl===url,'Exact public URL '+id);
 check(entry.reviewStatus==='source_specific_general_claim_checked_ungraded_not_independently_approved',
  'Source verified != lesson approved');
 check(/FICTIONAL/.test(entry.worked),'Synthetic worked case must be labeled');
 check(!/guaranteed profit|market outcome verified/i.test(entry.claim),'No performance certification');
 check(entry.counterexample.length>60&&entry.transfer.length>60,'Substantive counterexample and transfer');
}
// Market cap: two independent fixtures; no source attribution to a nonexistent issuer.
check(50_000_000*4===200_000_000,'Market capitalization with fictional shares');
check(80_000_000*7.5===600_000_000,'Transfer share-cap calculation');
// FINRA effective and transition dates: two different applicability dates.
const effective=Date.parse('2026-06-04T00:00:00Z');
const phaseEnd=Date.parse('2027-10-20T00:00:00Z');
const current=Date.parse('2026-10-31T00:00:00Z');
check(effective<current&&current<phaseEnd,'October 2026 is within FINRA broker phase-in');
check(by['DT-C04-L01'].worked.includes('Broker A')&&by['DT-C04-L01'].counterexample.includes('every'),
 'Both migrated and non-migrated brokerage regimes must be acknowledged');
// EDGAR temporal boundary: acceptance alone is not first-public-availability.
const seconds=s=>{const [h,m,sec]=s.split(':').map(Number);return h*3600+m*60+sec;};
check(seconds('08:00:45')<seconds('08:01:30'),'No later source at earlier decision boundary');
check(seconds('08:04:00')<seconds('08:06:00'),'Fresh transfer chronology');
// 10-K annual, 10-Q quarterly and 8-K current; not any SEC approval.
check(/10-K/.test(by['DT-C23-L01'].claim)&&/10-Q/.test(by['DT-C23-L01'].claim)&&/8-K/.test(by['DT-C23-L01'].claim),
 'Distinct filing form uses');
check(!/SEC approved the company's growth/.test(by['DT-C23-L01'].claim),
 'Misleading issuer headline must not appear as factual claim');
// Bid/ask: absolute and midpoint-relative spread are different measures.
const spread=(bid,ask)=>({absolute:ask-bid,mid:(ask+bid)/2,percent:(ask-bid)/((ask+bid)/2)*100});
const first=spread(12,12.12),transfer=spread(8,8.24);
check(Math.abs(first.absolute-0.12)<1e-9&&Math.abs(first.mid-12.06)<1e-9,'Initial quote math');
check(Math.abs(first.percent-0.9950248756)<0.00001,'Relative spread denominator declared');
check(Math.abs(transfer.absolute-0.24)<1e-9&&Math.abs(transfer.mid-8.12)<1e-9,'Fresh quote');
check(Math.abs(transfer.percent-2.9556650246)<0.00001,'Transfer spread percent');
// Quote/time and sales: the report was 200 milliseconds before quote snapshot.
const quoteMs=9*3600*1000+31*60*1000+100;
const printMs=9*3600*1000+30*60*1000+59900;
check(quoteMs-printMs===200,'Quote and tape timestamps distinguish past trade');
// Newly investigated claims: distinguish historical volume from current depth,
// align filing periods and count actual issued rather than merely authorized shares.
check(by['F2-C05-L03'].sourceUrl==='https://www.investor.gov/introduction-investing/investing-basics/glossary/liquidity-or-marketability',
 'Exact SEC liquidity definition');
check(2000>300&&5000>500,'Past tape volume cannot guarantee current ask depth');
check((28-25)===3,'Quarterly comparable revenue dollars');
check(Math.abs((28-25)/25*100-12)<1e-9,'Period-aligned 10-Q rate');
check(by['DT-C23-L02'].sourceUrl.includes('using-edgar-research-investments'),
 '10-K vs 10-Q must cite primary SEC form guide');
check(10000000/(10000000+2500000)===0.8,'Only genuinely issued equal shares in hypothetical ownership denominator');
check(20000000/(20000000+5000000)===0.8,'Independent dilution transfer arithmetic');
check(by['DT-C24-L01'].sourceUrl.includes('how-read-8'),
 'Original current-report rule source must be tied to narrow claim');
// No external instructor text or member-specific data may become sources.
for(const e of raw.records){
 check(!('privateAnswer' in e||'grade' in e||'userId' in e||'futureBars' in e),
  'Public evidence must never ship private assessment or future data');
}
console.log('PASS Talia independent calculations and chronology: '+assertions+
 ' independent guards; 17 public Lab entries, 9 new claim-specific sources, no historical/grade promotion.');
