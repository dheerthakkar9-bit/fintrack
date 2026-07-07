"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Wallet,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup";

export default function AuthForm() {
  const { dispatch } = useStore();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [success, setSuccess] = useState(false);

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    dispatch({
      type: "SET_USER",
      payload: {
        id: "user-1",
        name: email.split("@")[0],
        email,
        currency: "USD",
        theme: "dark",
      },
    });
    setSuccess(true);
  };

  const handleSocialLogin = (provider: string) => {
    dispatch({
      type: "SET_USER",
      payload: {
        id: "user-1",
        name: `${provider} User`,
        email: `user@${provider.toLowerCase()}.com`,
        currency: "USD",
        theme: "dark",
      },
    });
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-card p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 300, delay: 0.2 }}
            className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6"
          >
            <Wallet className="w-10 h-10 text-emerald-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome to FinTrack!
          </h2>
          <p className="text-muted-foreground">
            Your account has been created successfully. Start tracking your
            finances today.
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-4"
          >
            <Wallet className="w-8 h-8 text-foreground" />
          </motion.div>
          <h1 className="text-2xl font-bold">
            <span className="text-primary">FinTrack</span>
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Personal Finance Tracker
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex rounded-xl bg-muted p-1 mb-6">
          <button
            onClick={() => setMode("login")}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
              mode === "login"
                ? "bg-muted/80 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            className={cn(
              "flex-1 py-2 rounded-lg text-sm font-medium transition-colors",
              mode === "signup"
                ? "bg-muted/80 text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Sign Up
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === "login" ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: mode === "login" ? 20 : -20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Social Logins */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleSocialLogin("Google")}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-border hover:bg-muted transition-colors text-foreground"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => handleSocialLogin("Apple")}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-border hover:bg-muted transition-colors text-foreground"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Continue with Apple
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">or continue with email</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="you@example.com"
                    className={cn(
                      "w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all pl-10",
                      errors.email && "border-rose-500"
                    )}
                  />
                </div>
                {errors.email && (
                  <p className="text-rose-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={cn(
                      "w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all pl-10 pr-10",
                      errors.password && "border-rose-500"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-rose-400 text-xs mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {mode === "login" && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors w-full"
              >
                {mode === "login" ? "Login" : "Create Account"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          {mode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {mode === "login" ? "Sign up" : "Login"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
