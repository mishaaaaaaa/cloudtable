import axios from "axios";
import type { Row, UpdateRowPayload } from "../types";
import { API_URL } from "../config";

export const apiClient = axios.create({
  baseURL: API_URL,
});

export const fetchRows = async (): Promise<Row[]> => {
  const response = await apiClient.get<Row[]>("/rows");
  return response.data;
};

export const updateRow = async (payload: UpdateRowPayload): Promise<void> => {
  await apiClient.patch(`/rows/${payload.id}`, {
    [payload.colId]: payload.value,
  });
};
