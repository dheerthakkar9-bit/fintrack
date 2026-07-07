"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

export default function SpendingChart() {
  const { monthTransactions } = useStore();

  const chartData = useMemo(() => {
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const data = [];

    for (let d = 1; d <= Math.min(daysInMonth, new Date().getDate()); d++) {
      const dateStr = new Date(new Date().getFullYear(), new Date().getMonth(), d).toISOString().split("T")[0];
      const dayExpenses = monthTransactions
        .filter((t) => t.type === "expense" && t.date === dateStr)
        .reduce((sum, t) => sum + t.amount, 0);

      data.push({
        day: d,
        label: `${d}`,
        amount: dayExpenses,
      });
    }
    return data;
  }, [monthTransactions]);

  const totalSpent = chartData.reduce((sum, d) => sum + d.amount, 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
        <p className="text-xs text-muted-foreground">Day {payload[0]?.payload?.label}</p>
        <p className="text-sm font-medium">{formatCurrency(payload[0]?.value)}</p>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="glass-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Daily Spending</h3>
        <p className="text-sm font-medium">{formatCurrency(totalSpent)} <span className="text-muted-foreground font-normal">spent</span></p>
      </div>

      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              interval="preserveStartEnd"
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))", radius: 4 }} />
            <Bar
              dataKey="amount"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              maxBarSize={24}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
