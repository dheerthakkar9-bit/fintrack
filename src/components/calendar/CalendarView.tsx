"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { getDaysInMonth, formatCurrency, formatDate } from "@/lib/utils";
import { Transaction } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameMonth,
} from "date-fns";

export default function CalendarView() {
  const { state } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const calendarDays = useMemo(() => {
    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [currentDate]);

  const transactionsByDate = useMemo(() => {
    const map: Record<string, Transaction[]> = {};
    state.transactions.forEach((t) => {
      const dateKey = format(new Date(t.date), "yyyy-MM-dd");
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push(t);
    });
    return map;
  }, [state.transactions]);

  const selectedDayTransactions = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    return transactionsByDate[dateKey] || [];
  }, [selectedDate, transactionsByDate]);

  const selectedDayTotals = useMemo(() => {
    const income = selectedDayTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = selectedDayTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense };
  }, [selectedDayTransactions]);

  const getDayTransactions = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return transactionsByDate[dateKey] || [];
  };

  const getDayTotals = (date: Date) => {
    const dayTransactions = getDayTransactions(date);
    const income = dayTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = dayTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return { income, expense };
  };

  const getCategoryById = (id: string) => {
    return state.categories.find((c) => c.id === id);
  };

  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="glass-card rounded-2xl p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors p-2">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-xl font-bold text-foreground min-w-[160px] text-center">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <button onClick={nextMonth} className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors p-2">
            <ChevronRight size={20} />
          </button>
        </div>
        <button
          onClick={goToToday}
          className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors px-3 py-1.5"
        >
          Today
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-border rounded-xl overflow-hidden">
        {weekDays.map((day) => (
          <div
            key={day}
            className="bg-muted/50 py-2 text-center text-sm font-medium text-muted-foreground"
          >
            {day}
          </div>
        ))}

        {calendarDays.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const dayTransactions = getDayTransactions(day);
          const { income, expense } = getDayTotals(day);
          const hasTransactions = dayTransactions.length > 0;

          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedDate(day)}
              className={`
                relative min-h-[80px] md:min-h-[100px] p-2 cursor-pointer transition-colors
                ${isCurrentMonth ? "bg-card" : "bg-muted/30"}
                ${isSelected ? "ring-2 ring-primary" : ""}
                ${isTodayDate && !isSelected ? "bg-primary/10" : ""}
              `}
            >
              <div className="flex items-start justify-between">
                <span
                  className={`
                    text-sm font-medium
                    ${!isCurrentMonth ? "text-muted-foreground" : "text-foreground"}
                    ${isTodayDate ? "text-primary font-bold" : ""}
                  `}
                >
                  {format(day, "d")}
                </span>
                {isTodayDate && (
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                )}
              </div>

              {hasTransactions && isCurrentMonth && (
                <div className="mt-1 space-y-1">
                  <div className="flex gap-0.5 flex-wrap">
                    {dayTransactions.slice(0, 3).map((t, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${
                          t.type === "income" ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                    ))}
                    {dayTransactions.length > 3 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{dayTransactions.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {expense > 0 && (
                      <span className="text-red-400">-{formatCurrency(expense)}</span>
                    )}
                    {income > 0 && (
                      <span className="text-green-400 ml-1">+{formatCurrency(income)}</span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 font-medium text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors p-2"
              >
                <X size={18} />
              </button>
            </div>

            {(selectedDayTotals.income > 0 || selectedDayTotals.expense > 0) && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-green-500/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-400 text-sm mb-1">
                    <ArrowUpRight size={16} />
                    Income
                  </div>
                  <p className="text-lg font-bold text-green-400">
                    {formatCurrency(selectedDayTotals.income)}
                  </p>
                </div>
                <div className="bg-red-500/10 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-400 text-sm mb-1">
                    <ArrowDownRight size={16} />
                    Expenses
                  </div>
                  <p className="text-lg font-bold text-red-400">
                    {formatCurrency(selectedDayTotals.expense)}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {selectedDayTransactions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No transactions on this day
                </p>
              ) : (
                selectedDayTransactions.map((transaction) => {
                  const category = getCategoryById(transaction.categoryId);
                  return (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: category?.color + "20" }}
                      >
                        <span className="text-lg">{category?.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-foreground font-medium truncate">
                          {transaction.description}
                        </p>
                        <p className="text-sm text-muted-foreground">{category?.name}</p>
                      </div>
                      <div className="text-right">
                        <p
                          className={`font-semibold ${
                            transaction.type === "income"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatCurrency(transaction.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(transaction.date), "h:mm a")}
                        </p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
