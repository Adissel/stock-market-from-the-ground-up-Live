/** Crownlight site visualizations. Typed React components, never mutate authenticated form roots. */
import React,{useEffect,useRef,useState} from 'react';
import * as echarts from 'echarts/core';
import {CandlestickChart,BarChart,LineChart} from 'echarts/charts';
import {GridComponent,TooltipComponent,DataZoomComponent,LegendComponent} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';
import type {EChartsOption,EChartsType} from 'echarts';
echarts.use([CandlestickChart,BarChart,LineChart,GridComponent,TooltipComponent,DataZoomComponent,LegendComponent,CanvasRenderer]);
export type OHLCV={time:string;open:number;high:number;low:number;close:number;volume:number};
export type StudioTheme='midnight'|'slate'|'light';
export interface MarketPreviewProps{bars:ReadonlyArray<OHLCV>;theme?:StudioTheme;label?:string;onInspect?:(bar:OHLCV)=>void}
function assertBars(bars:ReadonlyArray<OHLCV>){let previous='';for(const bar of bars){if(!/^\d{4}-\d{2}-\d{2}/.test(bar.time)||bar.time<=previous)throw new Error('OHLCV timestamps must be chronological');if(![bar.open,bar.high,bar.low,bar.close,bar.volume].every(Number.isFinite)||bar.volume<0||bar.high<Math.max(bar.open,bar.close)||bar.low>Math.min(bar.open,bar.close))throw new Error('Invalid OHLCV record');previous=bar.time}}
export function MarketPreview({bars,theme='midnight',label='Fictional OHLCV educational chart',onInspect}:MarketPreviewProps){
 const node=useRef<HTMLDivElement>(null);const [error,setError]=useState('');
 useEffect(()=>{if(!node.current)return;let chart:EChartsType|undefined;let observer:ResizeObserver|undefined;try{assertBars(bars);chart=echarts.init(node.current,undefined,{renderer:'canvas'});const dark=theme!=='light';const options:EChartsOption={backgroundColor:'transparent',animationDuration:220,grid:[{left:56,right:56,top:20,height:'64%'},{left:56,right:56,top:'77%',height:'13%'}],tooltip:{trigger:'axis'},xAxis:[{type:'category',data:bars.map(b=>b.time),axisLabel:{color:dark?'#9bb6ca':'#36556a'},axisLine:{lineStyle:{color:dark?'#3d6075':'#abc0cf'}}},{type:'category',gridIndex:1,data:bars.map(b=>b.time),axisLabel:{show:false}}],yAxis:[{scale:true,splitLine:{lineStyle:{color:dark?'#263c50':'#d9e3ec'}},axisLabel:{color:dark?'#9bb6ca':'#36556a'}},{gridIndex:1,axisLabel:{show:false},splitLine:{show:false}}],dataZoom:[{type:'inside',xAxisIndex:[0,1],zoomOnMouseWheel:true,moveOnMouseMove:true},{type:'slider',xAxisIndex:[0,1],bottom:2,height:14}],series:[{type:'candlestick',name:'Candles',data:bars.map(b=>[b.open,b.close,b.low,b.high]),itemStyle:{color:'#40cbb1',color0:'#e46b75',borderColor:'#40cbb1',borderColor0:'#e46b75'}},{type:'bar',name:'Volume',xAxisIndex:1,yAxisIndex:1,data:bars.map(b=>({value:b.volume,itemStyle:{color:b.close>=b.open?'#40cbb1':'#e46b75'}}))}]};chart.setOption(options);chart.on('click',(event:{dataIndex?:number})=>{if(typeof event.dataIndex==='number'&&bars[event.dataIndex])onInspect?.(bars[event.dataIndex])});observer=new ResizeObserver(()=>chart?.resize());observer.observe(node.current);setError('')}catch(e){setError(e instanceof Error?e.message:'Unable to render chart')}
 return()=>{observer?.disconnect();chart?.dispose()}},[bars,theme,onInspect]);
 return <section className={'cl-market-preview cl-market-preview--'+theme} aria-label={label}><div ref={node} role="img" aria-label={label} style={{width:'100%',height:420}}/>{error&&<p role="alert">{error}</p>}<small>Educational market simulation. Never live trading advice.</small></section>
}
