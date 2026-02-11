import React, { useCallback } from "react";
import { useRowsData, useUpdateRow } from "./hooks/useRowsData";
import { useColumnsData } from "./hooks/useColumnsData";
import { useRealtime } from "./hooks/useRealtime";
import { Table } from "./components/table";
import type { Row } from "../../types";

export const Grid: React.FC = () => {
  const { data: rows = [], isLoading } = useRowsData();
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

  return <Table rows={rows} columns={columns} isLoading={isLoading} onUpdateData={handleUpdateData} />;
};
