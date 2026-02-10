import axios from "axios";
import type { Row, UpdateRowPayload } from "../types";

const API_URL = "http://localhost:4000"; // Port 4000 as per server setup

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
