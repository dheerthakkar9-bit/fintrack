"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { LayoutList } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCurrency, cn, groupBy } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/constants";
import type { Transaction } from "@/lib/types";

interface CategoryData {
  name: string;
  amount: number;
  color: string;
  categoryId: string;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: CategoryData }>;
}) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;

  return (
    <div className="bg-card border-border text-foreground px-4 py-3 shadow-xl border rounded-xl">
      <div className="flex items-center gap-2 mb-1">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: data.color }}
        />
        <span className="text-sm font-medium text-foreground">{data.name}</span>
      </div>
      <p className="text-lg font-semibold text-foreground">
        {formatCurrency(data.amount)}
      </p>
    </div>
  );
}

function CustomAxisTick({
  x,
  y,
  payload,
  data,
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
  data: CategoryData[];
}) {
  if (!x || !y || !payload) return null;
  const item = data.find((d) => d.name === payload.value);

  return (
    <g transform={`translate(${x},${y})`}>
      <circle cx={0} cy={0} r={4} fill={item?.color || "#fff"} opacity={0.8} />
      <text
        x={-10}
        y={0}
        dy={4}
        textAnchor="end"
        fill="hsl(var(--muted-foreground))"
        fontSize={12}
      >
        {payload.value.length > 12
          ? `${payload.value.slice(0, 12)}...`
          : payload.value}
      </text>
    </g>
  );
}

export default function CategoryTrend() {
  const { monthTransactions, getCategoryById } = useStore();

  const chartData = useMemo(() => {
    const expenses = monthTransactions.filter((t) => t.type === "expense");
    const grouped = groupBy(expenses, "categoryId");

    return Object.entries(grouped)
      .map(([categoryId, transactions], index) => {
        const category = getCategoryById(categoryId);
        const total = (transactions as Transaction[]).reduce(
          (sum, t) => sum + t.amount,
          0
        );
        return {
          name: category?.name || "Uncategorized",
          amount: total,
          color: category?.color || CHART_COLORS[index % CHART_COLORS.length],
          categoryId,
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 8);
  }, [monthTransactions, getCategoryById]);

  const maxAmount = Math.max(...chartData.map((d) => d.amount), 1);

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
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
          <LayoutList className="h-5 w-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Top Categories
          </h3>
          <p className="text-sm text-muted-foreground">Highest spending this month</p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          No expense data available
        </div>
      ) : (
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 60, left: 10, bottom: 0 }}
              barCategoryGap={8}
            >
              <defs>
                {chartData.map((entry, index) => (
                  <linearGradient
                    key={`cat-gradient-${index}`}
                    id={`cat-gradient-${index}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop
                      offset="0%"
                      stopColor={entry.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="100%"
                      stopColor={entry.color}
                      stopOpacity={0.4}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) =>
                  value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`
                }
              />
              <YAxis
                type="category"
                dataKey="name"
                width={90}
                tick={<CustomAxisTick data={chartData} />}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
              <Bar
                dataKey="amount"
                radius={[0, 8, 8, 0]}
                animationDuration={1200}
                animationEasing="ease-out"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#cat-gradient-${index})`}
                  />
                ))}
                <LabelList
                  dataKey="amount"
                  position="right"
                  formatter={(value: number) => formatCurrency(value)}
                  style={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
}
