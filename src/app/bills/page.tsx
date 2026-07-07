"use client";

import ProtectedPage from "@/components/ProtectedPage";
import AppShell from "@/components/layout/AppShell";
import BillCard from "@/components/bills/BillCard";
import BillForm from "@/components/bills/BillForm";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function BillsPage() {
  const { state } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editBill, setEditBill] = useState<null | typeof state.bills[0]>(null);

  const upcoming = state.bills.filter((b) => b.status === "upcoming");
  const paid = state.bills.filter((b) => b.status === "paid");

  return (
    <ProtectedPage>
      <AppShell>
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Bills & Recurring</h1>
              <p className="text-sm text-muted-foreground mt-0.5">Track your bills and recurring payments</p>
            </div>
            <button onClick={() => { setEditBill(null); setShowForm(true); }} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" /> Add Bill
            </button>
          </div>

          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground">Upcoming</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {upcoming.map((bill, i) => (
                <motion.div key={bill.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <BillCard bill={bill} onEdit={() => { setEditBill(bill); setShowForm(true); }} />
                </motion.div>
              ))}
            </div>
          </div>

          {paid.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground">Paid</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {paid.map((bill, i) => (
                  <motion.div key={bill.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                    <BillCard bill={bill} onEdit={() => { setEditBill(bill); setShowForm(true); }} />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          <BillForm bill={editBill} isOpen={showForm} onClose={() => { setShowForm(false); setEditBill(null); }} />
        </div>
      </AppShell>
    </ProtectedPage>
  );
}
