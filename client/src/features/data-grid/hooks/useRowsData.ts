import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchRows, updateRow } from "@/api/table";
import type { Row } from "@/features/data-grid/types";
import { KEYS } from "@/features/data-grid/data/constants";

export const useRowsData = () => {
  return useQuery({
    queryKey: KEYS.ROWS,
    queryFn: fetchRows,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useUpdateRow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRow,
    onMutate: async (newRowData) => {
      await queryClient.cancelQueries({ queryKey: KEYS.ROWS });

      const previousRows = queryClient.getQueryData<Row[]>(KEYS.ROWS);


      if (previousRows) {
        queryClient.setQueryData<Row[]>(KEYS.ROWS, (old) => {
          if (!old) return [];
          return old.map((row) => (row.id === newRowData.id ? { ...row, [newRowData.colId]: newRowData.value } : row));
        });
      }

      return { previousRows };
    },
    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (_err, _newRow, context) => {
      if (context?.previousRows) {
        queryClient.setQueryData(KEYS.ROWS, context.previousRows);
      }
    },
  });
};
