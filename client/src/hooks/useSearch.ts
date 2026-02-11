import { useState } from "react";
import { getFilteredRowModel } from "@tanstack/react-table";

export const useSearch = () => {
  const [globalFilter, setGlobalFilter] = useState("");

  return {
    globalFilter,
    setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
  };
};
