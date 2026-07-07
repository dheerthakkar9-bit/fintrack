"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { api } from "@/lib/api-client";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { SavingsGoal } from "@/lib/types";

interface SavingsGoalCardProps {
  goal: SavingsGoal;
  onEdit?: () => void;
}

export default function SavingsGoalCard({ goal, onEdit }: SavingsGoalCardProps) {
  const { dispatch } = useStore();
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [addAmount, setAddAmount] = useState("");

  const percentage = Math.min(
    100,
    (goal.currentAmount / goal.targetAmount) * 100
  );

  const getDaysRemaining = () => {
    if (!goal.deadline) return null;
    const today = new Date();
    const deadline = new Date(goal.deadline);
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: "Deadline passed", isPast: true };
    } else if (diffDays === 0) {
      return { text: "Due today", isPast: false };
    } else {
      return { text: `${diffDays} days left`, isPast: false };
    }
  };

  const daysInfo = getDaysRemaining();

  const handleAddFunds = async () => {
    if (addAmount && parseFloat(addAmount) > 0) {
      const newAmount = goal.currentAmount + parseFloat(addAmount);
      await api.savings.update(goal.id, { currentAmount: newAmount });
      dispatch({
        type: "UPDATE_SAVINGS_GOAL",
        payload: {
          ...goal,
          currentAmount: newAmount,
        },
      });
      setAddAmount("");
      setShowAddFunds(false);
    }
  };

  const handleDelete = async () => {
    await api.savings.delete(goal.id);
    dispatch({ type: "DELETE_SAVINGS_GOAL", payload: goal.id });
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="glass-card p-5 rounded-xl hover:shadow-lg transition-all duration-300 overflow-hidden relative"
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(135deg, ${goal.color}, transparent)`,
        }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: `${goal.color}20` }}
            >
              {goal.icon || "🎯"}
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">{goal.name}</h3>
              <p className="text-xs text-muted-foreground">
                Target: {formatCurrency(goal.targetAmount)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={onEdit} className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6 mb-4">
          <div className="relative w-28 h-28">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="8"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke={goal.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-foreground">
                {Math.round(percentage)}%
              </span>
              <span className="text-xs text-muted-foreground">complete</span>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Current Amount</p>
              <p className="text-xl font-bold text-foreground">
                {formatCurrency(goal.currentAmount)}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Remaining</p>
              <p className="text-lg font-semibold" style={{ color: goal.color }}>
                {formatCurrency(goal.targetAmount - goal.currentAmount)}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full bg-muted rounded-full h-2 mb-4">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: goal.color }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          {goal.deadline && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(goal.deadline)}</span>
            </div>
          )}
          {daysInfo && (
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs",
                daysInfo.isPast
                  ? "bg-red-500/20 text-red-400"
                  : "bg-blue-500/20 text-blue-400"
              )}
            >
              {daysInfo.text}
            </span>
          )}
        </div>

        {showAddFunds ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2"
          >
            <input
              type="number"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all flex-1 px-3 py-2"
              placeholder="Enter amount"
              min="0"
              step="0.01"
            />
            <button
              onClick={handleAddFunds}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-4 py-2 text-sm"
            >
              Add
            </button>
            <button
              onClick={() => {
                setShowAddFunds(false);
                setAddAmount("");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors px-3 py-2 text-sm"
            >
              Cancel
            </button>
          </motion.div>
        ) : (
          <button
            onClick={() => setShowAddFunds(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-muted/50 hover:bg-muted rounded-lg text-foreground transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Funds
          </button>
        )}
      </div>
    </motion.div>
  );
}
