import axios from 'axios';
import { getAuthToken } from '../auth/authService';

export const baseApi = import.meta.env.VITE_API_URL || 'https://localhost:3000';

const apiFishSpot = axios.create({
  baseURL: baseApi,
  timeout: 30000,
});

apiFishSpot.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiFishSpot.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default apiFishSpot;
