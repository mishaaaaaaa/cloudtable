import React, { useRef } from "react";
import { useSearch } from "../../../../hooks/useSearch";
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TableSkeleton } from "../skeleton";
import { TableHeader } from "./header";
import { TableToolbar } from "./toolbar";
import { TableFooter } from "./footer";

import type { Row } from "../../../../types";
import type { ColumnDef } from "@tanstack/react-table";

interface TableProps {
  rows: Row[];
  columns: ColumnDef<Row>[];
  isLoading: boolean;
  onUpdateData: (rowIndex: number, columnId: string, value: unknown, rowId: number) => void;
}

export const Table: React.FC<TableProps> = ({ rows, columns, isLoading, onUpdateData }) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const { globalFilter, setGlobalFilter, getFilteredRowModel } = useSearch();

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel,
    meta: {
      updateData: (rowIndex, columnId, value, rowId) => {
        onUpdateData(rowIndex, String(columnId), value, rowId);
      },
    },
  });

  const { rows: tableRows } = table.getRowModel();

  // Airtable uses a very compact, fixed height header
  const HEADER_HEIGHT = 32;

  const rowVirtualizer = useVirtualizer({
    count: tableRows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 32, // Airtable standard row height
    overscan: 20,
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="flex flex-col h-screen w-full bg-white text-[13px] font-sans text-gray-900 overflow-hidden">
      <TableHeader />
      <TableToolbar globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />

      {/* Grid Container */}
      <div ref={parentRef} className="flex-1 overflow-auto bg-white relative">
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize() + HEADER_HEIGHT}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {/* Sticky Header Row */}
          <div
            className="flex sticky top-0 z-10 bg-[#f5f5f5] border-b border-gray-300 text-gray-500 font-semibold text-xs"
            style={{
              width: "fit-content",
              minWidth: "100%",
              height: `${HEADER_HEIGHT}px`,
            }}
          >
            {/* Header: Columns */}
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <div
                    key={header.id}
                    className="flex-shrink-0 border-r border-gray-300 px-2 flex items-center select-none hover:bg-gray-200 cursor-pointer group transition-colors"
                    style={{ width: header.getSize() }}
                  >
                    {/* Icon based on column type usually goes here */}
                    <span className="text-gray-400 mr-1.5 dark:text-gray-500">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </span>
                    <span className="truncate">{flexRender(header.column.columnDef.header, header.getContext())}</span>
                    <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                    <div
                      {...{
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className: `absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-blue-400 ${
                          header.column.getIsResizing() ? "bg-blue-500" : ""
                        }`,
                      }}
                    />
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
                className="absolute top-0 left-0 flex hover:bg-[#f8f8f8] group"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start + HEADER_HEIGHT}px)`,
                  width: "fit-content",
                  minWidth: "100%",
                }}
              >
                {/* Cells: Data */}
                {row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    className="flex-shrink-0 border-r border-b border-gray-200 px-2 flex items-center font-normal text-gray-900 bg-white group-hover:bg-[#f8f8f8] overflow-hidden whitespace-nowrap"
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

      <TableFooter recordCount={rows.length} />
    </div>
  );
};
