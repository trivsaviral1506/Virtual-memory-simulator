export interface PagingStep {
  page: number;
  is_fault: boolean;
  frames: (number | null)[];
}

export interface PagingResult {
  total_page_faults: number;
  steps: PagingStep[];
}

export interface AllocationBlock {
  id: number;
  size: number;
  remaining: number;
  allocated_to: number;
  internal_fragmentation: number;
}

export interface AllocationProcess {
  id: number;
  size: number;
  block_id: number;
}

export interface AllocationResult {
  blocks: AllocationBlock[];
  processes: AllocationProcess[];
  total_internal_fragmentation: number;
  total_external_fragmentation: number;
}

export interface PagingComparison {
  FIFO: number;
  LRU: number;
  OPTIMAL: number;
}

export const simulationService = {
  async simulatePaging(algo: string, frames: number, pages: number[]): Promise<PagingResult> {
    const response = await fetch("/api/simulate/paging", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ algo, frames, pages }),
    });
    if (!response.ok) throw new Error("Simulation failed");
    return response.json();
  },

  async comparePaging(frames: number, pages: number[]): Promise<PagingComparison> {
    const response = await fetch("/api/simulate/paging/compare", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frames, pages }),
    });
    if (!response.ok) throw new Error("Comparison failed");
    return response.json();
  },

  async simulateAllocation(algo: string, blocks: number[], processes: number[]): Promise<AllocationResult> {
    const response = await fetch("/api/simulate/allocation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ algo, blocks, processes }),
    });
    if (!response.ok) throw new Error("Simulation failed");
    return response.json();
  },
};
