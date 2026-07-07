"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCurrency, cn } from "@/lib/utils";

interface DailySpend {
  date: string;
  label: string;
  amount: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-card border-border text-foreground px-4 py-3 shadow-xl border rounded-xl">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="text-lg font-semibold text-foreground">
        {formatCurrency(payload[0].value)}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">Daily spending</p>
    </div>
  );
}

export default function TrendLine() {
  const { monthTransactions } = useStore();

  const chartData = useMemo(() => {
    const now = new Date();
    const days: DailySpend[] = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      const dayStr = date.toISOString().split("T")[0];
      const label = date.toLocaleDateString("default", {
        month: "short",
        day: "numeric",
      });

      const dayExpenses = monthTransactions
        .filter((t) => {
          const tDate = new Date(t.date);
          return (
            t.type === "expense" &&
            tDate.getFullYear() === date.getFullYear() &&
            tDate.getMonth() === date.getMonth() &&
            tDate.getDate() === date.getDate()
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);

      days.push({ date: dayStr, label, amount: dayExpenses });
    }

    return days;
  }, [monthTransactions]);

  const maxSpend = Math.max(...chartData.map((d) => d.amount), 1);
  const avgSpend =
    chartData.reduce((sum, d) => sum + d.amount, 0) / chartData.length;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  return (
    <motion.div
      className="glass-card p-6 rounded-2xl h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
            <TrendingUp className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Spending Trend</h3>
            <p className="text-sm text-muted-foreground">Last 30 days</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xs text-muted-foreground">Daily Average</p>
          <p className="text-sm font-semibold text-foreground">
            {formatCurrency(avgSpend)}
          </p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
                <stop offset="50%" stopColor="#22d3ee" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.6} />
                <stop offset="50%" stopColor="#22d3ee" stopOpacity={1} />
                <stop offset="100%" stopColor="#67e8f9" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval={4}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`
              }
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="url(#lineGradient)"
              strokeWidth={2.5}
              fill="url(#spendGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: "#22d3ee",
                stroke: "hsl(var(--background))",
                strokeWidth: 2,
              }}
              animationDuration={1500}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>Min: {formatCurrency(Math.min(...chartData.map((d) => d.amount)))}</span>
        <span>Max: {formatCurrency(maxSpend)}</span>
      </div>
    </motion.div>
  );
}
