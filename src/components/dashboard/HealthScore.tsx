"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { calculateFinancialHealth, cn } from "@/lib/utils";
import { Shield, TrendingUp, PiggyBank, Wallet, CheckCircle } from "lucide-react";

export default function HealthScore() {
  const { state, totalIncome, totalExpenses, savingsRate } = useStore();

  const score = useMemo(
    () =>
      calculateFinancialHealth({
        totalIncome,
        totalExpenses,
        savingsRate,
        budgetAdherence: state.budgets.length > 0 ? 75 : 50,
        hasEmergencyFund: totalIncome > totalExpenses * 3,
        billPaymentRate: 0.9,
      }),
    [state, savingsRate, totalIncome, totalExpenses]
  );

  const circumference = 2 * Math.PI * 56;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (s >= 80) return "text-emerald-500";
    if (s >= 60) return "text-primary";
    if (s >= 40) return "text-amber-500";
    return "text-red-500";
  };

  const getScoreStroke = (s: number) => {
    if (s >= 80) return "stroke-emerald-500";
    if (s >= 60) return "stroke-primary";
    if (s >= 40) return "stroke-amber-500";
    return "stroke-red-500";
  };

  const getScoreLabel = (s: number) => {
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Good";
    if (s >= 40) return "Fair";
    return "Poor";
  };

  const breakdown = [
    {
      label: "Savings Rate",
      icon: <PiggyBank className="w-3.5 h-3.5" />,
      value: `${savingsRate.toFixed(1)}%`,
      status: savingsRate >= 20 ? "good" : savingsRate >= 10 ? "warning" : "poor",
    },
    {
      label: "Budget Adherence",
      icon: <Wallet className="w-3.5 h-3.5" />,
      value: state.budgets.length > 0 ? "On Track" : "No Budgets",
      status: state.budgets.length > 0 ? "good" : "warning",
    },
    {
      label: "Emergency Fund",
      icon: <Shield className="w-3.5 h-3.5" />,
      value: totalIncome > totalExpenses * 3 ? "Strong" : totalIncome > totalExpenses ? "Building" : "Low",
      status: totalIncome > totalExpenses * 3 ? "good" : totalIncome > totalExpenses ? "warning" : "poor",
    },
    {
      label: "Bill Payments",
      icon: <CheckCircle className="w-3.5 h-3.5" />,
      value: "90%",
      status: "good",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="glass-card"
    >
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Financial Health</h3>

      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="56"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-muted/50"
            />
            <motion.circle
              cx="60"
              cy="60"
              r="56"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className={getScoreStroke(score)}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-3xl font-bold", getScoreColor(score))}>{score}</span>
            <span className="text-xs text-muted-foreground">{getScoreLabel(score)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {breakdown.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.08 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-6 h-6 rounded-md flex items-center justify-center",
                item.status === "good" ? "bg-emerald-500/10 text-emerald-500" :
                item.status === "warning" ? "bg-amber-500/10 text-amber-500" :
                "bg-red-500/10 text-red-500"
              )}>
                {item.icon}
              </div>
              <span className="text-sm text-muted-foreground">{item.label}</span>
            </div>
            <span className="text-sm font-medium">{item.value}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
