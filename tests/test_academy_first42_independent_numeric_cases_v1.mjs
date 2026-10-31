/* SMFGU-ACADEMY-FIRST42-MATH-RECHECK-001
 * Independent-of-the-author's numericChecks arithmetic reconstruction.
 * Fictional data only. No source timestamp/license or editorial approval.
 */
import assert from 'node:assert/strict';
import {academyPrograms} from '../functions/_lib/bootcamp-academy-v014168.js';
const programs=new Map(academyPrograms.map(p=>[p.code,p]));
const caseMap=new Map();
for(const [code,n] of [['truth5',5],['watchlist7',7],['scanners10',10],['foundations30',20]])
 for(const day of programs.get(code).curriculum.slice(0,n)){
  assert(day.lesson,'Missing day case '+code+':'+day.day);
  caseMap.set(code+':'+day.day,day.lesson);
 }
assert.equal(caseMap.size,42);
const math=[
 ['truth5:4','ratioPercent',[3-.0-2.5,2.5],20,'percent move'],
 ['truth5:4','multiply',[200000,3],600000,'fictional dollar volume'],
 ['watchlist7:2','ratio',[90000,45000],2,'relative volume'],
 ['watchlist7:4','subtract',[10.2,10],.2,'candle body'],
 ['watchlist7:4','subtract',[10.6,9.8],.8,'candle range'],
 ['watchlist7:4','ratioPercent',[.2,.8],25,'body percentage'],
 ['watchlist7:5','subtract',[5.04,4.98],.06,'spread'],
 ['watchlist7:5','average',[4.98,5.04],5.01,'midpoint'],
 ['watchlist7:5','ratioPercent',[.06,5.01],1.1976047904,'percent midpoint spread'],
 ['watchlist7:6','sum',[2,1,1],4,'first weighted evidence score'],
 ['watchlist7:6','sum',[2,0,1],3,'second weighted evidence score'],
 ['scanners10:1','sum',[40,15],55,'excluded universe count'],
 ['scanners10:2','subtract',[9,8],1,'absolute dollar change A'],
 ['scanners10:2','ratioPercent',[1,8],12.5,'relative gain A'],
 ['scanners10:2','ratioPercent',[1,20],5,'relative gain B'],
 ['scanners10:3','ratio',[120000,60000],2,'comparable RVOL'],
 ['scanners10:5','sum',[50000,20000],70000,'all-session volume'],
 ['scanners10:6','subtract',[5.06,5],.06,'spread'],
 ['scanners10:6','average',[5,5.06],5.03,'midpoint'],
 ['scanners10:6','ratioPercent',[.06,5.03],1.1928429423,'midpoint percent spread'],
 ['foundations30:2','subtract',[9.2,8],1.2,'price change'],
 ['foundations30:2','ratioPercent',[1.2,8],15,'price return denominator'],
 ['foundations30:2','subtract',[9.28,9.05],.23,'quoted spread'],
 ['foundations30:3','ratioPercent',[3,5],60,'study question response fraction'],
 ['foundations30:4','ratio',[12,8],1.5,'float turnover'],
 ['foundations30:5','subtract',[32,31],1,'candle body'],
 ['foundations30:5','subtract',[32.5,30.5],2,'candle range'],
 ['foundations30:5','ratioPercent',[1,2],50,'body share'],
 ['foundations30:6','subtract',[8.03,7.98],.05,'quoted spread'],
 ['foundations30:10','subtract',[20,19.6],.4,'risk per share'],
 ['foundations30:10','ratio',[40,.4],100,'planned share quantity'],
 ['foundations30:11','subtract',[100,40],60,'remaining planned shares'],
 ['foundations30:17','multiply',[100,13-10],300,'short adverse mark'],
 ['foundations30:20','ratioPercent',[1.2,3],40,'short-sale volume ratio'],
 // Unseen formative arithmetic is NEVER a protected assessment answer.
 ['foundations30:2','ratioPercent',[5.04-4.8,4.8],5,'fresh check change'],
 ['foundations30:4','ratio',[9,6],1.5,'fresh float turnover'],
 ['foundations30:5','subtract',[7.8,7.3],.5,'fresh candle range'],
 ['foundations30:5','subtract',[7.65,7.5],.15,'fresh candle body'],
 ['foundations30:5','ratioPercent',[.15,.5],30,'fresh body share'],
 ['foundations30:6','subtract',[8.09,8.01],.08,'fresh quoted spread'],
 ['foundations30:10','subtract',[12.4,12.15],.25,'fresh risk per share'],
 ['foundations30:10','ratio',[37.5,.25],150,'fresh planned shares'],
 ['foundations30:11','subtract',[140,35+45],60,'fresh scale out'],
 ['foundations30:20','ratioPercent',[360000,900000],40,'fresh short-sale volume ratio'],
 ['watchlist7:4','subtract',[8.4,8.1],.3,'fresh bearish candle body'],
 ['watchlist7:4','subtract',[8.7,8],.7,'fresh OHLC range']
];
let validated=0;
for(const [id,op,inputs,expected,reason] of math){
 assert(caseMap.has(id),'Unexpected canonical day '+id);
 const [a,b]=inputs;assert(inputs.every(Number.isFinite));
 let actual;
 switch(op){
 case 'subtract':actual=a-b;break;
 case 'multiply':actual=a*b;break;
 case 'sum':actual=inputs.reduce((x,y)=>x+y,0);break;
 case 'average':actual=inputs.reduce((x,y)=>x+y,0)/inputs.length;break;
 case 'ratio':assert(b!==0);actual=a/b;break;
 case 'ratioPercent':assert(b!==0);actual=a/b*100;break;
 default:throw Error('Unsupported recheck '+op);
 }
 assert(Math.abs(actual-expected)<=1e-7,reason+' '+id+' actual '+actual+' expected '+expected);
 validated++;
}
assert(validated>=40);
for(const id of caseMap.keys()){
 const d=programs.get(id.split(':')[0]).curriculum[Number(id.split(':')[1])-1];
 assert.equal(d.officiallyGraded,false);
 assert.equal(d.masteryAwarded,false);
}
console.log('PASS first42 independent numeric recheck: '+validated+' fictional computations across 42 canonical study-day scope; 0 protected grades and 0 editorial approvals.');
