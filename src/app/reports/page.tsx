"use client";

import ProtectedPage from "@/components/ProtectedPage";
import AppShell from "@/components/layout/AppShell";
import ReportGenerator from "@/components/reports/ReportGenerator";

export default function ReportsPage() {
  return (
    <ProtectedPage>
      <AppShell>
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Export and analyze your financial data</p>
          </div>
          <ReportGenerator />
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
