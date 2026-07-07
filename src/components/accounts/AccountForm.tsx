"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Wallet,
  DollarSign,
  Tag,
  Banknote,
  Building,
  CreditCard,
  Smartphone,
  PiggyBank,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { api } from "@/lib/api-client";
import { generateId } from "@/lib/utils";
import { Account } from "@/lib/types";

interface AccountFormProps {
  account?: Account | null;
  onClose: () => void;
  isOpen: boolean;
}

export default function AccountForm({
  account,
  onClose,
  isOpen,
}: AccountFormProps) {
  const { dispatch } = useStore();
  const [formData, setFormData] = useState({
    name: "",
    type: "cash" as Account["type"],
    balance: "",
    color: "#3B82F6",
  });

  const accountTypes: { value: Account["type"]; label: string; icon: any }[] = [
    { value: "cash", label: "Cash", icon: Banknote },
    { value: "bank", label: "Bank Account", icon: Building },
    { value: "card", label: "Credit Card", icon: CreditCard },
    { value: "upi", label: "UPI", icon: Smartphone },
    { value: "wallet", label: "Wallet", icon: Wallet },
  ];

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
    if (account) {
      setFormData({
        name: account.name,
        type: account.type,
        balance: account.balance.toString(),
        color: account.color || "#3B82F6",
      });
    } else {
      setFormData({
        name: "",
        type: "cash",
        balance: "",
        color: "#3B82F6",
      });
    }
  }, [account, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const accountData: Account = {
      id: account?.id || generateId(),
      name: formData.name,
      type: formData.type,
      balance: parseFloat(formData.balance) || 0,
      currency: "USD",
      color: formData.color,
      icon: formData.type === "cash" ? "Banknote" : formData.type === "bank" ? "Building" : formData.type === "card" ? "CreditCard" : formData.type === "upi" ? "Smartphone" : "Wallet",
    };

    if (account) {
      const result = await api.accounts.update(account.id, accountData);
      dispatch({ type: "UPDATE_ACCOUNT", payload: result });
    } else {
      const result = await api.accounts.create(accountData);
      dispatch({ type: "ADD_ACCOUNT", payload: result });
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
                {account ? "Edit Account" : "Add New Account"}
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
                  Account Name
                </label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all pl-10 pr-4 py-2.5"
                    placeholder="e.g., Main Checking, Savings"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Account Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {accountTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, type: type.value })
                        }
                        className={cn(
                          "flex flex-col items-center gap-1 p-3 rounded-xl transition-all",
                          formData.type === type.value
                            ? "bg-primary/30 ring-2 ring-primary"
                            : "bg-muted hover:bg-accent"
                        )}
                      >
                        <Icon
                          className={cn(
                            "w-5 h-5",
                            formData.type === type.value
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        />
                        <span
                          className={cn(
                            "text-xs",
                            formData.type === type.value
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        >
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Balance
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.balance}
                    onChange={(e) =>
                      setFormData({ ...formData, balance: e.target.value })
                    }
                    className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all pl-10 pr-4 py-2.5"
                    placeholder="0.00"
                    required
                  />
                </div>
                {formData.type === "card" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Use negative value for outstanding balance
                  </p>
                )}
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
                        formData.color === color &&
                          "ring-2 ring-foreground ring-offset-2 ring-offset-background"
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
                  {account ? "Update Account" : "Add Account"}
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
