"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { api } from "@/lib/api-client";
import { generateId } from "@/lib/utils";
import { Budget } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Calendar, Tag } from "lucide-react";

interface BudgetFormProps {
  budget?: Budget | null;
  onClose: () => void;
  isOpen: boolean;
}

export default function BudgetForm({ budget, onClose, isOpen }: BudgetFormProps) {
  const { state, dispatch } = useStore();

  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState<"weekly" | "monthly" | "yearly">("monthly");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const expenseCategories = state.categories.filter((c) => c.type === "expense");

  useEffect(() => {
    if (budget) {
      setCategoryId(budget.categoryId);
      setAmount(budget.amount.toString());
      setPeriod(budget.period);
    } else {
      setCategoryId("");
      setAmount("");
      setPeriod("monthly");
    }
    setErrors({});
  }, [budget, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!categoryId) {
      newErrors.categoryId = "Please select a category";
    }

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const budgetData: Budget = {
      id: budget?.id || generateId(),
      categoryId,
      amount: parseFloat(amount),
      period,
      startDate: new Date().toISOString().split("T")[0],
    };

    if (budget) {
      const result = await api.budgets.update(budget.id, budgetData);
      dispatch({ type: "UPDATE_BUDGET", payload: result });
    } else {
      const result = await api.budgets.create(budgetData);
      dispatch({ type: "ADD_BUDGET", payload: result });
    }

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-card w-full max-w-md p-6 rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {budget ? "Edit Budget" : "Add Budget"}
              </h2>
              <button
                onClick={onClose}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors p-2"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Tag size={16} className="inline mr-2" />
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all"
                >
                  <option value="">Select a category</option>
                  {expenseCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-red-400 text-sm mt-1">{errors.categoryId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <DollarSign size={16} className="inline mr-2" />
                  Budget Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all"
                />
                {errors.amount && (
                  <p className="text-red-400 text-sm mt-1">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Calendar size={16} className="inline mr-2" />
                  Period
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["weekly", "monthly", "yearly"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPeriod(p)}
                      className={`py-2 px-4 rounded-lg capitalize transition-colors ${
                        period === p
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex-1 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex-1 py-2"
                >
                  {budget ? "Update" : "Add"} Budget
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
