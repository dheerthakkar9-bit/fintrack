"use client";

import ProtectedPage from "@/components/ProtectedPage";
import AppShell from "@/components/layout/AppShell";
import SavingsGoalCard from "@/components/savings/SavingsGoalCard";
import SavingsGoalForm from "@/components/savings/SavingsGoalForm";
import { useStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { Plus, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function SavingsPage() {
  const { state } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editGoal, setEditGoal] = useState<null | typeof state.savingsGoals[0]>(null);

  const totalSaved = state.savingsGoals.reduce((s, g) => s + g.currentAmount, 0);
  const totalTarget = state.savingsGoals.reduce((s, g) => s + g.targetAmount, 0);

  return (
    <ProtectedPage>
      <AppShell>
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Savings Goals</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Track progress toward your financial goals</p>
            </div>
            <button onClick={() => { setEditGoal(null); setShowForm(true); }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" /> Add Goal
            </button>
          </div>

          <div className="glass-card flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Saved</p>
              <p className="text-lg font-semibold">{formatCurrency(totalSaved)} <span className="text-sm font-normal text-muted-foreground">of {formatCurrency(totalTarget)}</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {state.savingsGoals.map((goal, i) => (
              <motion.div key={goal.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                <SavingsGoalCard goal={goal} onEdit={() => { setEditGoal(goal); setShowForm(true); }} />
              </motion.div>
            ))}
          </div>

          <SavingsGoalForm goal={editGoal} isOpen={showForm} onClose={() => { setShowForm(false); setEditGoal(null); }} />
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
