import axios from "axios";
import { API_BASE_URL, VIRTUS_API_URL } from "./baseURL";
import { store } from "../redux/store";

// Default API instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ERP API instance
const virtusAxiosInstance = axios.create({
  baseURL: VIRTUS_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// No token interceptors needed since backend doesn't require authentication
// All endpoints are publicly accessible according to API documentation

axiosInstance.interceptors.request.use((config) => {
  const fullUrl = config.baseURL
    ? config.baseURL.replace(/\/+$/, "") + "/" + (config.url || "").replace(/^\/+/, "")
    : config.url;
  return config;
});

virtusAxiosInstance.interceptors.request.use((config) => {
  const fullUrl = config.baseURL
    ? config.baseURL.replace(/\/+$/, "") + "/" + (config.url || "").replace(/^\/+/, "")
    : config.url;
  return config;
});


export { axiosInstance, virtusAxiosInstance };