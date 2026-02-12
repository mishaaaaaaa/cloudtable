# CloudTable

A high-performance data grid application capable of handling large datasets with realtime collaboration features. This project mimics core functionalities of Airtable.

## Quick Start

The entire environment (Frontend, Backend, Database, Redis) is containerized.

Here are steps to launch CloudTable

1. Check that the following ports are free on your machine:
   - `5173` (Frontend)
   - `4000` (Backend API)
   - `5433` (PostgreSQL)
   - `6379` (Redis)

2. Run the application (from cloudtable directory) :

   ```bash
   docker-compose up --build
   ```

3. Open your browser:
   - **Frontend:** http://localhost:5173
   - **Backend API:** http://localhost:4000 (don't need to open)

## Architecture Overview

### Backend

- **Node.js (Fastify):** Handles API requests.
- **PostgreSQL:** Primary database (seeds 50,000 rows on startup).
- **Redis:** Used as an adapter for Socket.io to support scaling across multiple nodes.
- **Socket.io:** Handles realtime bidirectional events (`row_update`).

### Frontend

The client is built with **React 19**, **TypeScript**, and **Vite**.

#### Folder Structure

The project follows a **Feature-Based Architecture**:

- `src/features/data-grid`: Contains all business logic specific to the grid (virtualization, data fetching, optimistic updates).
- `src/shared`: Contains reusable, domain-agnostic UI components.
  - **Example:** The `Select` component is located here to demonstrate how generic UI elements are decoupled from business logic.
- `src/api`: API clients and socket singleton configuration.

Aliases (`@/`) are configured to keep imports clean (e.g., `import { Icon } from "@/shared/ui/icons"`).

## Key Features & Implementation Details

### 1. Large Dataset Handling (Single Fetch)

- The application performs a **single fetch** of all 50,000 rows.
- **Virtualization:** Uses `@tanstack/react-virtual` to render only the visible rows in the DOM, maintaining scrolling performance despite the large dataset.
- **State Management:** Uses `@tanstack/react-query` with `staleTime: Infinity`. We do not refetch data automatically; instead, we rely on WebSocket events to keep the cache updated.

### 2. Realtime Collaboration

- **Singleton Socket Connection:** The socket connection is managed in a separate module to persist across component re-renders.
- **Optimistic Updates:** When a user edits a cell, the UI updates immediately. If the server request fails, the change is rolled back automatically.
- **Sync:** Updates from other users appear instantly via WebSocket events.

### 3. Behind the scope - what was not mentioned in the task, but i decided to add

- Implemented client-side filtering.
- Users can search globally or filter by specific columns.
- Search logic is memoized to prevent unnecessary recalculations during high-frequency updates.

### 4. Editing

- **Inline Editing:** Uses React Portals to render floating editors (Text, Number, Select) on top of the grid.
- **Input Validation:** Number fields use native input validation to ensure data integrity.

## Error Handling

- **Global Interceptors:** Axios interceptors catch API errors and display toast notifications to the user.
- **Mutation Rollbacks:** If an update fails, React Query reverts the local cache to the previous state to ensure data consistency.
- **UI States:** Dedicated Skeleton loaders and Error components are implemented for better UX.

## Limitations / Trade-offs

- **Horizontal Virtualization:** Currently, only vertical scrolling is virtualized. With 20 columns, this is performant, but for 50+ columns, horizontal virtualization would be added.
- **Sorting:** Client-side sorting is not currently implemented in the UI (though supported by the underlying data structure).
- **Mobile View:** The grid is optimized for desktop usage.

## Future Improvements

If I had more time, I would implement:

- **Column Sorting:** Add ability to sort rows by clicking on column headers (ascending/descending).
- **Horizontal Virtualization:** To support tables with hundreds of columns efficiently.
- **Backend Pagination:** Switch from single-fetch to cursor-based pagination for datasets exceeding 100k+ rows.
