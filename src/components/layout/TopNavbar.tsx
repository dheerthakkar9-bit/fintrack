"use client";

import { Menu, Search, Sun, Moon, Bell } from "lucide-react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

interface TopNavbarProps {
  onMenuToggle: () => void;
}

export default function TopNavbar({ onMenuToggle }: TopNavbarProps) {
  const { state, dispatch } = useStore();
  const theme = state.user.theme;

  const toggleTheme = () => {
    dispatch({
      type: "SET_THEME",
      payload: theme === "dark" ? "light" : "dark",
    });
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors md:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search transactions..."
              className="w-full rounded-lg border border-input bg-muted/50 py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground outline-none focus:border-ring focus:ring-1 focus:ring-ring/20 transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </button>

          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>

          <div className="ml-1 hidden sm:flex items-center gap-3 pl-3 border-l border-border">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-xs font-medium text-primary">
                {state.user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
