"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, DollarSign } from "lucide-react";
import { useStore } from "@/lib/store";
import { generateId } from "@/lib/utils";

export default function FloatingActionButton() {
  const [open, setOpen] = useState(false);
  const { state, dispatch } = useStore();
  const { categories, accounts } = state;

  const [form, setForm] = useState({
    type: "expense" as "income" | "expense",
    amount: "",
    categoryId: "",
    accountId: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: "ADD_TRANSACTION",
      payload: {
        id: generateId(),
        type: form.type,
        amount: parseFloat(form.amount),
        categoryId: form.categoryId,
        accountId: form.accountId,
        description: form.description,
        date: form.date,
        isRecurring: false,
        tags: [],
        createdAt: new Date().toISOString(),
      },
    });
    setForm({
      type: "expense",
      amount: "",
      categoryId: "",
      accountId: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    setOpen(false);
  };

  return (
    <>
      <motion.button
        onClick={() => setOpen(true)}
        className="fab"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.5,
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Plus className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-lg sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2"
            >
              <div className="glass-card rounded-2xl p-6 shadow-2xl">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                      <DollarSign className="h-5 w-5 text-foreground" />
                    </div>
                    <h2 className="text-lg font-semibold text-foreground">
                      New Transaction
                    </h2>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setForm((p) => ({ ...p, type: "expense" }))
                      }
                      className={`rounded-xl border-2 py-2.5 text-sm font-medium transition-all ${
                        form.type === "expense"
                          ? "border-red-500 bg-red-500/10 text-red-500"
                          : "border-border text-muted-foreground hover:border-border"
                      }`}
                    >
                      Expense
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setForm((p) => ({ ...p, type: "income" }))
                      }
                      className={`rounded-xl border-2 py-2.5 text-sm font-medium transition-all ${
                        form.type === "income"
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-500"
                          : "border-border text-muted-foreground hover:border-border"
                      }`}
                    >
                      Income
                    </button>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        required
                        className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all pl-8 pr-4"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Category
                      </label>
                      <select
                        name="categoryId"
                        value={form.categoryId}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all"
                      >
                        <option value="">Select</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-foreground">
                        Account
                      </label>
                      <select
                        name="accountId"
                        value={form.accountId}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all"
                      >
                        <option value="">Select</option>
                        {accounts.map((acc) => (
                          <option key={acc.id} value={acc.id}>
                            {acc.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      placeholder="What was this for?"
                      className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      Date
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                      className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-3 text-sm font-semibold text-foreground shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/30"
                  >
                    Add Transaction
                  </motion.button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
