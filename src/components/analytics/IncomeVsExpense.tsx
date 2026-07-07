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
  Legend,
} from "recharts";
import { ArrowUpRight, ArrowDownRight, BarChart3 } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCurrency, cn } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/constants";
import type { Transaction } from "@/lib/types";

interface MonthlyData {
  month: string;
  label: string;
  income: number;
  expenses: number;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-card border-border text-foreground px-4 py-3 shadow-xl border rounded-xl min-w-[160px]">
      <p className="text-sm font-medium text-muted-foreground mb-2">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-foreground capitalize">
              {entry.dataKey}
            </span>
          </div>
          <span className="text-sm font-semibold text-foreground">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
      {payload.length === 2 && (
        <div className="mt-2 border-t border-border pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Net</span>
            <span
              className={cn(
                "text-sm font-semibold",
                payload[0].value - payload[1].value >= 0
                  ? "text-emerald-400"
                  : "text-rose-400"
              )}
            >
              {formatCurrency(payload[0].value - payload[1].value)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function CustomLegend({ payload }: { payload?: Array<{ value: string; color: string }> }) {
  if (!payload) return null;

  return (
    <div className="flex items-center justify-center gap-6 mt-4">
      {payload.map((entry) => (
        <div key={entry.value} className="flex items-center gap-2">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-muted-foreground capitalize">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function IncomeVsExpense() {
  const { monthTransactions } = useStore();

  const chartData = useMemo(() => {
    const now = new Date();
    const months: MonthlyData[] = [];

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.toLocaleString("default", { month: "short" });
      const year = date.getFullYear();
      const monthKey = `${year}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      const monthTxns = monthTransactions.filter((t) => {
        const d = new Date(t.date);
        return (
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear()
        );
      });

      const income = monthTxns
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = monthTxns
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      months.push({
        month: monthKey,
        label: `${month} ${year}`,
        income,
        expenses,
      });
    }

    return months;
  }, [monthTransactions]);

  const totalIncome = chartData.reduce((sum, d) => sum + d.income, 0);
  const totalExpenses = chartData.reduce((sum, d) => sum + d.expenses, 0);

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
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
            <BarChart3 className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Income vs Expenses
            </h3>
            <p className="text-sm text-muted-foreground">Last 6 months</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <ArrowUpRight className="h-4 w-4 text-emerald-400" />
            <span className="text-sm text-muted-foreground">
              {formatCurrency(totalIncome)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <ArrowDownRight className="h-4 w-4 text-rose-400" />
            <span className="text-sm text-muted-foreground">
              {formatCurrency(totalExpenses)}
            </span>
          </div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
            barGap={4}
          >
            <defs>
              <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(var(--border))"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                value >= 1000 ? `${(value / 1000).toFixed(0)}k` : `${value}`
              }
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
            <Legend content={<CustomLegend />} />
            <Bar
              dataKey="income"
              fill="url(#incomeGradient)"
              radius={[6, 6, 0, 0]}
              animationDuration={1200}
              animationEasing="ease-out"
            />
            <Bar
              dataKey="expenses"
              fill="url(#expenseGradient)"
              radius={[6, 6, 0, 0]}
              animationDuration={1200}
              animationEasing="ease-out"
              animationBegin={200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
