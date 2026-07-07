"use client";

import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface MiniChartProps {
  data: number[];
  color?: string;
  height?: number;
}

export default function MiniChart({ data, color = "hsl(var(--primary))", height = 60 }: MiniChartProps) {
  const chartData = data.map((value, index) => ({ value, index }));

  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.3} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill="url(#gradient)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
