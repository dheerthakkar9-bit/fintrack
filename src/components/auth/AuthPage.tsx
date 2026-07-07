"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/lib/store";
import { api } from "@/lib/api-client";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  TrendingUp,
  Wallet,
  Shield,
} from "lucide-react";

type AuthMode = "login" | "signup";

export default function AuthPage() {
  const { dispatch, loadAllData } = useStore();
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (mode === "signup" && !name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email address";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});
    try {
      const { user, token } = mode === "signup"
        ? await api.auth.register(name, email, password)
        : await api.auth.login(email, password);

      api.token.set(token);
      dispatch({ type: "LOGIN", payload: { user, token } });
      await loadAllData();
    } catch (err: any) {
      setErrors({ general: err.message || "Authentication failed" });
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <TrendingUp className="w-5 h-5" />, title: "Smart Analytics", desc: "AI-powered insights into your spending" },
    { icon: <Wallet className="w-5 h-5" />, title: "Multi-Account", desc: "Track all your accounts in one place" },
    { icon: <Shield className="w-5 h-5" />, title: "Secure & Private", desc: "Your data stays on your device" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-white">FinanceApp</span>
          </div>

          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Track your finances<br />with clarity.
          </h1>
          <p className="text-lg text-white/70 max-w-md">
            A premium financial tracker designed with Apple-level attention to detail. Beautiful, fast, and private.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-white">
                {f.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{f.title}</p>
                <p className="text-sm text-white/60">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">FinanceApp</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-2xl font-semibold tracking-tight mb-1">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              {mode === "login"
                ? "Sign in to access your financial dashboard"
                : "Get started with your financial tracker"}
            </p>

            {errors.general && (
              <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {mode === "signup" && (
                  <motion.div
                    key="name"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <label className="text-sm font-medium mb-1.5 block">Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Alex Morgan"
                        className={cn(
                          "w-full rounded-lg border bg-muted/50 py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground outline-none transition-all focus:ring-1 focus:ring-ring/20",
                          errors.name ? "border-destructive focus:border-destructive" : "border-input focus:border-ring"
                        )}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={cn(
                      "w-full rounded-lg border bg-muted/50 py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground outline-none transition-all focus:ring-1 focus:ring-ring/20",
                      errors.email ? "border-destructive focus:border-destructive" : "border-input focus:border-ring"
                    )}
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(
                      "w-full rounded-lg border bg-muted/50 py-2.5 pl-10 pr-10 text-sm placeholder:text-muted-foreground outline-none transition-all focus:ring-1 focus:ring-ring/20",
                      errors.password ? "border-destructive focus:border-destructive" : "border-input focus:border-ring"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === "login" ? "Sign In" : "Create Account"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => { setMode(mode === "login" ? "signup" : "login"); setErrors({}); }}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
