"use client";

import ProtectedPage from "@/components/ProtectedPage";
import AppShell from "@/components/layout/AppShell";
import BudgetCard from "@/components/budgets/BudgetCard";
import BudgetForm from "@/components/budgets/BudgetForm";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function BudgetsPage() {
  const { state } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editBudget, setEditBudget] = useState<null | typeof state.budgets[0]>(null);

  return (
    <ProtectedPage>
      <AppShell>
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Budgets</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Set spending limits and track your progress</p>
            </div>
            <button onClick={() => { setEditBudget(null); setShowForm(true); }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" /> Add Budget
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {state.budgets.map((budget, i) => (
              <motion.div key={budget.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <BudgetCard budget={budget} onEdit={() => { setEditBudget(budget); setShowForm(true); }} />
              </motion.div>
            ))}
          </div>
          <BudgetForm budget={editBudget} isOpen={showForm} onClose={() => { setShowForm(false); setEditBudget(null); }} />
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
