import React, { useRef } from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { TableSkeleton } from "../skeleton";
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

  const table = useReactTable({
    data: rows,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
      {/* 1. App Header - Minimal red strip */}
      <div className="h-12 bg-[#d72b3f] flex items-center px-4 justify-between text-white shrink-0 z-30 relative">
        <div className="flex items-center gap-4">
          {/* Hamburger Icon */}
          <svg className="w-5 h-5 cursor-pointer opacity-80 hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="font-bold text-lg tracking-tight">CloudTable</span>
          <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium cursor-pointer hover:bg-white/30 transition-colors">Base</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/30 text-xs">🔔</div>
          <div className="w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white/20 cursor-pointer">
            MR
          </div>
        </div>
      </div>

      {/* 2. Toolbar - Airtable Style */}
      <div className="h-12 border-b border-gray-200 bg-white flex items-center px-4 gap-2 shrink-0 z-20 relative shadow-sm">
        <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors cursor-pointer font-medium">
          <span>Grid view</span>
          <svg className="w-3 h-3 ml-1 fill-current opacity-70" viewBox="0 0 24 24">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </div>
        <div className="h-5 w-[1px] bg-gray-300 mx-2"></div>

        {/* Tool Actions */}
        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1 px-2 py-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors font-medium">
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            <span>Filter</span>
          </button>
          <button className="flex items-center gap-1 px-2 py-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors font-medium">
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <span>Group</span>
          </button>
          <button className="flex items-center gap-1 px-2 py-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors font-medium">
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span>Sort</span>
          </button>
          <button className="flex items-center gap-1 px-2 py-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors font-medium">
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>Row height</span>
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center border border-transparent hover:border-gray-300 rounded px-2 py-1 transition-colors group">
            <svg className="w-4 h-4 text-gray-400 mr-1 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input placeholder="Find" className="bg-transparent outline-none text-[13px] w-24 placeholder-gray-400 focus:w-40 transition-all duration-200" />
          </div>
        </div>
      </div>

      {/* 3. The Grid Container */}
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
            {/* Header: Row Handle - REMOVED */}

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

            {/* Header: Add Column Placeholder - REMOVED */}
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
                {/* Cell: Row Handle - REMOVED */}

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

                {/* Spacer for 'add column' area - REMOVED */}
              </div>
            );
          })}
        </div>

        {/* 'Add row' at bottom of list (visual only for now) */}
        <div
          className="sticky left-0 w-full h-8 border-b border-gray-200 flex items-center px-2 cursor-pointer hover:bg-gray-50 text-gray-500 hover:text-gray-700 text-xs font-medium bg-white/80 backdrop-blur-sm z-10"
          style={{
            transform: `translateY(${rowVirtualizer.getTotalSize() + HEADER_HEIGHT}px)`,
            top: 0,
          }}
        >
          <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add record</span>
        </div>
      </div>

      {/* Footer / Status Bar - Minimal */}
      <div className="h-9 border-t border-gray-200 bg-white flex items-center px-4 text-xs text-gray-600 justify-between shrink-0 z-20">
        <div className="flex items-center gap-4">
          <div className="bg-white border border-gray-300 px-2 py-0.5 rounded text-[11px] font-medium shadow-sm">View 1</div>
          <div>{rows.length.toLocaleString()} records</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-[11px] uppercase tracking-wide text-gray-400 cursor-pointer hover:text-gray-600">Help</div>
          <div className="text-[11px] uppercase tracking-wide text-gray-400">Autosaved</div>
        </div>
      </div>
    </div>
  );
};
