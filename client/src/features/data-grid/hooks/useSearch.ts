import { useState, useMemo } from "react";
import { getFilteredRowModel, type ColumnFiltersState } from "@tanstack/react-table";

export const useSearch = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchColumn, setSearchColumn] = useState("all");

  const columnFilters = useMemo<ColumnFiltersState>(() => {
    if (searchColumn === "all") return [];
    return [{ id: searchColumn, value: searchValue }];
  }, [searchColumn, searchValue]);

  return {
    searchValue,
    setSearchValue,
    searchColumn,
    setSearchColumn,
    globalFilter: searchColumn === "all" ? searchValue : undefined,
    columnFilters,
    getFilteredRowModel: getFilteredRowModel(),
  };
};
