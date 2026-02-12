import React, { useCallback } from "react";
import { useRowsData, useUpdateRow } from "@/features/data-grid/hooks/useRowsData";
import { useColumnsData } from "@/features/data-grid/hooks/useColumnsData";
import { useRealtime } from "@/features/data-grid/hooks/useRealtime";
import { TableWrapper } from "./wrappers/table-wrapper";
import { Table } from "@/features/data-grid/components/table";
import type { Row } from "@/features/data-grid/types";

const DataGrid: React.FC = () => {
  const { data: rows = [], isLoading, isError } = useRowsData();
  const columns = useColumnsData();
  const updateMutation = useUpdateRow();

  useRealtime();

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

export default DataGrid;
