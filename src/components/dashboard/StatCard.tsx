"use client";

import { motion } from "framer-motion";
import { cn, formatCurrency } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number;
  format?: "currency" | "percent" | "number";
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean };
  color?: string;
  delay?: number;
}

export default function StatCard({ title, value, format = "currency", icon, trend, delay = 0 }: StatCardProps) {
  const displayValue = format === "currency" ? formatCurrency(value) : format === "percent" ? `${value.toFixed(1)}%` : value.toFixed(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="glass-card group"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold tracking-tight">{displayValue}</p>
          {trend && (
            <div className="flex items-center gap-1">
              <span className={cn("text-xs font-medium", trend.isPositive ? "text-emerald-500" : "text-red-500")}>
                {trend.isPositive ? "+" : ""}{trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">vs last month</span>
            </div>
          )}
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
