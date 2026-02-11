import { useMemo } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Row } from "../types";
import { BasicCell } from "../features/table/components/basic-cell";
import { DropdownCell } from "../features/table/components/dropdown-cell";

const STATUS_OPTIONS = ["Active", "Pending", "Blocked", "Archived"];
const PRIORITY_OPTIONS = ["High", "Medium", "Low"];

export const useColumnsData = () => {
  return useMemo<ColumnDef<Row>[]>(
    () => [
      { accessorKey: "id", header: "ID", size: 60 },
      {
        accessorKey: "name",
        header: "Name",
        size: 200,
        cell: BasicCell,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 120,
        cell: (context) => <DropdownCell {...context} options={STATUS_OPTIONS} />,
      },
      {
        accessorKey: "priority",
        header: "Priority",
        size: 100,
        cell: (context) => <DropdownCell {...context} options={PRIORITY_OPTIONS} />,
      },
      {
        accessorKey: "company",
        header: "Company",
        size: 200,
        cell: BasicCell,
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
};
