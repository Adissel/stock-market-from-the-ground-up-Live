import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const j=JSON.parse(readFileSync('data/talia-foundation-explanations-batch13-v1.json','utf8'));
const byCode=Object.fromEntries(j.guides.map(g=>[g.code,g]));
const near=(x,y)=>assert.ok(Math.abs(x-y)<1e-7,x+' != '+y);
const checks=[
 ['SHARE_COUNT_VS_NOTIONAL_TRADE_VOLUME',100*9+200*10,2900],
 ['MARKET_CAP_MULTIPLICATION_NOT_CASH',3000000*40,120000000],
 ['FLOAT_ESTIMATE_VS_OUTSTANDING',15000000-4000000,11000000],
 ['RELATIVE_SPREAD_TO_MIDPOINT',100*(20.2-20)/((20+20.2)/2),.9950248756218906],
 ['ONE_CENT_MOVE_PRICE_CONTEXT',100*.02/10,0.2],
 ['BASIS_POINT_PRICE_CHANGE_CONVERSION',10000*(79.6/80-1),-50],
 ['QUANTITY_WEIGHTED_ENTRY_PRICE',(10*8+15*9)/25,8.6],
 ['WHOLE_SHARE_CASH_PURCHASE_LIMIT',Math.floor(125/9.4),13],
 ['FRACTIONAL_SHARE_NOTIONAL_QUANTITY',30/48,.625],
 ['TWO_FOR_ONE_SPLIT_POSITION_SCALE',25*2,50],
 ['REVERSE_SPLIT_POSITION_SCALE',80/4,20],
 ['SPLIT_ADJUSTED_PERCENTAGE_COMPARISON',100*(31/(120/4)-1),100/30],
 ['CHANGING_QUOTE_MARKET_ORDER_FILL',(8.12-8)*50,6],
 ['PARTIAL_EXECUTION_WEIGHTED_PRICE',(30*5.1+20*5.2)/50,5.14],
 ['CANDLE_BODY_SIZE_VS_TOTAL_RANGE',100*.6/(30.4-29),42.85714285714286],
 ['UPPER_LOWER_WICK_SEPARATION',20.5-Math.max(20,19.5),.5],
 ['PRIOR_CLOSE_TO_OPEN_GAP',100*(23.4/24-1),-2.5],
 ['MATCHED_INTERVAL_VOLUME_COMPARISON',6000/8000,.75],
];
test('all 20 new Foundation lessons have unique ungraded transfer and misconception prompts',()=>{
 assert.equal(j.guides.length,20);
 assert.equal(new Set(j.guides.map(g=>g.code)).size,20);
 assert.equal(new Set(j.guides.map(g=>g.transferQuestion)).size,20);
 for(const g of j.guides){
  assert.equal(g.officialCompetency,false);assert.equal(g.independentEditorialApproved,false);
  assert.match(g.workedCase,/^FICTIONAL:/);
  assert.ok(g.transferQuestion.length>95&&g.commonError.length>90);
  assert.match(g.reviewExplanation,/Ungraded correction:/);
 }
});
test('18 independent transfer calculations are arithmetically correct with explicit units',()=>{
 assert.equal(checks.length,18);
 for(const [suffix,actual,expected] of checks){
  const g=byCode['TALIA_TOPIC_'+suffix];
  assert.ok(g,'missing transfer '+suffix);
  near(actual,expected);
  assert.ok(/shares|dollars|price|percent|percentage|quantity|gap|ratio|value|volume|spread/i.test(g.transferQuestion));
 }
});
test('limit-order nonfill and intrabar unknown final high cannot be treated as executed or available',()=>{
 const limit=byCode.TALIA_TOPIC_BUY_LIMIT_CANNOT_ASSUME_EXECUTION;
 const bar=byCode.TALIA_TOPIC_FIVE_MINUTE_BAR_AVAILABILITY_BOUNDARY;
 assert.match(limit.limit,/do not prove order priority|do not prove|cannot/i);
 assert.match(limit.commonError,/false execution|false|fill/i);
 assert.match(bar.workedCase,/09:31/);
 assert.match(bar.transferQuestion,/10:02/);
 assert.ok(!j.guides.some(g=>g.independentEditorialApproved));
});
