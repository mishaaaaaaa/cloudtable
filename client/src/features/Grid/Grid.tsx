import React, { useMemo, useRef, useState, useEffect } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRows, useUpdateRow } from "../../hooks/useRows";
import { useRealtime } from "../../hooks/useRealtime"; // Import realtime hook
import type { Row } from "../../types";
import type { ColumnDef, CellContext } from "@tanstack/react-table";

// --- Cell Components ---
const EditableTextCell = ({ getValue, row, column, table }: CellContext<Row, unknown>) => {
  const initialValue = getValue() as string;
  const [value, setValue] = useState(initialValue);

  // Sync internal state if external data changes (e.g. via socket)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const onBlur = () => {
    if (value !== initialValue) {
      table.options.meta?.updateData(row.index, column.id as keyof Row, value, row.original.id);
    }
  };

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={onBlur}
      className="w-full h-full bg-transparent outline-none px-1 py-1 focus:ring-2 focus:ring-blue-500 rounded-sm -ml-1"
    />
  );
};

const StatusCell = ({ getValue, row, column, table }: CellContext<Row, unknown>) => {
  const value = getValue() as string;
  return (
    <select
      value={value}
      onChange={(e) => table.options.meta?.updateData(row.index, column.id as keyof Row, e.target.value, row.original.id)}
      className="w-full h-full bg-transparent outline-none cursor-pointer"
    >
      <option value="Active">Active</option>
      <option value="Pending">Pending</option>
      <option value="Blocked">Blocked</option>
      <option value="Archived">Archived</option>
    </select>
  );
};

const PriorityCell = ({ getValue, row, column, table }: CellContext<Row, unknown>) => {
  const value = getValue() as string;
  return (
    <select
      value={value}
      onChange={(e) => table.options.meta?.updateData(row.index, column.id as keyof Row, e.target.value, row.original.id)}
      className="w-full h-full bg-transparent outline-none cursor-pointer"
    >
      <option value="High">High</option>
      <option value="Medium">Medium</option>
      <option value="Low">Low</option>
    </select>
  );
};

export const Grid: React.FC = () => {
  const { data: rows = [], isLoading } = useRows();
  useRealtime(); // Enable realtime sync
  const updateMutation = useUpdateRow();
  const parentRef = useRef<HTMLDivElement>(null);

  const columns = useMemo<ColumnDef<Row>[]>(
    () => [
      { accessorKey: "id", header: "ID", size: 60 },
      {
        accessorKey: "name",
        header: "Name",
        size: 200,
        cell: EditableTextCell,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 120,
        cell: StatusCell,
      },
      {
        accessorKey: "priority",
        header: "Priority",
        size: 100,
        cell: PriorityCell,
      },
      {
        accessorKey: "company",
        header: "Company",
        size: 200,
        cell: EditableTextCell,
      },
      { accessorKey: "title", header: "Title", size: 200 },
      { accessorKey: "email", header: "Email", size: 220 },
      { accessorKey: "phone", header: "Phone", size: 150 },
      { accessorKey: "estimated_value", header: "Value", size: 120 },
      { accessorKey: "category", header: "Category", size: 120 },
      { accessorKey: "rating", header: "Rating", size: 80 },
      { accessorKey: "city", header: "City", size: 150 },
      { accessorKey: "country", header: "Country", size: 150 },
      { accessorKey: "website", header: "Website", size: 200 },
      { accessorKey: "description", header: "Description", size: 300 },
    ],
    [],
  );

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    meta: {
      updateData: (rowIndex, columnId, value, rowId) => {
        // Optimistic update via React Query (handled in useRows hook)
        updateMutation.mutate({
          id: rowId,
          colId: columnId,
          value,
        });
      },
    },
  });

  const { rows: tableRows } = table.getRowModel();

  // Define explicit header height to offset rows
  const HEADER_HEIGHT = 30; // approx height of the header row

  const rowVirtualizer = useVirtualizer({
    count: tableRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35, // 35px row height
    overscan: 10,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-xl text-gray-500 animate-pulse">Loading 50,000 rows... (Downloading payload)</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white text-sm font-sans text-gray-900">
      {/* 1. App Header */}
      <div className="h-14 bg-[#f0404a] text-white flex items-center px-4 font-bold text-lg">CloudTable</div>

      {/* 2. Toolbar */}
      <div className="h-12 border-b border-gray-200 bg-white flex items-center px-4 gap-4 shadow-sm z-20">
        <div className="font-semibold text-gray-800 bg-gray-100 px-3 py-1 rounded cursor-pointer hover:bg-gray-200">Grid view</div>
        <div className="ml-auto">
          <button className="text-gray-500 hover:text-gray-900">Search</button>
        </div>
      </div>

      {/* 3. The Grid Container */}
      <div ref={parentRef} className="flex-1 overflow-auto bg-[#f5f5f5] relative">
        {/* Virtualizer Content Container */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize() + HEADER_HEIGHT}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {/* Sticky Header Row */}
          <div
            className="flex sticky top-0 z-10 shadow-sm bg-gray-100 border-b border-gray-300"
            style={{
              width: "fit-content",
              minWidth: "100%",
              height: `${HEADER_HEIGHT}px`,
              // Removed translateY, header stays at top
            }}
          >
            {/* Row Number Header */}
            <div className="w-12 flex-shrink-0 bg-gray-100 border-r border-gray-300 flex items-center justify-center">
              <input type="checkbox" className="rounded-sm border-gray-400" />
            </div>

            {/* Column Headers */}
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <div
                    key={header.id}
                    className="flex-shrink-0 bg-gray-100 border-r border-gray-300 px-2 py-1.5 text-xs font-semibold text-gray-500 select-none flex items-center hover:bg-gray-200 cursor-pointer"
                    style={{ width: header.getSize() }}
                  >
                    <span className="mr-1">📄</span>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>

          {/* Virtual Rows */}
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = tableRows[virtualRow.index];
            return (
              <div
                key={row.id}
                className="absolute top-0 left-0 flex border-b border-gray-200 bg-white hover:bg-gray-50 group"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start + HEADER_HEIGHT}px)`,
                  width: "fit-content",
                  minWidth: "100%",
                }}
              >
                {/* Row Number Cell */}
                <div className="w-12 flex-shrink-0 border-r border-gray-200 bg-gray-50 flex items-center justify-center text-xs text-gray-400 group-hover:bg-gray-100">
                  {virtualRow.index + 1}
                </div>

                {row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    className="flex-shrink-0 border-r border-gray-200 px-2 py-1.5 text-sm truncate flex items-center"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer / Status Bar */}
      <div className="h-8 border-t border-gray-200 bg-white flex items-center px-4 text-xs text-gray-500 justify-between z-20">
        <div>{rows.length.toLocaleString()} records</div>
        <div>All changes saved</div>
      </div>
    </div>
  );
};
