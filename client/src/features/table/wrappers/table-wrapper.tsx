import type { ReactNode } from "react";
import type React from "react";
import { TableSkeleton } from "../components/skeleton";
import { TableError } from "../components/error";

interface TableWrapperProps {
  isError: boolean;
  isLoading: boolean;
  children: ReactNode;
}

export const TableWrapper: React.FC<TableWrapperProps> = ({ isLoading, isError, children }) => {
  if (isLoading) return <TableSkeleton />;

  if (isError) return <TableError />;

  return children;
};
