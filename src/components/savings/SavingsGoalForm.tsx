"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Target,
  DollarSign,
  Calendar,
  Smile,
  Palette,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { api } from "@/lib/api-client";
import { generateId } from "@/lib/utils";
import { SavingsGoal } from "@/lib/types";

interface SavingsGoalFormProps {
  goal?: SavingsGoal | null;
  onClose: () => void;
  isOpen: boolean;
}

export default function SavingsGoalForm({
  goal,
  onClose,
  isOpen,
}: SavingsGoalFormProps) {
  const { dispatch } = useStore();
  const [formData, setFormData] = useState({
    name: "",
    targetAmount: "",
    currentAmount: "",
    deadline: "",
    icon: "🎯",
    color: "#3B82F6",
  });

  const presetIcons = ["🎯", "🏠", "🚗", "✈️", "🎓", "💍", "🏖️", "💻", "📱", "🎸"];
  const presetColors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#06B6D4",
    "#84CC16",
  ];

  useEffect(() => {
    if (goal) {
      setFormData({
        name: goal.name,
        targetAmount: goal.targetAmount.toString(),
        currentAmount: goal.currentAmount.toString(),
        deadline: goal.deadline ? goal.deadline.split("T")[0] : "",
        icon: goal.icon || "🎯",
        color: goal.color || "#3B82F6",
      });
    } else {
      setFormData({
        name: "",
        targetAmount: "",
        currentAmount: "",
        deadline: "",
        icon: "🎯",
        color: "#3B82F6",
      });
    }
  }, [goal, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const goalData: SavingsGoal = {
      id: goal?.id || generateId(),
      name: formData.name,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      deadline: formData.deadline || new Date().toISOString().split("T")[0],
      icon: formData.icon,
      color: formData.color,
    };

    if (goal) {
      const result = await api.savings.update(goal.id, goalData);
      dispatch({ type: "UPDATE_SAVINGS_GOAL", payload: result });
    } else {
      const result = await api.savings.create(goalData);
      dispatch({ type: "ADD_SAVINGS_GOAL", payload: result });
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="glass-card relative w-full max-w-md p-6 rounded-2xl border border-border shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {goal ? "Edit Savings Goal" : "Add New Savings Goal"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Goal Name
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all pl-10 pr-4 py-2.5"
                    placeholder="e.g., New Car, Vacation"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Target Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      step="0.01"
                      value={formData.targetAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          targetAmount: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all pl-10 pr-4 py-2.5"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Current Amount
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      step="0.01"
                      value={formData.currentAmount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentAmount: e.target.value,
                        })
                      }
                      className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all pl-10 pr-4 py-2.5"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Deadline (Optional)
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                    className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all pl-10 pr-4 py-2.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {presetIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all",
                        formData.icon === icon
                          ? "bg-primary/30 ring-2 ring-primary"
                          : "bg-muted hover:bg-accent"
                      )}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {presetColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setFormData({ ...formData, color })}
                      className={cn(
                        "w-8 h-8 rounded-full transition-all",
                        formData.color === color && "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex-1 px-4 py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex-1 px-4 py-2.5"
                >
                  {goal ? "Update Goal" : "Add Goal"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
