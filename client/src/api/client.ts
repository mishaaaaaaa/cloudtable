import axios from "axios";
import { toast } from "react-toastify";
import { API_URL } from "@/config";

export const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || "Something went wrong";
    toast.error(`Error: ${message}`);
    return Promise.reject(error);
  },
);
