import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { io } from "socket.io-client";
import { KEYS } from "./useRowsData";
import type { Row } from "../types";
import { SOCKET_URL } from "../config";

export const useRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("socket: connected");
    });

    socket.on("row_update", (updatedRow: Row) => {
      console.log("socket: row_update", updatedRow);

      queryClient.setQueryData<Row[]>(KEYS.ROWS, (oldRows) => {
        if (!oldRows) return oldRows;

        return oldRows.map((row) => (row.id === updatedRow.id ? updatedRow : row));
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
};
