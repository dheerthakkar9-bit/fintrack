"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Code,
  TrendingUp,
  Building2,
  Home,
  Gift,
  Plus,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Clapperboard,
  Receipt,
  Heart,
  GraduationCap,
  Apple,
  Shield,
  Plane,
  Sparkles,
  Dog,
  RefreshCw,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { Transaction } from "@/lib/types";

const iconMap: Record<string, React.ComponentType<any>> = {
  Briefcase,
  Code,
  TrendingUp,
  Building2,
  Home,
  Gift,
  Plus,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Clapperboard,
  Receipt,
  Heart,
  GraduationCap,
  Apple,
  Shield,
  Plane,
  Sparkles,
  Dog,
  RefreshCw,
  MoreHorizontal,
};

interface TransactionRowProps {
  transaction: Transaction;
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionRow({
  transaction,
  onEdit,
  onDelete,
}: TransactionRowProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { getCategoryById } = useStore();

  const category = getCategoryById(transaction.categoryId);
  const IconComponent = category ? iconMap[category.icon] : null;

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        "relative flex items-center gap-4 p-4 rounded-xl transition-all duration-200",
        "hover:bg-muted/50 group cursor-pointer"
      )}
    >
      {/* Category Icon */}
      <div
        className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
        style={{
          backgroundColor: (category?.color || "#6b7280") + "20",
        }}
      >
        {IconComponent ? (
          <IconComponent
            className="w-6 h-6"
            style={{ color: category?.color || "#6b7280" }}
          />
        ) : (
          <MoreHorizontal
            className="w-6 h-6"
            style={{ color: category?.color || "#6b7280" }}
          />
        )}
      </div>

      {/* Transaction Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">
          {transaction.description}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm text-muted-foreground">
            {category?.name || "Uncategorized"}
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">
            {formatDate(transaction.date)}
          </span>
        </div>
        {transaction.tags && transaction.tags.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {transaction.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {transaction.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{transaction.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Amount & Type Badge */}
      <div className="flex items-center gap-3 shrink-0">
        <span
          className={cn(
            "text-lg font-bold tabular-nums",
            transaction.type === "income"
              ? "text-emerald-500"
              : "text-red-500"
          )}
        >
          {transaction.type === "income" ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </span>
        <span
          className={cn(
            "badge-income text-xs px-2.5 py-1 rounded-full font-medium",
            transaction.type === "income"
              ? "badge-income"
              : "badge-expense"
          )}
        >
          {transaction.type === "income" ? "Income" : "Expense"}
        </span>
      </div>

      {/* Hover Actions */}
      <motion.div
        initial={false}
        animate={{
          opacity: isHovered ? 1 : 0,
          x: isHovered ? 0 : 10,
        }}
        transition={{ duration: 0.15 }}
        className={cn(
          "absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1",
          "bg-card border border-border rounded-lg shadow-lg p-1"
        )}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(transaction);
          }}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
          title="Edit transaction"
        >
          <Pencil className="w-4 h-4 text-muted-foreground" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(transaction.id);
          }}
          className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
          title="Delete transaction"
        >
          <Trash2 className="w-4 h-4 text-red-500" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
