"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import {
  Briefcase, Code, TrendingUp, Building2, Home, Gift, Plus,
  UtensilsCrossed, Car, ShoppingBag, Clapperboard, Receipt, Heart,
  GraduationCap, Apple, Shield, Plane, Sparkles, Dog, RefreshCw,
  MoreHorizontal, ArrowRight,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Briefcase, Code, TrendingUp, Building2, Home, Gift, Plus,
  UtensilsCrossed, Car, ShoppingBag, Clapperboard, Receipt, Heart,
  GraduationCap, Apple, Shield, Plane, Sparkles, Dog, RefreshCw, MoreHorizontal,
};

export default function RecentTransactions() {
  const { state, getCategoryById } = useStore();

  const recentTransactions = useMemo(
    () => [...state.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6),
    [state.transactions]
  );

  if (recentTransactions.length === 0) {
    return (
      <div className="glass-card">
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">No transactions yet</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="glass-card"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">Recent Transactions</h3>
        <Link href="/transactions" className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
          View all <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-1">
        {recentTransactions.map((t, i) => {
          const category = getCategoryById(t.categoryId);
          const Icon = iconMap[category?.icon || "MoreHorizontal"];
          const isIncome = t.type === "income";

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.05 }}
              className="flex items-center gap-3 py-2.5 rounded-lg hover:bg-accent/50 transition-colors px-2 -mx-2"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${category?.color || "#64748b"}15` }}
              >
                {Icon && <Icon className="w-4 h-4" style={{ color: category?.color || "#64748b" }} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{t.description}</p>
                <p className="text-xs text-muted-foreground">{category?.name} · {formatDate(t.date)}</p>
              </div>
              <p className={cn("text-sm font-medium tabular-nums", isIncome ? "text-emerald-500" : "text-foreground")}>
                {isIncome ? "+" : "-"}{formatCurrency(t.amount)}
              </p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
