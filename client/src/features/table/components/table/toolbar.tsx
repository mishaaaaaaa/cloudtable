import React from "react";
import type { Column } from "@tanstack/react-table";
import type { Row } from "../../../../types";
import { Select } from "../ui/select";
import type { SelectOption } from "../ui/select";

interface TableToolbarProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  searchColumn: string;
  setSearchColumn: (value: string) => void;
  columns: Column<Row, unknown>[];
}

export const TableToolbar: React.FC<TableToolbarProps> = ({ searchValue, setSearchValue, searchColumn, setSearchColumn, columns }) => {
  const getColumnLabel = (colId: string) => {
    if (colId === "all") return "All columns";
    const col = columns.find((c) => c.id === colId);
    return (col?.columnDef.header as string) || colId;
  };

  const getSelectOptions = (): SelectOption[] => {
    const options: SelectOption[] = [{ value: "all", label: "All columns" }];

    columns.forEach((col) => {
      const header = typeof col.columnDef.header === "string" ? col.columnDef.header : col.id;
      options.push({ value: col.id, label: header });
    });

    return options;
  };

  return (
    <div className="h-12 border-b border-gray-200 bg-white flex items-center px-4 gap-2 shrink-0 z-20 relative shadow-sm">
      {/* <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors cursor-pointer font-medium">
        <span>Grid view</span>
        <svg className="w-3 h-3 ml-1 fill-current opacity-70" viewBox="0 0 24 24">
          <path d="M7 10l5 5 5-5z" />
        </svg>
      </div>
      <div className="h-5 w-[1px] bg-gray-300 mx-2"></div> */}

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
        <Select
          value={searchColumn}
          onChange={setSearchColumn}
          options={getSelectOptions()}
          className="relative"
          align="right"
          renderTrigger={() => (
            <div className="flex items-center gap-1.5 px-2 py-1 text-[13px] text-gray-600 hover:bg-gray-100 rounded transition-colors border border-transparent hover:border-gray-200 h-[26px]">
              <span className="text-gray-500">Search in:</span>
              <span className="font-medium text-gray-800">{getColumnLabel(searchColumn)}</span>
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          )}
        />
        <div className="flex items-center border border-transparent hover:border-gray-300 rounded px-2 py-1 transition-colors group">
          <svg className="w-4 h-4 text-gray-400 mr-1 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            key="search-input"
            type="text"
            placeholder="Find"
            value={searchValue || ""}
            onChange={(e) => setSearchValue(e.target.value)}
            className="bg-transparent outline-none text-[13px] w-24 placeholder-gray-400 focus:w-40 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
};
