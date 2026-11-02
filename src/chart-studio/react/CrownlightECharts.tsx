import React, { useEffect, useRef, useState } from 'react';
import type { ECharts, EChartsOption } from 'echarts';
import { init, getInstanceByDom } from 'echarts/core';
import { CandlestickChart, BarChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, DataZoomComponent, LegendComponent, MarkLineComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { use } from 'echarts/core';
import { buildCandleOptions, type CompletedBar } from './completedBarOptions';

use([CandlestickChart, BarChart, LineChart, GridComponent, TooltipComponent, DataZoomComponent, LegendComponent, MarkLineComponent, CanvasRenderer]);

export interface CrownlightChartProps {
  /** Only bars authorized for this member and already revealed by the server. */
  completedBars: readonly CompletedBar[];
  symbol: string;
  interval: string;
  onBarInspect?: (bar: CompletedBar) => void;
  height?: number;
  className?: string;
  ariaLabel?: string;
}

/** Optional React adapter. Existing JavaScript Studio remains the production controller.
 * This component never fetches data or grants permissions. */
export function CrownlightECharts({
  completedBars, symbol, interval, onBarInspect, height = 480,
  className = '', ariaLabel = 'Completed-candle market chart'
}: CrownlightChartProps) {
  const node = useRef<HTMLDivElement>(null);
  const chart = useRef<ECharts | null>(null);
  const callback = useRef(onBarInspect);
  const bars = useRef(completedBars);
  const [selected, setSelected] = useState<number | null>(null);
  const inspect = (index: number) => {
    const bar = bars.current[index];
    if (!bar) return;
    setSelected(index);
    callback.current?.(bar);
  };
  callback.current = onBarInspect;
  bars.current = completedBars;

  useEffect(() => {
    const host = node.current;
    if (!host) return;
    const instance = getInstanceByDom(host) ?? init(host, undefined, { renderer: 'canvas' });
    chart.current = instance;
    const onClick = (event: { dataIndex?: number; seriesType?: string }) => {
      const index = event.dataIndex;
      if (event.seriesType !== 'candlestick' || !Number.isInteger(index) || index! < 0) return;
      inspect(index!);
    };
    instance.on('click', onClick);
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => instance.resize()) : null;
    observer?.observe(host);
    return () => {
      observer?.disconnect();
      instance.off('click', onClick);
      instance.dispose();
      chart.current = null;
    };
  }, []);

  useEffect(() => {
    const option: EChartsOption = buildCandleOptions(completedBars, symbol, interval);
    chart.current?.setOption(option, { notMerge: true, lazyUpdate: false });
    setSelected(null);
  }, [completedBars, symbol, interval]);

  return <section className={`cl-react-chart ${className}`} aria-label={ariaLabel}>
    <div ref={node} className="cl-react-chart__canvas" style={{ height: Math.max(240, height) }} role="img" aria-label={ariaLabel} />
    <div className="cl-react-chart__evidence" aria-live="polite">
      {selected === null ? `Showing ${completedBars.length} completed candles; no future bars are displayed.`
        : `Selected completed bar ${selected + 1} of ${completedBars.length}.`}
    </div>
    <table className="cl-react-chart__accessible-table">
      <caption>{symbol} {interval} — completed candles</caption>
      <thead><tr><th scope="col">Time</th><th scope="col">Open</th><th scope="col">High</th><th scope="col">Low</th><th scope="col">Close</th><th scope="col">Volume</th></tr></thead>
      <tbody>{completedBars.map((bar, i) => <tr key={`${bar.time}-${i}`}>
        <th scope="row"><button type="button" className="cl-react-chart__inspect" onClick={() => inspect(i)}
          aria-label={`Inspect completed candle ${i + 1} at ${bar.time}`} aria-pressed={selected === i}>{bar.time}</button></th><td>{bar.open}</td><td>{bar.high}</td><td>{bar.low}</td><td>{bar.close}</td><td>{bar.volume}</td>
      </tr>)}</tbody>
    </table>
  </section>;
}
