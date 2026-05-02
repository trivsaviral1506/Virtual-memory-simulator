import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

// Simulation Logic (Ported from C)
interface PagingStep {
  page: number;
  is_fault: boolean;
  frames: (number | null)[];
}
// this is the main part
interface PagingResult {
  total_page_faults: number;
  steps: PagingStep[];
}
// Simulates FIFO (First-In-First-Out) page replacement algorithm
function simulateFIFO(framesCount: number, referenceString: number[]): PagingResult {
  const frames: (number | null)[] = Array(framesCount).fill(null);
  const steps: PagingStep[] = [];
  let totalFaults = 0;
  let nextFrame = 0;

  for (const page of referenceString) {
    let isFault = false;
    if (!frames.includes(page)) {
      frames[nextFrame] = page;
      nextFrame = (nextFrame + 1) % framesCount;
      isFault = true;
      totalFaults++;
    }
    steps.push({ page, is_fault: isFault, frames: [...frames] });
  }
  return { total_page_faults: totalFaults, steps };
}

function simulateLRU(framesCount: number, referenceString: number[]): PagingResult {
  const frames: (number | null)[] = Array(framesCount).fill(null);
  const lastUsed = Array(framesCount).fill(-1);
  const steps: PagingStep[] = [];
  let totalFaults = 0;

  referenceString.forEach((page, i) => {
    let isFault = false;
    const existsIndex = frames.indexOf(page);

    if (existsIndex !== -1) {
      lastUsed[existsIndex] = i;
    } else {
      let victimIndex = frames.indexOf(null);
      if (victimIndex === -1) {
        victimIndex = lastUsed.indexOf(Math.min(...lastUsed));
      }
      frames[victimIndex] = page;
      lastUsed[victimIndex] = i;
      isFault = true;
      totalFaults++;
    }
    steps.push({ page, is_fault: isFault, frames: [...frames] });
  });
  return { total_page_faults: totalFaults, steps };
}

function simulateOptimal(framesCount: number, referenceString: number[]): PagingResult {
  const frames: (number | null)[] = Array(framesCount).fill(null);
  const steps: PagingStep[] = [];
  let totalFaults = 0;

  referenceString.forEach((page, i) => {
    let isFault = false;
    if (!frames.includes(page)) {
      let victimIndex = frames.indexOf(null);
      if (victimIndex === -1) {
        let furthest = -1;
        victimIndex = 0;
        for (let j = 0; j < frames.length; j++) {
          const nextUse = referenceString.slice(i + 1).indexOf(frames[j]!);
          if (nextUse === -1) {
            victimIndex = j;
            break;
          }
          if (nextUse > furthest) {
            furthest = nextUse;
            victimIndex = j;
          }
        }
      }
      frames[victimIndex] = page;
      isFault = true;
      totalFaults++;
    }
    steps.push({ page, is_fault: isFault, frames: [...frames] });
  });
  return { total_page_faults: totalFaults, steps };
}

// Memory Allocation
interface AllocBlock {
  id: number;
  size: number;
  remaining: number;
  allocated_to: number;
  internal_fragmentation: number;
}
interface AllocProcess {
  id: number;
  size: number;
  block_id: number;
}
interface AllocationResult {
  blocks: AllocBlock[];
  processes: AllocProcess[];
  total_internal_fragmentation: number;
  total_external_fragmentation: number;
}

function simulateAllocation(algo: string, initialBlocks: number[], processSizes: number[]): AllocationResult {
  const blocks: AllocBlock[] = initialBlocks.map((size, id) => ({
    id, size, remaining: size, allocated_to: -1, internal_fragmentation: 0
  }));
  const processes: AllocProcess[] = processSizes.map((size, id) => ({
    id, size, block_id: -1
  }));

  processes.forEach(proc => {
    let selectedIdx = -1;
    if (algo === "FIRST") {
      selectedIdx = blocks.findIndex(b => b.allocated_to === -1 && b.size >= proc.size);
    } else if (algo === "BEST") {
      blocks.forEach((b, i) => {
        if (b.allocated_to === -1 && b.size >= proc.size) {
          if (selectedIdx === -1 || b.size < blocks[selectedIdx].size) selectedIdx = i;
        }
      });
    } else if (algo === "WORST") {
      blocks.forEach((b, i) => {
        if (b.allocated_to === -1 && b.size >= proc.size) {
          if (selectedIdx === -1 || b.size > blocks[selectedIdx].size) selectedIdx = i;
        }
      });
    }

    if (selectedIdx !== -1) {
      blocks[selectedIdx].allocated_to = proc.id;
      blocks[selectedIdx].internal_fragmentation = blocks[selectedIdx].size - proc.size;
      proc.block_id = blocks[selectedIdx].id;
    }
  });

  const total_internal = blocks.reduce((acc, b) => acc + b.internal_fragmentation, 0);
  const total_external = blocks.filter(b => b.allocated_to === -1).reduce((acc, b) => acc + b.size, 0);

  return { blocks, processes, total_internal_fragmentation: total_internal, total_external_fragmentation: total_external };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/simulate/paging/compare", (req, res) => {
    const { frames, pages } = req.body;
    res.json({
      FIFO: simulateFIFO(frames, pages).total_page_faults,
      LRU: simulateLRU(frames, pages).total_page_faults,
      OPTIMAL: simulateOptimal(frames, pages).total_page_faults,
    });
  });

  app.post("/api/simulate/paging", (req, res) => {
    const { algo, frames, pages } = req.body;
    if (algo === "FIFO") res.json(simulateFIFO(frames, pages));
    else if (algo === "LRU") res.json(simulateLRU(frames, pages));
    else if (algo === "OPTIMAL") res.json(simulateOptimal(frames, pages));
    else res.status(400).json({ error: "Invalid algorithm" });
  });

  app.post("/api/simulate/allocation", (req, res) => {
    const { algo, blocks, processes } = req.body;
    res.json(simulateAllocation(algo, blocks, processes));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
