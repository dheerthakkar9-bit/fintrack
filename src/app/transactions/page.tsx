"use client";

import ProtectedPage from "@/components/ProtectedPage";
import AppShell from "@/components/layout/AppShell";
import TransactionList from "@/components/transactions/TransactionList";

export default function TransactionsPage() {
  return (
    <ProtectedPage>
      <AppShell>
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Transactions</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage your income and expenses</p>
          </div>
          <TransactionList />
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
