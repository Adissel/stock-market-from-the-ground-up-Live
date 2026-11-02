import type { EChartsOption } from 'echarts';

export interface CompletedBar {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

/** Source-only math; never estimates undisclosed future bars or reconstructs trade VWAP from OHLCV. */
export function ema(values: readonly number[], period: number): (number | null)[] {
  if (!Number.isInteger(period) || period < 1) throw new RangeError('EMA period must be positive integer');
  const out: (number | null)[] = Array(values.length).fill(null);
  for (const n of values) if (!Number.isFinite(n)) throw new TypeError('Invalid close');
  if (values.length < period) return out;
  let current = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
  out[period - 1] = current;
  const alpha = 2 / (period + 1);
  for (let i = period; i < values.length; i++) {
    current = alpha * values[i] + (1 - alpha) * current;
    out[i] = current;
  }
  return out;
}

/** HLC3 bar-VWAP approximation, reset at an explicit session boundary.
 * Default UTC date should be replaced by exchange-specific sessions when needed.
 */
export function barVwap(bars: readonly CompletedBar[], sessionKey: (bar: CompletedBar) => string = b => b.time.slice(0, 10)): (number | null)[] {
  let total = 0, weighted = 0, lastSession: string | null = null;
  return bars.map(b => {
    if (![b.high, b.low, b.close, b.volume].every(Number.isFinite) || b.volume < 0) throw new TypeError('Invalid OHLCV');
    const session = sessionKey(b);
    if (typeof session !== 'string' || !session.trim()) throw new TypeError('Invalid VWAP session');
    if (session !== lastSession) { total = 0; weighted = 0; lastSession = session; }
    const typical = (b.high + b.low + b.close) / 3;
    total += b.volume;
    weighted += typical * b.volume;
    return total > 0 ? weighted / total : null;
  });
}

export function buildCandleOptions(bars: readonly CompletedBar[], symbol: string, interval: string): EChartsOption {
  for (let i = 0; i < bars.length; i++) {
    const b = bars[i];
    if (typeof b.time !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(b.time) ||
      ![b.open,b.high,b.low,b.close,b.volume].every(Number.isFinite) ||
      b.high < Math.max(b.open,b.close,b.low) || b.low > Math.min(b.open,b.close,b.high) ||
      b.volume < 0 || (i > 0 && b.time <= bars[i - 1].time)) throw new TypeError('Invalid or unordered completed bars');
  }
  const times = bars.map(b => b.time);
  const closes = bars.map(b => b.close);
  return {
    backgroundColor: 'transparent',
    animation: false,
    legend: { top: 4, textStyle: { color: '#c7dbe6' } },
    grid: [{ left: 60, right: 30, top: 38, height: '59%' }, { left: 60, right: 30, top: '75%', height: '16%' }],
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    axisPointer: { link: [{ xAxisIndex: 'all' }] },
    xAxis: [{ type: 'category', data: times, boundaryGap: true, axisLabel: { color: '#c7dbe6' } },
      { type: 'category', gridIndex: 1, data: times, axisLabel: { color: '#c7dbe6' } }],
    yAxis: [{ type: 'value', scale: true, axisLabel: { color: '#c7dbe6' } },
      { type: 'value', gridIndex: 1, scale: true, axisLabel: { color: '#c7dbe6' } }],
    dataZoom: [{ type: 'inside', xAxisIndex: [0,1], filterMode: 'none' },
      { type: 'slider', xAxisIndex: [0,1], bottom: 0, height: 18 }],
    series: [
      { name: symbol + ' ' + interval, type: 'candlestick', data: bars.map(b => [b.open,b.close,b.low,b.high]),
        itemStyle: { color: '#27c6b0', color0: '#ef7281', borderColor: '#27c6b0', borderColor0: '#ef7281' } },
      { name: 'EMA 9', type: 'line', data: ema(closes,9), showSymbol: false, smooth: false, connectNulls: false, lineStyle: { color: '#76d9ff', width: 1.6 } },
      { name: 'EMA 20', type: 'line', data: ema(closes,20), showSymbol: false, smooth: false, connectNulls: false, lineStyle: { color: '#e9c985', width: 1.6 } },
      { name: 'Bar HLC3 VWAP (approx.)', type: 'line', data: barVwap(bars), showSymbol: false, smooth: false, connectNulls: false, lineStyle: { color: '#b6a2ff', width: 1.6 } },
      { name: 'Volume', type: 'bar', xAxisIndex: 1, yAxisIndex: 1, data: bars.map(b => ({ value: b.volume, itemStyle: { color: b.close >= b.open ? '#27c6b0' : '#ef7281' } })) }
    ]
  };
}
