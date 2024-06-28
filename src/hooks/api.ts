import axios from 'axios';
import { makeUseAxios } from 'axios-hooks';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const useApi = makeUseAxios({
  axios: http,
  defaultOptions: {
    manual: true,
    useCache: false,
    autoCancel: false,
  },
});
