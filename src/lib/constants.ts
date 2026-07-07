import { Category, Account } from "./types";

export const INCOME_CATEGORIES: Category[] = [
  { id: "cat-salary", name: "Salary", icon: "Briefcase", color: "#10b981", type: "income", isCustom: false },
  { id: "cat-freelance", name: "Freelance", icon: "Code", color: "#6366f1", type: "income", isCustom: false },
  { id: "cat-investment", name: "Investment", icon: "TrendingUp", color: "#3b82f6", type: "income", isCustom: false },
  { id: "cat-business", name: "Business", icon: "Building2", color: "#8b5cf6", type: "income", isCustom: false },
  { id: "cat-rental", name: "Rental", icon: "Home", color: "#f59e0b", type: "income", isCustom: false },
  { id: "cat-gift-income", name: "Gift", icon: "Gift", color: "#ec4899", type: "income", isCustom: false },
  { id: "cat-other-income", name: "Other", icon: "Plus", color: "#64748b", type: "income", isCustom: false },
];

export const EXPENSE_CATEGORIES: Category[] = [
  { id: "cat-food", name: "Food & Dining", icon: "UtensilsCrossed", color: "#f97316", type: "expense", isCustom: false },
  { id: "cat-transport", name: "Transport", icon: "Car", color: "#3b82f6", type: "expense", isCustom: false },
  { id: "cat-shopping", name: "Shopping", icon: "ShoppingBag", color: "#ec4899", type: "expense", isCustom: false },
  { id: "cat-entertainment", name: "Entertainment", icon: "Clapperboard", color: "#8b5cf6", type: "expense", isCustom: false },
  { id: "cat-bills", name: "Bills & Utilities", icon: "Receipt", color: "#eab308", type: "expense", isCustom: false },
  { id: "cat-health", name: "Health", icon: "Heart", color: "#ef4444", type: "expense", isCustom: false },
  { id: "cat-education", name: "Education", icon: "GraduationCap", color: "#06b6d4", type: "expense", isCustom: false },
  { id: "cat-groceries", name: "Groceries", icon: "Apple", color: "#22c55e", type: "expense", isCustom: false },
  { id: "cat-rent", name: "Rent", icon: "Home", color: "#6366f1", type: "expense", isCustom: false },
  { id: "cat-insurance", name: "Insurance", icon: "Shield", color: "#14b8a6", type: "expense", isCustom: false },
  { id: "cat-travel", name: "Travel", icon: "Plane", color: "#0ea5e9", type: "expense", isCustom: false },
  { id: "cat-personal", name: "Personal Care", icon: "Sparkles", color: "#d946ef", type: "expense", isCustom: false },
  { id: "cat-pets", name: "Pets", icon: "Dog", color: "#a855f7", type: "expense", isCustom: false },
  { id: "cat-subscriptions", name: "Subscriptions", icon: "RefreshCw", color: "#f43f5e", type: "expense", isCustom: false },
  { id: "cat-other-expense", name: "Other", icon: "MoreHorizontal", color: "#64748b", type: "expense", isCustom: false },
];

export const ALL_CATEGORIES: Category[] = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

export const DEFAULT_ACCOUNTS: Account[] = [
  { id: "acc-main", name: "Main Checking", type: "bank", balance: 0, currency: "USD", color: "#3b82f6", icon: "Building" },
  { id: "acc-savings", name: "Savings", type: "bank", balance: 0, currency: "USD", color: "#10b981", icon: "PiggyBank" },
  { id: "acc-cash", name: "Cash", type: "cash", balance: 0, currency: "USD", color: "#f59e0b", icon: "Banknote" },
  { id: "acc-credit", name: "Credit Card", type: "card", balance: 0, currency: "USD", color: "#ef4444", icon: "CreditCard" },
  { id: "acc-upi", name: "Digital Wallet", type: "upi", balance: 0, currency: "USD", color: "#8b5cf6", icon: "Smartphone" },
];

export const CHART_COLORS = [
  "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6",
  "#ec4899", "#06b6d4", "#f97316", "#6366f1", "#14b8a6",
  "#a855f7", "#eab308", "#0ea5e9", "#f43f5e", "#22c55e",
];

export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", JPY: "¥", INR: "₹", CAD: "C$", AUD: "A$",
};

export const NAV_ITEMS = [
  { label: "Dashboard", href: "/", icon: "LayoutDashboard" },
  { label: "Transactions", href: "/transactions", icon: "ArrowLeftRight" },
  { label: "Analytics", href: "/analytics", icon: "BarChart3" },
  { label: "Budgets", href: "/budgets", icon: "Target" },
  { label: "Calendar", href: "/calendar", icon: "CalendarDays" },
  { label: "Bills", href: "/bills", icon: "Receipt" },
  { label: "Savings", href: "/savings", icon: "PiggyBank" },
  { label: "Accounts", href: "/accounts", icon: "Wallet" },
  { label: "Reports", href: "/reports", icon: "FileBarChart" },
  { label: "Settings", href: "/settings", icon: "Settings" },
  { label: "Install App", href: "/download", icon: "Download" },
];
