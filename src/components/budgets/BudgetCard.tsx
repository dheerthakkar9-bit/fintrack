"use client";

import { useStore } from "@/lib/store";
import { api } from "@/lib/api-client";
import { formatCurrency, cn } from "@/lib/utils";
import { Budget } from "@/lib/types";
import { motion } from "framer-motion";
import { Edit2, Trash2, AlertTriangle } from "lucide-react";

interface BudgetCardProps {
  budget: Budget;
  onEdit: (budget: Budget) => void;
  onDelete?: (id: string) => void;
}

export default function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const { getCategoryById, monthTransactions } = useStore();

  const handleDelete = async () => {
    await api.budgets.delete(budget.id);
    onDelete?.(budget.id);
  };

  const category = getCategoryById(budget.categoryId);

  const spent = monthTransactions
    .filter((t) => t.categoryId === budget.categoryId && t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const remaining = budget.amount - spent;
  const percentage = Math.min((spent / budget.amount) * 100, 100);
  const isOverBudget = spent > budget.amount;

  const getColor = () => {
    if (isOverBudget) return "red";
    if (percentage >= 90) return "red";
    if (percentage >= 75) return "yellow";
    return "green";
  };

  const color = getColor();

  const progressColor = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  }[color];

  const textColor = {
    green: "text-green-500",
    yellow: "text-yellow-500",
    red: "text-red-500",
  }[color];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-card p-4 rounded-xl"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {category?.icon && (
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: category?.color + "20" }}
            >
              <span className="text-lg">{category?.icon}</span>
            </div>
          )}
          <div>
            <h3 className="font-medium text-foreground">{category?.name || "Unknown"}</h3>
            <p className="text-sm text-muted-foreground capitalize">{budget.period}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(budget)}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors p-2"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={handleDelete}
            className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors p-2 hover:text-red-400"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-muted-foreground">Budget</span>
          <span className="text-foreground font-medium">{formatCurrency(budget.amount)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Spent</span>
          <span className={cn("font-medium", textColor)}>{formatCurrency(spent)}</span>
        </div>
      </div>

      <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={cn("h-full rounded-full", progressColor)}
        />
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          {isOverBudget ? "Over budget" : "Remaining"}
        </span>
        <span
          className={cn(
            "font-medium",
            isOverBudget ? "text-red-400" : "text-green-400"
          )}
        >
          {isOverBudget ? formatCurrency(Math.abs(remaining)) : formatCurrency(remaining)}
        </span>
      </div>

      {isOverBudget && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 p-2 bg-red-500/20 rounded-lg flex items-center gap-2"
        >
          <AlertTriangle size={16} className="text-red-400" />
          <span className="text-sm text-red-400">Over budget by {formatCurrency(Math.abs(remaining))}</span>
        </motion.div>
      )}
    </motion.div>
  );
}
