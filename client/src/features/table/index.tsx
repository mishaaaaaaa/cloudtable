import React, { useCallback } from "react";
import { useRowsData, useUpdateRow } from "@/features/table/hooks/useRowsData";
import { useColumnsData } from "@/features/table/hooks/useColumnsData";
import { useRealtime } from "@/features/table/hooks/useRealtime";
import { TableWrapper } from "./wrappers/table-wrapper";
import { Table } from "@/features/table/components/table";
import type { Row } from "@/features/table/types";

export const Grid: React.FC = () => {
  const { data: rows = [], isLoading, isError } = useRowsData();
  useRealtime();
  const updateMutation = useUpdateRow();
  const columns = useColumnsData();

  const handleUpdateData = useCallback(
    (_rowIndex: number, columnId: string, value: unknown, rowId: number) => {
      updateMutation.mutate({
        id: rowId,
        colId: columnId as keyof Row,
        value,
      });
    },
    [updateMutation],
  );

  return (
    <TableWrapper isLoading={isLoading} isError={isError}>
      <Table rows={rows} columns={columns} onUpdateData={handleUpdateData} />;
    </TableWrapper>
  );
};
