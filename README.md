# Virtual Memory Optimization Simulator

[![Live Demo](https://img.shields.io/badge/🚀-Live%20Demo-blue?style=for-the-badge&logo=render&logoColor=white)](https://virtual-memory-simulator-9oho.onrender.com/)

---

## 📌 Quick Navigation

[![Project Description](https://img.shields.io/badge/📖-Project%20Description-blueviolet?style=for-the-badge)](#project-description)
[![Features](https://img.shields.io/badge/✨-Features-success?style=for-the-badge)](#features)
[![Technologies Used](https://img.shields.io/badge/🛠️-Technologies%20Used-orange?style=for-the-badge)](#technologies-used)
[![How to Run Locally](https://img.shields.io/badge/⚙️-How%20to%20Run%20Locally-critical?style=for-the-badge)](#how-to-run-locally)

---

## Project Description

The **Virtual Memory Optimization Simulator** is an educational and analytical tool designed to visualize the core concepts of Operating System memory management. Modern operating systems use virtual memory to allow processes to execute even when their entire address space isn't in physical RAM.

This project simulates how the CPU and Memory Management Unit (MMU) handle:
- **Demand Paging**: Loading pages into memory only when they are needed.
- **Page Replacement**: Deciding which page to evict when physical frames are full.
- **Memory Allocation**: Mapping processes to physical memory partitions using various placement strategies.

By providing a live, interactive visualization, users can compare different algorithms and understand the performance trade-offs, such as page faults and internal/external fragmentation.

---

## Features

- **Demand Paging Simulation**: Step-by-step visualization of page reference strings.
- **Replacement Algorithms**:
    - **FIFO** (First-In, First-Out)
    - **LRU** (Least Recently Used)
    - **Optimal** (Predictive replacement)
- **Memory Allocation Mappings**:
    - **First Fit**: Allocates the first block that is big enough.
    - **Best Fit**: Allocates the smallest block that fits perfectly.
    - **Worst Fit**: Allocates the largest available block.
- **Fragmentation Analysis**: Real-time calculation of internal and external fragmentation.
- **Performance Analytics**: Comparative bar charts showing total page faults for different strategies.
- **Hardware-Level UI**: A technical, dark-themed interface mimicking system monitors.

---

## Technologies Used

- **Frontend**: React 18, Vite, TypeScript.
- **Styling**: Tailwind CSS (Utility-first styling).
- **Animations**: Motion (formerly Framer Motion) for smooth state transitions.
- **Data Visualization**: Recharts for performance comparison metrics.
- **Icons**: Lucide React.
- **Backend**: Node.js/Express (serving as the simulation bridge).

---

## How to Run Locally

Follow these steps to get the simulator running on your machine:

### 1. Prerequisites
Ensure you have **Node.js** (v18+) and **npm** installed.

### 2. Clone the Repository
```bash
git clone <repository-url>
cd virtual-memory-simulator
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```

### 5. Access the App
Open your browser and navigate to `http://localhost:3000`.

---

## Implementation Details

The core logic of the simulation mimics the behavior of an OS kernel. The **Paging Module** maintains a frame array and calculates hits/faults based on the selected replacement stack. The **Allocation Module** maps a list of process sizes into defined memory partitions, tracking the used/free space down to the KB level to identify spatial inefficiencies.

---
© 2026 Virtual Memory Optimization Lab. Project for Operating Systems Analysis.
