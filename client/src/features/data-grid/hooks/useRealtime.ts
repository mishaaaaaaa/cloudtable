import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { socket } from "@/api/socket";
import { KEYS } from "@/features/data-grid/data/constants";
import type { Row } from "@/features/data-grid/types";

export const useRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    const onConnect = () => {
      console.log("socket: connected");
    };

    const onConnectError = (error: Error) => {
      console.error("socket: connect_error", error);
    };

    const onRowUpdate = (updatedRow: Row) => {
      console.log("socket: row_update", updatedRow);

      queryClient.setQueryData<Row[]>(KEYS.ROWS, (oldRows) => {
        if (!oldRows) return oldRows;

        return oldRows.map((row) => (row.id === updatedRow.id ? updatedRow : row));
      });
    };

    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);
    socket.on("row_update", onRowUpdate);

    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onConnectError);
      socket.off("row_update", onRowUpdate);
    };
  }, [queryClient]);
};
