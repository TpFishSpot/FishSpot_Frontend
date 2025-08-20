import axios from 'axios';

export const baseApi = 'http://localhost:3000';

const apiFishSpot = axios.create({
  baseURL: baseApi,
});

export default apiFishSpot;
