import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

let _userCurrency = "USD";

export function setUserCurrency(currency: string) {
  _userCurrency = currency;
}

export function getUserCurrency() {
  return _userCurrency;
}

export function formatCurrency(amount: number, currency?: string): string {
  const cur = currency || _userCurrency;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: cur,
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string, style: "short" | "long" | "relative" = "short"): string {
  const d = new Date(date);
  if (style === "short") return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  if (style === "long") return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getMonthRange(date: Date = new Date()): { start: string; end: string } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return {
    start: start.toISOString().split("T")[0],
    end: end.toISOString().split("T")[0],
  };
}

export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export function calculateFinancialHealth(params: {
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  budgetAdherence: number;
  hasEmergencyFund: boolean;
  billPaymentRate: number;
}): number {
  let score = 0;
  if (params.savingsRate >= 20) score += 25;
  else if (params.savingsRate >= 10) score += 15;
  else if (params.savingsRate >= 5) score += 10;

  if (params.budgetAdherence <= 80) score += 25;
  else if (params.budgetAdherence <= 100) score += 15;
  else score += 5;

  if (params.hasEmergencyFund) score += 20;
  else score += 5;

  if (params.billPaymentRate >= 0.95) score += 20;
  else if (params.billPaymentRate >= 0.8) score += 12;
  else score += 5;

  if (params.totalIncome > 0) {
    const expenseRatio = params.totalExpenses / params.totalIncome;
    if (expenseRatio <= 0.5) score += 10;
    else if (expenseRatio <= 0.75) score += 5;
  }

  return Math.min(100, score);
}

export function getHealthColor(score: number): string {
  if (score >= 80) return "text-mint-500";
  if (score >= 60) return "text-brand-500";
  if (score >= 40) return "text-amber-500";
  return "text-red-500";
}

export function getHealthGradient(score: number): string {
  if (score >= 80) return "from-mint-400 to-mint-600";
  if (score >= 60) return "from-brand-400 to-brand-600";
  if (score >= 40) return "from-amber-400 to-amber-600";
  return "from-red-400 to-red-600";
}

export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((acc, item) => {
    const val = String(item[key]);
    (acc[val] = acc[val] || []).push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export function downloadCSV(data: Record<string, string | number>[], filename: string): void {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(","),
    ...data.map((row) => headers.map((h) => `"${row[h]}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadJSON(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
