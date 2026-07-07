"use client";

import AppShell from "@/components/layout/AppShell";
import StatCard from "@/components/dashboard/StatCard";
import HealthScore from "@/components/dashboard/HealthScore";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import SpendingChart from "@/components/dashboard/SpendingChart";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardContent() {
  const { totalBalance, totalIncome, totalExpenses, savingsRate } = useStore();

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Your financial overview</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted-foreground">Net Worth</p>
            <p className="text-xl font-semibold">{formatCurrency(totalBalance)}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            title="Total Balance"
            value={totalBalance}
            icon={<Wallet className="w-4 h-4" />}
            trend={{ value: 4.2, isPositive: true }}
            delay={0}
          />
          <StatCard
            title="Income"
            value={totalIncome}
            icon={<TrendingUp className="w-4 h-4" />}
            trend={{ value: 8.1, isPositive: true }}
            delay={0.05}
          />
          <StatCard
            title="Expenses"
            value={totalExpenses}
            icon={<TrendingDown className="w-4 h-4" />}
            trend={{ value: 3.5, isPositive: false }}
            delay={0.1}
          />
          <StatCard
            title="Savings Rate"
            value={savingsRate}
            format="percent"
            icon={<PiggyBank className="w-4 h-4" />}
            delay={0.15}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <SpendingChart />
          </div>
          <div>
            <HealthScore />
          </div>
        </div>

        <RecentTransactions />
      </div>
    </AppShell>
  );
}
