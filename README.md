# 🧠 Project Handover: CloudTable (Airtable-like Clone)

## Context

Development of a Middle+/Senior level test task.
**Goal:** Build a high-performance data grid capable of handling **50,000+ rows** with virtualization and realtime collaboration.

## 🏗 Infrastructure & Status

**Current State:** Backend is 100% complete. Frontend is initialized.

### 1. Backend (Completed)

- **Path:** `/server`
- **Tech:** Node.js (Fastify), PostgreSQL, Redis.
- **Features:**
  - **Auto-Seeding:** On startup, generates 50,000 rows (Faker.js) with 20 columns if DB is empty.
  - **API:**
    - `GET /rows`: Fetches all 50k rows. Optimized with **Gzip compression** (global setting). Tested & stable.
    - `PATCH /rows/:id`: Updates a row and emits a `row_update` event via Socket.io.
  - **Realtime:** Uses **Socket.io + Redis Adapter** to ensure scalability across multiple server nodes.

### 2. Infrastructure

- **Docker Compose:**
  - `postgres`: Port 5433 (mapped from 5432).
  - `redis`: Port 6379.
  - `server`: Port 4000.
  - `client`: Port 5173 (standard Vite).

### 3. Frontend (Initialized)

- **Path:** `/client`
- **Tech:** Vite + React + TypeScript.
- **Dependencies Installed:**
  - `@tanstack/react-table` (Headless UI)
  - `@tanstack/react-query` (State/Caching)
  - `@tanstack/react-virtual` (Virtualization)
  - `axios`, `socket.io-client`
  - `tailwindcss`, `clsx`

## 🚀 Next Steps (To-Do)

1.  **Tailwind Setup:** Initialize configuration (`npx tailwindcss init -p`) and add directives to CSS.
2.  **React Architecture:**
    - Setup `QueryClientProvider` in `main.tsx`.
    - Create `useRows` hook (fetch 50k rows).
    - Create `useRealtimeRows` hook (listen for `row_update` -> update QueryCache).
3.  **Grid Component:**
    - Implement **Virtualization** using `@tanstack/react-virtual` (fixed row height, e.g., 35px).
    - Integrate with `@tanstack/react-table`.
4.  **Editing:**
    - Implement Inline Editing (Text, Number, Select).
    - Implement **Optimistic Updates** (update UI immediately, then revert if server fails).

## ℹ️ Useful Details

- **API URL:** `http://localhost:4000`
- **Data Structure:**
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "status": "Active",
    "priority": "High",
    "budget": "1000.00",
    ...
  }
  ```
- **Row Count:** 50,000 (approx 3-4MB gzipped network transfer).
