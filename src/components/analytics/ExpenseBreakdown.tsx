"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingDown } from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCurrency, cn, groupBy } from "@/lib/utils";
import { CHART_COLORS } from "@/lib/constants";
import type { Transaction } from "@/lib/types";

interface ExpenseByCategory {
  name: string;
  value: number;
  color: string;
  categoryId: string;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ExpenseByCategory }>;
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
        {formatCurrency(data.value)}
      </p>
      <p className="text-xs text-muted-foreground mt-0.5">
        {((data.value / payload[0].payload.value) * 100).toFixed(1)}% of total
      </p>
    </div>
  );
}

export default function ExpenseBreakdown() {
  const { state, getCategoryById, monthTransactions } = useStore();

  const expenseData = useMemo(() => {
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
          value: total,
          color: category?.color || CHART_COLORS[index % CHART_COLORS.length],
          categoryId,
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [monthTransactions, getCategoryById]);

  const totalExpenses = expenseData.reduce((sum, d) => sum + d.value, 0);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <motion.div
      className="glass-card p-6 rounded-2xl h-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10">
          <TrendingDown className="h-5 w-5 text-rose-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Expense Breakdown
          </h3>
          <p className="text-sm text-muted-foreground">This month&apos;s spending</p>
        </div>
      </div>

      {expenseData.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-muted-foreground">
          No expenses this month
        </div>
      ) : (
        <>
          <div className="relative h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {expenseData.map((entry, index) => (
                    <linearGradient
                      key={`gradient-${index}`}
                      id={`expense-gradient-${index}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor={entry.color}
                        stopOpacity={0.9}
                      />
                      <stop
                        offset="100%"
                        stopColor={entry.color}
                        stopOpacity={0.5}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                  animationBegin={0}
                  animationDuration={1200}
                  animationEasing="ease-out"
                >
                  {expenseData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#expense-gradient-${index})`}
                      className="cursor-pointer transition-all duration-200 hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <motion.p
                className="text-2xl font-bold text-foreground"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                {formatCurrency(totalExpenses)}
              </motion.p>
              <p className="text-xs text-muted-foreground">Total Expenses</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {expenseData.slice(0, 6).map((entry, index) => (
              <motion.div
                key={entry.categoryId}
                className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2"
                variants={itemVariants}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs text-muted-foreground">{entry.name}</p>
                  <p className="text-sm font-medium text-foreground">
                    {formatCurrency(entry.value)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {expenseData.length > 6 && (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              +{expenseData.length - 6} more categories
            </p>
          )}
        </>
      )}
    </motion.div>
  );
}
