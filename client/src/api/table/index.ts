import { apiClient } from "../client";
import type { Row, UpdateRowPayload } from "../../features/table/types";

export const fetchRows = async (): Promise<Row[]> => {
  const response = await apiClient.get<Row[]>("/rows");
  return response.data;
};

export const updateRow = async (payload: UpdateRowPayload): Promise<void> => {
  await apiClient.patch(`/rows/${payload.id}`, {
    [payload.colId]: payload.value,
  });
};
