import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRows, updateRow } from "../../../api/table";
import type { Row } from "../../../types";
import { KEYS } from "../data/constants";

export const useRowsData = () => {
  return useQuery({
    queryKey: KEYS.ROWS,
    queryFn: fetchRows,
    // Critical for performance with large datasets:
    staleTime: Infinity, // Data never becomes stale automatically (we rely on websockets)
    gcTime: Infinity, // Keep data in memory (don't garbage collect)
    refetchOnWindowFocus: false, // Don't refetch when user switches tabs
    refetchOnReconnect: false,
  });
};

export const useUpdateRow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRow,
    // When mutate is called:
    onMutate: async (newRowData) => {
      // 1. Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: KEYS.ROWS });

      // 2. Snapshot the previous value
      const previousRows = queryClient.getQueryData<Row[]>(KEYS.ROWS);

      // 3. Optimistically update to the new value
      if (previousRows) {
        queryClient.setQueryData<Row[]>(KEYS.ROWS, (old) => {
          if (!old) return [];
          return old.map((row) => (row.id === newRowData.id ? { ...row, [newRowData.colId]: newRowData.value } : row));
        });
      }

      // Return a context object with the snapshotted value
      return { previousRows };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _newRow, context) => {
      if (context?.previousRows) {
        queryClient.setQueryData(KEYS.ROWS, context.previousRows);
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      // In a real app we might invalidate here, but for 50k rows
      // we usually rely on the socket update to confirm the change.
      // queryClient.invalidateQueries({ queryKey: KEYS.ROWS });
    },
  });
};
