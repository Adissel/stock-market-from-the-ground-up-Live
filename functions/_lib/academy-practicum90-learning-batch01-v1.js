/* SMFGU-ACADEMY-PRACTICUM90-BATCH01 — five original fictional
 * Advanced Practicum learn-phase study-day cases, not graded assessments.
 * Day IDs 1-5 and thirty-source mapping remain unchanged.
 */
const rows=[[1,"Plan a reproducible market observation","Before any hypothetical market action, distinguish legal issuer identity, available market evidence, user-defined observation boundary, order risks and the record that establishes a defensible WAIT.","FICTIONAL: At 08:56 ET the watchlist identifies issuer QZ, a company release retrieved at 08:48 and a quote last seen at 08:31. The training policy requires quotes no older than three minutes. The 25-minute-old quote fails independently of the release; the current spread and size cannot be claimed.","Reconstruct a two-source timeline, calculate 08:56−08:31=25 minutes and document a no-trade precondition. A completed research routine alone does not satisfy current execution conditions.","Using the timestamp of a recent issuer announcement as though it refreshed an unrelated stale market quote.","On a new fictional 09:14 market, the quote is from 09:12 but the purported issuer document cannot be matched to the SEC CIK; decide which check fails and retain WAIT.","What exact source date, evidence owner and quote freshness must be saved before a hypothetical order is eligible?"],[2,"Separate an exciting move from safe execution","Observed price changes and quoted liquidity are separate measurements. A new candidate should be screened by its mandatory execution thresholds, not retrospective momentum.","FICTIONAL: A completed reference price moves $10.00 to $10.70, up 7%. A contemporaneous bid at $10.64 and ask at $10.82 has midpoint $10.73 and $0.18 spread, or 1.6775% of midpoint. A written 1% maximum makes this a NO TRADE, irrespective of the rise.","Calculate 0.70/10.00 and separately 0.18/10.73; report both percentages with their own denominators and timestamp, and leave hidden depth, fees and actual fills unknown.","Confusing a completed seven-percent rise with proof that a current market order can be completed at a tolerable spread.","A fresh fictional symbol moves $12.00 to $12.36 while the current bid/ask is $12.30/$12.38. Compute two independent percentages and apply an explicit 1% cap.","Does a completed price move establish current bid/ask depth, order-book stability or execution quality?"],[3,"Audit process quality without cherry-picking","Measure decision completeness against the original eligible cohort, even if incomplete records later show winning prices. A process score is not a realized profit or a protected official skill score.","FICTIONAL: Twelve prospective studies were started. Nine include dated original-source citations, eight contain predeclared invalidation, and only six have both. Report source completeness 9/12=75%, risk-plan completeness 8/12=66.67% and full process completeness 6/12=50%.","Keep one fixed denominator of twelve; recompute all three rates independently and explain why the six cases without a complete process cannot be silently excluded.","Removing three incomplete decisions from the cohort and then calling the remainder a representative 100% success rate.","Another fifteen-case process cohort has 12 source-verified, 10 invalidation-complete and 8 both. Calculate 80%, 66.67% and 53.33% without inventing returns.","Which exact record is an evidence-based training result, and which requires an actual independent grader?"],[4,"Validate shares, float and tradeable supply","Reported float and aggregate share volume answer different questions. A float-based turnover ratio can exceed one if the same shares trade repeatedly; it does not measure unique holders or usable top-of-book size.","FICTIONAL: an issuer's dated report estimates 480,000 float shares, while a later complete session reports volume of 720,000 shares. Mechanical turnover is 1.5×. Without quote-depth and fresh corporate-action evidence no 1.5× liquidity or ownership-change claim is justified.","Calculate 720000/480000=1.5; record report dates and share units, distinguish float estimates from outstanding shares and test for intervening issuance.","Interpreting 150% float-normalized volume as evidence that 150% of owners exchanged their unique positions.","An unrelated fictional filing reports 1,200,000 outstanding shares but no reliable float; volume is 600,000. Explain why the float-turnover calculation is unavailable.","What date and denominator would need verification before float could be used in an execution-risk rule?"],[5,"Audit candles and interval chronology","A completed candle gives open, high, low and close for a defined interval; it does not reveal the sequence of its intrabar high and low. Multi-timeframe analysis must exclude incomplete overlapping bars.","FICTIONAL: a fully closed five-minute candle from 10:00–10:05 ET has O=$21.00, H=$21.40, L=$20.80, C=$21.30. Its range is $0.60 and real body $0.30; a 10:05–10:10 candle currently forming at 10:07 must not be labeled final or used to assert the next confirmed pivot.","Compute H−L=0.60 and |C−O|=0.30; identify closed versus still-forming intervals and record what is known at 10:07 without hindsight.","Claiming that the high came before the low or that a forming five-minute candle already has its definitive close.","In another fictional candle O=$9.80, H=$10.10, L=$9.55, C=$9.70, compute range $0.55 and body $0.10, then explain why trade direction within the candle remains unobserved.","Can OHLC alone establish the intrabar order of extremes, order fills or who caused the move?"]];
const refs=[
 {label:'SEC Investor.gov — Researching Investments',url:'https://www.investor.gov/introduction-investing/getting-started/researching-investments',scope:'General source-vetting education only; not proof of these fictional quotes or actual orders.'},
 {label:'SEC Investor.gov — Types of Orders',url:'https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders',scope:'General quoted-order educational concepts; not an actual broker order, fill or guaranteed execution.'}
];
export const practicum90LearnBatch01=Object.freeze(rows.map((v,i)=>{
 const [sourceDay,title,explanation,workedExample,method,error,transfer,selfCheck]=v;
 return Object.freeze({
 title:title+' — original independent case study',explanation,workedExample,
 sourceProcedure:Object.freeze([
 'Declare the fictional source, observed timestamp, information cutoff and every numeric unit before analysis.',
 method,
 'Classify missing rights-cleared historical context and apply an explicit WAIT or NO TRADE boundary where relevant.'
 ]),
 error,
 reviewGuide:explanation+' Avoid: '+error,
 transfer:'FRESH FICTIONAL TRANSFER — '+transfer,
 investigation:'FRESH FICTIONAL TRANSFER — '+transfer,
 selfCheck,
 reviewPrompts:Object.freeze([
 'Recalculate each displayed input/ratio from the original quantities without hindsight.',
 'Identify what additional evidence is required for a valid market or educational claim.',
 'Explain one independent counterexample and how a no-trade decision can be correct.'
 ]),
 why:'An evidence-first educational practicum evaluates disciplined process, not a strategy profitability or customer trading outcome.',
 whenNot:'All data are fictional. No protected grading or mastery, qualified independent editorial approval, real broker fill, market-data license or historical outcome is demonstrated.',
 reference:Object.freeze(i===1?refs[1]:refs[0]),numericChecks:Object.freeze([]),
 status:'ORIGINAL_UNGRADED_EDITORIAL_AND_PROTECTED_REVIEW_PENDING',
 topicSourceDay:sourceDay,phase:'Learn and recognize',day:i+1
 });
}));
if(practicum90LearnBatch01.length!==5||rows.some((v,i)=>v[0]!==i+1||
 v.length!==8||v.slice(1).some((s,j)=>typeof s!=='string'||s.length<(j===0?18:45)))||
 new Set(rows.map(v=>v[3])).size!==5||
 new Set(rows.map(v=>v[6])).size!==5)
 throw Error('Practicum90 first five individual original source-day cases incomplete.');
