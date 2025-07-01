import axios from 'axios';

const apiFishSpot = axios.create({
  baseURL: 'http://localhost:3000/',
});

export default apiFishSpot;
