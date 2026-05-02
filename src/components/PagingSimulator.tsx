import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { simulationService, PagingResult, PagingComparison } from "../services/simulationService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
import { Play, ChevronRight, BarChart3, ListFilter } from "lucide-react";
import { cn } from "../lib/utils";

export function PagingSimulator() {
  const [algo, setAlgo] = useState("FIFO");
  const [frames, setFrames] = useState(3);
  const [pageString, setPageString] = useState("7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1");
  const [result, setResult] = useState<PagingResult | null>(null);
  const [comparison, setComparison] = useState<PagingComparison | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);

  const handleSimulate = async () => {
    if (!pageString.trim()) return;
    setLoading(true);
    try {
      const pages = pageString.split(",").map((s) => parseInt(s.trim())).filter((n) => !isNaN(n));
      const [res, comp] = await Promise.all([
        simulationService.simulatePaging(algo, frames, pages),
        simulationService.comparePaging(frames, pages)
      ]);
      setResult(res);
      setComparison(comp);
      setCurrentStep(-1);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const performanceData = comparison ? [
    { name: "FIFO", value: comparison.FIFO },
    { name: "LRU", value: comparison.LRU },
    { name: "Optimal", value: comparison.OPTIMAL },
  ] : [];

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-[380px] shrink-0 space-y-8">
        <div className="glass-card rounded-[2rem] p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">
              Configuration
            </h3>
          </div>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">Replacement Strategy</label>
              <div className="flex flex-col gap-2">
                {["FIFO", "LRU", "OPTIMAL"].map((a) => (
                  <button
                    key={a}
                    onClick={() => setAlgo(a)}
                    className={cn(
                      "group flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-300",
                      algo === a 
                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20" 
                        : "bg-zinc-950/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                    )}
                  >
                    <span className="text-xs font-bold uppercase tracking-widest">{a}</span>
                    <ChevronRight className={cn("w-4 h-4 transition-transform", algo === a ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100")} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Physical Frames</label>
                <span className="text-xs font-mono font-bold text-blue-400">{frames}</span>
              </div>
              <input 
                type="range" 
                value={frames} 
                onChange={(e) => setFrames(parseInt(e.target.value))}
                min="1" max="10"
                className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-widest text-zinc-500 px-1">Reference String</label>
              <div className="relative group">
                <textarea 
                  value={pageString} 
                  onChange={(e) => setPageString(e.target.value)}
                  rows={4}
                  placeholder="7,0,1,2,0,3..."
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-2xl px-4 py-4 text-white focus:border-blue-600/50 focus:ring-4 focus:ring-blue-600/10 outline-none font-mono text-sm leading-relaxed transition-all"
                />
              </div>
            </div>

            <button 
              onClick={handleSimulate}
              disabled={loading || !pageString.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.97] disabled:bg-zinc-800 text-white font-black uppercase tracking-[0.2em] text-[10px] py-5 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-[0_20px_40px_-15px_rgba(37,99,235,0.4)]"
            >
              {loading ? "Processing..." : "Compute Simulation"}
              {!loading && <Play className="w-3 h-3 fill-current" />}
            </button>
          </div>
        </div>

        {comparison && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-[2rem] p-8"
          >
            <div className="flex items-center gap-3 mb-8">
              <BarChart3 className="w-4 h-4 text-zinc-500" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Performance Map
              </h3>
            </div>
            
            <div className="h-44 w-full mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#52525b" fontSize={9} axisLine={false} tickLine={false} dy={10} />
                  <YAxis stroke="#52525b" fontSize={9} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#ffffff05' }}
                    contentStyle={{ backgroundColor: "#09090b", border: "1px solid #27272a", borderRadius: "12px", padding: "12px" }}
                    itemStyle={{ color: "#fff", fontSize: "10px", fontWeight: "bold" }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={32}>
                    {performanceData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.name === algo ? "#3b82f6" : "#27272a"} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              {performanceData.map((d) => (
                <div key={d.name} className={cn(
                  "flex justify-between items-center p-3 rounded-xl border transition-all",
                  d.name === algo ? "bg-blue-600/5 border-blue-600/30" : "bg-zinc-950/30 border-zinc-900/50"
                )}>
                  <span className="text-[10px] font-black text-zinc-500 tracking-widest">{d.name}</span>
                  <span className={cn("text-xs font-bold font-mono", d.name === algo ? "text-blue-400" : "text-zinc-300")}>
                    {d.value} FAULTS
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Main Visualization Viewport */}
      <div className="flex-1 w-full space-y-8">
        {!result ? (
          <div className="h-[700px] flex flex-col items-center justify-center glass-card rounded-[3rem] p-12 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-linear-to-b from-blue-600/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="w-24 h-24 bg-zinc-950 border border-zinc-800 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <ListFilter className="w-10 h-10 text-zinc-700" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 tracking-tighter">Analysis Terminal Ready</h3>
              <p className="text-zinc-500 max-w-sm mx-auto text-sm leading-relaxed font-medium">
                Adjust parameters in the sidebar to visualize frame transitions and memory efficiency.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Realtime Hero Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: "Memory Requests", val: result.steps.length, color: "text-white" },
                { label: "Fault Occurrence", val: result.total_page_faults, color: "text-red-500" },
                { label: "V-Mem Efficiency", val: (((result.steps.length - result.total_page_faults) / result.steps.length) * 100).toFixed(1) + "%", color: "text-emerald-500" }
              ].map((s, i) => (
                <div key={i} className="glass-card rounded-3xl p-6 border-zinc-800/30">
                  <span className="text-[10px] font-black font-mono text-zinc-500 uppercase tracking-widest mb-3 block">{s.label}</span>
                  <p className={cn("text-3xl font-black tracking-tighter", s.color)}>{s.val}</p>
                </div>
              ))}
            </div>

            {/* Main Data Table */}
            <div className="glass-card rounded-[3rem] overflow-hidden border-zinc-800/30">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-950/40 border-b border-zinc-800/50">
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Node</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Incoming</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Frame Registers</th>
                      <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900/40">
                    {result.steps.map((step, idx) => (
                      <motion.tr 
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.02 }}
                        className={cn(
                          "transition-colors relative group",
                          currentStep === idx ? "bg-blue-600/[0.03]" : "hover:bg-white/[0.01]"
                        )}
                        onMouseEnter={() => setCurrentStep(idx)}
                        onMouseLeave={() => setCurrentStep(-1)}
                      >
                        <td className="px-8 py-6">
                          <span className="text-[10px] font-mono font-bold text-zinc-700 tracking-tighter">0X{(idx * 4096).toString(16).toUpperCase()}</span>
                        </td>
                        <td className="px-8 py-6">
                          <div className={cn(
                            "w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm",
                            step.is_fault ? "bg-red-500/5 text-red-500 border border-red-500/10" : "bg-emerald-500/5 text-emerald-500 border border-emerald-500/10"
                          )}>
                            {step.page}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex gap-3">
                            {step.frames.map((f, fidx) => (
                              <motion.div 
                                key={fidx}
                                layout
                                className={cn(
                                  "w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs border transition-all duration-300",
                                  f === null ? "bg-zinc-950/20 border-zinc-900/50 text-zinc-800" : 
                                  f === step.page && step.is_fault ? "bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-600/30 ring-4 ring-blue-600/10" :
                                  "bg-zinc-900 border-zinc-800 text-zinc-300 group-hover:border-zinc-700"
                                )}
                              >
                                {f === null ? "" : f}
                              </motion.div>
                            ))}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <AnimatePresence mode="wait">
                            <motion.div 
                              key={step.is_fault ? 'fault' : 'hit'}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className={cn(
                                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                                step.is_fault ? "bg-red-500/5 text-red-500 border border-red-500/10" : "bg-emerald-500/5 text-emerald-500 border border-emerald-500/10"
                              )}
                            >
                              <div className={cn("w-1.5 h-1.5 rounded-full", step.is_fault ? "bg-red-500 animate-pulse" : "bg-emerald-500")} />
                              {step.is_fault ? "Fault" : "Hit"}
                            </motion.div>
                          </AnimatePresence>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
