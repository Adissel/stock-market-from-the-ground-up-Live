/* Public learning-academy homepage chart. Fictional OHLCV; no market feed or trading controls. */
(()=>{'use strict';
const TYPES=['Candlestick','Hollow Candles','OHLC Bars','Heikin-Ashi','Line','Area','Baseline','Mountain','Step Line','Renko','Line Break','Kagi','Point & Figure','Range Bars'];
const root=document.getElementById('cl-home-chart'); if(!root)return;
const selector=document.getElementById('cl-home-chart-type'),status=document.getElementById('cl-home-chart-status');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let seed=27931;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
const rows=[];let close=100;
function next(){const change=(rand()-.48)*2.7,o=close,c=Math.max(20,o+change),h=Math.max(o,c)+.3+rand()*1.5,l=Math.min(o,c)-.3-rand()*1.5;close=c;return {o:+o.toFixed(2),c:+c.toFixed(2),h:+h.toFixed(2),l:+l.toFixed(2),v:Math.round(180+rand()*920)};}
for(let i=0;i<72;i++)rows.push(next());
function derived(data,type){
 if(type==='Heikin-Ashi'){let prevO=(data[0].o+data[0].c)/2,prevC=(data[0].o+data[0].h+data[0].l+data[0].c)/4;return data.map((r,i)=>{const c=(r.o+r.h+r.l+r.c)/4,o=i?(prevO+prevC)/2:prevO;prevO=o;prevC=c;return {o,c,h:Math.max(r.h,o,c),l:Math.min(r.l,o,c)}});}
 if(type==='Renko'||type==='Range Bars'){const box=1.3;const out=[];let p=data[0].o;data.forEach(r=>{let target=r.c,steps=0;while(Math.abs(target-p)>=box&&steps++<20){let n=p+Math.sign(target-p)*box;out.push({o:p,c:n,h:Math.max(p,n),l:Math.min(p,n)});p=n;}});return out.slice(-68);}
 if(type==='Line Break'){let out=[{o:data[0].o,c:data[0].c,h:data[0].h,l:data[0].l}];for(const r of data.slice(1)){const last=out.slice(-3);const hi=Math.max(...last.map(x=>Math.max(x.o,x.c))),lo=Math.min(...last.map(x=>Math.min(x.o,x.c)));if(r.c>hi||r.c<lo){const o=out[out.length-1].c;out.push({o,c:r.c,h:Math.max(o,r.c),l:Math.min(o,r.c)});}}return out.slice(-68);}
 if(type==='Point & Figure'){const box=1.1,reverse=3;const out=[];let p=data[0].c,dir=0;for(const r of data.slice(1)){const d=r.c-p;if(!dir&&Math.abs(d)>=box)dir=Math.sign(d);if(dir&&d*dir>=box){const steps=Math.floor(Math.abs(d)/box);for(let i=0;i<steps;i++){let n=p+dir*box;out.push({o:p,c:n,h:Math.max(p,n),l:Math.min(p,n)});p=n;}}else if(dir&&d*dir<=-reverse*box){dir=-dir;let n=p+dir*box;out.push({o:p,c:n,h:Math.max(p,n),l:Math.min(p,n)});p=n;}}return out.slice(-68);}
 if(type==='Kagi'){const threshold=1.2;let out=[data[0]];data.slice(1).forEach(r=>{if(Math.abs(r.c-out[out.length-1].c)>threshold)out.push({o:out[out.length-1].c,c:r.c,h:Math.max(out[out.length-1].c,r.c),l:Math.min(out[out.length-1].c,r.c)});});return out.slice(-68);}
 return data;
}
function options(type){const d=derived(rows,type),cats=d.map((_,i)=>''+(i+1));const prices=d.map(r=>r.c),up='#65e3ba',down='#f28d9c';
const isCandle=['Candlestick','Hollow Candles','Heikin-Ashi','Renko','Line Break','Range Bars','Point & Figure'].includes(type);
const isBar=type==='OHLC Bars'; const step=type==='Step Line';
const series=isCandle?[{type:'candlestick',data:d.map(r=>[r.o,r.c,r.l,r.h]),itemStyle:{color:up,color0:down,borderColor:up,borderColor0:down},barMaxWidth:11,animationDuration:300}]:isBar?[{type:'custom',renderItem:(p,api)=>{const x=api.coord([api.value(0),api.value(2)])[0],yo=api.coord([api.value(0),api.value(1)])[1],yc=api.coord([api.value(0),api.value(2)])[1],yh=api.coord([api.value(0),api.value(3)])[1],yl=api.coord([api.value(0),api.value(4)])[1],color=api.value(2)>=api.value(1)?up:down;return {type:'group',children:[{type:'line',shape:{x1:x,y1:yh,x2:x,y2:yl},style:{stroke:color,lineWidth:1.6}},{type:'line',shape:{x1:x-5,y1:yo,x2:x,y2:yo},style:{stroke:color,lineWidth:1.6}},{type:'line',shape:{x1:x,y1:yc,x2:x+5,y2:yc},style:{stroke:color,lineWidth:1.6}}]};},data:d.map((r,i)=>[i,r.o,r.c,r.h,r.l])}]:[{type:'line',data:prices,showSymbol:false,step:step?'end':false,smooth:false,lineStyle:{width:type==='Kagi'?3:2.4,color:up},areaStyle:['Area','Mountain','Baseline'].includes(type)?{color:'rgba(66,214,176,.20)'}:undefined}];
return {backgroundColor:'#050d13',animation:!reduced,grid:{top:55,left:12,right:56,bottom:25,containLabel:false},tooltip:{trigger:'axis',axisPointer:{type:'cross'},formatter:params=>{const i=params?.[0]?.dataIndex??0,r=d[i];return r?'Fictional example<br>O '+r.o.toFixed(2)+' · H '+r.h.toFixed(2)+'<br>L '+r.l.toFixed(2)+' · C '+r.c.toFixed(2):''}},xAxis:{type:'category',data:cats,boundaryGap:true,axisTick:{show:false},axisLabel:{show:false},axisLine:{lineStyle:{color:'#2c4b55'}},splitLine:{show:true,lineStyle:{color:'#12252e'}}},yAxis:{type:'value',scale:true,position:'right',axisLabel:{color:'#8eabb6',fontSize:10},axisLine:{show:false},splitLine:{lineStyle:{color:'#18303a'}}},series};
}
let chart;function render(){if(!chart)return;chart.setOption(options(selector.value),true);}
selector.replaceChildren(...TYPES.map(t=>{const o=document.createElement('option');o.value=t;o.textContent=t;return o;}));selector.value='Candlestick';
selector.addEventListener('change',render);
function run(){if(!document.body.contains(root)||!chart)return;rows.push(next());while(rows.length>72)rows.shift();render();const factor=.1+rand()*.3;window.setTimeout(run,Math.round(1000/factor));}
const load=window.CrownlightECharts?.load?.();if(!load){status.textContent='Chart unavailable';return;}
load.then(echarts=>{chart=echarts.init(root,null,{renderer:'canvas'});render();status.textContent='Fictional chart · automatically updating';window.addEventListener('resize',()=>chart.resize(),{passive:true});if(!reduced)window.setTimeout(run,3500);}).catch(()=>{status.textContent='Chart unavailable. Open Free Chart Practice instead.';});
})();
