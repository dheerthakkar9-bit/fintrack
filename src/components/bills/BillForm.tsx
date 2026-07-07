"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, DollarSign, Tag, FileText, Zap } from "lucide-react";
import { useStore } from "@/lib/store";
import { api } from "@/lib/api-client";
import { generateId } from "@/lib/utils";
import { Bill } from "@/lib/types";

interface BillFormProps {
  bill?: Bill | null;
  onClose: () => void;
  isOpen: boolean;
}

export default function BillForm({ bill, onClose, isOpen }: BillFormProps) {
  const { state, dispatch } = useStore();
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    categoryId: "",
    dueDate: "",
    frequency: "monthly" as Bill["frequency"],
    isAutoPay: false,
    notes: "",
  });

  useEffect(() => {
    if (bill) {
      setFormData({
        name: bill.name,
        amount: bill.amount.toString(),
        categoryId: bill.categoryId,
        dueDate: bill.dueDate.split("T")[0],
        frequency: bill.frequency,
        isAutoPay: bill.isAutoPay,
        notes: bill.notes || "",
      });
    } else {
      setFormData({
        name: "",
        amount: "",
        categoryId: "",
        dueDate: "",
        frequency: "monthly",
        isAutoPay: false,
        notes: "",
      });
    }
  }, [bill, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const billData: Bill = {
      id: bill?.id || generateId(),
      name: formData.name,
      amount: parseFloat(formData.amount),
      categoryId: formData.categoryId,
      dueDate: new Date(formData.dueDate).toISOString().split("T")[0],
      frequency: formData.frequency,
      status: bill?.status || "upcoming",
      isAutoPay: formData.isAutoPay,
      notes: formData.notes,
    };

    if (bill) {
      const result = await api.bills.update(bill.id, billData);
      dispatch({ type: "UPDATE_BILL", payload: result });
    } else {
      const result = await api.bills.create(billData);
      dispatch({ type: "ADD_BILL", payload: result });
    }

    onClose();
  };

  const frequencies: Bill["frequency"][] = [
    "daily",
    "weekly",
    "monthly",
    "yearly",
  ];

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
                {bill ? "Edit Bill" : "Add New Bill"}
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
                  Bill Name
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all pl-10 pr-4 py-2.5"
                    placeholder="e.g., Netflix, Electricity"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Amount
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all pl-10 pr-4 py-2.5"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Category
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <select
                    value={formData.categoryId}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryId: e.target.value })
                    }
                    className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all pl-10 pr-4 py-2.5"
                    required
                  >
                    <option value="">Select a category</option>
                    {state.categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Due Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all pl-10 pr-4 py-2.5"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Frequency
                </label>
                <select
                  value={formData.frequency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      frequency: e.target.value as Bill["frequency"],
                    })
                  }
                  className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all px-4 py-2.5"
                >
                  {frequencies.map((freq) => (
                    <option key={freq} value={freq}>
                      {freq.charAt(0).toUpperCase() +
                        freq.slice(1).replace("-", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-foreground">Auto-pay</span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, isAutoPay: !formData.isAutoPay })
                  }
                  className={cn(
                    "relative w-11 h-6 rounded-full transition-colors",
                    formData.isAutoPay ? "bg-blue-500" : "bg-muted"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1 left-1 w-4 h-4 bg-foreground rounded-full transition-transform",
                      formData.isAutoPay && "translate-x-5"
                    )}
                  />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all resize-none"
                  rows={2}
                  placeholder="Add any additional notes..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors flex-1 px-4 py-2.5"
                >
                  Cancel
                </button>
                <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex-1 px-4 py-2.5">
                  {bill ? "Update Bill" : "Add Bill"}
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
