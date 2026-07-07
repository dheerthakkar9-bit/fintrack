"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Download,
  FileText,
  FileJson,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
  Wallet,
  Hash,
  ChevronDown,
} from "lucide-react";
import { useStore } from "@/lib/store";
import {
  formatCurrency,
  formatDate,
  cn,
  downloadCSV,
  downloadJSON,
} from "@/lib/utils";
import { TransactionType } from "@/lib/types";

export default function ReportGenerator() {
  const { state, monthTransactions, totalIncome, totalExpenses, savingsRate } = useStore();

  const [dateFrom, setDateFrom] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toISOString()
      .split("T")[0]
  );
  const [dateTo, setDateTo] = useState(new Date().toISOString().split("T")[0]);
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [accountFilter, setAccountFilter] = useState("all");

  const filteredTransactions = useMemo(() => {
    return monthTransactions.filter((t) => {
      const date = new Date(t.date);
      const from = new Date(dateFrom);
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);

      if (date < from || date > to) return false;
      if (typeFilter !== "all" && t.type !== typeFilter) return false;
      if (categoryFilter !== "all" && t.categoryId !== categoryFilter)
        return false;
      if (accountFilter !== "all" && t.accountId !== accountFilter) return false;
      return true;
    });
  }, [
    monthTransactions,
    dateFrom,
    dateTo,
    typeFilter,
    categoryFilter,
    accountFilter,
  ]);

  const filteredIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredExpenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredNetSavings = filteredIncome - filteredExpenses;

  const categories = state.categories;
  const accounts = state.accounts;

  const handleExportCSV = () => {
    const data = filteredTransactions.map((t) => ({
      Date: formatDate(t.date),
      Description: t.description,
      Category:
        state.categories.find((c) => c.id === t.categoryId)?.name || "N/A",
      Account:
        state.accounts.find((a) => a.id === t.accountId)?.name || "N/A",
      Type: t.type,
      Amount: t.amount,
    }));
    downloadCSV(data, `fintrack-report-${dateFrom}-to-${dateTo}.csv`);
  };

  const handleExportJSON = () => {
    downloadJSON(
      filteredTransactions,
      `fintrack-report-${dateFrom}-to-${dateTo}.json`
    );
  };

  const summaryStats = [
    {
      label: "Total Income",
      value: formatCurrency(filteredIncome),
      icon: TrendingUp,
      color: "text-emerald-400",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(filteredExpenses),
      icon: TrendingDown,
      color: "text-rose-400",
    },
    {
      label: "Net Savings",
      value: formatCurrency(filteredNetSavings),
      icon: Wallet,
      color: "text-blue-400",
    },
    {
      label: "Transactions",
      value: filteredTransactions.length.toString(),
      icon: Hash,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold">
          <span className="text-primary">Reports & Export</span>
        </h1>
        <p className="text-muted-foreground">
          Generate and export financial reports
        </p>
      </motion.div>

      {/* Date Range & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-foreground">Date Range</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Type</label>
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) =>
                  setTypeFilter(e.target.value as TransactionType | "all")
                }
                className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all appearance-none"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">
              Category
            </label>
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all appearance-none"
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="relative">
            <label className="block text-sm text-muted-foreground mb-1">Account</label>
            <select
              value={accountFilter}
              onChange={(e) => setAccountFilter(e.target.value)}
              className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all md:w-1/4 appearance-none"
            >
              <option value="all">All Accounts</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-[calc(100%-8px)] md:right-[calc(25%-12px)] w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {summaryStats.map((stat) => (
          <div key={stat.label} className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={cn("w-5 h-5", stat.color)} />
              <span className="text-sm text-muted-foreground">{stat.label}</span>
            </div>
            <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Preview Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-foreground">
            Transaction Preview ({filteredTransactions.length})
          </h2>
        </div>

        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-sm font-medium text-muted-foreground">
                  Date
                </th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">
                  Description
                </th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">
                  Category
                </th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">
                  Account
                </th>
                <th className="pb-3 text-sm font-medium text-muted-foreground text-right">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No transactions found for the selected filters
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-3 text-sm text-muted-foreground">
                      {formatDate(t.date)}
                    </td>
                    <td className="py-3 text-sm text-foreground">{t.description}</td>
                    <td className="py-3 text-sm text-muted-foreground">
                      {state.categories.find((c) => c.id === t.categoryId)
                        ?.name || "N/A"}
                    </td>
                    <td className="py-3 text-sm text-muted-foreground">
                      {state.accounts.find((a) => a.id === t.accountId)?.name ||
                        "N/A"}
                    </td>
                    <td
                      className={cn(
                        "py-3 text-sm text-right font-medium",
                        t.type === "income" ? "text-emerald-400" : "text-rose-400"
                      )}
                    >
                      {t.type === "income" ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Export Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Download className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-semibold text-foreground">Export Data</h2>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleExportCSV}
            disabled={filteredTransactions.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <FileText className="w-4 h-4" />
            Export CSV
          </button>

          <button
            onClick={handleExportJSON}
            disabled={filteredTransactions.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <FileJson className="w-4 h-4" />
            Export JSON
          </button>

          <div className="relative group">
            <button
              disabled
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors opacity-50 cursor-not-allowed"
            >
              <FileText className="w-4 h-4" />
              Export PDF
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 bg-card text-foreground text-xs rounded-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              Coming soon
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
