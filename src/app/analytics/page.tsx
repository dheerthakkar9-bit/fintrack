"use client";

import ProtectedPage from "@/components/ProtectedPage";
import AppShell from "@/components/layout/AppShell";
import ExpenseBreakdown from "@/components/analytics/ExpenseBreakdown";
import IncomeVsExpense from "@/components/analytics/IncomeVsExpense";
import TrendLine from "@/components/analytics/TrendLine";
import CategoryTrend from "@/components/analytics/CategoryTrend";

export default function AnalyticsPage() {
  return (
    <ProtectedPage>
      <AppShell>
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Insights into your spending patterns</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ExpenseBreakdown />
            <IncomeVsExpense />
            <TrendLine />
            <CategoryTrend />
          </div>
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
