export declare const TALIA_REPLAY_ID:string;
export declare const TALIA_REPLAY:number[][];
export declare function taliaSyntheticVolume(bar:number[],index:number):number;
export type TaliaChartContext={visible:number;index:number;timeframe:1|3|5};
export type TaliaChartBar={open:number;close:number;high:number;low:number;volume:number;body:number;range:number;upperWick:number;lowerWick:number;direction:'bullish'|'bearish'|'doji';bodyPercent:number};
export type TaliaChartEvidence={
 source:string;visible:number;index:number;timeframe:1|3|5;completeCount:number;
 firstSourceBar:number;lastSourceBar:number;selectedNumber:number;bar:TaliaChartBar;previous:TaliaChartBar|null;
 totalVolume:number;meanVolume:number;proxyVWAP:number;ema9:number|null;ema20:number|null;
 hiddenSourceBars:number;uncompletedSourceBars:number;clock:string
};
export declare function getTaliaChartEvidence(context:TaliaChartContext):TaliaChartEvidence;
