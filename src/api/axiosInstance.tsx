import axios from "axios";
import { API_BASE_URL, ERP_API_URL } from "./baseURL";
import { store } from "../redux/store";

// Default API instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ERP API instance
const erpAxiosInstance = axios.create({
  baseURL: ERP_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Attach access token dynamically from Redux for both
const attachToken = (config:any) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};
// Attach access token dynamically from Redux for both
const attachTokenSecond = (config:any) => {
  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJkYXRlIjoxNzU1NzY3ODk3MDEzLCJzdWIiOiJURVNUVVNFUjAwMSIsInJvbGUiOiJNQU5BR0VSIEZJTkFOQ0UiLCJjb3N0Q2VudGVyIjoiMTAxIiwiaXNzIjoiVEVTVFVTRVIwMDEiLCJlbXBObyI6IjAyMDAiLCJ1c2VyTmFtZSI6IlRFU1QgVVNFUiAwMDEiLCJUb2tlblR5cGUiOiJhdXRoIiwiYXBwbGljYXRpb24iOiJSRVBPUlRTIiwicm9sZU5hbWUiOiJNQUFOR0VSIEZJTkFOQ0UiLCJleHAiOjE3NzM3Njc4OTcsImlhdCI6MTc1NTc2Nzg5NywianRpIjoiVEVTVFVTRVIwMDEifQ.mjCNq4Q-ZsxMjAFcLtiJVlSjYIMWlnUsk-nfhslt1BI';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

axiosInstance.interceptors.request.use(attachToken, (error) => Promise.reject(error));
erpAxiosInstance.interceptors.request.use(attachTokenSecond, (error) => Promise.reject(error));

axiosInstance.interceptors.request.use((config) => {
  const fullUrl = config.baseURL
    ? config.baseURL.replace(/\/+$/, "") + "/" + (config.url || "").replace(/^\/+/, "")
    : config.url;
  return config;
});

erpAxiosInstance.interceptors.request.use((config) => {
  const fullUrl = config.baseURL
    ? config.baseURL.replace(/\/+$/, "") + "/" + (config.url || "").replace(/^\/+/, "")
    : config.url;
  return config;
});


export { axiosInstance, erpAxiosInstance };