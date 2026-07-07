"use client";

import ProtectedPage from "@/components/ProtectedPage";
import AppShell from "@/components/layout/AppShell";
import AccountCard from "@/components/accounts/AccountCard";
import AccountForm from "@/components/accounts/AccountForm";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { Plus, Wallet } from "lucide-react";
import { motion } from "framer-motion";

export default function AccountsPage() {
  const { state, totalBalance } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editAccount, setEditAccount] = useState<null | typeof state.accounts[0]>(null);

  return (
    <ProtectedPage>
      <AppShell>
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Accounts</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Manage your financial accounts</p>
            </div>
            <button onClick={() => { setEditAccount(null); setShowForm(true); }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" /> Add Account
            </button>
          </div>

          <div className="glass-card flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Net Worth</p>
              <p className="text-lg font-semibold">{formatCurrency(totalBalance)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {state.accounts.map((account, i) => (
              <motion.div key={account.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <AccountCard account={account} onEdit={() => { setEditAccount(account); setShowForm(true); }} />
              </motion.div>
            ))}
          </div>

          <AccountForm account={editAccount} isOpen={showForm} onClose={() => { setShowForm(false); setEditAccount(null); }} />
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
