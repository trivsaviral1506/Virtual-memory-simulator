# Virtual Memory Optimization Simulator

A full-stack simulation tool designed to visualize and analyze Virtual Memory management techniques, specifically Page Replacement and Memory Allocation algorithms.

## 🚀 Features

### 1. Demand Paging Simulator
- **Algorithms**: FIFO, LRU, Optimal.
- **Visualization**: Step-by-step frame allocation table with hit/fault detection.
- **Analytics**: Page fault rate calculation and visual comparison charts.

### 2. Memory Allocation Simulator
- **Algorithms**: First Fit, Best Fit, Worst Fit.
- **Visualization**: Interactive memory map showing process placement within blocks.
- **Analysis**: Real-time calculation of Internal and External fragmentation.

## 🛠️ Technical Stack
- **Core Logic**: C Programming (Performance-oriented simulation)
- **Backend**: Node.js + Express (Process execution & API layer)
- **Frontend**: React + TypeScript + Tailwind CSS
- **Visualization**: Recharts & Framer Motion

## 📂 Project Structure
- `/c-simulator`: C source files for core algorithms.
- `/src/components`: React UI components.
- `/src/services`: Frontend API integration.
- `server.ts`: Express server that compiles and runs C code.

## 🛠️ Setup & Local Execution

1. **Prerequisites**: Ensure `gcc` (GNU Compiler Collection) and `Node.js` are installed.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Run Development Server**:
   ```bash
   npm run dev
   ```
4. **Access UI**: Open `http://localhost:3000` in your browser.

## 🧩 How it Works
1. The React frontend sends a simulation request to the Node.js backend.
2. The backend receives the parameters and invokes the `gcc` compiler on the corresponding C source file.
3. The resulting binary is executed with the user's parameters.
4. The C program outputs a JSON object containing every step of the simulation.
5. The backend returns this JSON to the frontend, which renders it using interactive tables and charts.

---
*Created as part of the Operating Systems (B.Tech CS) Project Series.*
