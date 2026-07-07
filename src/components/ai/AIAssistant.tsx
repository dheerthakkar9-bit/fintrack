"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Send,
  X,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  AlertTriangle,
  Clock,
  Trophy,
  MessageSquare,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCurrency, cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "user" | "assistant";
  content: string;
  icon?: React.ReactNode;
}

const quickActions = [
  "Spending Analysis",
  "Savings Tips",
  "Budget Status",
  "Bill Reminders",
  "Achievements",
  "Trends",
];

export default function AIAssistant() {
  const { state, monthTransactions, totalExpenses, totalIncome, savingsRate } =
    useStore();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const insights = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    monthTransactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const cat = state.categories.find((c) => c.id === t.categoryId);
        const name = cat?.name || "Uncategorized";
        categoryTotals[name] = (categoryTotals[name] || 0) + t.amount;
      });

    const sortedCategories = Object.entries(categoryTotals).sort(
      ([, a], [, b]) => b - a
    );

    const topCategory = sortedCategories[0];
    const totalBudget = state.budgets.reduce((sum, b) => sum + b.amount, 0);
    const overBudgetCount = state.budgets.filter((b) => {
      const spent = monthTransactions
        .filter(
          (t) => t.type === "expense" && t.categoryId === b.categoryId
        )
        .reduce((sum, t) => sum + t.amount, 0);
      return spent >= b.amount;
    }).length;

    const closeToLimitCount = state.budgets.filter((b) => {
      const spent = monthTransactions
        .filter(
          (t) => t.type === "expense" && t.categoryId === b.categoryId
        )
        .reduce((sum, t) => sum + t.amount, 0);
      return spent >= b.amount * 0.8 && spent < b.amount;
    }).length;

    const upcomingBills = state.bills.filter((b) => {
      const due = new Date(b.dueDate);
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return due >= now && due <= nextWeek;
    });

    const categoriesWithBudget = state.budgets.map((b) => {
      const cat = state.categories.find((c) => c.id === b.categoryId);
      const spent = monthTransactions
        .filter((t) => t.type === "expense" && t.categoryId === b.categoryId)
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        name: cat?.name || "Unknown",
        budget: b.amount,
        spent,
        remaining: b.amount - spent,
      };
    });

    const underBudget = categoriesWithBudget.filter(
      (c) => c.spent < c.budget
    ).length;

    return {
      topCategory,
      sortedCategories,
      overBudgetCount,
      closeToLimitCount,
      upcomingBills,
      underBudget,
      categoriesWithBudget,
      savingsRate,
    };
  }, [monthTransactions, state]);

  const getInsight = (type: string): Message => {
    const id = Date.now().toString();
    const { topCategory, overBudgetCount, closeToLimitCount, upcomingBills, underBudget } = insights;

    switch (type) {
      case "Spending Analysis":
        return {
          id,
          type: "assistant",
          content: topCategory
            ? `Your biggest expense category this month is ${topCategory[0]} at ${formatCurrency(topCategory[1])}. ${
                topCategory[1] > totalExpenses * 0.3
                  ? "This is over 30% of your total spending - you might want to review this."
                  : "This looks reasonable relative to your overall spending."
              }`
            : "No expense data available for analysis yet.",
          icon: <TrendingDown className="w-4 h-4 text-rose-400" />,
        };
      case "Savings Tips": {
        const potentialSaving = topCategory
          ? topCategory[1] * 0.1
          : 0;
        return {
          id,
          type: "assistant",
          content: topCategory
            ? `You could save approximately ${formatCurrency(potentialSaving)} by reducing your ${topCategory[0]} spending by 10%. Your current savings rate is ${insights.savingsRate.toFixed(1)}%. ${
                insights.savingsRate >= 20
                  ? "Great job - you're saving over 20%!"
                  : "Try to aim for at least 20% savings rate."
              }`
            : "Add some transactions to get personalized savings tips.",
          icon: <Lightbulb className="w-4 h-4 text-yellow-400" />,
        };
      }
      case "Budget Status":
        return {
          id,
          type: "assistant",
          content: `${
            overBudgetCount + closeToLimitCount > 0
              ? `${overBudgetCount} budgets are over their limits and ${closeToLimitCount} are close to their limits.`
              : "All budgets are within limits!"
          } You've stayed under budget in ${underBudget} of ${state.budgets.length} categories this month.`,
          icon: <AlertTriangle className="w-4 h-4 text-orange-400" />,
        };
      case "Bill Reminders":
        return {
          id,
          type: "assistant",
          content:
            upcomingBills.length > 0
              ? `${upcomingBills.length} bill${
                  upcomingBills.length > 1 ? "s are" : " is"
                } due in the next 7 days: ${upcomingBills
                  .map((b) => b.name)
                  .join(", ")}.`
              : "No bills due in the next 7 days. You're all clear!",
          icon: <Clock className="w-4 h-4 text-blue-400" />,
        };
      case "Achievements":
        return {
          id,
          type: "assistant",
          content: `You've stayed under budget in ${underBudget} ${
            underBudget === 1 ? "category" : "categories"
          } this month! ${
            underBudget === state.budgets.length && state.budgets.length > 0
              ? "Amazing - you're under budget in all categories!"
              : "Keep up the good work!"
          }`,
          icon: <Trophy className="w-4 h-4 text-emerald-400" />,
        };
      case "Trends": {
        const currentMonthExpenses = totalExpenses;
        const avgDaily = currentMonthExpenses / new Date().getDate();
        const projected = avgDaily * 30;
        const difference = projected - currentMonthExpenses;
        return {
          id,
          type: "assistant",
          content: `Based on your current spending pace, you're projected to spend ${formatCurrency(
            projected
          )} this month. ${
            difference >= 0
              ? `You're ${formatCurrency(difference)} under your current total - nice pacing!`
              : `Your spending has increased - you're ${formatCurrency(
                  Math.abs(difference)
                )} above your current total.`
          }`,
          icon: <TrendingUp className="w-4 h-4 text-purple-400" />,
        };
      }
      default:
        return {
          id,
          type: "assistant",
          content:
            "I can help you with spending analysis, savings tips, budget status, bill reminders, achievements, and trend analysis. Try one of the quick actions!",
          icon: <MessageSquare className="w-4 h-4 text-muted-foreground" />,
        };
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      let insightType = "default";
      if (
        lowerInput.includes("spending") ||
        lowerInput.includes("expense") ||
        lowerInput.includes("analysis")
      )
        insightType = "Spending Analysis";
      else if (
        lowerInput.includes("save") ||
        lowerInput.includes("saving") ||
        lowerInput.includes("tip")
      )
        insightType = "Savings Tips";
      else if (
        lowerInput.includes("budget") ||
        lowerInput.includes("limit")
      )
        insightType = "Budget Status";
      else if (
        lowerInput.includes("bill") ||
        lowerInput.includes("due") ||
        lowerInput.includes("reminder")
      )
        insightType = "Bill Reminders";
      else if (
        lowerInput.includes("achievement") ||
        lowerInput.includes("goal") ||
        lowerInput.includes("win")
      )
        insightType = "Achievements";
      else if (
        lowerInput.includes("trend") ||
        lowerInput.includes("compare") ||
        lowerInput.includes("pace")
      )
        insightType = "Trends";

      const response = getInsight(insightType);
      setMessages((prev) => [...prev, response]);
    }, 500);
  };

  const handleQuickAction = (action: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      type: "user",
      content: action,
    };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const response = getInsight(action);
      setMessages((prev) => [...prev, response]);
    }, 500);
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors",
          isOpen
            ? "bg-muted hover:bg-accent"
            : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        )}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-foreground" />
        ) : (
          <Bot className="w-6 h-6 text-foreground" />
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-24 left-6 z-50 w-96 h-[500px] glass-card flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">FinTrack AI</h3>
                <p className="text-xs text-muted-foreground">Financial Assistant</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    Ask me about your finances or pick a quick action below
                  </p>
                </div>
              )}

              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-2",
                    msg.type === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {msg.type === "assistant" && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5 text-foreground" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl px-4 py-2",
                      msg.type === "user"
                        ? "bg-primary/20 text-foreground"
                        : "bg-muted text-foreground"
                    )}
                  >
                    <div className="flex items-start gap-2">
                      {msg.icon && <span className="mt-0.5">{msg.icon}</span>}
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-2 border-t border-border">
              <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => handleQuickAction(action)}
                    className="px-3 py-1 rounded-full text-xs bg-muted hover:bg-accent text-foreground whitespace-nowrap transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask about your finances..."
                  className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all flex-1"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-10 h-10 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  <Send className="w-4 h-4 text-primary-foreground" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
