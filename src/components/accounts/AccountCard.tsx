"use client";

import {
  Banknote,
  Building,
  CreditCard,
  Smartphone,
  Wallet,
  Edit,
  Trash2,
  PiggyBank,
} from "lucide-react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { api } from "@/lib/api-client";
import { formatCurrency, cn } from "@/lib/utils";
import { Account } from "@/lib/types";

interface AccountCardProps {
  account: Account;
  onEdit?: () => void;
}

export default function AccountCard({ account, onEdit }: AccountCardProps) {
  const { dispatch } = useStore();

  const getAccountIcon = () => {
    switch (account.type) {
      case "cash":
        return Banknote;
      case "bank":
        return Building;
      case "card":
        return CreditCard;
      case "upi":
        return Smartphone;
      case "wallet":
        return Wallet;
      default:
        return PiggyBank;
    }
  };

  const getAccountTypeLabel = () => {
    switch (account.type) {
      case "cash":
        return "Cash";
      case "bank":
        return "Bank Account";
      case "card":
        return "Credit Card";
      case "upi":
        return "UPI";
      case "wallet":
        return "Wallet";
      default:
        return "Account";
    }
  };

  const getBalanceColor = () => {
    if (account.type === "card" && account.balance < 0) {
      return "text-red-400";
    }
    return account.balance >= 0 ? "text-green-400" : "text-red-400";
  };

  const Icon = getAccountIcon();

  const handleDelete = async () => {
    await api.accounts.delete(account.id);
    dispatch({ type: "DELETE_ACCOUNT", payload: account.id });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "glass-card p-5 rounded-xl border-l-4 hover:shadow-lg transition-all duration-300",
        "border-l-current"
      )}
      style={{ borderLeftColor: account.color }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${account.color}20` }}
          >
            <Icon className="w-6 h-6" style={{ color: account.color }} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-lg">{account.name}</h3>
            <span
              className="px-2 py-0.5 text-xs rounded-full"
              style={{
                backgroundColor: `${account.color}20`,
                color: account.color,
              }}
            >
              {getAccountTypeLabel()}
            </span>
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

      <div className="mt-4">
        <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
        <p className={cn("text-3xl font-bold", getBalanceColor())}>
          {formatCurrency(account.balance)}
        </p>
      </div>

      {account.type === "card" && account.balance < 0 && (
        <p className="text-xs text-red-400 mt-2">
          Outstanding balance on credit card
        </p>
      )}
    </motion.div>
  );
}
