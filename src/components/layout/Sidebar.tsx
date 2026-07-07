"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  Target,
  CalendarDays,
  Receipt,
  PiggyBank,
  Wallet,
  FileBarChart,
  Settings,
  X,
  CreditCard,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  Target,
  CalendarDays,
  Receipt,
  PiggyBank,
  Wallet,
  FileBarChart,
  Settings,
};

const NAV_ITEMS = [
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
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { state } = useStore();
  const { user } = state;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <CreditCard className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-semibold tracking-tight">FinanceApp</h1>
          <p className="text-[11px] text-muted-foreground">Premium Tracker</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto scrollbar-thin">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-150",
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-primary/10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <Icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">
              {user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex w-60 lg:w-64 flex-col border-r border-border bg-card/50 backdrop-blur-sm">
        {sidebarContent}
      </aside>

      {/* Mobile */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border md:hidden"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-accent text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
