'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export interface TrendsLineConfig {
  dataKey: string;
  label?: string;
  color?: string;
  type?:
    | 'basis'
    | 'linear'
    | 'monotone'
    | 'natural'
    | 'step'
    | 'stepAfter'
    | 'stepBefore';
  activeDotRadius?: number;
}

export interface TrendsLineChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  lines?: TrendsLineConfig[];
  tooltipFormatter?: (
    value: number,
    name: string,
  ) => [string | number, string] | string | number;
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

const DEFAULT_LINES: TrendsLineConfig[] = [
  {
    dataKey: 'income',
    label: 'Income',
    color: '#10b981',
    activeDotRadius: 6,
  },
  {
    dataKey: 'expenses',
    label: 'Expenses',
    color: '#ef4444',
    activeDotRadius: 6,
  },
];

const DEFAULT_MARGIN = { top: 5, right: 30, left: 20, bottom: 5 };

export default function TrendsLineChart({
  data,
  xKey,
  height = 300,
  showLegend = true,
  showGrid = true,
  lines = DEFAULT_LINES,
  tooltipFormatter,
  margin = DEFAULT_MARGIN,
}: TrendsLineChartProps) {
  const resolvedLines = lines.length > 0 ? lines : DEFAULT_LINES;

  const handleTooltipFormatter = (value: number, name: string) => {
    if (tooltipFormatter != null) {
      return tooltipFormatter(value, name);
    }

    return [`$${value.toFixed?.(0) ?? value}`, name];
  };

  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={margin}>
          {showGrid ? <CartesianGrid strokeDasharray="3 3" /> : null}
          <XAxis dataKey={xKey} />
          <YAxis />
          <Tooltip
            formatter={(value, name) =>
              handleTooltipFormatter(Number(value), String(name))
            }
          />
          {showLegend ? <Legend /> : null}
          {resolvedLines.map((line) => (
            <Line
              key={line.dataKey}
              type={line.type ?? 'monotone'}
              dataKey={line.dataKey}
              stroke={line.color}
              name={line.label}
              activeDot={
                line.activeDotRadius ? { r: line.activeDotRadius } : undefined
              }
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
