import axios from 'axios';

// API 基址：构建时可用 VITE_API_BASE 指向独立部署的后端（如 https://api.你的域名.com/api）
// 不设置则走同源 /api（本地 dev 由 rsbuild 代理到 :3000）
const baseURL =
  (import.meta.env as { VITE_API_BASE?: string }).VITE_API_BASE || '/api';

// new-api 同款约定：Bearer token 放 localStorage，请求头携带
export const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
