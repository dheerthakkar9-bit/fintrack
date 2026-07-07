"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  Briefcase,
  Code,
  TrendingUp,
  Building2,
  Home,
  Gift,
  Plus,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Clapperboard,
  Receipt,
  Heart,
  GraduationCap,
  Apple,
  Shield,
  Plane,
  Sparkles,
  Dog,
  RefreshCw,
  MoreHorizontal,
  Inbox,
  X,
  ChevronDown,
} from "lucide-react";
import TransactionForm from "./TransactionForm";
import { useStore } from "@/lib/store";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { Transaction, TransactionType, Category } from "@/lib/types";
import TransactionRow from "./TransactionRow";

const iconMap: Record<string, React.ComponentType<any>> = {
  Briefcase,
  Code,
  TrendingUp,
  Building2,
  Home,
  Gift,
  Plus,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Clapperboard,
  Receipt,
  Heart,
  GraduationCap,
  Apple,
  Shield,
  Plane,
  Sparkles,
  Dog,
  RefreshCw,
  MoreHorizontal,
};

type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

interface TransactionListProps {
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
  onAdd?: () => void;
}

export default function TransactionList({
  onEdit,
  onDelete,
  onAdd,
}: TransactionListProps) {
  const { state, dispatch, getCategoryById } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editTransaction, setEditTransaction] = useState<Transaction | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TransactionType | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const filteredTransactions = useMemo(() => {
    let transactions = [...state.transactions];

    if (search) {
      const lowerSearch = search.toLowerCase();
      transactions = transactions.filter(
        (t) =>
          t.description.toLowerCase().includes(lowerSearch) ||
          t.tags?.some((tag) => tag.toLowerCase().includes(lowerSearch))
      );
    }

    if (typeFilter !== "all") {
      transactions = transactions.filter((t) => t.type === typeFilter);
    }

    if (categoryFilter !== "all") {
      transactions = transactions.filter(
        (t) => t.categoryId === categoryFilter
      );
    }

    transactions.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "amount-desc":
          return b.amount - a.amount;
        case "amount-asc":
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return transactions;
  }, [state.transactions, search, typeFilter, categoryFilter, sortBy]);

  const categories = useMemo(() => {
    const filtered =
      typeFilter === "all"
        ? state.categories
        : state.categories.filter((c) => c.type === typeFilter);
    return filtered;
  }, [state.categories, typeFilter]);

  const sortLabels: Record<SortOption, string> = {
    "date-desc": "Date (Newest First)",
    "date-asc": "Date (Oldest First)",
    "amount-desc": "Amount (High to Low)",
    "amount-asc": "Amount (Low to High)",
  };

  const totalAmount = filteredTransactions.reduce(
    (sum, t) => (t.type === "income" ? sum + t.amount : sum - t.amount),
    0
  );

  const handleAdd = () => { if (onAdd) onAdd(); else { setEditTransaction(null); setShowForm(true); } };
  const handleEdit = (t: Transaction) => { if (onEdit) onEdit(t); else { setEditTransaction(t); setShowForm(true); } };
  const handleDelete = (id: string) => { if (onDelete) onDelete(id); else dispatch({ type: "DELETE_TRANSACTION" as const, payload: id }); };

  return (
    <>
    <TransactionForm transaction={editTransaction} isOpen={showForm} onClose={() => { setShowForm(false); setEditTransaction(null); }} />
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card rounded-2xl p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Transactions</h2>
          <p className="text-sm text-muted-foreground">
            {filteredTransactions.length} transactions •{" "}
            <span
              className={cn(
                "font-semibold",
                totalAmount >= 0 ? "text-emerald-500" : "text-red-500"
              )}
            >
              {formatCurrency(totalAmount)}
            </span>
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Transaction
        </motion.button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search transactions..."
          className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all w-full pl-10 pr-10 py-3 rounded-xl"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        {/* Type Tabs */}
        <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1">
          {(["all", "income", "expense"] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                setTypeFilter(type);
                setCategoryFilter("all");
              }}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                typeFilter === type
                  ? "bg-background shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {type === "all"
                ? "All"
                : type === "income"
                ? "Income"
                : "Expense"}
            </button>
          ))}
        </div>

        {/* Category Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowCategoryDropdown(!showCategoryDropdown);
              setShowSortDropdown(false);
            }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
              "border border-border hover:border-primary/50",
              categoryFilter !== "all"
                ? "bg-primary/10 text-primary border-primary/30"
                : "text-muted-foreground"
            )}
          >
            <SlidersHorizontal className="w-4 h-4" />
            {categoryFilter === "all"
              ? "All Categories"
              : getCategoryById(categoryFilter)?.name || "Category"}
            <ChevronDown className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {showCategoryDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
              >
                <div className="p-2 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => {
                      setCategoryFilter("all");
                      setShowCategoryDropdown(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                      categoryFilter === "all"
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted text-foreground"
                    )}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => {
                    const IconComponent = iconMap[cat.icon];
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setCategoryFilter(cat.id);
                          setShowCategoryDropdown(false);
                        }}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                          categoryFilter === cat.id
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted text-foreground"
                        )}
                      >
                        <span
                          className="flex items-center justify-center w-7 h-7 rounded-lg"
                          style={{ backgroundColor: cat.color + "20" }}
                        >
                          {IconComponent && (
                            <IconComponent
                              className="w-4 h-4"
                              style={{ color: cat.color }}
                            />
                          )}
                        </span>
                        {cat.name}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sort Dropdown */}
        <div className="relative ml-auto">
          <button
            onClick={() => {
              setShowSortDropdown(!showSortDropdown);
              setShowCategoryDropdown(false);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground border border-border hover:border-primary/50 transition-all"
          >
            <ArrowUpDown className="w-4 h-4" />
            Sort
            <ChevronDown className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {showSortDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
              >
                <div className="p-2">
                  {(
                    [
                      "date-desc",
                      "date-asc",
                      "amount-desc",
                      "amount-asc",
                    ] as SortOption[]
                  ).map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortBy(option);
                        setShowSortDropdown(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors",
                        sortBy === option
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted text-foreground"
                      )}
                    >
                      {sortLabels[option]}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-2">
        <AnimatePresence>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((transaction, index) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: "easeOut",
                }}
              >
                <TransactionRow
                  transaction={transaction}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                <Inbox className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No transactions found
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {search || typeFilter !== "all" || categoryFilter !== "all"
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "Start tracking your finances by adding your first transaction."}
              </p>
              {!search && typeFilter === "all" && categoryFilter === "all" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAdd}
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mt-6"
                >
                  <Plus className="w-4 h-4" />
                  Add Transaction
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
    </>
  );
}
