"use client";

import Sidebar from "@/components/layout/Sidebar";
import TopNavbar from "@/components/layout/TopNavbar";
import FloatingActionButton from "@/components/ui/FloatingActionButton";
import AIAssistant from "@/components/ai/AIAssistant";
import { useState } from "react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <TopNavbar onMenuToggle={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="min-h-full p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
      <FloatingActionButton />
      <AIAssistant />
    </div>
  );
}
