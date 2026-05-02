import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { simulationService, AllocationResult } from "../services/simulationService";
import { Plus, Trash2, Database, Terminal, BarChart2, Info } from "lucide-react";
import { cn } from "../lib/utils";

export function AllocationSimulator() {
  const [algo, setAlgo] = useState("FIRST");
  const [blocks, setBlocks] = useState<number[]>([100, 500, 200, 300, 600]);
  const [processes, setProcesses] = useState<number[]>([212, 417, 112, 426]);
  const [result, setResult] = useState<AllocationResult | null>(null);
  const [comparisonResults, setComparisonResults] = useState<Record<string, AllocationResult> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    setBlocks([]);
    setProcesses([]);
    setResult(null);
    setComparisonResults(null);
  };

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const [res, first, best, worst] = await Promise.all([
        simulationService.simulateAllocation(algo, blocks, processes),
        simulationService.simulateAllocation("FIRST", blocks, processes),
        simulationService.simulateAllocation("BEST", blocks, processes),
        simulationService.simulateAllocation("WORST", blocks, processes)
      ]);
      setResult(res);
      setComparisonResults({ FIRST: first, BEST: best, WORST: worst });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addBlock = () => setBlocks([...blocks, 100]);
  const removeBlock = (index: number) => setBlocks(blocks.filter((_, i) => i !== index));
  const updateBlock = (index: number, val: number) => {
    const next = [...blocks];
    next[index] = isNaN(val) ? 0 : val;
    setBlocks(next);
  };

  const addProcess = () => setProcesses([...processes, 100]);
  const removeProcess = (index: number) => setProcesses(processes.filter((_, i) => i !== index));
  const updateProcess = (index: number, val: number) => {
    const next = [...processes];
    next[index] = isNaN(val) ? 0 : val;
    setProcesses(next);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start">
      {/* Configuration & Analytics Panel */}
      <div className="w-full lg:w-[380px] shrink-0 space-y-8">
        <div className="glass-card rounded-[2rem] p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-emerald-600 rounded-full" />
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">
                Environment
              </h3>
            </div>
            <div className="flex bg-zinc-950 p-1.5 rounded-xl border border-zinc-900 shadow-inner">
              {["FIRST", "BEST", "WORST"].map((a) => (
                <button
                  key={a}
                  onClick={() => setAlgo(a)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-[9px] font-black tracking-widest uppercase transition-all duration-300",
                    algo === a 
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                      : "text-zinc-600 hover:text-zinc-300"
                  )}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {/* Memory Blocks */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Partition Layout (KB)</label>
                <button onClick={addBlock} className="group p-2 bg-emerald-600/10 hover:bg-emerald-600/20 rounded-xl transition-colors">
                  <Plus className="w-3.5 h-3.5 text-emerald-500" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {blocks.map((b, i) => (
                  <div key={i} className="flex bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden focus-within:border-emerald-600/50 transition-all shadow-sm">
                    <input 
                      type="number" 
                      value={b} 
                      onChange={(e) => updateBlock(i, parseInt(e.target.value))}
                      className="w-full bg-transparent px-4 py-3 text-white font-mono text-xs outline-none"
                    />
                    <button onClick={() => removeBlock(i)} className="px-3 text-zinc-700 hover:text-red-500 hover:bg-red-500/5 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Processes */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Load Requests (KB)</label>
                <button onClick={addProcess} className="group p-2 bg-blue-600/10 hover:bg-blue-600/20 rounded-xl transition-colors">
                  <Plus className="w-3.5 h-3.5 text-blue-500" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {processes.map((p, i) => (
                  <div key={i} className="flex bg-zinc-950/50 border border-zinc-900 rounded-2xl overflow-hidden focus-within:border-emerald-600/50 transition-all shadow-sm">
                    <input 
                      type="number" 
                      value={p} 
                      onChange={(e) => updateProcess(i, parseInt(e.target.value))}
                      className="w-full bg-transparent px-4 py-3 text-white font-mono text-xs outline-none"
                    />
                    <button onClick={() => removeProcess(i)} className="px-3 text-zinc-700 hover:text-red-500 hover:bg-red-500/5 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleSimulate}
                disabled={loading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.97] disabled:bg-zinc-800 text-white font-black uppercase tracking-[0.2em] text-[10px] py-5 rounded-[1.5rem] transition-all shadow-[0_20px_40px_-15px_rgba(16,185,129,0.4)]"
              >
                {loading ? "Calculating..." : "Execute Physical Map"}
              </button>
              <button 
                onClick={handleReset}
                className="px-6 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded-[1.5rem] transition-all flex items-center justify-center transform active:scale-95"
                title="Reset Simulation"
              >
                <div className="flex flex-col items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-emerald-500" />
                  <span className="text-[8px] font-black uppercase tracking-tighter">CLR</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {comparisonResults && (
          <div className="glass-card rounded-[2rem] p-8 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2 mb-2">
              <BarChart2 className="w-4 h-4" /> Comparison Statistics
            </h3>
            <div className="space-y-4">
              {(Object.entries(comparisonResults) as [string, AllocationResult][]).map(([key, val]) => (
                <div key={key} className={cn(
                  "p-4 rounded-2xl border transition-all duration-500",
                  algo === key ? "bg-emerald-600/5 border-emerald-500/30 ring-4 ring-emerald-500/5" : "bg-zinc-950/30 border-zinc-900/50"
                )}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">{key} FIT</span>
                    <span className={cn("text-xs font-mono font-bold", algo === key ? "text-emerald-400" : "text-zinc-500")}>
                      {val.total_internal_fragmentation + val.total_external_fragmentation}KB LOSS
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[8px] font-black text-zinc-600 uppercase block mb-1">Internal</span>
                      <span className="text-xs font-bold text-orange-500/80">{val.total_internal_fragmentation}KB</span>
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-zinc-600 uppercase block mb-1">External</span>
                      <span className="text-xs font-bold text-red-500/80">{val.total_external_fragmentation}KB</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Spatial Visualization Area */}
      <div className="flex-1 w-full space-y-8">
        {!result ? (
          <div className="h-[700px] flex flex-col items-center justify-center glass-card rounded-[3rem] p-12 text-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-linear-to-b from-emerald-600/5 to-transparent pointer-events-none" />
             <div className="relative z-10">
              <div className="w-24 h-24 bg-zinc-950 border border-zinc-800 rounded-[2.5rem] flex items-center justify-center mb-8 mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500">
                <Database className="w-10 h-10 text-zinc-700" />
              </div>
              <h3 className="text-2xl font-black text-white mb-4 tracking-tighter">Physical Memory Unmapped</h3>
              <p className="text-zinc-500 max-w-sm mx-auto text-sm leading-relaxed font-medium">
                Define memory partitions and load requests to visualize hardware-level 
                spatial distribution and fragmentation patterns.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Terminal className="w-4 h-4" /> Physical Memory Distribution
              </h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-600 shadow-sm" /><span className="text-[9px] font-black text-zinc-500 uppercase pb-0.5">Used</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-600/30" /><span className="text-[9px] font-black text-zinc-500 uppercase pb-0.5">Frag</span></div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-800" /><span className="text-[9px] font-black text-zinc-500 uppercase pb-0.5">Free</span></div>
              </div>
            </div>
            
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {result.blocks.map((block, idx) => (
                  <motion.div 
                    key={`${algo}-${idx}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: idx * 0.05, ease: "circOut" }}
                    className="relative group h-20 glass-card rounded-[1.5rem] overflow-hidden border-zinc-800/30"
                  >
                    {/* Background Data Layers */}
                    {block.allocated_to !== -1 && (
                      <div className="absolute inset-0 flex transition-opacity duration-500 group-hover:opacity-80">
                        {/* Process Execution Fill */}
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(result.processes.find(p => p.id === block.allocated_to)!.size / block.size) * 100}%` }}
                          className="h-full bg-emerald-600/20 border-r border-emerald-400/20 z-0"
                          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        />
                        {/* Internal Entropy (Fragmentation) */}
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(block.internal_fragmentation / block.size) * 100}%` }}
                          className="h-full bg-orange-500/10 z-0"
                          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        />
                      </div>
                    )}

                    {/* Hardware Information Layer */}
                    <div className="absolute inset-0 z-10 flex items-center px-8 justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-24">
                          <span className="text-[8px] font-black text-zinc-600 block uppercase mb-1">Physical ADDR</span>
                          <span className="text-xs font-bold font-mono text-zinc-500">0x{(idx * 1024).toString(16).toUpperCase()}</span>
                        </div>
                        <div className="h-4 w-[1px] bg-zinc-800" />
                        <div>
                          <span className="text-[8px] font-black text-zinc-600 block uppercase mb-1">Partition Size</span>
                          <span className="text-base font-black text-white tracking-widest">{block.size}<span className="text-xs text-zinc-600 ml-1">KB</span></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-10">
                        {block.allocated_to !== -1 ? (
                          <div className="text-right">
                            <motion.div 
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="px-3 py-1 rounded-full bg-emerald-600/10 border border-emerald-500/20 text-[9px] font-black text-emerald-400 uppercase tracking-widest inline-block mb-1 shadow-sm"
                            >
                              Process {block.allocated_to}
                            </motion.div>
                            <span className="text-[10px] font-mono text-zinc-500 block">{result.processes.find(p => p.id === block.allocated_to)!.size}KB LOADED</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-end">
                            <div className="w-2 h-2 rounded-full border border-zinc-800 mb-1" />
                            <span className="text-[9px] font-black text-zinc-800 uppercase tracking-[0.25em]">Unassigned</span>
                          </div>
                        )}
                        
                        <div className="min-w-[100px] text-right">
                          {block.internal_fragmentation > 0 && (
                            <div className="space-y-1">
                              <span className="text-[8px] font-black text-orange-600/80 uppercase block">Spatial Loss</span>
                              <span className="text-xs font-bold font-mono text-orange-500">{block.internal_fragmentation}KB</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Error Mitigation Display */}
            <AnimatePresence>
              {result.processes.some(p => p.block_id === -1) && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-8 bg-red-600/5 border border-red-500/20 rounded-[2.5rem] flex items-start gap-6 shadow-xl shadow-red-900/5"
                >
                  <div className="p-3 bg-red-500/10 rounded-2xl">
                    <Info className="w-6 h-6 text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-red-100 tracking-tight">Allocation Integrity Warning</h4>
                    <p className="text-sm text-red-500/70 mt-2 leading-relaxed max-w-lg">
                      Hardware scheduler failed to map certain process requests. This is likely due to
                      {result.total_external_fragmentation > 0 ? " non-contiguous memory fragmentation " : " total exhaustion of physical partitions "}
                      preventing consistent page mapping.
                    </p>
                    <div className="flex gap-2 mt-4">
                      {result.processes.filter(p => p.block_id === -1).map(p => (
                        <div key={p.id} className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-lg text-xs font-black text-red-400">P-{p.id} ({p.size}K)</div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
