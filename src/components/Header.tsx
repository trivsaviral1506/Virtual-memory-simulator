import { Cpu } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-zinc-900 bg-zinc-950 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-center">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">
            <Cpu className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter uppercase">Virtual Memory Simulator</h1>
            <p className="text-[10px] text-zinc-600 font-mono text-center uppercase tracking-[0.2em] mt-0.5">Optimization Lab</p>
          </div>
        </div>
      </div>
    </header>
  );
}
