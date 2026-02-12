import React from "react";
import type { Column } from "@tanstack/react-table";
import type { Row } from "@/features/table/types";
import { Select, type SelectOption } from "@/shared/ui/select";

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
      <div className="flex items-center gap-2">
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
