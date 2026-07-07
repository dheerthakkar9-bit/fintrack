"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Camera,
  Globe,
  Palette,
  Database,
  AlertTriangle,
  Info,
  Save,
  Trash2,
  Download,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { api } from "@/lib/api-client";
import { cn, downloadJSON } from "@/lib/utils";

const currencies = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "\u20ac", name: "Euro" },
  { code: "GBP", symbol: "\u00a3", name: "British Pound" },
  { code: "INR", symbol: "\u20b9", name: "Indian Rupee" },
];

const themes = ["light", "dark", "system"] as const;

export default function SettingsPanel() {
  const { state, dispatch } = useStore();

  const [name, setName] = useState(state.user?.name || "");
  const [email, setEmail] = useState(state.user?.email || "");
  const [currency, setCurrency] = useState(state.user?.currency || "USD");
  const [theme, setTheme] = useState<"light" | "dark" | "system">(
    state.user?.theme || "dark"
  );
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    dispatch({
      type: "SET_USER",
      payload: {
        ...state.user,
        name,
        email,
        currency,
        theme,
      },
    });
    try {
      await api.user.updateSettings({ name, email, currency, theme });
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const [exporting, setExporting] = useState(false);

  const handleExportAll = async () => {
    setExporting(true);
    try {
      const data = await api.export.all();
      const date = new Date().toISOString().split("T")[0];
      const folder = `fintrack-export-${date}`;

      const files: Record<string, unknown> = {
        "summary": data.summary,
        "users": data.users,
        "transactions": data.transactions,
        "categories": data.categories,
        "accounts": data.accounts,
        "budgets": data.budgets,
        "bills": data.bills,
        "savings-goals": data.savingsGoals,
      };

      for (const [name, content] of Object.entries(files)) {
        downloadJSON(content, `${folder}/${name}.json`);
        await new Promise((r) => setTimeout(r, 200));
      }
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setExporting(false);
    }
  };

  const handleReset = () => {
    dispatch({
      type: "SET_DATA",
      payload: {
        transactions: [],
        categories: state.categories,
        accounts: state.accounts.map(a => ({ ...a, balance: 0 })),
        budgets: [],
        bills: [],
        savingsGoals: [],
      },
    });
    setShowResetConfirm(false);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-3xl font-bold">
          <span className="text-primary">Settings</span>
        </h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </motion.div>

      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <User className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-foreground">Profile</h2>
        </div>

        <div className="flex items-start gap-6">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-foreground">
              {name ? name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera className="w-5 h-5 text-foreground" />
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all pl-10"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all pl-10"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Preferences Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Palette className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-foreground">Preferences</h2>
        </div>

        <div className="space-y-6">
          {/* Currency */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">
              Currency
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {currencies.map((cur) => (
                <button
                  key={cur.code}
                  onClick={() => setCurrency(cur.code)}
                  className={cn(
                    "p-3 rounded-xl border transition-all text-left",
                    currency === cur.code
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-border bg-muted/50"
                  )}
                >
                  <span className="text-lg font-bold text-foreground">
                    {cur.symbol}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {cur.code}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Theme</label>
            <div className="flex gap-2">
              {themes.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={cn(
                    "px-4 py-2 rounded-xl border transition-all capitalize",
                    theme === t
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border hover:border-border text-muted-foreground bg-muted/50"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <Database className="w-5 h-5 text-emerald-400" />
          <h2 className="text-lg font-semibold text-foreground">Data Management</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
            <div>
              <p className="text-foreground font-medium">Export All Data</p>
              <p className="text-sm text-muted-foreground">
                Download all your financial data as JSON
              </p>
            </div>
            <button onClick={handleExportAll} disabled={exporting} className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
              {exporting ? (
                <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              {exporting ? "Exporting..." : "Export"}
            </button>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
            <div>
              <p className="text-foreground font-medium">Reset All Data</p>
              <p className="text-sm text-muted-foreground">
                Delete all data and start fresh with sample data
              </p>
            </div>
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </motion.div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold text-foreground">About</h2>
        </div>
        <div className="space-y-2 text-sm">
          <p className="text-muted-foreground">
            <span className="text-foreground font-medium">FinTrack</span> — Personal
            Finance Tracker
          </p>
          <p className="text-muted-foreground">Version 1.0.0</p>
          <p className="text-muted-foreground">
            Built with Next.js 14, Tailwind CSS, and Framer Motion
          </p>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="flex justify-end"
      >
        <button onClick={handleSave} className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
          <Save className="w-4 h-4" />
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </motion.div>

      {/* Reset Confirmation Dialog */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Reset All Data?
                </h3>
              </div>
              <p className="text-muted-foreground mb-6">
                This will delete all your transactions, budgets, and accounts.
                Sample data will be restored. This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-rose-500 text-foreground hover:bg-rose-600 transition-colors"
                >
                  Reset Everything
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
