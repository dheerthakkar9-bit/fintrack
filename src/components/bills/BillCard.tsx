"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  CreditCard,
  Edit,
  Trash2,
  Check,
  Zap,
  AlertCircle,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { Bill } from "@/lib/types";

interface BillCardProps {
  bill: Bill;
  onEdit?: () => void;
}

export default function BillCard({ bill, onEdit }: BillCardProps) {
  const { dispatch, getCategoryById } = useStore();
  const [isPaid, setIsPaid] = useState(bill.status === "paid");

  const category = getCategoryById(bill.categoryId);

  const getDaysUntilDue = () => {
    const today = new Date();
    const dueDate = new Date(bill.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)} days`, isOverdue: true };
    } else if (diffDays === 0) {
      return { text: "Due today", isOverdue: false };
    } else {
      return { text: `${diffDays} days left`, isOverdue: false };
    }
  };

  const daysInfo = getDaysUntilDue();

  const getStatusColor = () => {
    switch (bill.status) {
      case "paid":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "overdue":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  const getBorderColor = () => {
    switch (bill.status) {
      case "paid":
        return "border-l-green-500";
      case "overdue":
        return "border-l-red-500";
      default:
        return "border-l-blue-500";
    }
  };

  const handleMarkAsPaid = () => {
    setIsPaid(true);
    dispatch({
      type: "UPDATE_BILL",
      payload: { ...bill, status: "paid" },
    });
  };

  const handleDelete = () => {
    dispatch({ type: "DELETE_BILL", payload: bill.id });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "glass-card p-4 rounded-xl border-l-4 hover:shadow-lg transition-all duration-300",
        getBorderColor()
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              bill.status === "paid"
                ? "bg-green-500/20"
                : bill.status === "overdue"
                ? "bg-red-500/20"
                : "bg-blue-500/20"
            )}
          >
            {bill.isAutoPay ? (
              <Zap
                className={cn(
                  "w-5 h-5",
                  bill.status === "paid"
                    ? "text-green-400"
                    : bill.status === "overdue"
                    ? "text-red-400"
                    : "text-blue-400"
                )}
              />
            ) : (
              <CreditCard
                className={cn(
                  "w-5 h-5",
                  bill.status === "paid"
                    ? "text-green-400"
                    : bill.status === "overdue"
                    ? "text-red-400"
                    : "text-blue-400"
                )}
              />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{bill.name}</h3>
            {category && (
              <p className="text-xs text-muted-foreground">{category.name}</p>
            )}
          </div>
        </div>

        <span
          className={cn(
            "px-2 py-1 text-xs rounded-full border",
            getStatusColor()
          )}
        >
          {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
        </span>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(bill.amount)}
          </p>
          <p className="text-xs text-muted-foreground">{bill.frequency}</p>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(bill.dueDate)}</span>
          </div>
          <p
            className={cn(
              "text-xs mt-1",
              daysInfo.isOverdue ? "text-red-400" : "text-muted-foreground"
            )}
          >
            {daysInfo.text}
          </p>
        </div>
      </div>

      {bill.notes && (
        <p className="text-xs text-muted-foreground mb-3 truncate">{bill.notes}</p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          {bill.isAutoPay && (
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-400" />
              Auto-pay
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isPaid && bill.status !== "paid" && (
            <button
              onClick={handleMarkAsPaid}
              className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
            >
              <Check className="w-3 h-3" />
              Mark Paid
            </button>
          )}
          <button onClick={onEdit} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
