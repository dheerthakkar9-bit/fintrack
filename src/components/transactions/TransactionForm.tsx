"use client";

import { useState, useEffect, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Calendar, Tag, FileText, Wallet } from "lucide-react";
import { useStore } from "@/lib/store";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import { Transaction, TransactionType } from "@/lib/types";

interface TransactionFormProps {
  transaction?: Transaction | null;
  onClose: () => void;
  isOpen: boolean;
}

export default function TransactionForm({
  transaction,
  onClose,
  isOpen,
}: TransactionFormProps) {
  const { state, dispatch, getCategoryById, getAccountById } = useStore();

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [tags, setTags] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!transaction;

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      setCategoryId(transaction.categoryId);
      setAccountId(transaction.accountId);
      setDescription(transaction.description);
      setDate(new Date(transaction.date).toISOString().split("T")[0]);
      setTags(transaction.tags?.join(", ") || "");
    } else {
      resetForm();
    }
  }, [transaction, isOpen]);

  const resetForm = () => {
    setType("expense");
    setAmount("");
    setCategoryId("");
    setAccountId(state.accounts[0]?.id || "");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setTags("");
    setErrors({});
  };

  const filteredCategories = state.categories.filter(
    (c) => c.type === type
  );

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    if (!categoryId) {
      newErrors.categoryId = "Please select a category";
    }
    if (!accountId) {
      newErrors.accountId = "Please select an account";
    }
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const tagsArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    try {
      if (isEditing && transaction) {
        const updated = await api.transactions.update(transaction.id, {
          type,
          amount: parseFloat(amount),
          categoryId,
          accountId,
          description: description.trim(),
          date,
          tags: tagsArray,
        });
        dispatch({ type: "UPDATE_TRANSACTION", payload: updated });
      } else {
        const created = await api.transactions.create({
          type,
          amount: parseFloat(amount),
          categoryId,
          accountId,
          description: description.trim(),
          date,
          isRecurring: false,
          tags: tagsArray,
        });
        dispatch({ type: "ADD_TRANSACTION", payload: created });
      }

      resetForm();
      onClose();
    } catch (err: any) {
      setErrors({ general: err.message || "Failed to save transaction" });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg glass-card rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-bold text-foreground">
                {isEditing ? "Edit Transaction" : "Add Transaction"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Type Toggle */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Type
                </label>
                <div className="flex items-center gap-2 bg-muted/50 rounded-xl p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setType("income");
                      setCategoryId("");
                    }}
                    className={cn(
                      "flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all",
                      type === "income"
                        ? "bg-emerald-500 text-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setType("expense");
                      setCategoryId("");
                    }}
                    className={cn(
                      "flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all",
                      type === "expense"
                        ? "bg-red-500 text-foreground shadow-md"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Expense
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className={cn(
                      "w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all w-full pl-10 pr-4 py-3 rounded-xl",
                      errors.amount && "border-red-500 focus:ring-red-500"
                    )}
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-xs text-red-500">{errors.amount}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className={cn(
                    "w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all w-full px-4 py-3 rounded-xl appearance-none cursor-pointer",
                    errors.categoryId && "border-red-500 focus:ring-red-500"
                  )}
                >
                  <option value="">Select category</option>
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.categoryId}
                  </p>
                )}
              </div>

              {/* Account */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Account
                </label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <select
                    value={accountId}
                    onChange={(e) => setAccountId(e.target.value)}
                    className={cn(
                      "w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all w-full pl-10 pr-4 py-3 rounded-xl appearance-none cursor-pointer",
                      errors.accountId && "border-red-500 focus:ring-red-500"
                    )}
                  >
                    <option value="">Select account</option>
                    {state.accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.accountId && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.accountId}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What was this transaction for?"
                    className={cn(
                      "w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all w-full pl-10 pr-4 py-3 rounded-xl",
                      errors.description && "border-red-500 focus:ring-red-500"
                    )}
                  />
                </div>
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all w-full pl-10 pr-4 py-3 rounded-xl"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Tags{" "}
                  <span className="text-muted-foreground font-normal">
                    (comma separated)
                  </span>
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="e.g., food, monthly, recurring"
                    className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all w-full pl-10 pr-4 py-3 rounded-xl"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    onClose();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex-1 py-3 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex-1 py-3 rounded-xl font-semibold shadow-lg",
                    type === "income"
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
                      : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                  )}
                >
                  {isEditing ? "Update Transaction" : "Add Transaction"}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
