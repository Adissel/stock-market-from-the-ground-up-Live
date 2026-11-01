/* SMFGU-TALIA-RISK-MATH-001: zero-cost fictional source-only teaching.
 * No personalized risk percentages, broker buying-power grant, order, fee,
 * paid inference, private assessment answer or statistical strategy edge.
 */
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const valid=(...values)=>values.every(finite);
const zeroOrMore=x=>finite(x)&&x>=0;
export function technicalRiskDistance(side,entry,invalidation){
 if(!['long','short'].includes(side)||!valid(entry,invalidation)||entry<=0||invalidation<=0)return null;
 const distance=side==='long'?entry-invalidation:invalidation-entry;
 return distance>0?distance:null;
}
export function sharesFromRiskBudget(budget,distance){
 return zeroOrMore(budget)&&finite(distance)&&distance>0?Math.floor(budget/distance):null;
}
export function buyingPowerShareCap(buyingPower,unitPrice){
 return zeroOrMore(buyingPower)&&finite(unitPrice)&&unitPrice>0?Math.floor(buyingPower/unitPrice):null;
}
export function concentrationShareCap(accountValue,maximumFraction,unitPrice){
 return zeroOrMore(accountValue)&&finite(maximumFraction)&&maximumFraction>=0&&maximumFraction<=1&&finite(unitPrice)&&unitPrice>0
 ?Math.floor(accountValue*maximumFraction/unitPrice):null;
}
export function volumeParticipationCap(completedVolume,fraction){
 return Number.isSafeInteger(completedVolume)&&completedVolume>=0&&finite(fraction)&&fraction>=0&&fraction<=1
 ?Math.floor(completedVolume*fraction):null;
}
export function restrictiveShareCap(caps){
 if(!Array.isArray(caps)||!caps.length||caps.some(x=>!Number.isSafeInteger(x)||x<0))return null;
 return Math.min(...caps);
}
export function hypotheticalLongStress(entry,stop,adverseFill,shares){
 const distance=technicalRiskDistance('long',entry,stop);
 if(distance===null||!finite(adverseFill)||adverseFill<0||!Number.isSafeInteger(shares)||shares<1)return null;
 return {planned:distance*shares,stress:(entry-adverseFill)*shares,shares};
}
export function grossNetReward(entry,target,roundTripCost){
 if(!valid(entry,target,roundTripCost)||entry<=0||target<=0||roundTripCost<0)return null;
 return {gross:target-entry,net:target-entry-roundTripCost};
}
export function conditionalRewardRisk(grossReward,grossStopLoss,rewardFriction,stopFriction){
 if(!valid(grossReward,grossStopLoss,rewardFriction,stopFriction)||grossReward<0||grossStopLoss<=0||rewardFriction<0||stopFriction<0)return null;
 const reward=grossReward-rewardFriction,loss=grossStopLoss+stopFriction;
 return {reward,loss,ratio:reward/loss};
}
const cases=Object.freeze({
 TALIA_TOPIC_LONG_SHORT_RISK_DISTANCE:[
  {side:'long',entry:10,stop:9.7},{side:'short',entry:10,stop:10.6}
 ],
 TALIA_TOPIC_RISK_BUDGET_SHARE_FLOOR:[
  {budget:75,distance:.4},{budget:45,distance:.28}
 ],
 TALIA_TOPIC_BUYING_POWER_SHARE_BOUND:[
  {power:2000,price:20},{power:2000,price:25}
 ],
 TALIA_TOPIC_CONCENTRATION_SHARE_BOUND:[
  {value:10000,fraction:.1,price:20},{value:12000,fraction:.08,price:24}
 ],
 TALIA_TOPIC_LIQUIDITY_PARTICIPATION_CAP:[
  {volume:10000,fraction:.02},{volume:3500,fraction:.02}
 ],
 TALIA_TOPIC_MINIMUM_RISK_CAPS:[
  {caps:[187,100,50,200]},{caps:[120,80,100,60]}
 ],
 TALIA_TOPIC_STRESS_GAP_LOSS:[
  {entry:10,stop:9.8,fill:9.2,shares:100},{entry:10,stop:9.8,fill:8.9,shares:100}
 ],
 TALIA_TOPIC_NET_REWARD_AFTER_COST:[
  {entry:10,target:10.5,cost:.06},{entry:10,target:10.5,cost:.15}
 ],
 TALIA_TOPIC_NET_REWARD_TO_STRESS_RISK:[
  {reward:.5,loss:.2,rewardCost:.06,stopCost:.05},
  {reward:.5,loss:.2,rewardCost:.06,stopCost:.15}
 ]
});
export const FOUNDATION_RISK_MATH_TOPICS=Object.freeze(Object.keys(cases));
const dollars=x=>'$'+x.toFixed(2),four=x=>x.toFixed(4);
export function foundationRiskTeaching(code,question=''){
 const values=cases[String(code||'')];if(!values)return null;
 const again=/\b(?:another|different|new case|try again|fresh example)\b/i.test(String(question));
 const x=values[again?1:0];
 const result=['Original fictional, ungraded risk and execution mathematics. Never a personalized order or fixed-risk recommendation.'];
 if('side' in x){
  result.push('Side: '+x.side+'; entry '+dollars(x.entry)+'; invalidation '+dollars(x.stop)+'.',
   'Positive technical stop distance = '+dollars(technicalRiskDistance(x.side,x.entry,x.stop))+' per share.');
 }else if('budget' in x){
  result.push('Hypothetical classroom risk budget '+dollars(x.budget)+'; planned distance '+dollars(x.distance)+'.',
   'Theoretical whole-share risk cap = FLOOR('+dollars(x.budget)+'/'+dollars(x.distance)+') = '+sharesFromRiskBudget(x.budget,x.distance)+'.');
 }else if('power' in x){
  result.push('Hypothetical available buying power '+dollars(x.power)+'; entry reference '+dollars(x.price)+'.',
   'Theoretical cash/notional cap = FLOOR(buying power/unit price) = '+buyingPowerShareCap(x.power,x.price)+' shares, excluding fees.');
 }else if('value' in x){
  result.push('Fictional account reference '+dollars(x.value)+'; classroom concentration fraction '+four(x.fraction)+'; price '+dollars(x.price)+'.',
   'Notional cap='+dollars(x.value*x.fraction)+'; share cap='+concentrationShareCap(x.value,x.fraction,x.price)+'.');
 }else if('volume' in x){
  result.push('Fictional completed-period share volume '+x.volume+'; hypothetical participation fraction '+four(x.fraction)+'.',
   'Notional historical participation cap = '+volumeParticipationCap(x.volume,x.fraction)+' shares. This is NOT executable ask depth.');
 }else if('caps' in x){
  result.push('Independently computed fictional risk/buying power/concentration/liquidity caps: '+x.caps.join(', ')+'.',
   'Most restrictive cap = MIN(all validated caps) = '+restrictiveShareCap(x.caps)+' hypothetical whole shares.');
 }else if('fill' in x){
  const v=hypotheticalLongStress(x.entry,x.stop,x.fill,x.shares);
  result.push('Fictional long '+x.shares+' shares at '+dollars(x.entry)+' with stop trigger '+dollars(x.stop)+' and hypothetical gap fill '+dollars(x.fill)+'.',
   'Planned distance-only loss='+dollars(v.planned)+'; hypothetical stress-fill loss='+dollars(v.stress)+' before fees.');
 }else if('target' in x){
  const v=grossNetReward(x.entry,x.target,x.cost);
  result.push('Long reference '+dollars(x.entry)+'; target '+dollars(x.target)+'; modeled round-trip friction '+dollars(x.cost)+' per share.',
   'Gross price reward='+dollars(v.gross)+'; modeled net reward='+dollars(v.net)+' per share, assuming the target could fill.');
 }else if('reward' in x){
  const v=conditionalRewardRisk(x.reward,x.loss,x.rewardCost,x.stopCost);
  result.push('Fictional gross target movement '+dollars(x.reward)+', gross planned risk '+dollars(x.loss)+', target friction '+dollars(x.rewardCost)+', stop friction '+dollars(x.stopCost)+'.',
   'Net reward='+dollars(v.reward)+'; modeled loss='+dollars(v.loss)+'; conditional reward/risk='+four(v.ratio)+':1, not realized expectancy.');
 }
 result.push('Assumption boundary: stops may fill beyond trigger or fail to execute; theoretical sizing never guarantees a loss ceiling.',
  'Independent transfer: change one fictional input, recalculate in correct units, and explain which conclusion remains unsupported.');
 return result.join('\n\n');
}
