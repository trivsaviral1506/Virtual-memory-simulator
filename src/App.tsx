import React, { useState } from "react";
import { Header } from "./components/Header";
import { PagingSimulator } from "./components/PagingSimulator";
import { AllocationSimulator } from "./components/AllocationSimulator";
import { Layers, Activity } from "lucide-react";
import { cn } from "./lib/utils";
import { motion, AnimatePresence } from "motion/react";

type Tab = "paging" | "allocation";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("paging");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Tab switcher - Centered */}
        <div className="flex justify-center mb-16">
          <div className="flex gap-1 bg-zinc-900 border border-zinc-900 p-1.5 rounded-2xl shadow-2xl">
            <button 
              onClick={() => setActiveTab("paging")}
              className={cn(
                "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all duration-300",
                activeTab === "paging" ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" : "text-zinc-600 hover:text-zinc-400"
              )}
            >
              <Activity className="w-4 h-4" />
              Paging Logic
            </button>
            <button 
              onClick={() => setActiveTab("allocation")}
              className={cn(
                "px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all duration-300",
                activeTab === "allocation" ? "bg-emerald-600 text-white shadow-xl shadow-emerald-600/20" : "text-zinc-600 hover:text-zinc-400"
              )}
            >
              <Layers className="w-4 h-4" />
              Allocation Map
            </button>
          </div>
        </div>

        {/* Simulator Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {activeTab === "paging" ? <PagingSimulator /> : <AllocationSimulator />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
