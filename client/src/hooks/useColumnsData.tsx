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
      { accessorKey: "title", header: "Title", size: 200, cell: BasicCell },
      { accessorKey: "email", header: "Email", size: 220, cell: BasicCell },
      { accessorKey: "phone", header: "Phone", size: 150, cell: BasicCell },
      { accessorKey: "estimated_value", header: "Value", size: 120, cell: BasicCell },
      { accessorKey: "budget", header: "Budget", size: 120, cell: BasicCell },
      { accessorKey: "expenses", header: "Expenses", size: 120, cell: BasicCell },
      { accessorKey: "category", header: "Category", size: 120, cell: BasicCell },
      { accessorKey: "rating", header: "Rating", size: 80, cell: BasicCell },
      { accessorKey: "address", header: "Address", size: 200, cell: BasicCell },
      { accessorKey: "city", header: "City", size: 150, cell: BasicCell },
      { accessorKey: "country", header: "Country", size: 150, cell: BasicCell },
      { accessorKey: "zip_code", header: "Zip Code", size: 100, cell: BasicCell },
      { accessorKey: "website", header: "Website", size: 200, cell: BasicCell },
      { accessorKey: "notes", header: "Notes", size: 250, cell: BasicCell },
      { accessorKey: "description", header: "Description", size: 300, cell: BasicCell },
      {
        accessorKey: "created_at",
        header: "Created",
        size: 150,
        cell: ({ getValue }) => {
          const value = getValue() as string;
          if (!value) return "";
          return new Date(value).toLocaleString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        },
      },
      {
        accessorKey: "updated_at",
        header: "Updated",
        size: 150,
        cell: ({ getValue }) => {
          const value = getValue() as string;
          if (!value) return "";
          return new Date(value).toLocaleString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
        },
      },
    ],
    [],
  );
};
