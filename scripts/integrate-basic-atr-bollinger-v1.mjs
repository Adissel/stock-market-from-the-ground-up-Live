import {readFileSync,writeFileSync} from 'node:fs';
const path='data/lab-teaching-bridges-v014168.json';
const data=JSON.parse(readFileSync(path,'utf8'));
const mappings=[
 ['DT-C19-L03','atr','Range and Volatility','Average True Range: gap-aware true range, period seed and Wilder update in USD/share.'],
 ['F3-C07-L04','bollinger','narrow price window','Bollinger Bands: completed-close SMA, population deviation, declared multiplier and warmup.']
];
for(const [id,study,topic,summary] of mappings){
 const row=data.entries[id];if(!row||!row.instructionSource||!row.title.toLowerCase().includes(topic.toLowerCase()))
  throw Error('Canonical authored lesson mapping unavailable: '+id);
 row.indicatorLesson={studyId:study,mappingStatus:'SOURCE_INTEGRATED_EDITORIAL_REVIEW_PENDING',
  summary,definitionSource:'SMFGU-MASTER-RESEARCH-SOURCE-001',historicalData:false,
  completedBarsOnly:true,accessibleTableRequired:true,officialGrade:false,memberAcceptance:false};
}
writeFileSync(path,JSON.stringify(data,null,2)+'\n');
console.log('Attached canonical ATR and Bollinger workbenches without replacing authored curriculum.');
