import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchRows, updateRow } from "../api";

export const KEYS = {
  ROWS: ["rows"],
};

export const useRows = () => {
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
  return useMutation({
    mutationFn: updateRow,
  });
};
